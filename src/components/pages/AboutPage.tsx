import { ShieldCheck, FileText, Users, Hammer } from "lucide-react";

export function AboutPage() {
  const pillars = [
    { icon: ShieldCheck, title: "Quality Control", desc: "Checklist QC sebelum serah terima." },
    { icon: FileText, title: "Clear Documentation", desc: "Progress report & material list." },
    { icon: Users, title: "Team Coordination", desc: "Koordinasi lapangan + komunikasi owner." },
    { icon: Hammer, title: "Execution Focus", desc: "Struktur, finishing, dan detail tahan lama." },
  ];

  return (
    <div className="bg-background text-foreground">
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-3 py-1 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" />
              About
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Proper process. <span className="text-primary">Proper result.</span>
            </h1>

            <p className="mt-4 text-sm text-muted-foreground sm:text-base">
              Kami fokus pada eksekusi proyek real estate yang profesional: transparan, rapi, dan terdokumentasi.
            </p>

            <div className="mt-6 grid grid-cols-3 gap-4 rounded-2xl border border-border/60 bg-card p-5">
              <div>
                <div className="text-2xl font-semibold">120+</div>
                <div className="text-xs text-muted-foreground">Projects</div>
              </div>
              <div>
                <div className="text-2xl font-semibold">8+ yrs</div>
                <div className="text-xs text-muted-foreground">Experience</div>
              </div>
              <div>
                <div className="text-2xl font-semibold">Weekly</div>
                <div className="text-xs text-muted-foreground">Reporting</div>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border/60 bg-card p-6">
            <div className="text-sm font-semibold">What you get</div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {pillars.map((p) => {
                const Icon = p.icon;
                return (
                  <div key={p.title} className="rounded-2xl border border-border/60 bg-background p-5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/25">
                      <Icon size={18} />
                    </div>
                    <div className="mt-4 text-sm font-semibold">{p.title}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{p.desc}</div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl border border-border/60 bg-background p-5 text-sm text-muted-foreground">
              <span className="text-foreground font-semibold">Workflow:</span> Survey → RAB & timeline → Execution → QC → Handover.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
