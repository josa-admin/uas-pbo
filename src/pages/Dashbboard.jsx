import { LayoutDashboard } from "lucide-react";

export default function Dashbboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <div className="text-sm text-slate-500 font-medium">Dashboard</div>
        <h1 className="text-2xl font-bold text-slate-800">Ringkasan Sistem</h1>
      </div>
      <div className="bg-white border border-slate-200/80 rounded-xl p-8 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
        <LayoutDashboard className="h-12 w-12 text-slate-300 mb-4 animate-pulse" />
        <h2 className="text-lg font-semibold text-slate-700">Halaman Dashboard</h2>
        <p className="text-slate-400 text-sm mt-1 max-w-md text-center">
          Silakan navigasikan ke menu <strong className="text-emerald-600">Barang Masuk</strong> di sidebar untuk melihat data transaksi barang masuk dan mengelolanya.
        </p>
      </div>
    </div>
  );
}