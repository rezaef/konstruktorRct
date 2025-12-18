import { Lock, Mail } from "lucide-react";
import { useState } from "react";
import hdaLogo from "../../assets/login-bg.png";
import { ParticleBackground } from "../effects/ParticleBackground";

interface LoginPageProps {
  onLogin: () => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || "Login gagal. Cek kembali email & password.");
      }

      if (!data?.token) {
        throw new Error("Token tidak ditemukan di response backend.");
      }

      localStorage.setItem("authToken", data.token);
      onLogin();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan saat login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground">
      {/* Background gradient real-estate */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/40" />

      {/* Glow accents (gold + emerald) */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-secondary/15 blur-3xl" />

      {/* Partikel bergerak */}
      <ParticleBackground />

      {/* Wrapper */}
      <div className="relative z-10 min-h-screen w-full flex items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm">
            {/* Logo & Title */}
            <div className="text-center">
              <div className="mx-auto inline-flex items-center gap-3">
                <div className="h-11 w-11 overflow-hidden rounded-2xl border border-border/60 bg-background">
                  <img src={hdaLogo} alt="HDA Interior" className="h-full w-full object-cover opacity-90" />
                </div>
                <div className="text-left leading-tight">
                  <div className="text-sm font-semibold tracking-wide">KONSTRUKTOR</div>
                  <div className="text-xs text-muted-foreground">Admin Access</div>
                </div>
              </div>

              <h2 className="mt-5 text-2xl font-semibold tracking-tight">
                Admin Dashboard
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Masuk untuk mengelola proyek, keuangan, dan rekapitulasi.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              <div className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground">
                    Email
                  </label>
                  <div className="relative mt-2">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                      <Mail size={18} />
                    </span>
                    <input
                      type="email"
                      required
                      value={credentials.email}
                      onChange={(e) =>
                        setCredentials({ ...credentials, email: e.target.value })
                      }
                      className="block w-full rounded-2xl border border-border/60 bg-background pl-10 pr-3 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40"
                      placeholder="admin@konstruktor.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-medium text-muted-foreground">
                    Password
                  </label>
                  <div className="relative mt-2">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                      <Lock size={18} />
                    </span>
                    <input
                      type="password"
                      required
                      value={credentials.password}
                      onChange={(e) =>
                        setCredentials({ ...credentials, password: e.target.value })
                      }
                      className="block w-full rounded-2xl border border-border/60 bg-background pl-10 pr-3 py-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/40"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-2xl border border-destructive/30 bg-card px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95 disabled:opacity-70"
              >
                {isLoading && (
                  <span className="h-4 w-4 border-2 border-primary-foreground border-b-transparent rounded-full animate-spin" />
                )}
                <span>{isLoading ? "Memproses..." : "Masuk"}</span>
              </button>

              {/* Footnote */}
              <p className="text-center text-xs text-muted-foreground">
                Protected area • Token-based authentication
              </p>
            </form>
          </div>

          {/* Small hint card */}
          <div className="mt-4 rounded-2xl border border-border/60 bg-card/60 p-4 text-xs text-muted-foreground">
            Gunakan akun admin yang terdaftar di backend. Jika token invalid, silakan login ulang.
          </div>
        </div>
      </div>
    </div>
  );
}
