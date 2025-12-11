import { useState } from 'react';
import { Toaster } from "sonner";
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AdminSidebar } from './components/AdminSidebar';
import { LogoutModal } from './components/LogoutModal';
import { HomePage } from './components/pages/HomePage';
import { AboutPage } from './components/pages/AboutPage';
import { ServicesPage } from './components/pages/ServicesPage';
import { PortfolioPage } from './components/pages/PortfolioPage';
import { ProjectDetailPage } from './components/pages/ProjectDetailPage';
import { ContactPage } from './components/pages/ContactPage';
import { LoginPage } from './components/pages/LoginPage';
import { AdminDashboard } from './components/pages/AdminDashboard';
import { AdminRecapPage } from './components/pages/AdminRecapPage';
import { AdminProjectsPage } from './components/pages/AdminProjectsPage';
import { AdminFinancePage } from './components/pages/AdminFinancePage';
import { AdminMaterialsPage } from './components/pages/AdminMaterialsPage';
import { AdminSettingsPage } from './components/pages/AdminSettingsPage';
import { AdminDocsPage } from './components/pages/AdminDocsPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('admin-dashboard');
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    setIsAuthenticated(false);
    setShowLogoutModal(false);
    setCurrentPage('home');
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // Public pages
  const publicPages = ['home', 'about', 'services', 'portfolio', 'contact', 'login'];
  const projectPages = ['project-1', 'project-2', 'project-3', 'project-4', 'project-5', 'project-6'];
  const isPublicPage = publicPages.includes(currentPage) || projectPages.includes(currentPage);

  // Admin pages
  const adminPages = [
    'admin-dashboard',
    'admin-recap',
    'admin-projects',
    'admin-finance',
    'admin-materials',
    'admin-settings',
    'admin-docs',
  ];
  const isAdminPage = adminPages.includes(currentPage);

  // Render current page
  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'about':
        return <AboutPage />;
      case 'services':
        return <ServicesPage />;
      case 'portfolio':
        return <PortfolioPage onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactPage />;
      case 'login':
        return <LoginPage onLogin={handleLogin} />;
      case 'admin-dashboard':
        return <AdminDashboard />;
      case 'admin-recap':
        return <AdminRecapPage />;
      case 'admin-projects':
        return <AdminProjectsPage />;
      case 'admin-finance':
        return <AdminFinancePage />;
      case 'admin-materials':
        return <AdminMaterialsPage />;
      case 'admin-settings':
        return <AdminSettingsPage />;
      case 'admin-docs':
        return <AdminDocsPage />;
      default:
        if (currentPage.startsWith('project-')) {
          return <ProjectDetailPage projectId={currentPage} onNavigate={handleNavigate} />;
        }
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="min-h-screen flex flex-col">
        {/* Public Pages Layout */}
        {isPublicPage && currentPage !== 'login' && (
          <>
            <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
            <main className="flex-1">{renderPage()}</main>
            <Footer />
          </>
        )}

        {/* Login Page */}
        {currentPage === 'login' && !isAuthenticated && (
          <main className="flex-1">{renderPage()}</main>
        )}

        {/* Admin Pages Layout */}
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

        {/* Logout Confirmation Modal */}
        {showLogoutModal && (
          <LogoutModal onConfirm={handleLogoutConfirm} onCancel={handleLogoutCancel} />
        )}
      </div>
    </>
  );
}
