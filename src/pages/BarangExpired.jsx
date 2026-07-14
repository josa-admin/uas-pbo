import { useEffect, useMemo, useState } from "react";
import { AlertOctagon, Calendar, MapPin, RotateCcw, Search, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/api/api";
import ENDPOINTS from "@/api/endpoints";

const normalizeListData = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.results)) return payload.results;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return [];
};

export default function BarangExpired() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToastMsg = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const loadExpiredItems = async () => {
    try {
      setLoading(true);
      const response = await api.get(ENDPOINTS.EXPIRED_ALERT);
      setItems(normalizeListData(response.data));
    } catch (error) {
      console.error(error);
      showToastMsg("Gagal mengambil data barang expired", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpiredItems();
  }, []);

  useEffect(() => {
    if (!toast.show) return undefined;

    const timer = window.setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [toast.show]);

  const processedItems = useMemo(() => {
    return items.map((item) => {
      const expDate = new Date(item.expired_date || item.expiredDate || "");
      const today = new Date();
      const diffTime = expDate.getTime() - today.getTime();
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

      const remainingQuantity = Number(item.remaining_quantity ?? item.stok ?? 0);

      return {
        ...item,
        id: item.id || item.stock_id || item.batch_number,
        kode: item.batch_number || item.kode || "-",
        nama: item.product_name || item.nama || "-",
        kategori: item.category_name || item.kategori || "-",
        lokasi: item.bin_name || item.lokasi || "-",
        expiredDate: item.expired_date || item.expiredDate || "",
        stok: remainingQuantity,
        diffDays,
        status,
        statusText,
      };
    });
  }, [items]);

  const filteredItems = useMemo(() => {
    if (!query) return processedItems;
    const q = query.toLowerCase();
    return processedItems.filter((item) => {
      const searchable = [
        item.product_name,
        item.category_name,
        item.supplier_name,
        item.bin_name,
        item.batch_number,
        item.nama,
        item.kategori,
        item.lokasi,
        item.kode,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(q);
    });
  }, [processedItems, query]);

  const stats = useMemo(() => {
    let expiredCount = 0;
    let hampirCount = 0;
    let expiredQuantityTotal = 0;

    processedItems.forEach((item) => {
      if (item.status === "expired") {
        expiredCount += 1;
        expiredQuantityTotal += Number(item.stok || 0);
      } else if (item.status === "hampir") {
        hampirCount += 1;
      }
    });

    return { expiredCount, hampirCount, expiredQuantityTotal };
  }, [processedItems]);

  const handleDelete = async (id) => {
    if (!id) {
      showToastMsg("ID stok tidak tersedia", "error");
      return;
    }

    try {
      await api.delete(ENDPOINTS.STOCK_DETAIL(id));
      showToastMsg("Barang berhasil dibuang", "success");
      await loadExpiredItems();
    } catch (error) {
      console.error(error);
      showToastMsg("Gagal membuang barang", "error");
    }
  };

  const handleRetur = (kode) => {
    showToastMsg(`TODO: integrasi retur untuk ${kode}`, "info");
  };

  const disposeAllExpired = async () => {
    showToastMsg("TODO: integrasi pembuangan batch expired", "info");
  };

  return (
    <div className="space-y-6">
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3.5 bg-[#1e293b] text-white px-5 py-4 rounded-xl shadow-xl border border-slate-700 animate-slide-in">
          <div className={`p-1.5 rounded-full ${toast.type === "error" ? "bg-red-500/20 text-red-400" : toast.type === "info" ? "bg-blue-500/20 text-blue-400" : "bg-emerald-500/20 text-emerald-400"}`}>
            {toast.type === "error" ? <X className="h-5 w-5" /> : <Check className="h-5 w-5" />}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">
              {toast.type === "error" ? "Error" : toast.type === "info" ? "Informasi" : "Data Disimpan"}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">{toast.message}</p>
          </div>
          <button
            onClick={() => setToast({ show: false, message: "", type: "success" })}
            className="text-slate-400 hover:text-slate-200 ml-4 focus:outline-none"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

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
            <div className="text-sm font-medium text-slate-500">Jumlah Barang Expired</div>
            <div className="text-2xl font-bold text-slate-800 mt-1">
              {stats.expiredQuantityTotal} Unit
            </div>
          </div>
          <div className="bg-slate-50 border border-slate-200 text-slate-500 p-3 rounded-xl">
            <span className="text-lg font-bold">U</span>
          </div>
        </div>
      </div>

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
              {loading ? (
                <TableRow>
                  <TableCell colSpan={10} className="text-center py-10 text-slate-400">
                    Memuat data...
                  </TableCell>
                </TableRow>
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item, index) => (
                  <TableRow key={item.id || item.kode} className="hover:bg-slate-50/30 transition-colors">
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
                      -
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
                          onClick={() => handleDelete(item.id)}
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
