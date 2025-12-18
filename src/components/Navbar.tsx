import { Menu, X } from "lucide-react";
import { useState } from "react";
import hdaLogo from "../assets/login-bg.png";

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "home" },
    { name: "About", path: "about" },
    { name: "Services", path: "services" },
    { name: "Portfolio", path: "portfolio" },
    { name: "Contact", path: "contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div
            className="flex cursor-pointer items-center gap-3"
            onClick={() => {
              onNavigate("home");
              setIsMobileMenuOpen(false);
            }}
          >
            <div className="h-10 w-10 overflow-hidden rounded-xl border border-border/60 bg-card">
              <img
                src={hdaLogo}
                alt="Logo"
                className="h-full w-full object-cover opacity-90"
              />
            </div>

            <div className="leading-tight">
              <div className="text-base font-semibold tracking-wide text-foreground">
                KONSTRUKTOR
              </div>
              <div className="text-xs text-muted-foreground">
                Real Estate • Build • Renovate
              </div>
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const active = currentPage === link.path;
              return (
                <button
                  key={link.path}
                  onClick={() => onNavigate(link.path)}
                  className={[
                    "rounded-xl px-4 py-2 text-sm transition",
                    active
                      ? "bg-primary/15 text-foreground ring-1 ring-primary/40"
                      : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                  ].join(" ")}
                >
                  {link.name}
                </button>
              );
            })}
            <button
              onClick={() => onNavigate("contact")}
              className="ml-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95"
            >
              Get a Quote
            </button>
          </div>

          {/* Mobile */}
          <button
            className="md:hidden rounded-xl border border-border/60 bg-card p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="rounded-2xl border border-border/60 bg-card p-2">
              {navLinks.map((link) => {
                const active = currentPage === link.path;
                return (
                  <button
                    key={link.path}
                    onClick={() => {
                      onNavigate(link.path);
                      setIsMobileMenuOpen(false);
                    }}
                    className={[
                      "w-full rounded-xl px-4 py-3 text-left text-sm transition",
                      active
                        ? "bg-primary/15 text-foreground ring-1 ring-primary/40"
                        : "text-muted-foreground hover:bg-muted/70 hover:text-foreground",
                    ].join(" ")}
                  >
                    {link.name}
                  </button>
                );
              })}
              <button
                onClick={() => {
                  onNavigate("contact");
                  setIsMobileMenuOpen(false);
                }}
                className="mt-2 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
              >
                Get a Quote
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
