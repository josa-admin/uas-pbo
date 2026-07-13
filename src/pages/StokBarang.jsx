import { Package } from "lucide-react";

export default function StokBarang() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <div className="text-sm text-slate-500 font-medium">Dashboard &gt; Manajemen Barang</div>
        <h1 className="text-2xl font-bold text-slate-800">Manajemen Stok Barang</h1>
      </div>
      <div className="bg-white border border-slate-200/80 rounded-xl p-8 shadow-sm flex flex-col items-center justify-center min-h-[300px]">
        <Package className="h-12 w-12 text-slate-300 mb-4 animate-pulse" />
        <h2 className="text-lg font-semibold text-slate-700">Manajemen Stok Barang</h2>
        <p className="text-slate-400 text-sm mt-1 max-w-md text-center">
          Fitur manajemen stok barang. Gunakan menu <strong className="text-emerald-600">Barang Masuk</strong> untuk memasukkan transaksi baru.
        </p>
      </div>
    </div>
  );
}
