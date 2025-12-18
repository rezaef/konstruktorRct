import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";

export function ContactPage() {
  return (
    <div className="bg-background text-foreground">
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card px-3 py-1 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Contact
            </div>

            <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              Konsultasi proyek <span className="text-primary">sekarang</span>
            </h1>
            <p className="mt-3 text-sm text-muted-foreground sm:text-base">
              Kirim detail kebutuhan—kami balas dengan estimasi awal dan timeline kasar.
            </p>

            <div className="mt-6 space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2"><Phone size={16} className="opacity-80" /> <span>+62 8xx xxxx xxxx</span></div>
              <div className="flex items-center gap-2"><Mail size={16} className="opacity-80" /> <span>hello@konstruktor.id</span></div>
              <div className="flex items-center gap-2"><MapPin size={16} className="opacity-80" /> <span>Indonesia</span></div>
            </div>

            <div className="mt-8 rounded-3xl border border-border/60 bg-card p-6 text-sm text-muted-foreground">
              <div className="text-sm font-semibold text-foreground">Yang perlu disiapkan</div>
              <ul className="mt-3 grid gap-2">
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> Lokasi & luas area</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> Tipe proyek (build/reno/fit-out)</li>
                <li className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full bg-primary" /> Target timeline & budget range (opsional)</li>
              </ul>
            </div>
          </div>

          <div className="rounded-3xl border border-border/60 bg-card p-6">
            <div className="text-sm font-semibold">Send a message</div>

            <form className="mt-5 grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs text-muted-foreground">Name</label>
                  <input className="mt-2 w-full rounded-2xl border border-border/60 bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40" placeholder="Nama kamu" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Phone</label>
                  <input className="mt-2 w-full rounded-2xl border border-border/60 bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40" placeholder="+62 ..." />
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground">Email</label>
                <input className="mt-2 w-full rounded-2xl border border-border/60 bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40" placeholder="email@domain.com" />
              </div>

              <div>
                <label className="text-xs text-muted-foreground">Message</label>
                <textarea className="mt-2 min-h-[140px] w-full rounded-2xl border border-border/60 bg-background px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/40" placeholder="Ceritakan kebutuhan proyek kamu..." />
              </div>

              <button type="button" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:opacity-95">
                Send <ArrowRight size={18} />
              </button>

              <div className="text-xs text-muted-foreground">
                *Ini masih UI. Kalau mau, aku sambungkan ke endpoint backend.
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
