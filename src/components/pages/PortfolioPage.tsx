import { ImageWithFallback } from "../figma/ImageWithFallback";

export function PortfolioPage() {
  const projects = [
    { id: 1, title: "Modern Residential Cluster", type: "Housing", image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1600&q=80" },
    { id: 2, title: "Commercial Fit-out", type: "Retail/Office", image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80" },
    { id: 3, title: "Premium Renovation", type: "Upgrade", image: "https://images.unsplash.com/photo-1501183638710-841dd1904471?auto=format&fit=crop&w=1600&q=80" },
    { id: 4, title: "Facade Improvement", type: "Exterior", image: "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1600&q=80" },
    { id: 5, title: "Contemporary Interior", type: "Interior", image: "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1600&q=80" },
    { id: 6, title: "Office Refresh", type: "Commercial", image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80" },
  ];

  return (
    <div className="bg-background text-foreground">
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-3 py-1 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Portfolio
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Portofolio dengan vibe <span className="text-primary">premium</span>
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Showcase pekerjaan yang clean, modern, dan menaikkan persepsi kualitas properti.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <div key={p.id} className="group overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
              <div className="relative h-56">
                <ImageWithFallback src={p.image} alt={p.title} className="h-full w-full object-cover transition group-hover:scale-[1.03]" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/85 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="inline-flex rounded-full border border-border/60 bg-card/70 px-2 py-1 text-xs text-muted-foreground">
                    {p.type}
                  </div>
                  <div className="mt-2 text-sm font-semibold">{p.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-3xl border border-border/60 bg-card p-6 text-sm text-muted-foreground">
          Tinggal ganti data projects ini ke data asli dari backend/API kalau sudah siap.
        </div>
      </section>
    </div>
  );
}
