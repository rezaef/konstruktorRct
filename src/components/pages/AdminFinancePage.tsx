import { useEffect, useMemo, useState } from 'react';
import { TrendingDown, Download } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

/**
 * === KONTRAK DATA (samakan dengan response API kamu) ===
 * Minimal field yang kita butuhkan:
 * - id: string | number
 * - date: string (YYYY-MM-DD / ISO string)
 * - description: string
 * - category?: string
 * - amount: number (POSITIVE untuk cashout)
 *
 * Jika di API kamu namanya beda (mis. tanggal, keterangan, nominal),
 * tinggal mapping di normalizeCashout().
 */
type Cashout = {
  id: string | number;
  date: string;
  description: string;
  category?: string;
  amount: number;
};

type MonthlyPoint = { month: string; cashout: number };

function toMonthKey(dateStr: string) {
  const d = new Date(dateStr);
  // fallback kalau dateStr format "YYYY-MM-DD"
  if (Number.isNaN(d.getTime())) {
    const [y, m] = dateStr.split('-');
    return `${y}-${m}`;
  }
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  return `${y}-${m}`;
}

function monthLabelFromKey(key: string) {
  // key: YYYY-MM
  const [, mm] = key.split('-');
  const map: Record<string, string> = {
    '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr', '05': 'May', '06': 'Jun',
    '07': 'Jul', '08': 'Aug', '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec',
  };
  return map[mm] ?? key;
}

function buildMonthly(transactions: Cashout[]): MonthlyPoint[] {
  const bucket = new Map<string, number>();

  for (const t of transactions) {
    const key = toMonthKey(t.date);
    bucket.set(key, (bucket.get(key) ?? 0) + (Number(t.amount) || 0));
  }

  // sort ascending by YYYY-MM
  const sorted = Array.from(bucket.entries()).sort((a, b) => a[0].localeCompare(b[0]));

  return sorted.map(([key, sum]) => ({
    month: monthLabelFromKey(key),
    cashout: sum,
  }));
}

/**
 * Sesuaikan endpoint ini dengan backend kamu.
 * Contoh umum:
 * - VITE_API_BASE_URL=http://localhost:8000
 * - endpoint: /api/cashouts
 */
function getApiBaseUrl() {
  // Vite
  const vite = (import.meta as any)?.env?.VITE_API_BASE_URL as string | undefined;
  if (vite) return vite;

  // CRA fallback (aman untuk TS di Vite karena tidak refer "process" langsung)
  const cra = (globalThis as any)?.process?.env?.REACT_APP_API_BASE_URL as string | undefined;
  if (cra) return cra;

  return '';
}

function getAuthToken() {
  // sesuaikan dengan auth kamu (mis. "token", "access_token", dll)
  return localStorage.getItem('token') || localStorage.getItem('access_token') || '';
}

// ✅ mapping response API -> Cashout standar page ini
function normalizeCashout(raw: any): Cashout {
  return {
    id: raw.id ?? raw._id ?? `${raw.date}-${raw.amount}-${Math.random()}`,
    date: raw.date ?? raw.tanggal ?? raw.created_at ?? raw.createdAt,
    description: raw.description ?? raw.keterangan ?? raw.note ?? raw.nama ?? 'Cash Out',
    category: raw.category ?? raw.kategori ?? raw.type ?? 'Operational',
    amount: Number(raw.amount ?? raw.nominal ?? raw.total ?? 0),
  };
}

export function AdminFinancePage() {
  const [cashouts, setCashouts] = useState<Cashout[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // === API CONFIG (ubah ini kalau endpoint kamu beda) ===
  const API_BASE = getApiBaseUrl(); // optional
  const CASHOUT_ENDPOINT = `${API_BASE}/api/cashouts`; // <-- GANTI sesuai route backend kamu

  useEffect(() => {
    let isMounted = true;

    async function fetchCashouts() {
      setLoading(true);
      setError('');

      try {
        const token = getAuthToken();

        const res = await fetch(CASHOUT_ENDPOINT, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });

        if (!res.ok) {
          const text = await res.text().catch(() => '');
          throw new Error(`API error ${res.status}: ${text || res.statusText}`);
        }

        const json = await res.json();

        // Fleksibel: {data: []} atau [] langsung
        const rows = Array.isArray(json) ? json : (json.data ?? json.cashouts ?? []);
        const normalized: Cashout[] = rows.map(normalizeCashout);

        // pastikan cashout only (amount > 0)
        const onlyCashout = normalized
          .filter((x) => Number(x.amount) > 0)
          .sort((a, b) => (b.date || '').localeCompare(a.date || ''));

        if (isMounted) setCashouts(onlyCashout);
      } catch (e: any) {
        if (isMounted) setError(e?.message || 'Failed to fetch cashout data');
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchCashouts();
    return () => {
      isMounted = false;
    };
  }, [CASHOUT_ENDPOINT]);

  const totalCashout = useMemo(
    () => cashouts.reduce((sum, item) => sum + (Number(item.amount) || 0), 0),
    [cashouts]
  );

  const monthlyCashout = useMemo(() => buildMonthly(cashouts), [cashouts]);

  const handleExportCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Amount'];
    const rows = cashouts.map((t) => [
      t.date,
      // escape commas & quotes biar aman
      `"${String(t.description).replace(/"/g, '""')}"`,
      `"${String(t.category ?? '').replace(/"/g, '""')}"`,
      t.amount,
    ]);

    const csvContent = [headers, ...rows].map((r) => r.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'cashout-report.csv';
    link.click();
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-[#2C2C2C]">Finance & Reports</h1>
          <p className="text-gray-600">Cash out monitoring & expense reports</p>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={loading || cashouts.length === 0}
          className="px-6 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#C19B2B] transition flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Download size={18} />
          Export CSV
        </button>
      </div>

      {/* State: loading / error */}
      {loading && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8 text-gray-700">
          Loading cashout data...
        </div>
      )}

      {!loading && error && (
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <p className="text-red-600 font-medium">Failed to load Finance data</p>
          <p className="text-gray-600 mt-1 text-sm">{error}</p>
          <p className="text-gray-500 mt-3 text-sm">
            Cek endpoint: <span className="font-mono">{CASHOUT_ENDPOINT}</span>
          </p>
        </div>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-gray-600">Total Cash Out</h4>
            <TrendingDown size={22} className="text-red-500" />
          </div>
          <p className="text-3xl text-[#2C2C2C] mb-1">
            Rp {totalCashout.toLocaleString('id-ID')}
          </p>
          <p className="text-sm text-red-600">Year to date</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h3 className="text-[#2C2C2C] mb-6">Monthly Cash Out</h3>

        {(!loading && monthlyCashout.length === 0) ? (
          <div className="text-gray-600">Belum ada data cashout untuk ditampilkan.</div>
        ) : (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={monthlyCashout}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip
                formatter={(value) => `Rp ${Number(value).toLocaleString('id-ID')}`}
              />
              <Bar dataKey="cashout" fill="#ef4444" name="Cash Out" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b">
          <h3 className="text-[#2C2C2C]">Cash Out Transactions</h3>
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
                        {t.category || 'Operational'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-red-600">
                      Rp {Number(t.amount).toLocaleString('id-ID')}
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
