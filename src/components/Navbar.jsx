import React from 'react';
import { Menu, Search, Bell, ChevronDown } from 'lucide-react';

const Navbar = ({ title = 'Dashboard' }) => {
  return (
    <header className="h-20 bg-slate-50 flex items-center justify-between px-8 border-b border-gray-100">
      <div className="flex items-center gap-4">
        <button className="text-gray-500 hover:bg-gray-100 p-2 rounded-lg transition-colors lg:hidden">
          <Menu size={24} />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      </div>

      <div className="flex-1 max-w-xl px-8 hidden md:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari barang, kode, kategori..."
            className="w-full bg-white border border-gray-200 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-gray-500 hover:text-emerald-600 transition-colors">
          <Bell size={24} />
          <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border-2 border-white">
            3
          </span>
        </button>

        <div className="flex items-center gap-3 cursor-pointer group">
          <img
            src="https://ui-avatars.com/api/?name=Admin+Gudang&background=0F2F20&color=fff"
            alt="Admin"
            className="w-10 h-10 rounded-full border-2 border-gray-100 group-hover:border-emerald-500 transition-colors"
          />
          
          <div className="hidden md:block text-left">
            <p className="text-sm font-bold text-gray-800 leading-tight">Admin Gudang</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
          <ChevronDown size={16} className="text-gray-400 group-hover:text-gray-600" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
