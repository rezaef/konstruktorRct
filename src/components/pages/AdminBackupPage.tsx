import { useEffect, useMemo, useState } from "react";
import { CloudUpload, ExternalLink, Trash2, Copy } from "lucide-react";

// Prefer env-configured base URL (contoh: VITE_API_BASE_URL=http://localhost:4000)
// Fallback tetap aman untuk dev, tapi tidak muncul di UI.
const API_BASE =
  ((import.meta as any)?.env?.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ||
  "http://localhost:4000";

type BackupItem = {
  id: string;
  name: string;
  webViewLink?: string;
  createdTime?: string;
};

function getTokenSafe() {
  const raw = localStorage.getItem("authToken");
  if (!raw) return null;
  const cleaned = raw.replace(/^"+|"+$/g, "").trim();
  const isJWT = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(cleaned);
  return isJWT ? cleaned : null;
}

function loadHistory(): BackupItem[] {
  try {
    const raw = localStorage.getItem("backupHistory");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHistory(items: BackupItem[]) {
  localStorage.setItem("backupHistory", JSON.stringify(items.slice(0, 20)));
}

function fmtTime(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("id-ID", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function AdminBackupPage() {
  const [prefix, setPrefix] = useState("backup");
  const [creating, setCreating] = useState(false);
  const [notice, setNotice] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [lastBackup, setLastBackup] = useState<BackupItem | null>(null);
  const [history, setHistory] = useState<BackupItem[]>([]);
  const [q, setQ] = useState("");

  useEffect(() => {
    const t = getTokenSafe();
    if (!t) {
      setNotice({ type: "err", text: "Sesi login kamu sudah berakhir. Silakan login ulang." });
      localStorage.removeItem("authToken");
      window.location.pathname = "/dashboard";
      return;
    }

    const h = loadHistory();
    setHistory(h);
    if (h.length > 0) setLastBackup(h[0]);
  }, []);

  const filteredHistory = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return history;
    return history.filter((x) => `${x.name} ${x.createdTime || ""}`.toLowerCase().includes(term));
  }, [history, q]);

  async function handleBackupNow() {
    setNotice(null);
    setCreating(true);
    try {
      const token = getTokenSafe();
      if (!token) throw new Error("Sesi login kamu sudah berakhir. Silakan login ulang.");

      const res = await fetch(`${API_BASE}/backup/spreadsheet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ namePrefix: (prefix || "backup").trim() }),
      });

      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j?.message || `Gagal backup (${res.status})`);

      const backup: BackupItem = j?.backup;
      if (!backup?.id) throw new Error("Response backup tidak valid.");

      setLastBackup(backup);

      const next = [backup, ...history].slice(0, 20);
      setHistory(next);
      saveHistory(next);

      setNotice({ type: "ok", text: j?.message || "Backup berhasil dibuat." });
    } catch (e: any) {
      const msg = e?.message || "Gagal membuat backup.";
      setNotice({ type: "err", text: msg });

      if (
        String(msg).toLowerCase().includes("token") ||
        String(msg).toLowerCase().includes("login")
      ) {
        localStorage.removeItem("authToken");
        window.location.pathname = "/dashboard";
      }
    } finally {
      setCreating(false);
    }
  }

  function clearHistory() {
    localStorage.removeItem("backupHistory");
    setHistory([]);
    setLastBackup(null);
    setNotice({ type: "ok", text: "Riwayat backup dibersihkan." });
  }

  async function copyLink(link?: string) {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setNotice({ type: "ok", text: "Link berhasil disalin." });
    } catch {
      setNotice({ type: "err", text: "Gagal menyalin link. Coba salin manual." });
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[#0B1F3B]">Backup Spreadsheet</h1>
          <p className="text-gray-600">
            Buat salinan spreadsheet untuk arsip dan pemulihan data. Nama file akan otomatis
            ditambahkan timestamp.
          </p>
        </div>

        <button
          onClick={handleBackupNow}
          disabled={creating}
          className="px-6 py-3 bg-[#0E7C66] text-white rounded-lg hover:bg-[#0A6A58] transition-colors flex items-center gap-2 disabled:opacity-60"
        >
          <CloudUpload size={20} />
          {creating ? "Membuat backup…" : "Backup Now"}
        </button>
      </div>

      {notice && (
        <div
          className={`rounded-lg border px-4 py-3 ${
            notice.type === "ok"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {notice.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
          <h3 className="text-[#0B1F3B]">Ringkasan</h3>
          <ul className="mt-2 text-sm text-gray-600 space-y-2 list-disc pl-5">
            <li>Membuat salinan spreadsheet ke folder backup di Google Drive.</li>
            <li>Riwayat di halaman ini menampilkan hingga 20 backup terbaru.</li>
            <li>Gunakan fitur ini sebelum perubahan besar atau untuk arsip berkala.</li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-[#0B1F3B]">Nama backup</h3>
          <p className="text-sm text-gray-600 mb-3">
            Prefix nama file backup (akan ditambahkan nama sheet + timestamp).
          </p>
          <input
            value={prefix}
            onChange={(e) => setPrefix(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#D4AF37]"
            placeholder="backup"
          />
          <div className="mt-2 text-xs text-gray-500">Contoh: backup-Sheet1-2026-01-12T…</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-[#0B1F3B]">Backup terakhir</h3>
            <p className="text-sm text-gray-600">Backup terbaru yang dibuat dari panel ini.</p>
          </div>
          <button
            onClick={clearHistory}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            <Trash2 size={18} /> Hapus riwayat
          </button>
        </div>

        {!lastBackup ? (
          <div className="mt-4 text-gray-500">Belum ada backup.</div>
        ) : (
          <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <div className="text-sm text-gray-500">Nama</div>
              <div className="text-[#0B1F3B] font-medium break-all">{lastBackup.name}</div>
              <div className="mt-1 text-sm text-gray-500">
                Waktu: {fmtTime(lastBackup.createdTime)}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => copyLink(lastBackup.webViewLink)}
                disabled={!lastBackup.webViewLink}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                <Copy size={18} /> Salin link
              </button>
              <a
                href={lastBackup.webViewLink || "#"}
                target="_blank"
                rel="noreferrer"
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D4AF37] text-white hover:bg-[#C19B2B] ${
                  !lastBackup.webViewLink ? "pointer-events-none opacity-60" : ""
                }`}
              >
                <ExternalLink size={18} /> Buka di Drive
              </a>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h3 className="text-[#0B1F3B]">Riwayat backup</h3>
            <p className="text-sm text-gray-600">Menampilkan backup terbaru (maks. 20 item).</p>
          </div>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari nama…"
            className="w-full md:w-72 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-gray-600">Nama</th>
                <th className="px-6 py-4 text-left text-gray-600">Waktu</th>
                <th className="px-6 py-4 text-left text-gray-600">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredHistory.length === 0 ? (
                <tr>
                  <td className="px-6 py-5 text-gray-500" colSpan={3}>
                    Belum ada riwayat.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-gray-700 break-all">{b.name}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{fmtTime(b.createdTime)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => copyLink(b.webViewLink)}
                          disabled={!b.webViewLink}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                          title="Salin link"
                        >
                          <Copy size={16} />
                        </button>
                        <a
                          href={b.webViewLink || "#"}
                          target="_blank"
                          rel="noreferrer"
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#0B1F3B] text-white hover:bg-gray-800 ${
                            !b.webViewLink ? "pointer-events-none opacity-60" : ""
                          }`}
                          title="Buka di Drive"
                        >
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
