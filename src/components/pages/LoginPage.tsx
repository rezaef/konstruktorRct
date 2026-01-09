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

      // Simpan token di localStorage
      localStorage.setItem("authToken", data.token);

      // Beritahu App bahwa login sukses
      onLogin();
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan saat login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
  <div className="relative min-h-screen w-full bg-gradient-to-br from-[#0B1F3B] via-[#102A4D] to-[#0E7C66]">
    {/* Partikel bergerak di belakang form */}
    <ParticleBackground />

    {/* Wrapper form (di atas partikel) */}
    <div className="relative z-10 min-h-screen w-full flex items-center justify-center px-6 py-12 lg:px-16">
      <div className="w-full max-w-md">
        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-xl border border-white/40 p-8 sm:p-10 space-y-8">
        {/* Logo & Title */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 mb-4">
            <img
              src={hdaLogo}
              alt="HDA Interior"
              className="w-10 h-10 rounded-xl object-cover ring-1 ring-[#E2E8F0]"
            />
            <span className="text-xl font-semibold tracking-tight text-[#0B1F3B]">
              HDA Interior
            </span>
          </div>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-[#0B1F3B]">
            Admin Dashboard
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Masuk untuk mengelola proyek, keuangan, dan rekapitulasi.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Mail size={18} />
                </span>
                <input
                  type="email"
                  required
                  value={credentials.email}
                  onChange={(e) =>
                    setCredentials({ ...credentials, email: e.target.value })
                  }
                  className="block w-full rounded-lg border border-[#E2E8F0] pl-10 pr-3 py-2 text-sm shadow-sm focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                  placeholder="admin@konstruktor.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Lock size={18} />
                </span>
                <input
                  type="password"
                  required
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  className="block w-full rounded-lg border border-[#E2E8F0] pl-10 pr-3 py-2 text-sm shadow-sm focus:border-[#D4AF37] focus:ring-[#D4AF37]"
                  placeholder="••••••••"
                />
              </div>
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#C19B2B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] disabled:opacity-70"
          >
            {isLoading && (
              <span className="h-4 w-4 border-2 border-white border-b-transparent rounded-full animate-spin" />
            )}
            <span>{isLoading ? "Memproses..." : "Masuk"}</span>
          </button>
        </form>
        </div>
      </div>
    </div>
  </div>
);

}
