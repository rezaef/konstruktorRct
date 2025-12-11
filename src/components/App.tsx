import { useState } from "react";

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

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage("admin-dashboard");
  };

  const handleLogoutClick = () => setShowLogoutModal(true);

  const handleLogoutConfirm = () => {
    setIsAuthenticated(false);
    setShowLogoutModal(false);
    setCurrentPage("home");
  };

  const handleLogoutCancel = () => setShowLogoutModal(false);

  const handleNavigate = (page: string) => {
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
    "admin-recap", // <-- DITAMBAHKAN
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
      case "admin-recap": // <-- DITAMBAHKAN
        return <AdminRecapPage />;

      default:
        if (currentPage.startsWith("project-")) {
          return <ProjectDetailPage projectId={currentPage} onNavigate={handleNavigate} />;
        }
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
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
        <div className="flex min-h-screen">
          <AdminSidebar
            currentPage={currentPage}
            onNavigate={handleNavigate}
            onLogout={handleLogoutClick}
          />
          <main className="flex-1 bg-gray-50">{renderPage()}</main>
        </div>
      )}

      {/* Modal logout */}
      {showLogoutModal && (
        <LogoutModal onConfirm={handleLogoutConfirm} onCancel={handleLogoutCancel} />
      )}
    </div>
  );
}
