import { LayoutDashboard, FolderKanban, DollarSign, BookOpen, LogOut, FileSpreadsheet } from 'lucide-react';
import hdaLogo from "../assets/login-bg.png";

interface AdminSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function AdminSidebar({ currentPage, onNavigate, onLogout }: AdminSidebarProps) {
  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: 'admin-dashboard' },
    { icon: FileSpreadsheet, label: 'Rekapitulasi', path: 'admin-recap' },
    { icon: FolderKanban, label: 'Projects', path: 'admin-projects' },
    { icon: DollarSign, label: 'Finance', path: 'admin-finance' },
    // { icon: Package, label: 'Materials', path: 'admin-materials' },
    // { icon: Settings, label: 'Settings', path: 'admin-settings' },
    { icon: BookOpen, label: 'Documentation', path: 'admin-docs' },
  ];

  return (
    <div className="w-64 bg-[#0B1F3B] text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <img src={hdaLogo} alt="HDA Logo" className="h-10 w-10 rounded-lg ring-1 ring-white/20 bg-white" />
          <h2 className="text-[#D4AF37] font-semibold tracking-tight">HDA Admin</h2>
        </div>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <button
                  onClick={() => onNavigate(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    currentPage === item.path
                      ? 'bg-white/10 text-white border border-[#D4AF37]/40'
                      : 'text-gray-300 hover:bg-white/5'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
