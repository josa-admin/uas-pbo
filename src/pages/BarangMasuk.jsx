import { useState, useEffect } from "react";
import {
  Package,
  Plus,
  Trash2,
  History,
  Save,
  Check,
  X,
  Layers,
  FileText,
  Truck,
  Printer
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

// Available products list for selection
const AVAILABLE_ITEMS = [
  { kode: "BR0001", nama: "Mouse Logitech G Pro Wireless", harga: 1250000 },
  { kode: "BR0042", nama: "Mechanical Keyboard Keychron K2", harga: 1800000 },
  { kode: "BR0015", nama: "Monitor ASUS ROG 27\"", harga: 4500000 },
  { kode: "BR0089", nama: "Headset SteelSeries Arctis 7", harga: 2100000 },
  { kode: "BR0102", nama: "SSD Samsung Evo 1TB", harga: 1650000 },
];

export default function BarangMasuk() {
  // Main form states
  const [noPo, setNoPo] = useState("PO-20240524-001");
  const [supplier, setSupplier] = useState("PT. Logistik Terpadu");
  const [tanggalMasuk, setTanggalMasuk] = useState("2024-05-24");
  const [petugas, setPetugas] = useState("Admin");

  // Items table state
  const [items, setItems] = useState([
    { id: 1, kode: "BR0001", nama: "Mouse Logitech G Pro Wireless", qty: 10, harga: 1250000 },
    { id: 2, kode: "BR0042", nama: "Mechanical Keyboard Keychron K2", qty: 5, harga: 1800000 }
  ]);

  // Dialog and toast states
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [savedTransactions, setSavedTransactions] = useState([]);

  // Add Item form state
  const [selectedItemOption, setSelectedItemOption] = useState("BR0001");
  const [customKode, setCustomKode] = useState("");
  const [customNama, setCustomNama] = useState("");
  const [customHarga, setCustomHarga] = useState("");
  const [addQty, setAddQty] = useState(1);

  // Load history from localStorage on mount
  useEffect(() => {
    const history = localStorage.getItem("wms_barang_masuk_history");
    if (history) {
      try {
        setSavedTransactions(JSON.parse(history));
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

  // Handle Qty change directly in table
  const handleQtyChange = (id, newQty) => {
    const parsedQty = parseInt(newQty);
    if (isNaN(parsedQty) || parsedQty < 1) return;
    setItems(items.map(item => item.id === id ? { ...item, qty: parsedQty } : item));
  };

  // Handle Delete item from table
  const handleDeleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
    showToastMsg("Barang berhasil dihapus dari daftar.", "info");
  };

  // Reset form
  const handleReset = () => {
    setItems([
      { id: 1, kode: "BR0001", nama: "Mouse Logitech G Pro Wireless", qty: 10, harga: 1250000 },
      { id: 2, kode: "BR0042", nama: "Mechanical Keyboard Keychron K2", qty: 5, harga: 1800000 }
    ]);
    setNoPo(`PO-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(100 + Math.random() * 900)}`);
    setSupplier("PT. Logistik Terpadu");
    setTanggalMasuk(new Date().toISOString().split("T")[0]);
    showToastMsg("Form transaksi telah direset.", "info");
  };

  // Add Item submit handler
  const handleAddItem = (e) => {
    e.preventDefault();
    let newItem = {};

    if (selectedItemOption === "custom") {
      if (!customKode || !customNama || !customHarga || addQty < 1) {
        alert("Mohon isi semua field untuk item kustom.");
        return;
      }
      newItem = {
        id: Date.now(),
        kode: customKode,
        nama: customNama,
        qty: parseInt(addQty),
        harga: parseInt(customHarga)
      };
    } else {
      const predef = AVAILABLE_ITEMS.find(item => item.kode === selectedItemOption);
      if (!predef) return;
      newItem = {
        id: Date.now(),
        kode: predef.kode,
        nama: predef.nama,
        qty: parseInt(addQty),
        harga: predef.harga
      };
    }

    setItems([...items, newItem]);
    setIsAddOpen(false);

    // Reset Add fields
    setCustomKode("");
    setCustomNama("");
    setCustomHarga("");
    setAddQty(1);

    showToastMsg(`Berhasil menambahkan ${newItem.nama}.`);
  };

  // Save transaction handler
  const handleSaveTransaction = (printLabel = false) => {
    if (items.length === 0) {
      showToastMsg("Gagal menyimpan: Daftar barang masih kosong.", "error");
      return;
    }

    const transaction = {
      id: Date.now(),
      noPo,
      supplier,
      tanggalMasuk,
      petugas,
      items,
      totalUnit,
      totalHarga
    };

    const newHistory = [transaction, ...savedTransactions];
    setSavedTransactions(newHistory);
    localStorage.setItem("wms_barang_masuk_history", JSON.stringify(newHistory));

    if (printLabel) {
      showToastMsg(`Data Disimpan. Transaksi ${noPo} berhasil dicatat & label dicetak.`, "success");
      // Simulate printer print label
      window.print();
    } else {
      showToastMsg(`Data Disimpan. Transaksi ${noPo} berhasil dicatat.`, "success");
    }

    // Generate new PO number for next transaction
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    setNoPo(`PO-${dateStr}-${Math.floor(100 + Math.random() * 900)}`);
  };

  // Format IDR helper
  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  // Calculations
  const totalUnit = items.reduce((sum, item) => sum + item.qty, 0);
  const totalHarga = items.reduce((sum, item) => sum + (item.qty * item.harga), 0);

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

      {/* Top Header & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-500 font-medium tracking-wide">
            Dashboard &gt; <span className="text-emerald-600 font-semibold">Barang Masuk</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mt-1">Input Barang Masuk</h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={() => handleSaveTransaction(false)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium shadow-sm transition-colors duration-150 rounded-lg flex items-center gap-2 h-9 px-4 cursor-pointer"
          >
            <Save className="h-4 w-4" />
            <span>Simpan Transaksi</span>
          </Button>
        </div>
      </div>

      {/* Form Fields Card */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="space-y-1.5">
            <Label className="text-slate-500 text-xs font-semibold uppercase tracking-wider">No. PO</Label>
            <Input
              value={noPo}
              onChange={(e) => setNoPo(e.target.value)}
              placeholder="PO-YYYYMMDD-XXX"
              className="h-10 bg-transparent border-slate-200 text-slate-700 text-sm focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Supplier</Label>
            <Select value={supplier} onValueChange={setSupplier}>
              <SelectTrigger className="h-10 w-full bg-transparent border-slate-200 text-slate-700 text-sm focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20">
                <SelectValue placeholder="Pilih Supplier" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PT. Logistik Terpadu">PT. Logistik Terpadu</SelectItem>
                <SelectItem value="PT. Indogrosir Jaya">PT. Indogrosir Jaya</SelectItem>
                <SelectItem value="PT. Makmur Sentosa">PT. Makmur Sentosa</SelectItem>
                <SelectItem value="PT. Sinar Distribusi">PT. Sinar Distribusi</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Tanggal Masuk</Label>
            <Input
              type="date"
              value={tanggalMasuk}
              onChange={(e) => setTanggalMasuk(e.target.value)}
              className="h-10 bg-transparent border-slate-200 text-slate-700 text-sm focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-slate-500 text-xs font-semibold uppercase tracking-wider">Petugas Penerima</Label>
            <Input
              value={petugas}
              disabled
              className="h-10 bg-slate-50 border-slate-200 text-slate-400 text-sm cursor-not-allowed font-medium"
            />
          </div>
        </div>
      </div>

      {/* Detail Barang Section */}
      <div className="bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
        {/* Table Header Section */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 font-semibold">
            <Package className="h-5 w-5 text-emerald-600" />
            <span>Detail Barang</span>
          </div>

          {/* Add Item Trigger Dialog */}
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="border-emerald-600/30 text-emerald-600 hover:bg-emerald-50 text-xs font-semibold h-8 rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Barang</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white p-5 border border-slate-200 rounded-xl">
              <DialogHeader>
                <DialogTitle className="text-slate-800 text-lg font-bold flex items-center gap-2">
                  <Plus className="h-5 w-5 text-emerald-600" />
                  <span>Tambah Item Barang Masuk</span>
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
                      {AVAILABLE_ITEMS.map(item => (
                        <SelectItem key={item.kode} value={item.kode}>
                          {item.kode} - {item.nama} ({formatRupiah(item.harga)})
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
                      <Label className="text-xs text-slate-500 font-medium">Harga Satuan (IDR)</Label>
                      <Input
                        type="number"
                        value={customHarga}
                        onChange={(e) => setCustomHarga(e.target.value)}
                        placeholder="Contoh: 500000"
                        className="h-9 border-slate-200 text-slate-700"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <Label className="text-xs text-slate-500 font-semibold uppercase">Jumlah Diterima</Label>
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

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100 text-left">
                <th className="py-3.5 px-4 w-16 text-center">No</th>
                <th className="py-3.5 px-4 w-28">Kode Barang</th>
                <th className="py-3.5 px-4">Nama Barang</th>
                <th className="py-3.5 px-4 w-32 text-center">Jumlah Diterima</th>
                <th className="py-3.5 px-4 w-44 text-right">Harga Satuan</th>
                <th className="py-3.5 px-4 w-20 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {items.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400">
                    Belum ada barang ditambahkan. Klik <strong className="text-emerald-600">Tambah Barang</strong> di kanan atas untuk memulai.
                  </td>
                </tr>
              ) : (
                items.map((item, index) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-4 text-center text-slate-400">{index + 1}</td>
                    <td className="py-4 px-4 font-semibold text-emerald-600 cursor-pointer hover:underline">
                      {item.kode}
                    </td>
                    <td className="py-4 px-4 text-slate-700 font-medium">{item.nama}</td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center">
                        <input
                          type="number"
                          min="1"
                          value={item.qty}
                          onChange={(e) => handleQtyChange(item.id, e.target.value)}
                          className="w-16 h-8 text-center border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20"
                        />
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right text-slate-600 font-medium">
                      {formatRupiah(item.harga)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1.5 rounded-md text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}

              {/* Total Row */}
              {items.length > 0 && (
                <tr className="bg-slate-50/30 border-t border-slate-100 text-slate-800 font-bold">
                  <td colSpan="3" className="py-4 px-4 text-right pr-16 text-slate-500 font-semibold">
                    Total Transaksi
                  </td>
                  <td className="py-4 px-4 text-center text-slate-700 text-sm">
                    {totalUnit} Unit
                  </td>
                  <td className="py-4 px-4 text-right text-emerald-600 text-[15px]">
                    {formatRupiah(totalHarga)}
                  </td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* History Links & Cancel/Save Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* History Link */}
        <div>
          <button
            onClick={() => setIsHistoryOpen(true)}
            className="flex items-center gap-1.5 text-emerald-600 hover:text-emerald-700 text-xs font-semibold transition-colors duration-150 cursor-pointer"
          >
            <History className="h-4 w-4" />
            <span>Lihat Riwayat Barang Masuk</span>
          </button>
        </div>

        {/* Action Button Controls */}
        <div className="flex items-center gap-3 justify-end">
          <Button
            variant="outline"
            onClick={handleReset}
            className="border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold h-9 px-4 rounded-lg cursor-pointer"
          >
            Batal
          </Button>

          <Button
            onClick={() => handleSaveTransaction(true)}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs h-9 px-4 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Printer className="h-4 w-4" />
            <span>Simpan & Cetak Label</span>
          </Button>
        </div>
      </div>

      {/* Bottom Summary Cards: Stats & Warehouse Capacity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4">
        {/* Inbound Stats Card (Left) */}
        <div className="lg:col-span-8 bg-emerald-600 text-white rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-1 relative z-10">
            <h3 className="text-lg font-bold text-white tracking-wide">Statistik Inbound Hari Ini</h3>
            <p className="text-emerald-100 text-xs mt-0.5 leading-relaxed max-w-lg">
              Peningkatan aktivitas penerimaan barang sebesar 12% dibanding kemarin.
            </p>
          </div>

          <div className="flex items-center gap-10 mt-8 relative z-10">
            <div className="flex flex-col">
              <span className="text-[10px] text-emerald-100 uppercase tracking-widest font-semibold">Total Item</span>
              <span className="text-2xl font-black mt-1 flex items-baseline gap-1">
                342 <span className="text-xs font-medium text-emerald-100">Unit</span>
              </span>
            </div>

            <div className="h-8 w-px bg-emerald-500"></div>

            <div className="flex flex-col">
              <span className="text-[10px] text-emerald-100 uppercase tracking-widest font-semibold">Truk Tiba</span>
              <span className="text-2xl font-black mt-1 flex items-baseline gap-1">
                8 <span className="text-xs font-medium text-emerald-100">Fleet</span>
              </span>
            </div>
          </div>

          {/* Decorative backdrop shapes */}
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-emerald-500/20 rounded-tl-full pointer-events-none"></div>
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-emerald-500/10 rounded-full pointer-events-none"></div>
        </div>

        {/* Warehouse Capacity Card (Right) */}
        <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
          <div className="p-3 bg-slate-50 text-slate-500 rounded-xl mb-3 shadow-inner">
            <Layers className="h-5 w-5 text-emerald-600" />
          </div>

          <h3 className="text-base font-bold text-slate-800">Kapasitas Gudang</h3>
          <p className="text-slate-400 text-xs mt-0.5 font-medium">Pemanfaatan Rak Saat Ini</p>

          {/* Progress Bar */}
          <div className="w-full mt-5">
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: "72%" }}
              ></div>
            </div>
            <span className="text-xs font-semibold text-slate-600 block mt-2 text-center">72% Terisi</span>
          </div>
        </div>
      </div>

      {/* History Dialog Modal */}
      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="sm:max-w-2xl bg-white p-5 border border-slate-200 rounded-xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-slate-800 text-lg font-bold flex items-center gap-2">
              <History className="h-5 w-5 text-emerald-600" />
              <span>Riwayat Transaksi Barang Masuk</span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {savedTransactions.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                Belum ada riwayat transaksi yang tersimpan. Simpan transaksi di halaman utama untuk melihat riwayat di sini.
              </div>
            ) : (
              <div className="space-y-3.5">
                {savedTransactions.map((tx) => (
                  <div key={tx.id} className="border border-slate-100 rounded-xl p-4 bg-slate-50/50 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-800">{tx.noPo}</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full uppercase">
                          {tx.petugas}
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 font-medium">
                        {tx.tanggalMasuk} | <span className="font-semibold text-slate-700">{tx.supplier}</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Daftar Item:</span>
                      <ul className="text-xs text-slate-600 space-y-1 divide-y divide-slate-100/50">
                        {tx.items.map((item, idx) => (
                          <li key={idx} className="flex justify-between py-1.5 first:pt-0">
                            <span>
                              {item.kode} - <strong className="font-medium text-slate-700">{item.nama}</strong> (x{item.qty})
                            </span>
                            <span className="text-slate-500 font-medium">
                              {formatRupiah(item.harga * item.qty)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100/80 text-xs font-bold">
                      <span className="text-slate-500">Total Unit: {tx.totalUnit} Pcs</span>
                      <span className="text-emerald-700 text-sm">{formatRupiah(tx.totalHarga)}</span>
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
