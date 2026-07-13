import { useMemo, useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Package, RotateCcw } from "lucide-react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

const SAMPLE_ITEMS = [
  { kode: "BRG-001", nama: "Kopi Bubuk", kategori: "Minuman", satuan: "Bungkus", harga: "Rp 12.000,00", stok: 12, status: "Normal", lokasi: "Rak A-01" },
  { kode: "BRG-002", nama: "Teh Celup", kategori: "Minuman", satuan: "Kotak", harga: "Rp 9.000,00", stok: 5, status: "Menipis", lokasi: "Rak A-02" },
  { kode: "BRG-003", nama: "Susu Kental Manis", kategori: "Minuman", satuan: "Kaleng", harga: "Rp 14.000,00", stok: 2, status: "Kritis", lokasi: "Rak B-01" },
  { kode: "BRG-004", nama: "Kecap Manis", kategori: "Bumbu Dapur", satuan: "Botol", harga: "Rp 18.000,00", stok: 45, status: "Normal", lokasi: "Rak C-03" },
  { kode: "BRG-005", nama: "Garam Dapur", kategori: "Bumbu Dapur", satuan: "Bungkus", harga: "Rp 4.000,00", stok: 24, status: "Normal", lokasi: "Rak C-04" },
  { kode: "BRG-006", nama: "Mouse Logitech", kategori: "Elektronik", satuan: "Unit", harga: "Rp 150.000,00", stok: 120, status: "Normal", lokasi: "Rak D-02" },
  { kode: "BRG-007", nama: "Keyboard Mechanical", kategori: "Elektronik", satuan: "Unit", harga: "Rp 450.000,00", stok: 15, status: "Normal", lokasi: "Rak D-03" },
  { kode: "BRG-008", nama: "Monitor LCD 24 Inch", kategori: "Elektronik", satuan: "Unit", harga: "Rp 1.800.000,00", stok: 3, status: "Kritis", lokasi: "Rak D-05" }
];

export default function PencarianBarang() {
  const [query, setQuery] = useState("");
  const [history, setHistory] = useState(["Kopi", "Elektronik", "Rak A"]);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const filteredItems = useMemo(() => {
    if (!query) return SAMPLE_ITEMS;
    const q = query.toLowerCase();
    return SAMPLE_ITEMS.filter(
      (item) =>
        item.kode.toLowerCase().includes(q) ||
        item.nama.toLowerCase().includes(q) ||
        item.kategori.toLowerCase().includes(q) ||
        item.lokasi.toLowerCase().includes(q)
    );
  }, [query]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim() && !history.includes(query.trim())) {
      setHistory((prev) => [query.trim(), ...prev.slice(0, 4)]);
    }
  };

  const clearHistory = () => {
    setHistory([]);
  };

  function statusClasses(status) {
    switch (status) {
      case "Normal":
        return "bg-emerald-50 text-emerald-700 font-semibold";
      case "Menipis":
        return "bg-amber-50 text-amber-700 font-semibold";
      case "Kritis":
        return "bg-rose-50 text-rose-700 font-semibold";
      default:
        return "bg-slate-50 text-slate-700";
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <div className="text-sm text-slate-500 font-medium">Dashboard &gt; Pencarian Barang</div>
        <h1 className="text-2xl font-bold text-slate-800">Pencarian Barang Gudang</h1>
      </div>

      {/* Main Search Panel */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-6">
        <form onSubmit={handleSearchSubmit} className="relative flex gap-3 max-w-3xl">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <Input
              ref={searchInputRef}
              type="text"
              placeholder="Cari berdasarkan Nama, Kode, Kategori, atau Lokasi Rak (misal: 'Rak A-01')..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-12 h-12 bg-slate-50 border-slate-200 text-slate-800 placeholder:text-slate-400 text-base focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
            />
          </div>
          <Button type="submit" className="h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-medium px-6 shrink-0">
            Cari Barang
          </Button>
        </form>

        {/* Search History / Quick Tags */}
        {history.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-sm">
            <span className="text-slate-400 font-medium flex items-center gap-1.5 mr-2">
              <RotateCcw className="h-3.5 w-3.5" /> Pencarian Terakhir:
            </span>
            {history.map((tag, idx) => (
              <button
                key={idx}
                onClick={() => setQuery(tag)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1 rounded-full transition-colors font-medium"
              >
                {tag}
              </button>
            ))}
            <button
              onClick={clearHistory}
              className="text-xs text-rose-500 hover:text-rose-600 font-semibold ml-2 transition-colors"
            >
              Hapus Riwayat
            </button>
          </div>
        )}
      </div>

      {/* Search Results */}
      <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Package className="h-5 w-5 text-slate-400" />
            Hasil Pencarian
            <span className="text-sm font-normal text-slate-500">
              ({filteredItems.length} barang ditemukan)
            </span>
          </h2>
        </div>

        {filteredItems.length > 0 ? (
          <div className="rounded-xl border border-slate-200/80 bg-white overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50">
                  <TableHead className="w-12">No</TableHead>
                  <TableHead>Kode Barang</TableHead>
                  <TableHead>Nama Barang</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Lokasi Gudang</TableHead>
                  <TableHead className="text-right">Harga</TableHead>
                  <TableHead className="text-right">Stok</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item, index) => (
                  <TableRow key={item.kode} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="text-slate-400 font-medium">{index + 1}</TableCell>
                    <TableCell className="font-semibold text-slate-700">{item.kode}</TableCell>
                    <TableCell className="font-medium text-slate-800">{item.nama}</TableCell>
                    <TableCell className="text-slate-600">{item.kategori}</TableCell>
                    <TableCell className="text-slate-700">
                      <span className="inline-flex items-center gap-1 bg-slate-100/80 text-slate-700 text-xs px-2 py-0.5 rounded font-medium">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        {item.lokasi}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-slate-600">{item.harga}</TableCell>
                    <TableCell className="text-right font-semibold text-slate-800">{item.stok}</TableCell>
                    <TableCell className="text-center">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusClasses(item.status)}`}>
                        {item.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-slate-200 rounded-xl">
            <Search className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-700 font-semibold text-lg">Tidak ada hasil cocok</p>
            <p className="text-slate-400 text-sm mt-1">Coba periksa kembali ejaan kata kunci pencarian Anda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
