import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/70 bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="text-lg font-semibold tracking-wide text-foreground">
              KONSTRUKTOR
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Premium real-estate & construction partner. Clean execution, clear
              timeline, and professional documentation.
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold text-foreground">Contact</div>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone size={16} className="opacity-80" />
                <span>+62 8xx xxxx xxxx</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} className="opacity-80" />
                <span>hello@konstruktor.id</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin size={16} className="opacity-80" />
                <span>Indonesia</span>
              </div>
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold text-foreground">
              Quick Links
            </div>
            <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
              <span>Services</span>
              <span>Portfolio</span>
              <span>Documentation</span>
              <span>Consultation</span>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border/70 pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Konstruktor. All rights reserved.</span>
          <span className="opacity-80">Dark Real Estate Theme</span>
        </div>
      </div>
    </footer>
  );
}
