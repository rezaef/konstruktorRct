import { ImageWithFallback } from "../figma/ImageWithFallback";
import { ArrowRight, Building2, ShieldCheck, Timer, TrendingUp } from "lucide-react";

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  const highlights = [
    { icon: Building2, title: "Premium Build", desc: "Finishing rapi, material jelas, hasil proper." },
    { icon: Timer, title: "Timeline Transparan", desc: "Milestone jelas + update progress berkala." },
    { icon: ShieldCheck, title: "QC sebelum Handover", desc: "Checklist QC agar minim revisi & aman." },
    { icon: TrendingUp, title: "Value Properti Naik", desc: "Desain & eksekusi yang meningkatkan nilai." },
  ];

  const featured = [
    {
      title: "Modern Residential",
      tag: "Housing",
      image:
        "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Commercial Space",
      tag: "Retail/Office",
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
    },
    {
      title: "Premium Renovation",
      tag: "Upgrade",
      image:
        "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1600&q=80",
    },
  ];

  return (
    <div className="bg-background text-foreground">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=2200&q=80"
            alt="Hero"
            className="h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-3 py-1 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Real Estate • Construction • Renovation
            </div>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Proper, profesional, dan{" "}
              <span className="text-primary">siap meningkatkan value</span> properti
            </h1>

            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              Dari perencanaan sampai serah terima—kami fokus pada hasil yang rapi,
              timeline jelas, dan dokumentasi lengkap.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => onNavigate("contact")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95"
              >
                Konsultasi & Estimasi <ArrowRight size={18} />
              </button>
              <button
                onClick={() => onNavigate("portfolio")}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-border/70 bg-card px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted/70"
              >
                Lihat Portofolio
              </button>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-4 rounded-2xl border border-border/60 bg-card/60 p-4 backdrop-blur sm:max-w-xl">
              <div>
                <div className="text-2xl font-semibold text-foreground">120+</div>
                <div className="text-xs text-muted-foreground">Project handled</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-foreground">8+ yrs</div>
                <div className="text-xs text-muted-foreground">Experience</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-foreground">QC</div>
                <div className="text-xs text-muted-foreground">Before handover</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Kenapa pilih kami</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Standar real estate: tampilan premium, struktur aman, dan proses rapi.
            </p>
          </div>
          <button
            onClick={() => onNavigate("services")}
            className="hidden rounded-xl border border-border/70 bg-card px-4 py-2 text-sm font-semibold hover:bg-muted/70 sm:inline-flex"
          >
            Explore services
          </button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {highlights.map((h) => {
            const Icon = h.icon;
            return (
              <div key={h.title} className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/25">
                  <Icon size={18} />
                </div>
                <div className="mt-4 text-sm font-semibold">{h.title}</div>
                <div className="mt-1 text-sm text-muted-foreground">{h.desc}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/60 bg-card p-6 sm:p-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold">Featured works</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Contoh hasil kerja dengan gaya modern & premium.
              </p>
            </div>
            <button
              onClick={() => onNavigate("portfolio")}
              className="inline-flex items-center gap-2 self-start rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:opacity-95"
            >
              View portfolio <ArrowRight size={16} />
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {featured.map((p) => (
              <div key={p.title} className="group overflow-hidden rounded-2xl border border-border/60 bg-background">
                <div className="relative h-48">
                  <ImageWithFallback
                    src={p.image}
                    alt={p.title}
                    className="h-full w-full object-cover transition group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="inline-flex rounded-full border border-border/60 bg-card/70 px-2 py-1 text-xs text-muted-foreground">
                      {p.tag}
                    </div>
                    <div className="mt-2 text-sm font-semibold">{p.title}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
