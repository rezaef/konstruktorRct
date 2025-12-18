// src/services/backendApi.ts
const API_BASE =
  (import.meta as any).env?.VITE_API_BASE_URL?.toString() || "http://localhost:4000";

export function getAuthToken() {
  return localStorage.getItem("authToken");
}

export function clearAuthToken() {
  localStorage.removeItem("authToken");
}

async function parseJsonSafe(res: Response) {
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { message: text };
  }
}

export async function apiGet<T>(path: string, token?: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : undefined,
  });

  const data = await parseJsonSafe(res);

  if (!res.ok) {
    const msg = data?.message || `Request gagal (${res.status})`;
    const err: any = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data as T;
}

export async function apiPost<T>(path: string, body: any, token?: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
  });

  const data = await parseJsonSafe(res);

  if (!res.ok) {
    const msg = data?.message || `Request gagal (${res.status})`;
    const err: any = new Error(msg);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data as T;
}

// ===== Types & API wrappers =====
export type ProjectsResponse = {
  success: boolean;
  projects: string[];
};

export type CashoutItem = {
  sheetRow: number;
  date: string;
  pengeluaran: string;
  metode: string;
  amount: number;
};

export type CashoutResponse = {
  success: boolean;
  projectSheet: string;
  month: string;
  count: number;
  total: number;
  items: CashoutItem[];
};

export type CashoutCreateResponse = {
  success: boolean;
  message: string;
  sheet: string;
  rowIndex: number;
  data: { date: string; pengeluaran: string; metode: string; amount: number };
};

export async function listProjects(token: string) {
  return apiGet<ProjectsResponse>(`/projects`, token);
}

export async function getCashout(token: string, projectSheet: string, month: string) {
  const qs = new URLSearchParams({ projectSheet, month });
  return apiGet<CashoutResponse>(`/cashout?${qs.toString()}`, token);
}

export async function addCashout(
  token: string,
  payload: { projectSheet: string; date: string; pengeluaran: string; metode: string; amount: string }
) {
  return apiPost<CashoutCreateResponse>(`/cashout`, payload, token);
}

export async function getDashboardOverview(project: string = "all") {
  const token = localStorage.getItem("token"); // sesuaikan key token kamu
  const res = await fetch(`http://localhost:4000/dashboard/overview?project=${encodeURIComponent(project)}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error("Failed to load dashboard overview");
  return res.json();
}
