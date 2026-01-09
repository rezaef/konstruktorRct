import { useEffect, useState } from "react";
import { DollarSign, TrendingUp, FolderKanban, AlertCircle } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const API_BASE = "http://localhost:4000";

function formatIDR(v: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(v || 0);
}

function getTokenSafe() {
  // token kamu disimpan oleh LoginPage sebagai "authToken"
  const raw = localStorage.getItem("authToken");
  if (!raw) return null;

  // bersihin kalau tersimpan dengan quotes: "\"eyJ...\""
  const cleaned = raw.replace(/^"+|"+$/g, "").trim();

  // validasi bentuk JWT: header.payload.signature
  const isJWT = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(cleaned);
  if (!isJWT) return null;

  return cleaned;
}

export function AdminDashboard() {
  const [scope, setScope] = useState("all");
  const [projects, setProjects] = useState<string[]>([]);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadDashboard(project = "all") {
    setLoading(true);
    setError(null);

    try {
      const token = getTokenSafe();
      if (!token) {
        setError("Token tidak valid / tidak ditemukan. Silakan login ulang.");
        setData(null);
        setProjects([]);
        return;
      }

      const res = await fetch(
        `${API_BASE}/dashboard/overview?project=${encodeURIComponent(project)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 401) {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
        return;
      }


      // kalau backend balikin non-200
      if (!res.ok) {
        let msg = `Gagal load dashboard (${res.status})`;
        try {
          const j = await res.json();
          msg = j?.message || msg;
        } catch {}
        setError(msg);
        setData(null);
        setProjects([]);
        return;
      }

      const json = await res.json();

      // guard structure
      if (!json?.success) {
        setError(json?.message || "Response tidak sukses.");
        setData(null);
        setProjects([]);
        return;
      }
      if (!json?.charts?.bar || !json?.charts?.line || !json?.kpi) {
        setError("Format data dashboard tidak sesuai (charts/kpi missing).");
        setData(null);
        setProjects([]);
        return;
      }

      setData(json);
      setProjects(json.projects || []);
    } catch (err: any) {
      setError(err?.message || "Load failed (cek backend/CORS/server).");
      setData(null);
      setProjects([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard(scope);
  }, [scope]);

  if (loading) {
    return <div className="p-8 text-gray-500">Loading dashboard…</div>;
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-white p-4 rounded-lg shadow border border-red-200 text-red-700">
          {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return <div className="p-8 text-gray-500">No data.</div>;
  }

  const { kpi, charts } = data;

  const barData = (charts.bar.labels || []).map((m: string, i: number) => ({
    month: m,
    expenses: charts.bar.data?.[i] ?? 0,
  }));

  const lineData = (charts.line.labels || []).map((m: string, i: number) => ({
    month: m,
    baseline: charts.line.green?.[i] ?? 0,
    expenses: charts.line.red?.[i] ?? 0,
  }));

  return (
    <div className="p-8">
      {/* Header + Filter */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-[#0B1F3B]">Dashboard Overview</h1>
          <p className="text-gray-600">
            Welcome back! Here's what's happening with your projects.
          </p>
        </div>

        <select
          className="border rounded-lg px-4 py-2 bg-white"
          value={scope}
          onChange={(e) => setScope(e.target.value)}
        >
          <option value="all">All Projects</option>
          {projects.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#D4AF37]">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-gray-600">Total Projects</h4>
            <FolderKanban size={24} className="text-[#D4AF37]" />
          </div>
          <p className="text-3xl text-[#0B1F3B]">{kpi.totalProjects}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-gray-600">Monthly Spending</h4>
            <DollarSign size={24} className="text-green-500" />
          </div>
          <p className="text-3xl text-[#0B1F3B]">
            {formatIDR(kpi.monthlySpending)}
          </p>
          {kpi.monthlySpendingPct !== null && kpi.monthlySpendingPct !== undefined && (
            <p className="text-sm text-green-600 mt-2">
              {kpi.monthlySpendingPct > 0 ? "+" : ""}
              {Number(kpi.monthlySpendingPct).toFixed(1)}% from last month
            </p>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-gray-600">Ongoing Projects</h4>
            <TrendingUp size={24} className="text-blue-500" />
          </div>
          <p className="text-3xl text-[#0B1F3B]">{kpi.ongoingProjects}</p>
          <p className="text-sm text-gray-500 mt-2">
            {kpi.nearCompletion} near completion
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-orange-500">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-gray-600">Total Expenses</h4>
            <AlertCircle size={24} className="text-orange-500" />
          </div>
          <p className="text-3xl text-[#0B1F3B]">
            {formatIDR(kpi.totalExpenses)}
          </p>
          <p className="text-sm text-orange-600 mt-2">Monitor carefully</p>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-[#0B1F3B] mb-4">Monthly Expenses Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(v) => formatIDR(Number(v))} />
              <Bar dataKey="expenses" fill="#D4AF37" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-[#0B1F3B] mb-4">Financial Report</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={lineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(v) => formatIDR(Number(v))} />
              <Line type="monotone" dataKey="baseline" stroke="#10b981" strokeWidth={2} />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>

          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded" />
              <span className="text-sm text-gray-600">{charts.line.greenLabel}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded" />
              <span className="text-sm text-gray-600">{charts.line.redLabel}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
