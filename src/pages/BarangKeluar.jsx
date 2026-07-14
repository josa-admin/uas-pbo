import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Calendar,
  Building2,
  Check,
  X,
  ChevronRight,
  PlusCircle,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import api from "@/api/api";
import ENDPOINTS from "@/api/endpoints";

const normalizeListData = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.results)) return payload.results;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return [];
};

export default function BarangKeluar() {
  const [tanggal, setTanggal] = useState(new Date().toISOString().split("T")[0]);
  const [tujuan, setTujuan] = useState("");
  const [petugas, setPetugas] = useState("Admin");

  const [items, setItems] = useState([]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [outboundHistory, setOutboundHistory] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedItemOption, setSelectedItemOption] = useState("");
  const [addQty, setAddQty] = useState(1);
  const [loading, setLoading] = useState(false);

  const showToastMsg = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
  };

  const loadProductsAndHistory = async () => {
    try {
      setLoading(true);
      const [productRes, outboundRes] = await Promise.all([
        api.get(ENDPOINTS.PRODUCT),
        api.get(ENDPOINTS.OUTBOUND),
      ]);

      setProducts(normalizeListData(productRes.data));
      const historyData = normalizeListData(outboundRes.data);
      setOutboundHistory(
        historyData.map((tx) => ({
          id: tx.id,
          txCode: tx.outbound_number,
          tujuan: tx.destination,
          tanggal: tx.created_at,
          petugas,
          items: (tx.items || []).map((item) => ({
            kode: item.product_name || item.product || "-",
            nama: item.product_name || item.product || "-",
            qty: item.quantity,
          })),
          totalUnit: (tx.items || []).reduce((sum, item) => sum + Number(item.quantity || 0), 0),
        }))
      );
    } catch (error) {
      console.error(error);
      showToastMsg("Gagal memuat data dari backend", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProductsAndHistory();
  }, []);

  useEffect(() => {
    if (!toast.show) return undefined;

    const timer = window.setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [toast.show]);

  const handleQtyChange = (id, newQty) => {
    const parsedQty = parseInt(newQty, 10);
    if (Number.isNaN(parsedQty) || parsedQty < 1) return;

    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, qty: parsedQty } : item))
    );
  };

  const handleDeleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    showToastMsg("Barang dihapus dari daftar pengeluaran.", "info");
  };

  const handleReset = () => {
    setItems([]);
    setTanggal(new Date().toISOString().split("T")[0]);
    setTujuan("");
    setPetugas("Admin");
    setSelectedItemOption("");
    setAddQty(1);
    showToastMsg("Form pengeluaran telah direset.", "info");
  };

  const handleAddItem = (e) => {
    e.preventDefault();

    if (!selectedItemOption) {
      showToastMsg("Pilih barang terlebih dahulu.", "error");
      return;
    }

    const parsedQty = Number(addQty);
    if (!Number.isFinite(parsedQty) || parsedQty < 1) {
      showToastMsg("Jumlah keluar harus lebih dari 0.", "error");
      return;
    }

    const product = products.find((item) => String(item.id) === String(selectedItemOption));
    if (!product) {
      showToastMsg("Barang tidak ditemukan.", "error");
      return;
    }

    const exists = items.some((item) => String(item.product) === String(product.id));
    if (exists) {
      showToastMsg(`Barang ${product.name} sudah ada dalam daftar.`, "error");
      return;
    }

    const newItem = {
      id: Date.now(),
      product: product.id,
      kode: product.id,
      nama: product.name,
      qty: parsedQty,
      stock: null,
    };

    setItems((prev) => [...prev, newItem]);
    setSelectedItemOption("");
    setAddQty(1);
    setIsAddOpen(false);

    showToastMsg(`Berhasil menambahkan ${newItem.nama} ke daftar.`);
  };

  const handleConfirm = async () => {
    if (!tujuan.trim()) {
      showToastMsg("Gagal menyimpan: Tujuan / Penerima harus diisi.", "error");
      return;
    }

    if (items.length === 0) {
      showToastMsg("Gagal menyimpan: Daftar barang pengeluaran masih kosong.", "error");
      return;
    }

    const invalidQty = items.some((item) => Number(item.qty) < 1);
    if (invalidQty) {
      showToastMsg("Jumlah keluar harus lebih dari 0.", "error");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        destination: tujuan.trim(),
        outbound_date: tanggal,
        notes: "",
        items: items.map((item) => ({
          product: item.product,
          quantity: Number(item.qty),
        })),
      };

      await api.post(ENDPOINTS.OUTBOUND, payload);
      await loadProductsAndHistory();
      setItems([]);
      setTujuan("");
      setSelectedItemOption("");
      setAddQty(1);
      showToastMsg("Transaksi berhasil dicatat.", "success");
    } catch (error) {
      console.error(error);
      console.log(error.response?.data)
      showToastMsg(JSON.stringify(error.response?.data)), 'error'
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 relative pb-16">
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

      <div className="flex items-center justify-between">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 text-sm font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Kembali ke Daftar</span>
        </button>

        <Button
          onClick={handleConfirm}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium shadow-sm rounded-lg flex items-center gap-1.5 h-9 px-4 cursor-pointer"
          disabled={loading}
        >
          <Plus className="h-4 w-4" />
          <span>{loading ? "Memuat..." : "Input Barang Keluar"}</span>
        </Button>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <Label className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Tanggal</Label>
            <div className="relative">
              <Input
                type="date"
                value={tanggal}
                onChange={(e) => setTanggal(e.target.value)}
                className="h-10 bg-transparent border-slate-200 text-slate-700 text-sm focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20 pr-10"
              />
              <Calendar className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Tujuan / Penerima</Label>
            <div className="relative">
              <Input
                type="text"
                placeholder="Masukkan tujuan / penerima"
                value={tujuan}
                onChange={(e) => setTujuan(e.target.value)}
                className="h-10 bg-transparent border-slate-200 text-slate-700 text-sm focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20 pr-10"
              />
              <Building2 className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Petugas</Label>
            <Select value={petugas} onValueChange={setPetugas}>
              <SelectTrigger className="h-10 w-full bg-transparent border-slate-200 text-slate-700 text-sm focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20">
                <SelectValue placeholder="Pilih Petugas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Admin">Admin</SelectItem>
                <SelectItem value="Supervisor">Supervisor</SelectItem>
                <SelectItem value="Staff Gudang">Staff Gudang</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
        <div className="bg-[#f0f4f8]/50 p-4 border-b border-slate-200/80">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Detail Barang</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-200/60 text-left">
                <th className="py-3 px-4 w-16 text-center">NO</th>
                <th className="py-3 px-4 w-32">KODE BARANG</th>
                <th className="py-3 px-4">NAMA BARANG</th>
                <th className="py-3 px-4 w-36 text-center">JUMLAH KELUAR</th>
                <th className="py-3 px-4 w-36 text-center">STOK TERSEDIA</th>
                <th className="py-3 px-4 w-20 text-center">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    Belum ada barang ditambahkan. Klik <strong className="text-emerald-600">Tambah Barang</strong> di bawah untuk memulai.
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/30 transition-colors">
                    <td className="py-3.5 px-4 text-center text-slate-400 font-medium">{index + 1}</td>
                    <td className="py-3.5 px-4 text-slate-500 font-medium">{item.kode}</td>
                    <td className="py-3.5 px-4 text-slate-800 font-semibold">{item.nama}</td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center">
                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) => handleQtyChange(item.id, e.target.value)}
                          className="w-16 h-8 text-center border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                        {item.stock ?? "—"} Unit
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 rounded-md text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/20">
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <button className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 text-xs font-bold transition-colors cursor-pointer focus:outline-none">
                <PlusCircle className="h-4.5 w-4.5" />
                <span>Tambah Barang</span>
              </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white p-5 border border-slate-200 rounded-xl">
              <DialogHeader>
                <DialogTitle className="text-slate-800 text-lg font-bold flex items-center gap-2">
                  <PlusCircle className="h-5 w-5 text-emerald-600" />
                  <span>Tambah Barang Keluar</span>
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleAddItem} className="space-y-4 pt-2">
                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500 font-semibold uppercase">Pilih Barang</Label>
                  <Select value={selectedItemOption} onValueChange={setSelectedItemOption}>
                    <SelectTrigger className="h-10 w-full text-slate-700 bg-transparent border-slate-200">
                      <SelectValue placeholder="Pilih barang" />
                    </SelectTrigger>
                    <SelectContent>
                      {products.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500 font-semibold uppercase">Jumlah Keluar</Label>
                  <Input
                    type="number"
                    min="1"
                    value={addQty}
                    onChange={(e) => setAddQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                    className="h-10 text-slate-700 border-slate-200"
                    required
                  />
                </div>

                <DialogFooter className="flex flex-row justify-end gap-2 pt-4">
                  <DialogClose asChild>
                    <Button type="button" variant="outline" className="h-9 cursor-pointer">
                      Batal
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium h-9 px-4 cursor-pointer"
                  >
                    Tambah ke Daftar
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3.5">
        <Button
          variant="outline"
          onClick={handleReset}
          className="border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs h-9 px-6 rounded-lg cursor-pointer"
        >
          Batal
        </Button>
        <Button
          onClick={handleConfirm}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs h-9 px-6 rounded-lg cursor-pointer shadow-sm"
          disabled={loading}
        >
          Konfirmasi
        </Button>
      </div>

      <div className="flex justify-center pt-2">
        <button
          onClick={() => setIsHistoryOpen(true)}
          className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 text-xs font-bold transition-colors cursor-pointer"
        >
          <span>Riwayat Barang Keluar</span>
          <ChevronRight className="h-4.5 w-4.5" />
        </button>
      </div>

      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="sm:max-w-2xl bg-white p-5 border border-slate-200 rounded-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-slate-800 text-lg font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-600" />
              <span>Riwayat Transaksi Barang Keluar</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {outboundHistory.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                Belum ada riwayat transaksi pengeluaran. Konfirmasi transaksi baru untuk melihat riwayat di sini.
              </div>
            ) : (
              <div className="space-y-3.5">
                {outboundHistory.map((tx) => (
                  <div key={tx.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-800">{tx.txCode}</span>
                        <span className="text-[10px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded-full uppercase">
                          {tx.petugas}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        {tx.tanggal} | Tujuan: <span className="font-semibold text-slate-700">{tx.tujuan}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Daftar Item Keluar:</span>
                      <ul className="text-xs text-slate-600 space-y-1 divide-y divide-slate-100/50">
                        {tx.items.map((item, idx) => (
                          <li key={idx} className="flex justify-between py-1.5 first:pt-0">
                            <span>
                              {item.kode} - <strong className="font-medium text-slate-700">{item.nama}</strong>
                            </span>
                            <span className="text-slate-500 font-medium">
                              {item.qty} Pcs
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-end pt-2 border-t border-slate-100/80 text-xs font-bold text-slate-600">
                      Total Unit Keluar: {tx.totalUnit} Pcs
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter className="pt-4 border-t border-slate-100">
            <DialogClose asChild>
              <Button variant="outline" className="w-full sm:w-auto cursor-pointer">
                Tutup Riwayat
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
