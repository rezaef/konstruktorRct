import { useEffect, useMemo, useState } from "react";
import { RefreshCw, Plus, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import {
  addCashout,
  clearAuthToken,
  getAuthToken,
  getCashout,
  listProjects,
  type CashoutItem,
} from "../../services/backendApi";

function fmtRp(n: number) {
  return new Intl.NumberFormat("id-ID").format(n);
}

function getDefaultMonth() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function AdminRecapPage() {
  const [token, setToken] = useState<string | null>(null);

  const [projects, setProjects] = useState<string[]>([]);
  const [projectSheet, setProjectSheet] = useState("");
  const [month, setMonth] = useState(getDefaultMonth());

  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const [items, setItems] = useState<CashoutItem[]>([]);
  const [total, setTotal] = useState(0);

  const [form, setForm] = useState({
    date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
    pengeluaran: "",
    metode: "transfer",
    amount: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const [q, setQ] = useState("");

  // Ambil token dari localStorage
  useEffect(() => {
    const t = getAuthToken();
    setToken(t);
    if (!t) {
      toast.error("Silakan login dulu.");
      // paksa balik ke /dashboard (karena login kamu via /dashboard)
      window.location.pathname = "/dashboard";
    }
  }, []);

  // Load list project (nama-nama sheet)
  useEffect(() => {
    if (!token) return;

    const run = async () => {
      setLoadingProjects(true);
      try {
        const res = await listProjects(token);
        const list = res.projects || [];
        setProjects(list);

        // auto pilih pertama kalau belum ada
        if (!projectSheet && list.length > 0) setProjectSheet(list[0]);
      } catch (e: any) {
        if (e?.status === 401) {
          clearAuthToken();
          toast.error("Sesi login habis. Silakan login ulang.");
          window.location.pathname = "/dashboard";
          return;
        }
        toast.error(e?.message || "Gagal mengambil daftar project.");
      } finally {
        setLoadingProjects(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // Load data cashout tiap ganti project / month
  const loadCashout = async () => {
    if (!token || !projectSheet || !month) return;

    setLoadingData(true);
    try {
      const res = await getCashout(token, projectSheet, month);
      setItems(res.items || []);
      setTotal(res.total || 0);
    } catch (e: any) {
      if (e?.status === 401) {
        clearAuthToken();
        toast.error("Sesi login habis. Silakan login ulang.");
        window.location.pathname = "/dashboard";
        return;
      }
      toast.error(e?.message || "Gagal memuat data cashout.");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadCashout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, projectSheet, month]);

  const filteredItems = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return items;
    return items.filter((x) =>
      `${x.date} ${x.pengeluaran} ${x.metode}`.toLowerCase().includes(term)
    );
  }, [items, q]);

  const filteredTotal = useMemo(() => {
    return filteredItems.reduce((s, x) => s + (x.amount || 0), 0);
  }, [filteredItems]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (!projectSheet) return toast.error("Pilih project dulu.");
    if (!month) return toast.error("Pilih bulan dulu.");
    if (!form.date) return toast.error("Tanggal wajib.");
    if (!form.pengeluaran.trim()) return toast.error("Pengeluaran wajib.");
    if (!form.amount.trim()) return toast.error("Nominal wajib.");

    setSubmitting(true);
    try {
      await addCashout(token, {
        projectSheet,
        date: form.date,
        pengeluaran: form.pengeluaran.trim(),
        metode: form.metode,
        amount: form.amount.trim(),
      });

      toast.success("Berhasil menambahkan cashout.");
      setForm((p) => ({ ...p, pengeluaran: "", amount: "" }));

      // refresh data
      await loadCashout();
    } catch (e: any) {
      if (e?.status === 401) {
        clearAuthToken();
        toast.error("Sesi login habis. Silakan login ulang.");
        window.location.pathname = "/dashboard";
        return;
      }
      toast.error(e?.message || "Gagal menambahkan cashout.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Rekapitulasi Pengeluaran (Cashout)
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Tambah & lihat pengeluaran per project (berdasarkan tab sheet) dan per bulan.
          </p>
        </div>

        <button
          onClick={loadCashout}
          disabled={loadingData || !projectSheet}
          className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-60"
        >
          <RefreshCw className={loadingData ? "animate-spin" : ""} size={16} />
          Refresh
        </button>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-4">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2 flex items-center gap-2">
            <FileSpreadsheet size={16} /> Project (Sheet)
          </div>

          <select
            value={projectSheet}
            onChange={(e) => setProjectSheet(e.target.value)}
            disabled={loadingProjects}
            className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-950 px-3 py-2 text-sm"
          >
            {projects.length === 0 ? (
              <option value="">
                {loadingProjects ? "Memuat project..." : "Tidak ada project"}
              </option>
            ) : (
              projects.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))
            )}
          </select>

          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Total project: {projects.length}
          </div>
        </div>

        <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-4">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Bulan
          </div>

          <input
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-950 px-3 py-2 text-sm"
          />

          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Transaksi: {items.length} • Total: Rp {fmtRp(total)}
          </div>
        </div>

        <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-4">
          <div className="text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Cari
          </div>

          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Cari tanggal / pengeluaran / metode..."
            className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-950 px-3 py-2 text-sm"
          />

          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Hasil: {filteredItems.length} • Total filter: Rp {fmtRp(filteredTotal)}
          </div>
        </div>
      </div>

      {/* Form tambah cashout */}
      <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Tambah Pengeluaran
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-3">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
              Tanggal
            </label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-950 px-3 py-2 text-sm"
            />
          </div>

          <div className="md:col-span-5">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
              Pengeluaran (keterangan)
            </label>
            <input
              value={form.pengeluaran}
              onChange={(e) => setForm((p) => ({ ...p, pengeluaran: e.target.value }))}
              placeholder="Contoh: Material / Paving / Upah..."
              className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-950 px-3 py-2 text-sm"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
              Metode
            </label>
            <select
              value={form.metode}
              onChange={(e) => setForm((p) => ({ ...p, metode: e.target.value }))}
              className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-950 px-3 py-2 text-sm"
            >
              <option value="cash">Cash</option>
              <option value="debit">Debit</option>
              <option value="transfer">Transfer</option>
              <option value="kartu kredit">Kartu Kredit</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
              Nominal (Rp)
            </label>
            <input
              value={form.amount}
              onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
              placeholder="Contoh: 1.250.000"
              className="w-full rounded-lg border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-950 px-3 py-2 text-sm"
            />
          </div>

          <div className="md:col-span-12 flex justify-end">
            <button
              type="submit"
              disabled={submitting || !projectSheet}
              className="inline-flex items-center gap-2 rounded-lg bg-gray-900 text-white px-4 py-2 text-sm font-semibold hover:bg-gray-800 disabled:opacity-60"
            >
              <Plus size={16} />
              {submitting ? "Menyimpan..." : "Tambah"}
            </button>
          </div>
        </form>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
          <div className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Daftar Pengeluaran
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {loadingData ? "Memuat..." : `${filteredItems.length} item`}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-950/60">
              <tr className="text-left text-gray-600 dark:text-gray-300">
                <th className="px-5 py-3 font-medium">Tanggal</th>
                <th className="px-5 py-3 font-medium">Pengeluaran</th>
                <th className="px-5 py-3 font-medium">Metode</th>
                <th className="px-5 py-3 font-medium text-right">Nominal</th>
                <th className="px-5 py-3 font-medium text-right">Row Sheet</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200 dark:divide-white/10">
              {filteredItems.length === 0 ? (
                <tr>
                  <td className="px-5 py-4 text-gray-500 dark:text-gray-400" colSpan={5}>
                    {loadingData ? "Memuat data..." : "Belum ada data untuk filter/bulan ini."}
                  </td>
                </tr>
              ) : (
                filteredItems.map((x) => (
                  <tr key={`${x.sheetRow}-${x.date}-${x.amount}`}>
                    <td className="px-5 py-3 text-gray-800 dark:text-gray-100">
                      {x.date}
                    </td>
                    <td className="px-5 py-3 text-gray-800 dark:text-gray-100">
                      {x.pengeluaran || "-"}
                    </td>
                    <td className="px-5 py-3 text-gray-700 dark:text-gray-200">
                      {x.metode || "-"}
                    </td>
                    <td className="px-5 py-3 text-right font-medium text-gray-900 dark:text-gray-100">
                      Rp {fmtRp(x.amount || 0)}
                    </td>
                    <td className="px-5 py-3 text-right text-gray-500 dark:text-gray-400">
                      {x.sheetRow}
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            {filteredItems.length > 0 && (
              <tfoot className="bg-gray-50 dark:bg-gray-950/60">
                <tr>
                  <td className="px-5 py-3 font-semibold" colSpan={3}>
                    Total
                  </td>
                  <td className="px-5 py-3 text-right font-bold">
                    Rp {fmtRp(filteredTotal)}
                  </td>
                  <td className="px-5 py-3" />
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </div>
  );
}
