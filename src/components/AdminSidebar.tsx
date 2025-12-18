import {
  LayoutDashboard,
  FolderKanban,
  DollarSign,
  Package,
  Settings,
  BookOpen,
  LogOut,
  FileSpreadsheet,
} from "lucide-react";
import hdaLogo from "../assets/login-bg.png";

interface AdminSidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function AdminSidebar({ currentPage, onNavigate, onLogout }: AdminSidebarProps) {
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "admin-dashboard" },
    { icon: FileSpreadsheet, label: "Rekapitulasi", path: "admin-recap" },
    { icon: FolderKanban, label: "Projects", path: "admin-projects" },
    { icon: DollarSign, label: "Finance", path: "admin-finance" },
    { icon: Package, label: "Materials", path: "admin-materials" },
    { icon: Settings, label: "Settings", path: "admin-settings" },
    { icon: BookOpen, label: "Documentation", path: "admin-docs" },
  ];

  const baseItem =
    "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition";
  const normalItem =
    "text-muted-foreground hover:bg-muted/70 hover:text-foreground";
  const activeItem =
    "bg-primary/15 text-foreground ring-1 ring-primary/40";

  return (
    <aside className="w-72 min-h-screen flex flex-col border-r border-border/70 bg-card text-foreground">
      {/* Brand */}
      <div className="p-6 border-b border-border/70">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 overflow-hidden rounded-2xl border border-border/60 bg-background">
            <img src={hdaLogo} alt="HDA Logo" className="h-full w-full object-cover opacity-90" />
          </div>

          <div className="leading-tight">
            <div className="text-sm font-semibold tracking-wide">KONSTRUKTOR</div>
            <div className="text-xs text-muted-foreground">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.path;

            return (
              <li key={item.path}>
                <button
                  onClick={() => onNavigate(item.path)}
                  className={`${baseItem} ${isActive ? activeItem : normalItem}`}
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-background border border-border/60">
                    <Icon size={18} className={isActive ? "text-primary" : "text-muted-foreground"} />
                  </span>
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border/70">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted/70 hover:text-foreground transition"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-background border border-border/60">
            <LogOut size={18} className="text-muted-foreground" />
          </span>
          <span className="text-sm font-semibold">Logout</span>
        </button>
      </div>
    </aside>
  );
}
