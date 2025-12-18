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
  const raw = localStorage.getItem("authToken");
  if (!raw) return null;

  const cleaned = raw.replace(/^"+|"+$/g, "").trim();
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
    return (
      <div className="mx-auto max-w-7xl px-6 py-8 text-sm text-muted-foreground">
        Loading dashboard…
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div className="rounded-2xl border border-destructive/30 bg-card p-4 text-sm text-destructive">
          {error}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-8 text-sm text-muted-foreground">
        No data.
      </div>
    );
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
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* Header + Filter */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Dashboard Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Welcome back! Here’s what’s happening with your projects.
          </p>
        </div>

        <div className="w-full sm:w-auto">
          <label className="text-xs text-muted-foreground">Project scope</label>
          <select
            className="mt-2 w-full sm:w-[220px] rounded-xl border border-border/60 bg-background px-4 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40"
            value={scope}
            onChange={(e) => setScope(e.target.value)}
          >
            <option value="all">All Projects</option>
            {projects.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {/* Total Projects */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Total Projects</div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/25">
              <FolderKanban size={18} />
            </div>
          </div>
          <div className="mt-3 text-3xl font-semibold text-foreground">{kpi.totalProjects}</div>
          <div className="mt-2 text-xs text-muted-foreground">Overview across scope</div>
        </div>

        {/* Monthly Spending */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Monthly Spending</div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary/15 text-secondary ring-1 ring-secondary/25">
              <DollarSign size={18} />
            </div>
          </div>
          <div className="mt-3 text-2xl font-semibold text-foreground">
            {formatIDR(kpi.monthlySpending)}
          </div>
          {kpi.monthlySpendingPct !== null && kpi.monthlySpendingPct !== undefined && (
            <div className="mt-2 text-xs text-muted-foreground">
              <span className="text-secondary font-semibold">
                {kpi.monthlySpendingPct > 0 ? "+" : ""}
                {Number(kpi.monthlySpendingPct).toFixed(1)}%
              </span>{" "}
              from last month
            </div>
          )}
        </div>

        {/* Ongoing Projects */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Ongoing Projects</div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/25">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="mt-3 text-3xl font-semibold text-foreground">{kpi.ongoingProjects}</div>
          <div className="mt-2 text-xs text-muted-foreground">{kpi.nearCompletion} near completion</div>
        </div>

        {/* Total Expenses */}
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">Total Expenses</div>
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-destructive/15 text-destructive ring-1 ring-destructive/25">
              <AlertCircle size={18} />
            </div>
          </div>
          <div className="mt-3 text-2xl font-semibold text-foreground">
            {formatIDR(kpi.totalExpenses)}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">Monitor carefully</div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <h3 className="text-base font-semibold text-foreground mb-4">
            Monthly Expenses Overview
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(v) => formatIDR(Number(v))} />
                <Bar dataKey="expenses" fill="#c9a227" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
          <h3 className="text-base font-semibold text-foreground mb-4">Financial Report</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(v) => formatIDR(Number(v))} />
                <Line type="monotone" dataKey="baseline" stroke="#1f7a6c" strokeWidth={2} />
                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-secondary" />
              <span>{charts.line.greenLabel}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded bg-destructive" />
              <span>{charts.line.redLabel}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
