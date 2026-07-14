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
    { name: "Product", path: "/master-product", icon: Package },
    { name: "Category", path: "/master-category", icon: Package },
    { name: "Suplier", path: "/master-supplier", icon: Package },
    { name: "Bins", path: "/master-bin", icon: Package },
    { name: "Manajemen Barang", path: "/stok-barang", icon: Package },
    { name: "inbound", path: "/barang-masuk", icon: LogIn },
    { name: "outbound", path: "/barang-keluar", icon: LogOut },
    { name: "Laporan", path: "/laporan", icon: BarChart3 },
    { name: "Pencarian Barang", path: "/pencarian-barang", icon: Search },
    { name: "Stok Kritis", path: "/stok-kritis", icon: AlertTriangle },
    { name: "Barang Expired", path: "/barang-expired", icon: Calendar },
    
  ];

  return (
    <aside className="w-64 h-screen bg-[#111c24] text-slate-300 flex flex-col justify-between select-none shrink-0 border-r border-slate-800">
      <div className="flex flex-col">
        {/* Brand/Logo Section */}
        <div className="p-6 pb-8 flex items-center gap-3">
          <div className="shrink-0 flex items-center justify-center">
            <svg
              width="36"
              height="36"
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Top face (diamond) */}
              <polygon
                points="60,12 100,34 60,56 20,34"
                stroke="#3ecf8e"
                strokeWidth="2.5"
                fill="rgba(62,207,142,0.1)"
                strokeLinejoin="round"
              />
              {/* Vertical cross line */}
              <line x1="60" y1="12" x2="60" y2="56" stroke="#3ecf8e" strokeWidth="2.0" strokeLinecap="round" />
              {/* Horizontal cross line */}
              <line x1="20" y1="34" x2="100" y2="34" stroke="#3ecf8e" strokeWidth="2.0" strokeLinecap="round" />
              {/* Left face */}
              <polygon points="20,34 60,56 60,100 20,78" stroke="#3ecf8e" strokeWidth="2.5" fill="rgba(62,207,142,0.06)" strokeLinejoin="round" />
              {/* Right face */}
              <polygon points="100,34 100,78 60,100 60,56" stroke="#3ecf8e" strokeWidth="2.5" fill="rgba(62,207,142,0.06)" strokeLinejoin="round" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold !text-white tracking-wider leading-none">
              WMS
            </h1>
            <p className="text-[9px] text-slate-200 mt-1.5 uppercase tracking-wider font-semibold leading-tight">
              Warehouse<br />Management System
            </p>
          </div>
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
                  `flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
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
