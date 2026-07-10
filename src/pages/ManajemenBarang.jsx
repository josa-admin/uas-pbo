import React from 'react';
import Layout from '../components/Layout';
import { 
  Search, 
  ChevronDown, 
  Plus, 
  Edit2, 
  Trash2, 
  Coffee, 
  CupSoda, 
  Milk, 
  Droplet, 
  Box,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  ClipboardList,
  ArrowUpRight
} from 'lucide-react';

const dataBarang = [
  { id: 'BRG-001', nama: 'Kopi Bubuk', kategori: 'Minuman', satuan: 'Bungkus', harga: 'Rp 12.000.00', stok: 12, status: 'NORMAL', icon: Coffee },
  { id: 'BRG-002', nama: 'Teh Celup', kategori: 'Minuman', satuan: 'Kotak', harga: 'Rp 9.000.00', stok: 5, status: 'MENIPIS', icon: CupSoda },
  { id: 'BRG-003', nama: 'Susu Kental Manis', kategori: 'Minuman', satuan: 'Kaleng', harga: 'Rp 14.000.00', stok: 2, status: 'KRITIS', icon: Milk },
  { id: 'BRG-004', nama: 'Kecap Manis', kategori: 'Bumbu Dapur', satuan: 'Botol', harga: 'Rp 18.000.00', stok: 45, status: 'NORMAL', icon: Droplet },
  { id: 'BRG-005', nama: 'Garam Dapur', kategori: 'Bumbu Dapur', satuan: 'Bungkus', harga: 'Rp 4.000.00', stok: 24, status: 'NORMAL', icon: Box },
];

export default function ManajemenBarang() {
  return (
    <Layout title="Manajemen Barang">
      <div className="flex flex-col gap-6">
        
        {/* Top Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Cari barang berdasarkan nama atau kod"
                className="w-full bg-white border border-gray-200 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              />
            </div>
            
            <div className="relative">
              <select className="appearance-none bg-white border border-gray-200 rounded-lg py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-600">
                <option>Semua Kategori</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>

            <div className="relative">
              <select className="appearance-none bg-white border border-gray-200 rounded-lg py-2 pl-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-600">
                <option>Semua Status</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
            </div>
          </div>
          
          <button className="bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors w-full md:w-auto justify-center">
            <Plus size={18} />
            Tambah Barang
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500 font-semibold text-xs border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 font-bold tracking-wider">KODE<br/>BARANG</th>
                  <th className="px-6 py-4 font-bold tracking-wider">NAMA BARANG</th>
                  <th className="px-6 py-4 font-bold tracking-wider">KATEGORI</th>
                  <th className="px-6 py-4 font-bold tracking-wider">SATUAN</th>
                  <th className="px-6 py-4 font-bold tracking-wider">HARGA</th>
                  <th className="px-6 py-4 font-bold tracking-wider">STOK</th>
                  <th className="px-6 py-4 font-bold tracking-wider">STATUS</th>
                  <th className="px-6 py-4 font-bold tracking-wider">AKSI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-600">
                {dataBarang.map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-emerald-600 font-semibold">{row.id.split('-')[0]}-<br/>{row.id.split('-')[1]}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gray-100 text-gray-500 flex items-center justify-center">
                        <row.icon size={16} />
                      </div>
                      <span className="font-bold text-gray-800">{row.nama.split(' ').map((w,i)=><React.Fragment key={i}>{w}<br/></React.Fragment>)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-500">{row.kategori}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{row.satuan}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-800">{row.harga}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-bold ${row.stok <= 2 ? 'text-red-500' : 'text-gray-800'}`}>{row.stok}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {row.status === 'NORMAL' && (
                        <span className="bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded border border-emerald-200 text-[10px] font-bold tracking-wider">NORMAL</span>
                      )}
                      {row.status === 'MENIPIS' && (
                        <span className="bg-yellow-100 text-yellow-700 px-2.5 py-1 rounded border border-yellow-200 text-[10px] font-bold tracking-wider">MENIPIS</span>
                      )}
                      {row.status === 'KRITIS' && (
                        <span className="bg-red-100 text-red-700 px-2.5 py-1 rounded border border-red-200 text-[10px] font-bold tracking-wider">KRITIS</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-3 text-gray-400">
                        <button className="hover:text-gray-600 transition-colors"><Edit2 size={16} /></button>
                        <button className="hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between text-xs text-gray-500">
            <div>
              Menampilkan <span className="font-bold">1 - 5</span> dari <span className="font-bold">250</span> data barang
            </div>
            <div className="flex items-center gap-1">
              <button className="p-1 text-gray-400 hover:text-gray-600"><ChevronLeft size={16} /></button>
              <button className="w-7 h-7 flex items-center justify-center rounded bg-emerald-700 text-white font-medium">1</button>
              <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 text-gray-600 font-medium">2</button>
              <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 text-gray-600 font-medium">3</button>
              <span className="px-1 text-gray-400">...</span>
              <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 text-gray-600 font-medium">50</button>
              <button className="p-1 text-gray-400 hover:text-gray-600"><ChevronRight size={16} /></button>
            </div>
          </div>
        </div>

        {/* Bottom Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-8 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden flex flex-col justify-between">
            {/* Background graphic */}
            <div className="absolute -right-4 -top-8 opacity-[0.03] pointer-events-none">
               <span className="text-[200px] font-black leading-none">M O</span>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2 relative z-10">Analisis Pergerakan Stok</h3>
              <p className="text-sm text-gray-500 max-w-md leading-relaxed relative z-10">
                Efisiensi operasional gudang meningkat sebesar 14% bulan ini. Pantau item terlaris dan restock item kritis segera.
              </p>
            </div>
            
            <div className="mt-8 relative z-10">
              <button className="bg-[#151F28] hover:bg-black text-white px-5 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
                Lihat Laporan Lengkap <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
          
          <div className="bg-[#0F6F3A] rounded-xl shadow-sm p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="bg-emerald-600/30 p-3 rounded-2xl mb-4 border border-emerald-500/30">
              <ClipboardList className="text-white" size={32} />
            </div>
            <h2 className="text-4xl font-black text-white mb-1">2.450</h2>
            <p className="text-[10px] font-bold text-emerald-100 tracking-widest mb-4">TOTAL UNIT TERSEDIA</p>
            <div className="bg-emerald-800/60 border border-emerald-700 text-emerald-50 px-3 py-1 rounded text-xs font-bold flex items-center gap-1">
              <TrendingUp size={12} />
              +12% vs last month
            </div>
          </div>
        </div>
        
        <div className="text-center text-[10px] text-gray-400 mt-4 pb-4 border-t border-gray-200 pt-6">
          © 2024 WMS Dashboard v2.0. Built for industrial scale efficiency.
        </div>

      </div>
    </Layout>
  );
}
