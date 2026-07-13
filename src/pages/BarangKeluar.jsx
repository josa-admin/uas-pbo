import { useState, useEffect } from "react";
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
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
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

// Available stock for selection
const AVAILABLE_STOCK = [
  { kode: "BR0001", nama: "Mouse Logitech MX Master 3", stock: 20 },
  { kode: "BR0042", nama: "Mechanical Keyboard Keychron K2", stock: 15 },
  { kode: "BR0015", nama: "Monitor ASUS ROG 27\"", stock: 8 },
  { kode: "BR0089", nama: "Headset SteelSeries Arctis 7", stock: 12 },
  { kode: "BR0102", nama: "SSD Samsung Evo 1TB", stock: 30 },
];

export default function BarangKeluar() {
  // Main form states
  const [tanggal, setTanggal] = useState("2024-05-24");
  const [tujuan, setTujuan] = useState("");
  const [petugas, setPetugas] = useState("Admin");

  // Items table state
  const [items, setItems] = useState([
    { id: 1, kode: "BR0001", nama: "Mouse Logitech MX Master 3", qty: 5, stock: 20 }
  ]);

  // Dialog and toast states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [outboundHistory, setOutboundHistory] = useState([]);

  // Add Item form state
  const [selectedItemOption, setSelectedItemOption] = useState("BR0001");
  const [customKode, setCustomKode] = useState("");
  const [customNama, setCustomNama] = useState("");
  const [customStock, setCustomStock] = useState(10);
  const [addQty, setAddQty] = useState(1);

  // Load history from localStorage on mount
  useEffect(() => {
    const history = localStorage.getItem("wms_barang_keluar_history");
    if (history) {
      try {
        setOutboundHistory(JSON.parse(history));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Show Toast helper
  const showToastMsg = (msg, type = "success") => {
    setToast({ show: true, message: msg, type });
  };

  // Auto-dismiss toast
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: "", type: "success" });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Handle Qty change directly in table with stock check
  const handleQtyChange = (id, newQty) => {
    const parsedQty = parseInt(newQty);
    if (isNaN(parsedQty) || parsedQty < 1) return;

    setItems(items.map(item => {
      if (item.id === id) {
        if (parsedQty > item.stock) {
          showToastMsg(`Jumlah keluar tidak boleh melebihi stok tersedia (${item.stock} Unit).`, "error");
          return { ...item, qty: item.stock };
        }
        return { ...item, qty: parsedQty };
      }
      return item;
    }));
  };

  // Handle Delete item from table
  const handleDeleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
    showToastMsg("Barang dihapus dari daftar pengeluaran.", "info");
  };

  // Reset form
  const handleReset = () => {
    setItems([
      { id: 1, kode: "BR0001", nama: "Mouse Logitech MX Master 3", qty: 5, stock: 20 }
    ]);
    setTanggal(new Date().toISOString().split("T")[0]);
    setTujuan("");
    setPetugas("Admin");
    showToastMsg("Form pengeluaran telah direset.", "info");
  };

  // Add Item submit handler
  const handleAddItem = (e) => {
    e.preventDefault();
    let newItem = {};

    if (selectedItemOption === "custom") {
      if (!customKode || !customNama || customStock < 1 || addQty < 1) {
        alert("Mohon isi semua field.");
        return;
      }
      if (addQty > customStock) {
        showToastMsg(`Jumlah melebihi stok tersedia (${customStock} Unit).`, "error");
        return;
      }
      newItem = {
        id: Date.now(),
        kode: customKode,
        nama: customNama,
        qty: parseInt(addQty),
        stock: parseInt(customStock)
      };
    } else {
      const predef = AVAILABLE_STOCK.find(item => item.kode === selectedItemOption);
      if (!predef) return;
      if (addQty > predef.stock) {
        showToastMsg(`Jumlah melebihi stok tersedia (${predef.stock} Unit).`, "error");
        return;
      }
      newItem = {
        id: Date.now(),
        kode: predef.kode,
        nama: predef.nama,
        qty: parseInt(addQty),
        stock: predef.stock
      };
    }

    // Check if product already exists in items table
    const exists = items.find(item => item.kode === newItem.kode);
    if (exists) {
      showToastMsg(`Barang ${newItem.kode} sudah ada dalam daftar.`, "error");
      return;
    }

    setItems([...items, newItem]);
    setIsAddOpen(false);

    // Reset fields
    setCustomKode("");
    setCustomNama("");
    setCustomStock(10);
    setAddQty(1);

    showToastMsg(`Berhasil menambahkan ${newItem.nama} ke daftar.`);
  };

  // Confirm/Save transaction handler
  const handleConfirm = () => {
    if (!tujuan.trim()) {
      showToastMsg("Gagal menyimpan: Tujuan / Penerima harus diisi.", "error");
      return;
    }
    if (items.length === 0) {
      showToastMsg("Gagal menyimpan: Daftar barang pengeluaran masih kosong.", "error");
      return;
    }

    const txCode = `OUT-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(100 + Math.random() * 900)}`;

    const transaction = {
      id: Date.now(),
      txCode,
      tanggal,
      tujuan,
      petugas,
      items,
      totalUnit: items.reduce((sum, item) => sum + item.qty, 0)
    };

    const newHistory = [transaction, ...outboundHistory];
    setOutboundHistory(newHistory);
    localStorage.setItem("wms_barang_keluar_history", JSON.stringify(newHistory));

    showToastMsg(`Transaksi ${txCode} berhasil dicatat.`, "success");

    // Reset fields for next outbound
    setTujuan("");
    setItems([
      { id: 1, kode: "BR0001", nama: "Mouse Logitech MX Master 3", qty: 5, stock: 20 }
    ]);
  };

  return (
    <div className="space-y-6 relative pb-16">
      {/* Toast Notification Container */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3.5 bg-[#1e293b] text-white px-5 py-4 rounded-xl shadow-xl border border-slate-700 animate-slide-in">
          <div className={`p-1.5 rounded-full ${toast.type === 'error' ? 'bg-red-500/20 text-red-400' : toast.type === 'info' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
            {toast.type === 'error' ? <X className="h-5 w-5" /> : <Check className="h-5 w-5" />}
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">
              {toast.type === 'error' ? 'Error' : toast.type === 'info' ? 'Informasi' : 'Data Disimpan'}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              {toast.message}
            </p>
          </div>
          <button
            onClick={() => setToast({ show: false, message: "", type: "success" })}
            className="text-slate-400 hover:text-slate-200 ml-4 focus:outline-none"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Header section with back navigation and input trigger button */}
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
        >
          <Plus className="h-4 w-4" />
          <span>Input Barang Keluar</span>
        </Button>
      </div>

      {/* Form Fields Card */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Date Picker */}
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

          {/* Destination / Recipient */}
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

          {/* Officer dropdown */}
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

      {/* Detail Barang Card */}
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
        {/* Card Header Bar */}
        <div className="bg-[#f0f4f8]/50 p-4 border-b border-slate-200/80">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Detail Barang</h3>
        </div>

        {/* Table View */}
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
                          max={item.stock}
                          value={item.qty}
                          onChange={(e) => handleQtyChange(item.id, e.target.value)}
                          className="w-16 h-8 text-center border border-slate-200 rounded-lg text-slate-700 font-medium focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                        />
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">
                        {item.stock} Unit
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

        {/* Add Goods Link triggers Radix UI Dialog */}
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
                      {AVAILABLE_STOCK.map(item => (
                        <SelectItem key={item.kode} value={item.kode}>
                          {item.kode} - {item.nama} (Stok: {item.stock})
                        </SelectItem>
                      ))}
                      <SelectItem value="custom">+ Item Kustom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {selectedItemOption === "custom" && (
                  <div className="space-y-3.5 border-l-2 border-emerald-500 pl-3.5 py-1">
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-500 font-medium">Kode Barang Custom</Label>
                      <Input
                        value={customKode}
                        onChange={(e) => setCustomKode(e.target.value)}
                        placeholder="Contoh: BR0099"
                        className="h-9 border-slate-200 text-slate-700"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-500 font-medium">Nama Barang</Label>
                      <Input
                        value={customNama}
                        onChange={(e) => setCustomNama(e.target.value)}
                        placeholder="Nama barang..."
                        className="h-9 border-slate-200 text-slate-700"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-500 font-medium">Stok Tersedia</Label>
                      <Input
                        type="number"
                        min="1"
                        value={customStock}
                        onChange={(e) => setCustomStock(Math.max(1, parseInt(e.target.value) || 1))}
                        className="h-9 border-slate-200 text-slate-700"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500 font-semibold uppercase">Jumlah Keluar</Label>
                  <Input
                    type="number"
                    min="1"
                    value={addQty}
                    onChange={(e) => setAddQty(Math.max(1, parseInt(e.target.value) || 1))}
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

      {/* Action Buttons */}
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
        >
          Konfirmasi
        </Button>
      </div>

      {/* Center history link */}
      <div className="flex justify-center pt-2">
        <button
          onClick={() => setIsHistoryOpen(true)}
          className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 text-xs font-bold transition-colors cursor-pointer"
        >
          <span>Riwayat Barang Keluar</span>
          <ChevronRight className="h-4.5 w-4.5" />
        </button>
      </div>

      {/* History Dialog Modal */}
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
