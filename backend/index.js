// backend/index.js (CommonJS)

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
const jwt = require("jsonwebtoken");


dotenv.config();

const app = express();
// Support env lama: xPORT (opsional)
const PORT = process.env.PORT || process.env.xPORT || 4000;

// ============ MIDDLEWARE ============
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

// ============ GOOGLE SHEETS SETUP ============
const credentialsPath = path.join(__dirname, "google-service.json");
const credentials = JSON.parse(fs.readFileSync(credentialsPath, "utf8"));

const auth = new google.auth.GoogleAuth({
  credentials,
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

// ============ GOOGLE DRIVE SETUP (UNTUK BACKUP FILE SPREADSHEET) =========
// Kamu bisa pakai 2 mode auth:
// A) Service Account (default) -> perlu share akses file/folder ke email service account
// B) OAuth User (opsi B) -> pakai akun Google kamu sendiri, jadi kuota & My Drive milik user
//    Aktif kalau env DRIVE_OAUTH_* terisi.

function createDriveClient() {
  const clientId = (process.env.DRIVE_OAUTH_CLIENT_ID || "").trim();
  const clientSecret = (process.env.DRIVE_OAUTH_CLIENT_SECRET || "").trim();
  const redirectUri = (process.env.DRIVE_OAUTH_REDIRECT_URI || "http://localhost").trim();
  const refreshToken = (process.env.DRIVE_OAUTH_REFRESH_TOKEN || "").trim();

  // Mode OAuth (user)
  if (clientId && clientSecret && refreshToken) {
    const oAuth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
    oAuth2Client.setCredentials({ refresh_token: refreshToken });
    console.log("Drive auth mode: OAuth (user)");
    return google.drive({ version: "v3", auth: oAuth2Client });
  }

  // Default: Service Account
  const driveAuth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/drive"],
  });
  console.log("Drive auth mode: Service Account");
  return google.drive({ version: "v3", auth: driveAuth });
}

const drive = createDriveClient();

const SPREADSHEET_ID = process.env.SHEET_ID;
const SHEET_NAME = process.env.SHEET_NAME || "Sheet1";
const RANGE_ALL = `${SHEET_NAME}!A:Z`;

// ============ ADMIN LOGIN SETTINGS ============
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@konstruktor.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const JWT_SECRET = process.env.JWT_SECRET || "dev_secret_konstruktor";

function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });
}

console.log("Service account:", credentials.client_email);
console.log("Key ID:", credentials.private_key_id);

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token tidak ditemukan. Silakan login dulu.",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT error:", err);
    return res.status(401).json({
      success: false,
      message: "Token tidak valid atau kedaluwarsa.",
    });
  }
}

const MONTHS_ID = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember"
];

function normalizeDate(input) {
  if (!input) return "";
  const s = String(input).trim();

  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[2]}-${m[1]}`;
  return s;
}

function parseAmount(input) {
  if (input === null || input === undefined) return 0;
  const s = String(input).trim()
    .replace(/rp/gi, "")
    .replace(/\s+/g, "")
    .replace(/\./g, "")
    .replace(/,/g, ".");
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

function monthYearFromDate(yyyyMmDd) {
  const [y, m] = yyyyMmDd.split("-");
  const monthIdx = Number(m) - 1;
  return { year: Number(y), monthIdx, monthName: MONTHS_ID[monthIdx] };
}

function parseBlockFromFormula(formula) {
  const f = String(formula || "");

  let m = f.match(/K(\d+)\s*:\s*K(\d+)/i);
  if (m) return { startRow: Number(m[1]), endRow: Number(m[2]) };

  m = f.match(/K(\d+)/i);
  if (m) {
    const r = Number(m[1]);
    return { startRow: r, endRow: r };
  }

  return null;
}

function sheetSerialToISO(n) {
  // Google Sheets date serial: day 0 = 1899-12-30
  const epoch = Date.UTC(1899, 11, 30);
  const ms = epoch + Number(n) * 86400000;
  return new Date(ms).toISOString().slice(0, 10);
}

function normalizeSheetDate(v) {
  if (v === null || v === undefined) return "";

  // kalau numeric serial
  if (typeof v === "number") return sheetSerialToISO(v);

  const s = String(v).trim();
  if (!s) return "";

  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;

  // DD/MM/YYYY atau DD-MM-YYYY
  let m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
  if (m) {
    const dd = m[1].padStart(2, "0");
    const mm = m[2].padStart(2, "0");
    let yyyy = m[3];
    if (yyyy.length === 2) yyyy = `20${yyyy}`;
    return `${yyyy}-${mm}-${dd}`;
  }

  // fallback parse Date (kalau bisa)
  const d = new Date(s);
  if (!Number.isNaN(d.getTime())) return d.toISOString().slice(0, 10);

  return s;
}

function monthKeyFromISO(isoDate) {
  // isoDate: YYYY-MM-DD
  if (!isoDate || isoDate.length < 7) return "";
  return isoDate.slice(0, 7); // YYYY-MM
}

function last12MonthKeys(now = new Date()) {
  const keys = [];
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  for (let i = 11; i >= 0; i--) {
    const d = new Date(start.getFullYear(), start.getMonth() - i, 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    keys.push(`${y}-${m}`);
  }
  return keys;
}

function monthLabelFromKey(key) {
  // key: YYYY-MM
  const [y, m] = key.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleString("en-US", { month: "short" }); // Jan, Feb...
}

function movingAverage(arr, window = 3) {
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    const start = Math.max(0, i - window + 1);
    const slice = arr.slice(start, i + 1);
    out.push(slice.reduce((a, b) => a + b, 0) / slice.length);
  }
  return out;
}

function pctChange(curr, prev) {
  if (!prev || prev === 0) return null;
  return ((curr - prev) / prev) * 100;
}

async function findMonthBlocks(sheetTitle) {
  const sh = a1Sheet(sheetTitle);

  const colA = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sh}!A:A`,
  });

  const aValues = colA.data.values || [];
  const totalRows = [];

  for (let i = 0; i < aValues.length; i++) {
    const v = (aValues[i]?.[0] ?? "").toString();
    if (v.toLowerCase().includes("total pengeluaran bulan")) {
      totalRows.push({ rowNumber: i + 1, label: v });
    }
  }

  const blocks = [];
  for (const t of totalRows) {
    const formulaResp = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sh}!L${t.rowNumber}:L${t.rowNumber}`,
      valueRenderOption: "FORMULA",
    });

    const formula = formulaResp.data.values?.[0]?.[0];
    const block = parseBlockFromFormula(formula);

    blocks.push({
      totalRow: t.rowNumber,
      label: t.label,
      formula: formula || "",
      startRow: block?.startRow,
      endRow: block?.endRow,
    });
  }

  return blocks.filter(b => b.startRow && b.endRow);
}

function pickMethodIndex(methodRaw) {
  const m = String(methodRaw || "").toLowerCase().trim();
  if (m === "cash") return 5;          // F
  if (m === "debit") return 6;         // G
  if (m === "transfer") return 7;      // H
  if (m === "kartu kredit" || m === "kartu_kredit") return 8; // I
  return 7; // default transfer
}

async function findFirstEmptyRowInBlock(sheetTitle, startRow, endRow) {
  const sh = a1Sheet(sheetTitle);

  const resp = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sh}!A${startRow}:K${endRow}`,
    valueRenderOption: "UNFORMATTED_VALUE",
  });

  const rows = resp.data.values || [];
  const totalRows = endRow - startRow + 1;

  for (let i = 0; i < totalRows; i++) {
    const r = rows[i] || []; // kalau row tidak ada di response → dianggap kosong
    const A = String(r[0] ?? "").trim();
    const C = String(r[2] ?? "").trim();
    const K = r[10];

    const kEmpty = (K === undefined || K === null || String(K).trim() === "");
    if (A === "" && C === "" && kEmpty) return startRow + i;
  }

  return null;
}


function parseMonthYearFromLabel(label) {
  // "Total Pengeluaran Bulan Oktober 2025"
  const m = String(label || "").match(/bulan\s+([a-zA-Z]+)\s+(\d{4})/i);
  if (!m) return null;
  const monthName = m[1];
  const year = Number(m[2]);
  return { monthName, year };
}

function a1Sheet(title) {
  const safe = String(title).replace(/'/g, "''");
  return `'${safe}'`;
}

// ===== Projects metadata sheet =====
const META_SHEET = "_PROJECTS";

async function ensureProjectsMetaSheet() {
  const meta = await sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
    fields: "sheets(properties(title))",
  });

  const titles = (meta.data.sheets || []).map(s => s.properties?.title).filter(Boolean);
  if (titles.includes(META_SHEET)) return;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: { requests: [{ addSheet: { properties: { title: META_SHEET } } }] },
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${META_SHEET}!A1:E1`,
    valueInputOption: "RAW",
    resource: { values: [["project","client","status","startDate","progress"]] },
  });
}


async function getLastUsedRow(sheetTitle) {
  const sh = a1Sheet(sheetTitle);

  const resp = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sh}!A:K`,
    valueRenderOption: "UNFORMATTED_VALUE",
  });

  const rows = resp.data.values || [];
  let last = 1;

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i] || [];
    const A = String(r[0] ?? "").trim();
    const C = String(r[2] ?? "").trim();
    const K = r[10];

    const kHas = !(K === undefined || K === null || String(K).trim() === "");
    if (A !== "" || C !== "" || kHas) last = i + 1;
  }

  return last;
}

async function createMonthBlockAtBottom(sheetTitle, monthName, year, reserveRows = 30) {
  const sh = a1Sheet(sheetTitle);
  const lastUsed = await getLastUsedRow(sheetTitle);

  const startRow = lastUsed + 2;             // kasih 1 baris jarak
  const endRow = startRow + reserveRows - 1; // area input
  const totalRow = endRow + 1;

  // tulis label total + formula total di kolom L
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${sh}!A${totalRow}:L${totalRow}`,
    valueInputOption: "USER_ENTERED",
    resource: {
      values: [[
        `Total Pengeluaran Bulan ${monthName} ${year}`,
        "", "", "", "", "", "", "", "", "", "",  // B..K kosong
        `=SUM(K${startRow}:K${endRow})`          // L
      ]],
    },
  });

  return {
    label: `Total Pengeluaran Bulan ${monthName} ${year}`,
    startRow,
    endRow,
    totalRow,
  };
}


// ============ ROUTES ============

// Healthcheck
app.get("/", (req, res) => {
  res.send("Konstruktor Backend is running");
});

// LOGIN ADMIN
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Email dan password wajib diisi.",
    });
  }

  if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
    return res.status(401).json({
      success: false,
      message: "Email atau password salah.",
    });
  }

  const token = generateToken({ email, role: "admin" });

  return res.json({
    success: true,
    token,
    user: {
      email,
      role: "admin",
    },
  });
});

// Cek user dari token
app.get("/auth/me", authenticate, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

// BACKUP SPREADSHEET (PROTECTED)
// Duplikasi file Google Sheet (SHEET_ID) ke folder Drive (BACKUP_FOLDER_ID)
app.post("/backup/spreadsheet", authenticate, async (req, res) => {
  try {
    const backupFolderId = (process.env.BACKUP_FOLDER_ID || "").trim();

    if (!backupFolderId) {
      return res.status(400).json({
        success: false,
        message:
          "BACKUP_FOLDER_ID belum di-set di .env. Buat folder backup di Google Drive lalu isi BACKUP_FOLDER_ID dan share foldernya ke email service account.",
      });
    }

    const ts = new Date().toISOString().replace(/[:.]/g, "-");
    const prefix = (req.body?.namePrefix || "backup").toString().trim();
    const backupName = `${prefix}-${SHEET_NAME}-${ts}`;

    const copyResp = await drive.files.copy({
      fileId: SPREADSHEET_ID,
      supportsAllDrives: true,
      requestBody: {
        name: backupName,
        parents: [backupFolderId],
      },
      fields: "id,name,webViewLink,createdTime",
    });

    return res.json({
      success: true,
      message: "Backup spreadsheet berhasil dibuat di Google Drive.",
      backup: copyResp.data,
    });
  } catch (e) {
    console.error("POST /backup/spreadsheet error:", e?.response?.data || e);
    return res.status(500).json({
      success: false,
      message:
        e?.response?.data?.error?.message || e.message || "Gagal membuat backup spreadsheet.",
    });
  }
});

// GET REKAP (PROTECTED)
app.get("/rekap", authenticate, async (req, res) => {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE_ALL,
    });

    const rows = response.data.values || [];
    res.json({
      success: true,
      rowCount: rows.length,
      rows,
    });
  } catch (error) {
    console.error("Error GET /rekap:", error);
    res.status(500).json({ success: false, message: "Failed to fetch data" });
  }
});

// POST REKAP (PROTECTED)
app.post("/rekap", authenticate, async (req, res) => {
  try {
    let newRow;

    if (Array.isArray(req.body.row)) {
      newRow = req.body.row;
    } else {
      newRow = Object.values(req.body);
    }

    if (!newRow || newRow.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Body kosong atau tidak valid" });
    }

    const appendResult = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE_ALL,
      valueInputOption: "USER_ENTERED",
      insertDataOption: "INSERT_ROWS",
      resource: {
        values: [newRow],
      },
    });

    res.status(201).json({
      success: true,
      message: "Data berhasil ditambahkan ke baris kosong berikutnya",
      appended: newRow,
      rawResult: appendResult.data,
    });
  } catch (error) {
    console.error("Error POST /rekap:", error);
    res.status(500).json({ success: false, message: "Failed to add data" });
  }
});

app.get("/projects", authenticate, async (req, res) => {
  try {
    const meta = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
      fields: "sheets(properties(sheetId,title))",
    });

    const projects = (meta.data.sheets || [])
      .map(s => s.properties?.title)
      .filter(Boolean)
      .filter(t => t !== META_SHEET); // ✅ sembunyikan tab non project

    res.json({ success: true, projects });
  } catch (e) {
    console.error("GET /projects", e);
    res.status(500).json({ success: false, message: "Gagal ambil list project(sheet)." });
  }
});

app.post("/cashout", authenticate, async (req, res) => {
  try {
    const { projectSheet, date, pengeluaran, metode, amount } = req.body || {};

    if (!projectSheet) {
      return res.status(400).json({ success: false, message: "projectSheet wajib (nama tab project)." });
    }

    const sh = a1Sheet(projectSheet); 

    const normDate = normalizeDate(date);
    const amt = parseAmount(amount);

    if (!normDate) return res.status(400).json({ success: false, message: "Tanggal wajib." });
    if (!pengeluaran) return res.status(400).json({ success: false, message: "Pengeluaran/keterangan wajib." });
    if (!amt || amt <= 0) return res.status(400).json({ success: false, message: "Nominal wajib angka > 0." });

    const targetMY = monthYearFromDate(normDate);
    const blocks = await findMonthBlocks(projectSheet);

    let targetBlock = blocks.find(b => {
  const parsed = parseMonthYearFromLabel(b.label);
  if (!parsed) return false;
  return parsed.year === targetMY.year &&
    parsed.monthName.toLowerCase() === targetMY.monthName.toLowerCase();
});

if (!targetBlock) {
  // cari placeholder terakhir (label kosong / belum ada bulan-tahun)
  targetBlock = blocks.slice().reverse().find(b => {
    const parsed = parseMonthYearFromLabel(b.label);
    return !parsed;
  });

  // kalau ketemu placeholder, isi labelnya biar rapi
  if (targetBlock) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sh}!A${targetBlock.totalRow}`,
      valueInputOption: "USER_ENTERED",
      resource: { values: [[`Total Pengeluaran Bulan ${targetMY.monthName} ${targetMY.year}`]] },
    });
  }
}

if (!targetBlock) {
  // ✅ AUTO CREATE BLOK BULAN BARU DI BAWAH SHEET
  targetBlock = await createMonthBlockAtBottom(
    projectSheet,
    targetMY.monthName,
    targetMY.year,
    30 // jumlah baris kosong yang disediakan untuk input cashout
  );
}

const emptyRow = await findFirstEmptyRowInBlock(
  projectSheet,
  targetBlock.startRow,
  targetBlock.endRow
);

    if (!emptyRow) {
      return res.status(400).json({
        success: false,
        message: `Blok bulan ${targetMY.monthName} ${targetMY.year} penuh.`,
      });
    }

    const row = Array(11).fill("");
    row[0] = normDate;      // A
    row[2] = pengeluaran;   // C
    row[10] = amt;          // K

    const methodIdx = pickMethodIndex(metode);
    row[methodIdx] = "√";

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sh}!A${emptyRow}:K${emptyRow}`, // ✅ pakai sh
      valueInputOption: "USER_ENTERED",
      resource: { values: [row] },
    });

    res.status(201).json({
      success: true,
      message: "Cashout berhasil ditulis ke sheet project.",
      sheet: projectSheet,
      rowIndex: emptyRow,
      data: { date: normDate, pengeluaran, metode: metode || "transfer", amount: amt },
    });

  } catch (e) {
    console.error("POST /cashout error:", e?.response?.data || e);
    res.status(500).json({
      success: false,
      message: e?.response?.data?.error?.message || e.message || "Gagal menulis cashout ke spreadsheet.",
    });
  }
});

app.get("/cashout", authenticate, async (req, res) => {
  try {
    const projectSheet = (req.query.projectSheet || "").toString().trim();
    const month = (req.query.month || "").toString().trim(); // YYYY-MM

    if (!projectSheet) {
      return res.status(400).json({ success: false, message: "projectSheet wajib." });
    }
    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
      return res.status(400).json({ success: false, message: "month wajib format YYYY-MM (contoh: 2025-12)." });
    }

    const sh = a1Sheet(projectSheet);

    const resp = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sh}!A:K`,
      valueRenderOption: "UNFORMATTED_VALUE",
    });

    const rows = resp.data.values || [];

    const items = [];
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i] || [];

      // ✅ tanggal dari sheet bisa serial number → normalize jadi YYYY-MM-DD
      const rawDate = r[0]; // kolom A
      const dateISO = normalizeSheetDate(rawDate);
      if (!dateISO) continue;

      // ✅ filter by month (YYYY-MM)
      const monthKey = dateISO.slice(0, 7);
      if (monthKey !== month) continue;

      const pengeluaran = String(r[2] ?? "").trim(); // kolom C

      const cash = String(r[5] ?? "").trim();     // F
      const debit = String(r[6] ?? "").trim();    // G
      const transfer = String(r[7] ?? "").trim(); // H
      const kartu = String(r[8] ?? "").trim();    // I

      const amount = parseAmount(r[10]); // K
      if (!amount || amount <= 0) continue;

      let metode = "";
      if (cash === "√") metode = "cash";
      else if (debit === "√") metode = "debit";
      else if (transfer === "√") metode = "transfer";
      else if (kartu === "√") metode = "kartu kredit";

      items.push({
        sheetRow: i + 1,
        date: dateISO,
        pengeluaran,
        metode,
        amount,
      });
    }

    // sort by date asc
    items.sort((a, b) => String(a.date).localeCompare(String(b.date)));

    const total = items.reduce((s, x) => s + (x.amount || 0), 0);

    res.json({
      success: true,
      projectSheet,
      month,
      count: items.length,
      total,
      items,
    });
  } catch (e) {
    console.error("GET /cashout error:", e?.response?.data || e);
    res.status(500).json({
      success: false,
      message: e?.response?.data?.error?.message || e.message || "Gagal ambil data cashout.",
    });
  }
});


app.get("/cashout/summary", authenticate, async (req, res) => {
  try {
    const projectSheet = (req.query.projectSheet || "").toString().trim();
    if (!projectSheet) return res.status(400).json({ success: false, message: "projectSheet wajib." });

    const sh = a1Sheet(projectSheet);

    const resp = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${sh}!A:K`,
      valueRenderOption: "UNFORMATTED_VALUE",
    });

    const rows = resp.data.values || [];

    const byMonth = {};
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i] || [];

      const dateISO = normalizeSheetDate(r[0]); // ✅ FIX
      if (!dateISO || dateISO.length < 7) continue;

      const amount = parseAmount(r[10]);
      if (!amount || amount <= 0) continue;

      const m = dateISO.slice(0, 7);
      byMonth[m] = (byMonth[m] || 0) + amount;
    }

    res.json({ success: true, projectSheet, byMonth });
  } catch (e) {
    console.error("GET /cashout/summary error:", e?.response?.data || e);
    res.status(500).json({
      success: false,
      message: e?.response?.data?.error?.message || e.message || "Gagal ambil summary cashout.",
    });
  }
});

// ===== Dashboard Cache (hindari quota sheets) =====
const dashboardCache = new Map(); // key -> { ts, data }
const DASH_TTL_MS = 60 * 1000;    // 60 detik

app.get("/dashboard/overview", authenticate, async (req, res) => {
  try {
    const project = String(req.query.project || "all").trim();

    // ambil semua tab
    const meta = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
      fields: "sheets(properties(title))",
    });

    const projects = (meta.data.sheets || [])
      .map(s => s.properties?.title)
      .filter(Boolean)
      .filter(t => t !== META_SHEET); // ✅ sembunyikan tab non project

    const scope = (project && project !== "all") ? project : "all";
    const selectedProjects = scope === "all"
      ? projects
      : projects.filter(p => p === scope);

    if (selectedProjects.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Project tab tidak ditemukan.",
        projects,
      });
    }

    // ===== CACHE HIT =====
    const cacheKey = `dashboard:${scope}`;
    const cached = dashboardCache.get(cacheKey);
    if (cached && (Date.now() - cached.ts) < DASH_TTL_MS) {
      return res.json(cached.data);
    }

    // ===== BATCH GET (1 request untuk banyak tab) =====
    const ranges = selectedProjects.map(t => `${a1Sheet(t)}!A:K`);
    const batch = await sheets.spreadsheets.values.batchGet({
      spreadsheetId: SPREADSHEET_ID,
      ranges,
      valueRenderOption: "UNFORMATTED_VALUE",
    });

    const rows = [];
    const valueRanges = batch.data.valueRanges || [];

    valueRanges.forEach((vr, idx) => {
      const sheetTitle = selectedProjects[idx];
      const values = vr.values || [];

      for (const r of values) {
        const dateISO = normalizeSheetDate(r?.[0]); // kolom A
        const amount = parseAmount(r?.[10]);        // kolom K
        if (!dateISO || !amount || amount <= 0) continue;

        rows.push({
          project: sheetTitle,
          date: dateISO,
          month: dateISO.slice(0, 7), // YYYY-MM
          amount,
        });
      }
    });

    // ===== Hitung KPI + Charts =====
    const now = new Date();
    const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonth = `${prevMonthDate.getFullYear()}-${String(prevMonthDate.getMonth() + 1).padStart(2, "0")}`;

    const totalProjects = selectedProjects.length;
    const totalExpenses = rows.reduce((s, x) => s + (x.amount || 0), 0);

    const thisMonthSpending = rows.filter(x => x.month === thisMonth).reduce((s, x) => s + x.amount, 0);
    const prevMonthSpending = rows.filter(x => x.month === prevMonth).reduce((s, x) => s + x.amount, 0);

    const monthlySpendingPct = (prevMonthSpending > 0)
      ? ((thisMonthSpending - prevMonthSpending) / prevMonthSpending) * 100
      : null;

    const ongoingSet = new Set(rows.filter(x => x.month === thisMonth).map(x => x.project));
    const ongoingProjects = ongoingSet.size;
    const nearCompletion = Math.max(0, totalProjects - ongoingProjects);

    // 12 bulan terakhir
    const keys = [];
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    for (let i = 11; i >= 0; i--) {
      const d = new Date(start.getFullYear(), start.getMonth() - i, 1);
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      keys.push(k);
    }
    const labels = keys.map(k => {
      const [y, m] = k.split("-");
      const d = new Date(Number(y), Number(m) - 1, 1);
      return d.toLocaleString("en-US", { month: "short" });
    });

    const sums = {};
    for (const k of keys) sums[k] = 0;
    for (const x of rows) {
      if (sums[x.month] !== undefined) sums[x.month] += x.amount;
    }

    const expenses12 = keys.map(k => sums[k] || 0);

    // moving average 3 bulan
    const baseline = expenses12.map((_, i) => {
      const start = Math.max(0, i - 2);
      const slice = expenses12.slice(start, i + 1);
      return slice.reduce((a, b) => a + b, 0) / slice.length;
    });

    const payload = {
      success: true,
      scope,
      projects, // dropdown selalu lengkap
      kpi: {
        totalProjects,
        monthlySpending: thisMonthSpending,
        monthlySpendingPct,
        ongoingProjects,
        nearCompletion,
        totalExpenses,
        expensesNote: "Monitor carefully",
      },
      charts: {
        bar: { labels, data: expenses12, label: "Expenses" },
        line: {
          labels,
          greenLabel: "Avg (3 mo)",
          green: baseline,
          redLabel: "Expenses",
          red: expenses12,
        },
      },
    };

    // ===== CACHE SET =====
    dashboardCache.set(cacheKey, { ts: Date.now(), data: payload });

    return res.json(payload);
  } catch (e) {
    console.error("GET /dashboard/overview error:", e?.response?.data || e);
    return res.status(500).json({
      success: false,
      message: e?.response?.data?.error?.message || e.message || "Gagal generate dashboard overview.",
    });
  }
});

// const META_SHEET = "_PROJECTS";

async function ensureProjectsMetaSheet() {
  const meta = await sheets.spreadsheets.get({
    spreadsheetId: SPREADSHEET_ID,
    fields: "sheets(properties(title))",
  });

  const titles = (meta.data.sheets || []).map(s => s.properties?.title);
  if (titles.includes(META_SHEET)) return;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SPREADSHEET_ID,
    requestBody: {
      requests: [
        { addSheet: { properties: { title: META_SHEET } } }
      ],
    },
  });

  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `${META_SHEET}!A1:E1`,
    valueInputOption: "RAW",
    requestBody: { values: [["project","client","status","startDate","progress"]] },
  });
}

app.get("/projects", authenticate, async (req, res) => {
  try {
    await ensureProjectsMetaSheet();

    const meta = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
      fields: "sheets(properties(title))",
    });

    const tabs = (meta.data.sheets || [])
      .map(s => s.properties?.title)
      .filter(Boolean)
      .filter(t => t !== META_SHEET);

    const metaRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${META_SHEET}!A2:E`,
    });

    const metaRows = metaRes.data.values || [];
    const metaMap = new Map();
    for (const r of metaRows) {
      const [project, client, status, startDate, progress] = r;
      if (!project) continue;
      metaMap.set(project, {
        client: client || "-",
        status: status || "Planning",
        startDate: startDate || "",
        progress: Number(progress || 0),
      });
    }

    const data = tabs.map((name) => {
      const m = metaMap.get(name) || { client:"-", status:"Planning", startDate:"", progress:0 };
      return { id: name, name, ...m };
    });

    res.json({ success: true, data, projects: tabs });
  } catch (e) {
    console.error("GET /projects", e?.response?.data || e);
    res.status(500).json({ success: false, message: "Gagal ambil list project(sheet)." });
  }
});


app.post("/projects", authenticate, async (req, res) => {
  try {
    await ensureProjectsMetaSheet();

    const { name, client, status, startDate, progress } = req.body || {};
    const projectName = String(name || "").trim();
    if (!projectName) {
      return res.status(400).json({ success: false, message: "name wajib diisi." });
    }
    if (projectName === META_SHEET) {
      return res.status(400).json({ success: false, message: "Nama project tidak valid." });
    }

    // cek sudah ada atau belum
    const meta = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
      fields: "sheets(properties(title))",
    });
    const titles = (meta.data.sheets || []).map(s => s.properties?.title).filter(Boolean);
    if (titles.includes(projectName)) {
      return res.status(409).json({ success: false, message: "Project/tab sudah ada." });
    }

    // create new tab
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: { requests: [{ addSheet: { properties: { title: projectName } } }] },
    });

    // append metadata
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${META_SHEET}!A:E`,
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      resource: {
        values: [[
          projectName,
          client || "-",
          status || "Planning",
          startDate || "",
          String(progress ?? 0),
        ]],
      },
    });

    res.json({ success: true, message: "Project berhasil dibuat." });
  } catch (e) {
    console.error("POST /projects", e?.response?.data || e);
    res.status(500).json({ success: false, message: "Gagal membuat project." });
  }
});


app.delete("/projects/:name", authenticate, async (req, res) => {
  try {
    await ensureProjectsMetaSheet();

    const name = String(req.params.name || "").trim();
    if (!name) return res.status(400).json({ success: false, message: "name kosong" });

    const meta = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID,
      fields: "sheets(properties(sheetId,title))",
    });

    const sheet = (meta.data.sheets || []).find(s => s.properties?.title === name);
    if (!sheet) return res.status(404).json({ success: false, message: "Project tidak ditemukan." });

    // delete sheet tab
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: { requests: [{ deleteSheet: { sheetId: sheet.properties.sheetId } }] },
    });

    // rewrite metadata without this project
    const metaRes = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${META_SHEET}!A1:E`,
    });

    const all = metaRes.data.values || [];
    const header = all[0] || ["project","client","status","startDate","progress"];
    const kept = [header, ...all.slice(1).filter(r => (r?.[0] || "") !== name)];

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${META_SHEET}!A1:E`,
      valueInputOption: "RAW",
      resource: { values: kept },
    });

    res.json({ success: true, message: "Project berhasil dihapus." });
  } catch (e) {
    console.error("DELETE /projects/:name", e?.response?.data || e);
    res.status(500).json({ success: false, message: "Gagal hapus project." });
  }
});



// Start server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});