import { useEffect, useMemo, useState } from "react";
import { TrendingDown, Download } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  clearAuthToken,
  getAuthToken,
  getCashout,
  getCashoutSummary,
  listProjects,
  type CashoutItem,
} from "../../services/backendApi";

type CashoutRow = {
  id: string;
  date: string; // YYYY-MM-DD
  description: string;
  category: string; // metode
  amount: number;
};

type MonthlyPoint = { month: string; cashout: number };

function fmtRp(n: number) {
  return new Intl.NumberFormat("id-ID").format(n || 0);
}

function monthLabelFromKey(key: string) {
  // key: YYYY-MM
  const [, mm] = key.split("-");
  const map: Record<string, string> = {
    "01": "Jan",
    "02": "Feb",
    "03": "Mar",
    "04": "Apr",
    "05": "May",
    "06": "Jun",
    "07": "Jul",
    "08": "Aug",
    "09": "Sep",
    "10": "Oct",
    "11": "Nov",
    "12": "Dec",
  };
  return map[mm] ?? key;
}

function buildMonthly(transactions: CashoutRow[]): MonthlyPoint[] {
  const bucket = new Map<string, number>();

  for (const t of transactions) {
    const key = (t.date || "").slice(0, 7); // YYYY-MM
    if (!/^\d{4}-\d{2}$/.test(key)) continue;
    bucket.set(key, (bucket.get(key) ?? 0) + (Number(t.amount) || 0));
  }

  const sorted = Array.from(bucket.entries()).sort((a, b) => a[0].localeCompare(b[0]));

  return sorted.map(([key, sum]) => ({
    month: monthLabelFromKey(key),
    cashout: sum,
  }));
}

function getTokenSafe() {
  const raw = getAuthToken();
  if (!raw) return null;
  const cleaned = raw.replace(/^"+|"+$/g, "").trim();
  const isJWT = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(cleaned);
  return isJWT ? cleaned : null;
}

function uniqYearsFromByMonth(byMonth: Record<string, number>) {
  const years = new Set<string>();
  Object.keys(byMonth || {}).forEach((k) => {
    const y = k.slice(0, 4);
    if (/^\d{4}$/.test(y)) years.add(y);
  });
  return Array.from(years).sort((a, b) => b.localeCompare(a));
}

export function AdminFinancePage() {
  const [token, setToken] = useState<string | null>(null);

  const [projects, setProjects] = useState<string[]>([]);
  const [projectSheet, setProjectSheet] = useState<string>("");

  const [availableYears, setAvailableYears] = useState<string[]>([]);
  const [year, setYear] = useState<string>(String(new Date().getFullYear()));

  const [cashouts, setCashouts] = useState<CashoutRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  // ===== Init token =====
  useEffect(() => {
    const t = getTokenSafe();
    setToken(t);
    if (!t) {
      setError("Token tidak valid / tidak ditemukan. Silakan login ulang.");
      // biar konsisten sama halaman lain
      window.location.pathname = "/login";
    }
  }, []);

  // ===== Load project list =====
  useEffect(() => {
    if (!token) return;
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const res = await listProjects(token);
        const list = res.projects || [];
        if (!mounted) return;

        setProjects(list);

        // pilih project default
        const saved = localStorage.getItem("financeProjectSheet") || "";
        const next = (saved && list.includes(saved)) ? saved : (list[0] || "");
        setProjectSheet(next);
      } catch (e: any) {
        if (!mounted) return;

        if (e?.status === 401) {
          clearAuthToken();
          window.location.pathname = "/login";
          return;
        }
        setError(e?.message || "Gagal mengambil daftar project.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [token]);

  // persist selection
  useEffect(() => {
    if (projectSheet) localStorage.setItem("financeProjectSheet", projectSheet);
  }, [projectSheet]);

  // ===== Load summary + YTD items =====
  useEffect(() => {
    if (!token || !projectSheet) return;
    let mounted = true;

    (async () => {
      setLoading(true);
      setError("");

      try {
        // 1) ambil summary semua bulan (keys: YYYY-MM)
        const summary = await getCashoutSummary(token, projectSheet);
        if (!mounted) return;

        const byMonth = summary.byMonth || {};
        const years = uniqYearsFromByMonth(byMonth);
        setAvailableYears(years);

        // kalau year yang dipilih tidak ada datanya, pindah ke year terbaru yang ada
        const nextYear = (years.includes(year) ? year : (years[0] || year));
        if (nextYear !== year) setYear(nextYear);

        // 2) ambil list bulan untuk year tsb
        const monthKeys = Object.keys(byMonth)
          .filter((k) => k.startsWith(`${nextYear}-`))
          .filter((k) => /^\d{4}-\d{2}$/.test(k))
          .sort((a, b) => a.localeCompare(b));

        if (monthKeys.length === 0) {
          setCashouts([]);
          return;
        }

        // 3) fetch detail per bulan (YTD)
        const detail = await Promise.all(
          monthKeys.map((m) => getCashout(token, projectSheet, m))
        );

        if (!mounted) return;

        const rows: CashoutRow[] = detail
          .flatMap((d) => d.items || [])
          .map((x: CashoutItem) => ({
            id: `${projectSheet}-${x.sheetRow}-${x.date}`,
            date: x.date,
            description: x.pengeluaran,
            category: x.metode || "-",
            amount: Number(x.amount) || 0,
          }))
          .filter((x) => x.amount > 0)
          .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

        setCashouts(rows);
      } catch (e: any) {
        if (!mounted) return;

        if (e?.status === 401) {
          clearAuthToken();
          window.location.pathname = "/login";
          return;
        }
        setError(e?.message || "Failed to load Finance data");
        setCashouts([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
    // sengaja include year agar reload YTD saat user ganti tahun
  }, [token, projectSheet, year]);

  const totalCashout = useMemo(
    () => cashouts.reduce((sum, item) => sum + (Number(item.amount) || 0), 0),
    [cashouts]
  );

  const monthlyCashout = useMemo(() => buildMonthly(cashouts).slice(-12), [cashouts]);

  const handleExportCSV = () => {
    const headers = ["Date", "Description", "Category", "Amount"];
    const rows = cashouts.map((t) => [
      t.date,
      // escape commas & quotes biar aman
      `"${String(t.description).replace(/"/g, '""')}"`,
      `"${String(t.category ?? "").replace(/"/g, '""')}"`,
      t.amount,
    ]);

    const csvContent = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `cashout-report-${projectSheet || "project"}-${year}.csv`;
    link.click();
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center mb-8">
        <div>
          <h1 className="text-[#0B1F3B]">Finance & Reports</h1>
          <p className="text-gray-600">Cash out monitoring & expense reports</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={projectSheet}
            onChange={(e) => setProjectSheet(e.target.value)}
            disabled={loading || projects.length === 0}
            className="border rounded-lg px-3 py-2 bg-white text-sm"
            title="Project (Sheet)"
          >
            {projects.length === 0 ? (
              <option value="">No project</option>
            ) : (
              projects.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))
            )}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            disabled={loading || availableYears.length === 0}
            className="border rounded-lg px-3 py-2 bg-white text-sm"
            title="Year"
          >
            {availableYears.length === 0 ? (
              <option value={year}>{year}</option>
            ) : (
              availableYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))
            )}
          </select>

          <button
            onClick={handleExportCSV}
            disabled={loading || cashouts.length === 0}
            className="px-6 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#C19B2B] transition flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {/* State: loading / error */}
      {loading && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 text-gray-700">
          Loading finance data...
        </div>
      )}

      {!loading && error && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <p className="text-red-600 font-medium">Failed to load Finance data</p>
          <p className="text-gray-600 mt-1 text-sm">{error}</p>
          <p className="text-gray-500 mt-3 text-sm">
            Endpoint yang dipakai: <span className="font-mono">/projects</span>,{" "}
            <span className="font-mono">/cashout/summary</span>,{" "}
            <span className="font-mono">/cashout</span>
          </p>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-gray-600">Total Cash Out ({year})</h4>
            <TrendingDown size={22} className="text-red-500" />
          </div>
          <p className="text-3xl text-[#0B1F3B] mb-1">Rp {fmtRp(totalCashout)}</p>
          <p className="text-sm text-red-600">Year to date</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-[#0B1F3B] mb-6">Monthly Cash Out</h3>

        {!loading && monthlyCashout.length === 0 ? (
          <div className="text-gray-600">Belum ada data cashout untuk ditampilkan.</div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyCashout}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => `Rp ${fmtRp(Number(value))}`} />
              <Bar dataKey="cashout" fill="#ef4444" name="Cash Out" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h3 className="text-[#0B1F3B]">Cash Out Transactions</h3>
          <p className="text-gray-500 text-sm mt-1">
            Menampilkan transaksi cashout untuk <b>{projectSheet || "-"}</b> tahun <b>{year}</b>.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-gray-600">Date</th>
                <th className="px-6 py-4 text-left text-gray-600">Description</th>
                <th className="px-6 py-4 text-left text-gray-600">Category</th>
                <th className="px-6 py-4 text-right text-gray-600">Amount</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {!loading && cashouts.length === 0 ? (
                <tr>
                  <td className="px-6 py-6 text-gray-600" colSpan={4}>
                    Belum ada transaksi cashout.
                  </td>
                </tr>
              ) : (
                cashouts.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-600">{t.date}</td>
                    <td className="px-6 py-4 text-gray-700">{t.description}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm">
                        {t.category || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-red-600">Rp {fmtRp(t.amount)}</td>
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
