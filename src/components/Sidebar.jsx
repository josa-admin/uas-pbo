import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  FileText, 
  Search, 
  AlertTriangle, 
  User, 
  Settings, 
  LogOut,
  Box
} from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Manajemen Barang', icon: Package, path: '/manajemen-barang' },
    { name: 'Barang Masuk', icon: ArrowDownCircle, path: '/barang-masuk' },
    { name: 'Barang Keluar', icon: ArrowUpCircle, path: '/barang-keluar' },
    { name: 'Laporan', icon: FileText, path: '/laporan' },
    { name: 'Pencarian Barang', icon: Search, path: '/pencarian' },
    { name: 'Stok Kritis', icon: AlertTriangle, path: '/stok-kritis' },
    { name: 'Profil', icon: User, path: '/profil' },
    { name: 'Pengaturan', icon: Settings, path: '/pengaturan' },
  ];

  return (
    <aside className="w-64 min-h-screen bg-[#151F28] text-gray-400 flex flex-col justify-between fixed top-0 left-0">
      <div>
        <div className="flex items-center gap-3 px-6 py-6 text-white mb-2">
          <div className="bg-emerald-500 p-2.5 rounded-lg flex-shrink-0">
            <Box size={20} className="text-white" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="font-bold text-[22px] tracking-wide leading-none mb-1">WMS</span>
            <span className="text-[9px] text-gray-400 font-medium uppercase tracking-wider leading-tight">
              WAREHOUSE MANAGEMENT<br/>SYSTEM
            </span>
          </div>
        </div>

        <nav className="flex flex-col gap-1 px-4">
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium ${
                  isActive
                    ? 'bg-[#0F6F3A] text-white'
                    : 'hover:bg-[#1b2b36] hover:text-gray-200'
                }`
              }
            >
              <item.icon size={20} />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4">
        <NavLink
          to="/login"
          className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-medium hover:bg-[#1b2b36] hover:text-gray-200 border border-gray-700/50"
        >
          <LogOut size={20} />
          Logout
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
