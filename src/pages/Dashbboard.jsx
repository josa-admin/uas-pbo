import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Package, 
  ArrowDownLeft, 
  ArrowUpRight, 
  AlertTriangle, 
  Plus,
  ArrowRight,
  TrendingUp,
  FileText
} from "lucide-react";

export default function Dashbboard() {
  // Sample Data matching the reference design
  const [stats, setStats] = useState({
    totalBarang: 250,
    barangMasuk: 120,
    barangKeluar: 80,
    stokKritis: 12
  });

  const recentTransactions = [
    { tanggal: "14/06/2024 10:20", jenis: "Masuk", kode: "BRG001", nama: "Kopi Premium", qty: 10, petugas: "Admin" },
    { tanggal: "14/06/2024 09:15", jenis: "Keluar", kode: "BRG002", nama: "Susu Prem", qty: 2, petugas: "Staff Gudang" },
    { tanggal: "13/06/2024 16:45", jenis: "Masuk", kode: "BRG003", nama: "Minyak Goreng", qty: 5, petugas: "Admin" },
    { tanggal: "13/06/2024 14:20", jenis: "Keluar", kode: "BRG001", nama: "Kopi Premium", qty: 3, petugas: "Staff Gudang" },
    { tanggal: "12/06/2024 11:05", jenis: "Masuk", kode: "BRG004", nama: "Roti Tawar", qty: 50, petugas: "Admin" }
  ];

  return (
    <div className="space-y-6">
      {/* 4 Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Barang */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="bg-emerald-500/10 text-emerald-600 p-3 rounded-full">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Barang</div>
            <div className="text-3xl font-extrabold text-slate-850 mt-1">{stats.totalBarang}</div>
            <div className="text-[10px] text-slate-500 mt-0.5 font-medium">Semua Barang</div>
          </div>
        </div>

        {/* Barang Masuk */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="bg-blue-500/10 text-blue-600 p-3 rounded-full">
            <ArrowDownLeft className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Barang Masuk</div>
            <div className="text-3xl font-extrabold text-slate-850 mt-1">{stats.barangMasuk}</div>
            <div className="text-[10px] text-slate-500 mt-0.5 font-medium">Bulan Ini</div>
          </div>
        </div>

        {/* Barang Keluar */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="bg-orange-500/10 text-orange-600 p-3 rounded-full">
            <ArrowUpRight className="h-6 w-6" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Barang Keluar</div>
            <div className="text-3xl font-extrabold text-slate-850 mt-1">{stats.barangKeluar}</div>
            <div className="text-[10px] text-slate-500 mt-0.5 font-medium">Bulan Ini</div>
          </div>
        </div>

        {/* Stok Kritis */}
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex items-center gap-4">
          <div className="bg-rose-500/10 text-rose-600 p-3 rounded-full">
            <AlertTriangle className="h-6 w-6 animate-bounce" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Stok Kritis</div>
            <div className="text-3xl font-extrabold text-rose-600 mt-1">{stats.stokKritis}</div>
            <div className="text-[10px] text-rose-600 mt-0.5 font-medium">Perlu Perhatian</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Graph & Stocks Summary */}
      <div className="grid gap-6 xl:grid-cols-[2.5fr_1.1fr]">
        {/* Left Card: Transaction Graph */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Grafik Transaksi 6 Bulan Terakhir</h2>
              <p className="text-xs text-slate-400 mt-0.5 font-medium">Tren keluar masuk logistik barang</p>
            </div>
            <div className="flex gap-4 text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span> Barang Masuk
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span> Barang Keluar
              </span>
            </div>
          </div>

          {/* SVG Line Chart */}
          <div className="relative w-full h-64">
            <svg viewBox="0 0 500 200" className="w-full h-full overflow-visible">
              {/* Grid Lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="60" x2="480" y2="60" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="120" x2="480" y2="120" stroke="#f1f5f9" strokeWidth="1" />
              <line x1="40" y1="160" x2="480" y2="160" stroke="#e2e8f0" strokeWidth="1.5" />

              {/* Y Axis Labels */}
              <text x="15" y="25" fill="#94a3b8" fontSize="8" fontWeight="600">100</text>
              <text x="15" y="65" fill="#94a3b8" fontSize="8" fontWeight="600">75</text>
              <text x="15" y="125" fill="#94a3b8" fontSize="8" fontWeight="600">50</text>
              <text x="15" y="165" fill="#94a3b8" fontSize="8" fontWeight="600">0</text>

              {/* X Axis Labels */}
              <text x="60" y="180" fill="#94a3b8" fontSize="8" fontWeight="600">Jan</text>
              <text x="140" y="180" fill="#94a3b8" fontSize="8" fontWeight="600">Feb</text>
              <text x="220" y="180" fill="#94a3b8" fontSize="8" fontWeight="600">Mar</text>
              <text x="300" y="180" fill="#94a3b8" fontSize="8" fontWeight="600">Apr</text>
              <text x="380" y="180" fill="#94a3b8" fontSize="8" fontWeight="600">Mei</text>
              <text x="460" y="180" fill="#94a3b8" fontSize="8" fontWeight="600">Jun</text>

              {/* Green Line - Barang Masuk */}
              <path 
                d="M 60,110 Q 140,80 220,105 T 380,85 T 460,95" 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
              />
              <circle cx="60" cy="110" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="140" cy="90" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="220" cy="105" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="300" cy="85" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="380" cy="112" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="460" cy="95" r="4.5" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />

              {/* Orange Line - Barang Keluar */}
              <path 
                d="M 60,140 Q 140,115 220,130 T 380,122 T 460,115" 
                fill="none" 
                stroke="#f59e0b" 
                strokeWidth="3.5" 
                strokeLinecap="round" 
              />
              <circle cx="60" cy="140" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="140" cy="120" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="220" cy="130" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="300" cy="110" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="380" cy="125" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
              <circle cx="460" cy="115" r="4.5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        {/* Right Card: Ringkasan Stok (Donut chart) */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Ringkasan Stok</h2>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">Berdasarkan status persediaan</p>
          </div>

          {/* Donut Chart */}
          <div className="relative flex justify-center items-center h-44 my-4">
            <svg className="w-36 h-36 transform -rotate-90">
              {/* Outer track */}
              <circle cx="72" cy="72" r="50" fill="transparent" stroke="#f1f5f9" strokeWidth="14" />
              
              {/* Green Segment (Stok Normal 72%) */}
              <circle cx="72" cy="72" r="50" fill="transparent" stroke="#10b981" strokeWidth="14"
                strokeDasharray="314.15" strokeDashoffset="87.96" strokeLinecap="round" />
                
              {/* Orange Segment (Stok Menipis 22%) */}
              <circle cx="72" cy="72" r="50" fill="transparent" stroke="#f59e0b" strokeWidth="14"
                strokeDasharray="314.15" strokeDashoffset="245.03" strokeLinecap="round" 
                className="transform origin-center rotate-[259.2deg]"/>

              {/* Red Segment (Stok Kritis 6%) */}
              <circle cx="72" cy="72" r="50" fill="transparent" stroke="#f43f5e" strokeWidth="14"
                strokeDasharray="314.15" strokeDashoffset="295.3" strokeLinecap="round" 
                className="transform origin-center rotate-[338.4deg]" />
            </svg>
            <div className="absolute flex flex-col justify-center items-center">
              <span className="text-3xl font-extrabold text-slate-800 leading-none">250</span>
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-1.5">Total</span>
            </div>
          </div>

          {/* Legends */}
          <div className="space-y-2 mt-2">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="flex items-center gap-2 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Stok Normal
              </span>
              <span className="text-slate-800">180 (72%)</span>
            </div>
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="flex items-center gap-2 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Stok Menipis
              </span>
              <span className="text-slate-800">56 (22%)</span>
            </div>
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="flex items-center gap-2 text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span> Stok Kritis
              </span>
              <span className="text-slate-800">14 (6%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Recent Transactions & Critical Stock Alert */}
      <div className="grid gap-6 xl:grid-cols-[2.5fr_1.1fr]">
        {/* Left: Recent Transactions Table */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-800">Transaksi Terbaru</h2>
            <Link to="/laporan" className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 flex items-center gap-1 transition-colors">
              Lihat semua <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-semibold uppercase border-b border-slate-100">
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Jenis</th>
                  <th className="py-3 px-4">Kode Barang</th>
                  <th className="py-3 px-4">Nama Barang</th>
                  <th className="py-3 px-4 text-right">Jumlah</th>
                  <th className="py-3 px-4">Petugas</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 font-medium">
                {recentTransactions.map((tx, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors text-slate-700">
                    <td className="py-3 px-4 text-slate-400">{tx.tanggal}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        tx.jenis === "Masuk" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                      }`}>
                        {tx.jenis}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{tx.kode}</td>
                    <td className="py-3 px-4">{tx.nama}</td>
                    <td className="py-3 px-4 text-right font-bold text-slate-800">{tx.qty}</td>
                    <td className="py-3 px-4 text-slate-500">{tx.petugas}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Critical Stock List */}
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-800">Barang Stok Kritis</h2>
            <Link to="/stok-kritis" className="text-xs font-semibold text-emerald-600 hover:text-emerald-500 flex items-center gap-1 transition-colors">
              Lihat semua <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="space-y-3">
            <div className="rounded-xl border border-rose-100 bg-rose-50/20 p-4">
              <div className="text-xs font-bold text-rose-700 uppercase">Susu Kental Manis</div>
              <div className="text-[10px] text-slate-400 mt-1 font-semibold">Tersisa 2 Kaleng di Rak B-01</div>
              <Link to="/stok-kritis" className="text-[10px] font-bold text-rose-600 hover:underline mt-2 inline-block">
                Lihat Semua Stok Kritis →
              </Link>
            </div>
            
            <div className="rounded-xl border border-amber-100 bg-amber-50/20 p-4">
              <div className="text-xs font-bold text-amber-700 uppercase">Teh Celup Herbal</div>
              <div className="text-[10px] text-slate-400 mt-1 font-semibold">Tersisa 5 Kotak di Rak A-02</div>
              <Link to="/stok-kritis" className="text-[10px] font-bold text-amber-600 hover:underline mt-2 inline-block">
                Lihat Semua Stok Kritis →
              </Link>
            </div>
          </div>

          <div className="rounded-xl bg-emerald-600 p-4 text-white flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-lg">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-semibold">Dalam Fast-Moving</div>
              <div className="text-[10px] opacity-80 mt-0.5">Sebagian besar kategori stabil</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid (Bottom) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <Link to="/stok-barang" className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group">
          <div className="bg-emerald-500/10 text-emerald-600 p-3 rounded-xl group-hover:scale-105 transition-transform">
            <Plus className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Tambah Barang</div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-medium">Tambah produk baru</div>
          </div>
        </Link>

        <Link to="/barang-masuk" className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group">
          <div className="bg-blue-500/10 text-blue-600 p-3 rounded-xl group-hover:scale-105 transition-transform">
            <ArrowDownLeft className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Barang Masuk</div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-medium">Pemasukan gudang</div>
          </div>
        </Link>

        <Link to="/barang-keluar" className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group">
          <div className="bg-orange-500/10 text-orange-600 p-3 rounded-xl group-hover:scale-105 transition-transform">
            <ArrowUpRight className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Barang Keluar</div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-medium">Pengeluaran gudang</div>
          </div>
        </Link>

        <Link to="/laporan" className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm hover:shadow-md transition-shadow flex items-center gap-4 group">
          <div className="bg-purple-500/10 text-purple-600 p-3 rounded-xl group-hover:scale-105 transition-transform">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-800">Laporan</div>
            <div className="text-[10px] text-slate-400 mt-0.5 font-medium">Rekapitulasi gudang</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
