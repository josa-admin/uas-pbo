import { NavLink } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package, 
  LogIn, 
  LogOut, 
  BarChart3, 
  Search, 
  AlertTriangle, 
  Calendar 
} from "lucide-react";

export default function Sidebar() {
  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Manajemen Barang", path: "/stok-barang", icon: Package },
    { name: "Barang Masuk", path: "/barang-masuk", icon: LogIn },
    { name: "Barang Keluar", path: "/barang-keluar", icon: LogOut },
    { name: "Laporan", path: "/laporan", icon: BarChart3 },
    { name: "Pencarian Barang", path: "/pencarian-barang", icon: Search },
    { name: "Stok Kritis", path: "/stok-kritis", icon: AlertTriangle },
    { name: "Barang Expired", path: "/barang-expired", icon: Calendar },
  ];

  return (
    <aside className="w-64 h-screen bg-[#111c24] text-slate-300 flex flex-col justify-between select-none shrink-0 border-r border-slate-800">
      <div className="flex flex-col">
        {/* Brand/Logo Section */}
        <div className="p-6 pb-8">
          <h1 className="text-3xl font-bold text-white tracking-wider flex items-center gap-2">
            WMS
          </h1>
          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-semibold">
            Warehouse Management System
          </p>
        </div>

        {/* Navigation Menu */}
        <nav className="px-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/20"
                      : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                  }`
                }
              >
                <Icon className="h-5 w-5 shrink-0" />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-4 border-t border-slate-800/50">
        <NavLink
          to="/"
          className="flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-950/20 hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span>Logout</span>
        </NavLink>
      </div>
    </aside>
  );
}
