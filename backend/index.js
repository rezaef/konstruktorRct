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
const PORT = process.env.PORT || 4000;

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

// Start server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
