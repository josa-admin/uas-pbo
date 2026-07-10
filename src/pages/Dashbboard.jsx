import React from 'react';
import Layout from '../components/Layout';
import { 
  Box, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  AlertTriangle,
  Plus,
  FileText
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell
} from 'recharts';

const dataChart = [
  { name: 'Jan', masuk: 75, keluar: 45 },
  { name: 'Feb', masuk: 90, keluar: 55 },
  { name: 'Mar', masuk: 75, keluar: 38 },
  { name: 'Apr', masuk: 95, keluar: 58 },
  { name: 'Mei', masuk: 65, keluar: 38 },
  { name: 'Jun', masuk: 90, keluar: 50 },
];

const dataPie = [
  { name: 'Stok Normal', value: 180, color: '#10B981' },
  { name: 'Stok Menipis', value: 58, color: '#F59E0B' },
  { name: 'Stok Habis', value: 12, color: '#EF4444' },
];

const transaksiTerbaru = [
  { id: 1, tanggal: '24/05/2024 10:30', jenis: 'Masuk', kode: 'BR001', nama: 'Beras Premium', jumlah: 10, petugas: 'Admin' },
  { id: 2, tanggal: '24/05/2024 09:15', jenis: 'Keluar', kode: 'BR002', nama: 'Gula Pasir', jumlah: 5, petugas: 'Staff Gudang' },
  { id: 3, tanggal: '23/05/2024 16:45', jenis: 'Masuk', kode: 'BR003', nama: 'Minyak Goreng', jumlah: 3, petugas: 'Admin' },
  { id: 4, tanggal: '23/05/2024 14:20', jenis: 'Keluar', kode: 'BR001', nama: 'Tepung Terigu', jumlah: 2, petugas: 'Staff Gudang' },
  { id: 5, tanggal: '22/05/2024 11:05', jenis: 'Masuk', kode: 'BR004', nama: 'Mie Instan', jumlah: 20, petugas: 'Admin' },
];

export default function Dashboard() {
  return (
    <Layout title="Dashboard">
      <div className="flex flex-col gap-6">
        
        {/* Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
            <div className="bg-emerald-50 p-4 rounded-xl">
              <Box className="text-emerald-500" size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Total Barang</p>
              <h3 className="text-2xl font-bold text-gray-800">250</h3>
              <p className="text-xs text-gray-400 mt-1">Semua barang</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
            <div className="bg-blue-50 p-4 rounded-xl">
              <ArrowDownCircle className="text-blue-500" size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Barang Masuk</p>
              <h3 className="text-2xl font-bold text-gray-800">120</h3>
              <p className="text-xs text-gray-400 mt-1">Bulan ini</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
            <div className="bg-orange-50 p-4 rounded-xl">
              <ArrowUpCircle className="text-orange-500" size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Barang Keluar</p>
              <h3 className="text-2xl font-bold text-gray-800">80</h3>
              <p className="text-xs text-gray-400 mt-1">Bulan ini</p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-5">
            <div className="bg-red-50 p-4 rounded-xl">
              <AlertTriangle className="text-red-500" size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Stok Kritis</p>
              <h3 className="text-2xl font-bold text-gray-800">12</h3>
              <p className="text-xs text-red-500 mt-1 font-medium">Perlu perhatian</p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            
            {/* Line Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-gray-800">Grafik Transaksi 6 Bulan Terakhir</h3>
                <div className="flex gap-4 text-xs font-medium">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                    <span className="text-gray-500">Barang Masuk</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-orange-400"></div>
                    <span className="text-gray-500">Barang Keluar</span>
                  </div>
                </div>
              </div>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dataChart} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9CA3AF', fontSize: 12 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#9CA3AF', fontSize: 12 }}
                      ticks={[0, 30, 60, 90, 120]}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="masuk" 
                      stroke="#10B981" 
                      strokeWidth={2}
                      dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
                      activeDot={{ r: 6 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="keluar" 
                      stroke="#FBBF24" 
                      strokeWidth={2}
                      dot={{ r: 4, strokeWidth: 2, fill: 'white' }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-gray-50">
                <h3 className="font-bold text-gray-800">Transaksi Terbaru</h3>
                <button className="text-sm font-semibold text-emerald-600 hover:text-emerald-700">Lihat semua</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-white text-gray-400 font-semibold text-xs">
                    <tr>
                      <th className="px-6 py-4 font-medium uppercase tracking-wider">TANGGAL</th>
                      <th className="px-6 py-4 font-medium uppercase tracking-wider">JENIS</th>
                      <th className="px-6 py-4 font-medium uppercase tracking-wider">KODE BARANG</th>
                      <th className="px-6 py-4 font-medium uppercase tracking-wider">NAMA BARANG</th>
                      <th className="px-6 py-4 font-medium uppercase tracking-wider">JUMLAH</th>
                      <th className="px-6 py-4 font-medium uppercase tracking-wider">PETUGAS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 text-gray-600">
                    {transaksiTerbaru.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap flex items-center gap-2">
                          {row.jenis === 'Masuk' ? (
                            <ArrowDownCircle size={14} className="text-emerald-500" />
                          ) : (
                            <ArrowUpCircle size={14} className="text-red-500" />
                          )}
                          {row.tanggal}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`font-semibold ${row.jenis === 'Masuk' ? 'text-emerald-600' : 'text-red-500'}`}>
                            {row.jenis}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700">{row.kode}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{row.nama}</td>
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-800">{row.jumlah}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{row.petugas}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
              <button className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:border-emerald-500 transition-all text-left group">
                <div className="bg-emerald-50 p-3 rounded-xl group-hover:bg-emerald-100 transition-colors">
                  <Plus className="text-emerald-600" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Tambah<br/>Barang</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Tambah data<br/>barang baru</p>
                </div>
              </button>
              
              <button className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:border-blue-500 transition-all text-left group">
                <div className="bg-blue-50 p-3 rounded-xl group-hover:bg-blue-100 transition-colors">
                  <ArrowDownCircle className="text-blue-600" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Barang<br/>Masuk</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Catat barang<br/>masuk</p>
                </div>
              </button>
              
              <button className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:border-orange-500 transition-all text-left group">
                <div className="bg-orange-50 p-3 rounded-xl group-hover:bg-orange-100 transition-colors">
                  <ArrowUpCircle className="text-orange-600" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Barang<br/>Keluar</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Catat barang<br/>keluar</p>
                </div>
              </button>
              
              <button className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 hover:border-purple-500 transition-all text-left group">
                <div className="bg-purple-50 p-3 rounded-xl group-hover:bg-purple-100 transition-colors">
                  <FileText className="text-purple-600" size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 text-sm">Laporan</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Lihat & cetak<br/>laporan</p>
                </div>
              </button>
            </div>

          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            
            {/* Ringkasan Stok (Pie Chart) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-gray-800 mb-6">Ringkasan Stok</h3>
              
              <div className="relative flex justify-center items-center py-4">
                  <PieChart width={220} height={220}>
                    <Pie
                      data={dataPie}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      paddingAngle={3}
                      startAngle={90}
                      endAngle={450}
                      dataKey="value"
                      stroke="none"
                      cornerRadius={3}
                    >
                      {dataPie.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                  </PieChart>
                {/* Custom Label in the middle */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-4xl font-black text-[#1F2937] leading-none mb-1">250</span>
                  <span className="text-[11px] font-bold text-gray-400 tracking-widest">TOTAL</span>
                </div>
              </div>

              <div className="mt-8 flex flex-col gap-3 px-2">
                {dataPie.map((item, index) => (
                  <div key={index} className="flex items-center text-[13px]">
                    <div className="w-3 h-3 rounded-full shrink-0 mr-3" style={{ backgroundColor: item.color }}></div>
                    <span className="text-gray-500 font-medium flex-1">{item.name}</span>
                    <div className="flex items-center">
                      <span className="font-bold text-gray-800 w-10 text-right">{item.value}</span>
                      <span className="text-gray-400 text-xs w-12 text-right">
                        ({Math.round((item.value / 250) * 100)}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Barang Stok Kritis */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col">
              <div className="flex justify-between items-center p-6 pb-4">
                <h3 className="font-bold text-gray-800">Barang Stok Kritis</h3>
                <button className="text-xs font-semibold text-emerald-600 hover:text-emerald-700">Lihat semua</button>
              </div>
              
              <div className="p-6 pt-0">
                <button className="w-full py-2.5 rounded-lg border border-emerald-100 text-emerald-600 font-semibold text-xs hover:bg-emerald-50 transition-colors">
                  Lihat Semua Stok Kritis
                </button>
              </div>

              <div className="p-4 pt-0">
                <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-4">
                   <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden">
                     {/* Dummy Image for Sabun Cuci Piring */}
                     <div className="w-6 h-8 bg-green-500 rounded-sm opacity-80 flex items-center justify-center relative overflow-hidden">
                        <div className="absolute top-1 w-4 h-2 bg-yellow-300 rounded-full"></div>
                     </div>
                   </div>
                   <div className="flex-1">
                     <h4 className="text-sm font-bold text-gray-800">Sabun Cuci Piring</h4>
                     <p className="text-xs text-red-500 font-medium mt-0.5">Sisa: 5 pcs</p>
                   </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
