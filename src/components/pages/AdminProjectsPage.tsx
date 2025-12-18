import { Plus, Edit, Trash2, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const API_BASE = "http://localhost:4000";

type Project = {
  id: string;       // pakai nama tab
  name: string;
  client: string;
  status: "Planning" | "In Progress" | "Near Complete" | "Completed" | string;
  startDate: string;
  progress: number;
};

function getTokenSafe() {
  const raw = localStorage.getItem("authToken");
  if (!raw) return null;
  const cleaned = raw.replace(/^"+|"+$/g, "").trim();
  const isJWT = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/.test(cleaned);
  return isJWT ? cleaned : null;
}

export function AdminProjectsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ type: "ok" | "err"; text: string } | null>(null);


  // modal create
  const [openCreate, setOpenCreate] = useState(false);
  const [form, setForm] = useState({
    name: "",
    client: "",
    status: "Planning",
    startDate: "",
    progress: 0,
  });

  async function fetchProjects() {
  setLoading(true);
  setError(null);

  try {
    const token = getTokenSafe();
    if (!token) {
      setError("Token tidak valid. Silakan login ulang.");
      setProjects([]);
      return;
    }

    const res = await fetch(`${API_BASE}/projects`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const j = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(j?.message || `Gagal load projects (${res.status})`);
    }

    // ✅ fallback: backend bisa balikin {data:[...]} atau {projects:[...]}
    if (Array.isArray(j.data)) {
      setProjects(j.data);
    } else if (Array.isArray(j.projects)) {
      setProjects(
        j.projects.map((name: string) => ({
          id: name,
          name,
          client: "-",
          status: "Planning",
          startDate: "",
          progress: 0,
        }))
      );
    } else {
      setProjects([]);
    }
  } catch (e: any) {
    setError(e?.message || "Gagal load projects.");
    setProjects([]);
  } finally {
    setLoading(false);
  }
} 

  async function createProject() {
    try {
      const token = getTokenSafe();
      if (!token) return;

      const res = await fetch(`${API_BASE}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const j = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(j?.message || `Gagal create project (${res.status})`);
      }

      // ✅ notif sukses
      setNotice({ type: "ok", text: j?.message || "Project berhasil dibuat." });

      setOpenCreate(false);
      setForm({ name: "", client: "", status: "Planning", startDate: "", progress: 0 });

      await fetchProjects(); // ✅ pastikan refresh selesai


      setOpenCreate(false);
      setForm({ name: "", client: "", status: "Planning", startDate: "", progress: 0 });
      fetchProjects();
    } catch (e: any) {
      alert(e?.message || "Create project gagal");
    }
  }

  async function deleteProject(name: string) {
    const ok = confirm(`Hapus project "${name}"? Ini akan menghapus TAB di spreadsheet.`);
    if (!ok) return;

    try {
      const token = getTokenSafe();
      if (!token) return;

      const res = await fetch(`${API_BASE}/projects/${encodeURIComponent(name)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j?.message || `Gagal delete project (${res.status})`);
      }

      fetchProjects();
    } catch (e: any) {
      alert(e?.message || "Delete project gagal");
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  const filteredProjects = useMemo(() => {
    const q = searchTerm.toLowerCase();
    return projects.filter((p) =>
      p.name.toLowerCase().includes(q) || (p.client || "").toLowerCase().includes(q)
    );
  }, [projects, searchTerm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";
      case "In Progress":
        return "bg-blue-100 text-blue-700";
      case "Near Complete":
        return "bg-purple-100 text-purple-700";
      case "Planning":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) return <div className="p-8 text-gray-500">Loading projects…</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        {notice && (
        <div
          className={`mb-6 rounded-lg border px-4 py-3 ${
            notice.type === "ok"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {notice.text}
        </div>
      )}

        <div>
          <h1 className="text-[#2C2C2C]">Project Management</h1>
          <p className="text-gray-600">Manage and track all your interior design projects</p>
        </div>
        <button
          onClick={() => setOpenCreate(true)}
          className="px-6 py-3 bg-[#D4AF37] text-white rounded-lg hover:bg-[#C19B2B] transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          New Project
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search projects or clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:border-[#D4AF37]"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-gray-600">Project Name</th>
                <th className="px-6 py-4 text-left text-gray-600">Client</th>
                <th className="px-6 py-4 text-left text-gray-600">Status</th>
                <th className="px-6 py-4 text-left text-gray-600">Start Date</th>
                <th className="px-6 py-4 text-left text-gray-600">Progress</th>
                <th className="px-6 py-4 text-left text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredProjects.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="text-gray-700">{p.name}</p>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{p.client}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{p.startDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-[120px]">
                        <div className="bg-[#D4AF37] h-2 rounded-full" style={{ width: `${p.progress}%` }} />
                      </div>
                      <span className="text-sm text-gray-600 min-w-[45px]">{p.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Edit (next)">
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => deleteProject(p.name)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Delete project"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProjects.length === 0 && (
                <tr>
                  <td className="px-6 py-6 text-gray-500" colSpan={6}>No projects found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600 mb-2">Total Projects</p>
          <p className="text-3xl text-[#2C2C2C]">{projects.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600 mb-2">In Progress</p>
          <p className="text-3xl text-blue-600">{projects.filter((p) => p.status === "In Progress").length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600 mb-2">Near Complete</p>
          <p className="text-3xl text-purple-600">{projects.filter((p) => p.status === "Near Complete").length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600 mb-2">Completed</p>
          <p className="text-3xl text-green-600">{projects.filter((p) => p.status === "Completed").length}</p>
        </div>
      </div>

      {/* Modal Create */}
      {openCreate && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6">
            <h3 className="text-lg font-semibold mb-4">New Project</h3>

            <div className="grid grid-cols-1 gap-3">
              <input
                className="border rounded-lg px-4 py-2"
                placeholder="Project name (tab name)"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                className="border rounded-lg px-4 py-2"
                placeholder="Client"
                value={form.client}
                onChange={(e) => setForm({ ...form, client: e.target.value })}
              />
              <select
                className="border rounded-lg px-4 py-2"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option>Planning</option>
                <option>In Progress</option>
                <option>Near Complete</option>
                <option>Completed</option>
              </select>
              <input
                className="border rounded-lg px-4 py-2"
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
              <input
                className="border rounded-lg px-4 py-2"
                type="number"
                min={0}
                max={100}
                value={form.progress}
                onChange={(e) => setForm({ ...form, progress: Number(e.target.value) })}
              />
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <button className="px-4 py-2 rounded-lg border" onClick={() => setOpenCreate(false)}>
                Cancel
              </button>
              <button className="px-4 py-2 rounded-lg bg-[#D4AF37] text-white" onClick={createProject}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
