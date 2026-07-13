import { Menu, Search, Bell, Settings } from "lucide-react";

export default function Navbar() {
  return (
    <header className="h-16 bg-white border-b border-slate-200/80 flex items-center justify-between px-6 shrink-0 shadow-sm">
      {/* Left Section: Menu & Search */}
      <div className="flex items-center gap-4 flex-1">
        <button className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors md:block cursor-pointer">
          <Menu className="h-5 w-5" />
        </button>

        <div className="relative max-w-md w-full md:block hidden">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari hubungi, stok, kategori..."
            className="w-full h-9 pl-10 pr-4 rounded-full bg-[#f0f4f8] text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 border border-transparent focus:border-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Right Section: Alerts & Settings */}
      <div className="flex items-center gap-5">
        {/* Notification Bell */}
        <button className="relative p-1.5 rounded-full text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer">
          <Bell className="h-5 w-5 text-emerald-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border border-white"></span>
        </button>

        {/* Settings Gear */}
        <button className="p-1.5 rounded-full text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer">
          <Settings className="h-5 w-5 text-emerald-600" />
        </button>
      </div>
    </header>
  );
}
