import { LayoutDashboard, FolderKanban, DollarSign, Package, Settings, BookOpen, LogOut, FileSpreadsheet } from 'lucide-react';
import hdaLogo from 'figma:asset/6079b6e47b4180656d7238eb51827e949fc7d47c.png';

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
    { icon: Package, label: 'Materials', path: 'admin-materials' },
    { icon: Settings, label: 'Settings', path: 'admin-settings' },
    { icon: BookOpen, label: 'Documentation', path: 'admin-docs' },
  ];

  return (
    <div className="w-64 bg-[#2D3748] text-white min-h-screen flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <img src={hdaLogo} alt="HDA Logo" className="h-10 w-10" />
          <h2 className="text-[#5BA8A8]">HDA Admin</h2>
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
                      ? 'bg-[#5BA8A8] text-white'
                      : 'text-gray-300 hover:bg-gray-700'
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
