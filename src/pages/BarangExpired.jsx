import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { AlertOctagon, Calendar, Trash2, RotateCcw, MapPin, Search } from "lucide-react";

const INITIAL_EXPIRED_ITEMS = [
  { kode: "BRG-001", nama: "Kopi Bubuk Premium", kategori: "Minuman", stok: 12, expiredDate: "2026-06-15", lokasi: "Rak A-01", harga: 12000 },
  { kode: "BRG-002", nama: "Teh Celup Herbal", kategori: "Minuman", stok: 5, expiredDate: "2026-07-28", lokasi: "Rak A-02", harga: 9000 },
  { kode: "BRG-003", nama: "Susu Kaleng Manis", kategori: "Minuman", stok: 15, expiredDate: "2026-05-10", lokasi: "Rak B-01", harga: 14000 },
  { kode: "BRG-004", nama: "Roti Tawar Gandum", kategori: "Makanan", stok: 8, expiredDate: "2026-07-15", lokasi: "Rak B-03", harga: 15000 },
  { kode: "BRG-005", nama: "Saus Cabai Botol", kategori: "Bumbu Dapur", stok: 20, expiredDate: "2026-08-20", lokasi: "Rak C-01", harga: 18000 },
  { kode: "BRG-006", nama: "Mentega Serbaguna", kategori: "Bumbu Dapur", stok: 10, expiredDate: "2026-07-10", lokasi: "Rak C-02", harga: 22000 }
];

const CURRENT_DATE = new Date("2026-07-13"); // Anchor date based on system local time

export default function BarangExpired() {
  const [items, setItems] = useState(INITIAL_EXPIRED_ITEMS);
  const [query, setQuery] = useState("");

  const processedItems = useMemo(() => {
    return items.map(item => {
      const expDate = new Date(item.expiredDate);
      const diffTime = expDate.getTime() - CURRENT_DATE.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      let status = "aman";
      let statusText = "";
      
      if (diffDays < 0) {
        status = "expired";
        statusText = `Expired (${Math.abs(diffDays)} hari lalu)`;
      } else if (diffDays <= 30) {
        status = "hampir";
        statusText = `${diffDays} hari lagi`;
      } else {
        status = "aman";
        statusText = `${diffDays} hari lagi`;
      }

      return {
        ...item,
        diffDays,
        status,
        statusText,
        nilai: item.stok * item.harga
      };
    });
  }, [items]);

  const filteredItems = useMemo(() => {
    if (!query) return processedItems;
    const q = query.toLowerCase();
    return processedItems.filter(item => 
      item.nama.toLowerCase().includes(q) ||
      item.kode.toLowerCase().includes(q) ||
      item.kategori.toLowerCase().includes(q) ||
      item.lokasi.toLowerCase().includes(q)
    );
  }, [processedItems, query]);

  // Statistics
  const stats = useMemo(() => {
    let expiredCount = 0;
    let hampirCount = 0;
    let totalLoss = 0;

    processedItems.forEach(item => {
      if (item.status === "expired") {
        expiredCount += 1;
        totalLoss += item.nilai;
      } else if (item.status === "hampir") {
        hampirCount += 1;
      }
    });

    return { expiredCount, hampirCount, totalLoss };
  }, [processedItems]);

  const handleDelete = (kode) => {
    if (confirm("Apakah Anda yakin ingin membuang/menghapus barang ini dari gudang?")) {
      setItems(prev => prev.filter(item => item.kode !== kode));
    }
  };

  const handleRetur = (kode) => {
    alert(`Barang dengan kode ${kode} ditandai untuk dikembalikan (retur) ke supplier.`);
  };

  const disposeAllExpired = () => {
    if (confirm("Apakah Anda yakin ingin membuang semua barang yang sudah kedaluwarsa?")) {
      setItems(prev => prev.filter(item => {
        const expDate = new Date(item.expiredDate);
        return expDate.getTime() >= CURRENT_DATE.getTime();
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <div className="text-sm text-slate-500 font-medium">Dashboard &gt; Barang Expired</div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Barang Expired & Hampir Expired</h1>
        </div>
        {stats.expiredCount > 0 && (
          <Button onClick={disposeAllExpired} className="bg-rose-600 hover:bg-rose-500 text-white font-medium gap-2">
            <Trash2 className="h-4 w-4" /> Buang Semua Expired
          </Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="rounded-xl border border-rose-100 bg-rose-50/20 p-5 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-rose-800">Telah Kedaluwarsa</div>
            <div className="text-3xl font-bold text-rose-600 mt-1">{stats.expiredCount} Item</div>
          </div>
          <div className="bg-rose-50 border border-rose-100 text-rose-500 p-3 rounded-xl">
            <AlertOctagon className="h-6 w-6" />
          </div>
        </div>
        
        <div className="rounded-xl border border-amber-100 bg-amber-50/20 p-5 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-amber-800">Hampir Kedaluwarsa (&le; 30 Hari)</div>
            <div className="text-3xl font-bold text-amber-600 mt-1">{stats.hampirCount} Item</div>
          </div>
          <div className="bg-amber-50 border border-amber-100 text-amber-500 p-3 rounded-xl">
            <Calendar className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-slate-500">Estimasi Kerugian Gudang</div>
            <div className="text-2xl font-bold text-slate-800 mt-1">
              Rp {stats.totalLoss.toLocaleString("id-ID")}
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 text-slate-500 p-3 rounded-xl">
            <span className="text-lg font-bold">Rp</span>
          </div>
        </div>
      </div>

      {/* Table Area */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-800">Daftar Pengawasan Kedaluwarsa</h2>
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              type="text"
              placeholder="Cari nama barang, kode, rak..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-9 bg-white border-slate-200"
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                <TableHead className="w-12">No</TableHead>
                <TableHead>Kode Barang</TableHead>
                <TableHead>Nama Barang</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Lokasi Rak</TableHead>
                <TableHead>Tgl Expired</TableHead>
                <TableHead>Sisa Hari</TableHead>
                <TableHead className="text-right">Stok</TableHead>
                <TableHead className="text-right">Nilai Barang</TableHead>
                <TableHead className="text-center w-40">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <TableRow key={item.kode} className="hover:bg-slate-50/30 transition-colors">
                    <TableCell className="text-slate-400">{index + 1}</TableCell>
                    <TableCell className="font-semibold text-slate-700">{item.kode}</TableCell>
                    <TableCell className="font-medium text-slate-800">{item.nama}</TableCell>
                    <TableCell className="text-slate-500 text-sm">{item.kategori}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1 text-slate-700 text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        {item.lokasi}
                      </span>
                    </TableCell>
                    <TableCell className="text-slate-600 text-sm">{item.expiredDate}</TableCell>
                    <TableCell>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${
                        item.status === "expired" ? "bg-rose-50 text-rose-700" :
                        item.status === "hampir" ? "bg-amber-50 text-amber-700 animate-pulse" :
                        "bg-emerald-50 text-emerald-700"
                      }`}>
                        {item.statusText}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-semibold">{item.stok}</TableCell>
                    <TableCell className="text-right text-slate-600 text-sm">
                      Rp {item.nilai.toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-1.5">
                        <Button 
                          onClick={() => handleRetur(item.kode)} 
                          variant="outline" 
                          size="sm" 
                          className="h-8 border-slate-200 text-slate-600 text-xs px-2.5 font-medium gap-1"
                        >
                          <RotateCcw className="h-3 w-3" /> Retur
                        </Button>
                        <Button 
                          onClick={() => handleDelete(item.kode)} 
                          variant="destructive" 
                          size="sm" 
                          className="h-8 bg-rose-50 hover:bg-rose-100 border-none text-rose-600 shadow-none text-xs px-2.5 font-medium gap-1"
                        >
                          <Trash2 className="h-3 w-3" /> Buang
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-10 text-slate-400">
                    Tidak ada data barang expired yang ditemukan.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
