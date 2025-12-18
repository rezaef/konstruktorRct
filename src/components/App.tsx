import { useState, useEffect } from "react";

// Komponen UI umum
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { AdminSidebar } from "./AdminSidebar";
import { LogoutModal } from "./LogoutModal";

// Halaman umum (public)
import { HomePage } from "./pages/HomePage";
import { AboutPage } from "./pages/AboutPage";
import { ServicesPage } from "./pages/ServicesPage";
import { PortfolioPage } from "./pages/PortfolioPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage";
import { ContactPage } from "./pages/ContactPage";
import { LoginPage } from "./pages/LoginPage";

// Halaman admin
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminProjectsPage } from "./pages/AdminProjectsPage";
import { AdminFinancePage } from "./pages/AdminFinancePage";
import { AdminMaterialsPage } from "./pages/AdminMaterialsPage";
import { AdminSettingsPage } from "./pages/AdminSettingsPage";
import { AdminDocsPage } from "./pages/AdminDocsPage";
import { AdminRecapPage } from "./pages/AdminRecapPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const adminPathMap: Record<string, string> = {
    "/dashboard": "admin-dashboard",
    "/projects": "admin-projects",
    "/finance": "admin-finance",
    "/materials": "admin-materials",
    "/settings": "admin-settings",
    "/documentation": "admin-docs",
    "/rekapitulasi": "admin-recap",
  };

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  useEffect(() => {
    const path = window.location.pathname;
    const token = localStorage.getItem("authToken");

    const adminPage = adminPathMap[path];

    // === AKSES ADMIN TANPA TOKEN ===
    if (adminPage && !token) {
      setIsAuthenticated(false);
      setCurrentPage("login");
      window.history.replaceState(null, "", "/login");
      return;
    }

    // === ADA TOKEN → VALIDASI KE BACKEND ===
    if (token && adminPage) {
      fetch("http://localhost:4000/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Token invalid");
          return res.json();
        })
        .then(() => {
          setIsAuthenticated(true);
          setCurrentPage(adminPage);
        })
        .catch(() => {
          localStorage.removeItem("authToken");
          setIsAuthenticated(false);
          setCurrentPage("login");
          window.history.replaceState(null, "", "/login");
        });
      return;
    }

    // === PAGE BIASA ===
    if (!adminPage) {
      setIsAuthenticated(!!token);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage("admin-dashboard");

    // Ubah URL jadi /dashboard (tanpa reload)
    if (window.location.pathname !== "/dashboard") {
      window.history.pushState(null, "", "/dashboard");
    }
  };

  const handleLogoutClick = () => setShowLogoutModal(true);

  const handleLogoutConfirm = () => {
    setIsAuthenticated(false);
    setShowLogoutModal(false);
    setCurrentPage("home");

    // Hapus token
    localStorage.removeItem("authToken");

    // Balik ke home
    if (window.location.pathname !== "/") {
      window.history.pushState(null, "", "/");
    }
  };

  const handleLogoutCancel = () => setShowLogoutModal(false);

  const handleNavigate = (page: string) => {
    const token = localStorage.getItem("authToken");

    if (page.startsWith("admin-") && !token) {
      setCurrentPage("login");
      window.history.pushState(null, "", "/login");
      return;
    }

    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Public page list
  const publicPages = ["home", "about", "services", "portfolio", "contact", "login"];
  const projectPages = ["project-1", "project-2", "project-3", "project-4", "project-5", "project-6"];
  const isPublicPage = publicPages.includes(currentPage) || projectPages.includes(currentPage);

  // Admin page list
  const adminPages = [
    "admin-dashboard",
    "admin-projects",
    "admin-finance",
    "admin-materials",
    "admin-settings",
    "admin-docs",
    "admin-recap",
  ];
  const isAdminPage = adminPages.includes(currentPage);

  // Render halaman berdasarkan state
  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={handleNavigate} />;
      case "about":
        return <AboutPage />;
      case "services":
        return <ServicesPage />;
      case "portfolio":
        return <PortfolioPage onNavigate={handleNavigate} />;
      case "contact":
        return <ContactPage />;
      case "login":
        return <LoginPage onLogin={handleLogin} />;

      // Admin
      case "admin-dashboard":
        return <AdminDashboard />;
      case "admin-projects":
        return <AdminProjectsPage />;
      case "admin-finance":
        return <AdminFinancePage />;
      case "admin-materials":
        return <AdminMaterialsPage />;
      case "admin-settings":
        return <AdminSettingsPage />;
      case "admin-docs":
        return <AdminDocsPage />;
      case "admin-recap":
        return <AdminRecapPage />;

      default:
        if (currentPage.startsWith("project-")) {
          return <ProjectDetailPage projectId={currentPage} onNavigate={handleNavigate} />;
        }
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    // ✅ DIUBAH: background & text ikut theme (real-estate dark)
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Layout untuk halaman publik */}
      {isPublicPage && currentPage !== "login" && (
        <>
          <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
          <main className="flex-1">{renderPage()}</main>
          <Footer />
        </>
      )}

      {/* Halaman login */}
      {currentPage === "login" && !isAuthenticated && (
        <main className="flex-1">{renderPage()}</main>
      )}

      {/* Layout untuk halaman admin */}
      {isAdminPage && isAuthenticated && (
        <div className="flex min-h-screen bg-background text-foreground">
          <AdminSidebar
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onLogout={handleLogoutClick}
          />
          {/* ✅ DIUBAH: jangan bg-gray-50 supaya dark theme masuk */}
          <main className="flex-1 bg-background text-foreground">{renderPage()}</main>
        </div>
      )}

      {/* Modal logout */}
      {showLogoutModal && (
        <LogoutModal onConfirm={handleLogoutConfirm} onCancel={handleLogoutCancel} />
      )}
    </div>
  );
}
