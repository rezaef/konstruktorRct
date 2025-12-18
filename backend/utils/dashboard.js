export function parseIDR(v) {
  if (v == null) return 0;
  const s = String(v).replace(/[^\d.-]/g, "");
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

// Support dd/mm/yyyy (contoh: 07/06/2022)
export function parseDateID(v) {
  if (!v) return null;
  const str = String(v).trim();

  // dd/mm/yyyy
  const m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) {
    const dd = Number(m[1]);
    const mm = Number(m[2]);
    const yy = Number(m[3]);
    const d = new Date(yy, mm - 1, dd);
    if (!Number.isNaN(d.getTime())) return d;
  }

  // fallback Date parser
  const d2 = new Date(str);
  if (!Number.isNaN(d2.getTime())) return d2;

  return null;
}

export function monthKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

export function last12MonthKeys(now = new Date()) {
  const keys = [];
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  for (let i = 11; i >= 0; i--) {
    const d = new Date(start.getFullYear(), start.getMonth() - i, 1);
    keys.push(monthKey(d));
  }
  return keys;
}

export function toMonthLabel(key) {
  const [y, m] = key.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleString("en-US", { month: "short" });
}

export function movingAvg(arr, window = 3) {
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    const start = Math.max(0, i - window + 1);
    const slice = arr.slice(start, i + 1);
    out.push(slice.reduce((a,b)=>a+b,0) / slice.length);
  }
  return out;
}

export function pctChange(curr, prev) {
  if (!prev || prev === 0) return null;
  return ((curr - prev) / prev) * 100;
}
