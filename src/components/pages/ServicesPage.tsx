import { Home, Building2, Wrench, ClipboardCheck } from "lucide-react";

export function ServicesPage() {
  const services = [
    {
      icon: Home,
      title: "Residential Build & Renovation",
      description:
        "Rumah tinggal sampai unit investasi. Fokus pada struktur, finishing, dan layout yang menaikkan value.",
      points: ["RAB & timeline", "Renovasi interior/exterior", "Finishing premium", "QC handover"],
    },
    {
      icon: Building2,
      title: "Commercial & Fit-out",
      description:
        "Kantor, retail, ruko. Rapi, efisien, dan mudah maintenance.",
      points: ["Layout & partisi", "MEP readiness", "On-time delivery", "Dokumentasi lengkap"],
    },
    {
      icon: Wrench,
      title: "Maintenance & Improvement",
      description:
        "Perawatan berkala dan upgrade agar properti tetap menarik di pasar.",
      points: ["Perbaikan minor/major", "Waterproofing", "Upgrade material", "Facade touch-up"],
    },
    {
      icon: ClipboardCheck,
      title: "Project Documentation",
      description:
        "Progress report, material list, dan catatan QC untuk owner/developer.",
      points: ["Progress report", "Material tracking", "Punch list", "Serah terima terstruktur"],
    },
  ];

  return (
    <div className="bg-background text-foreground">
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-3 py-1 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Services
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Layanan profesional untuk <span className="text-primary">proyek real estate</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Paket layanan rapi, transparan, dan siap eksekusi.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {services.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.title} className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/25">
                    <Icon size={18} />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Output: <span className="text-foreground font-semibold">RAB • Timeline • QC</span>
                  </div>
                </div>

                <div className="mt-4 text-lg font-semibold">{s.title}</div>
                <p className="mt-2 text-sm text-muted-foreground">{s.description}</p>

                <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
