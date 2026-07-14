import { useEffect, useState } from "react";
import {
  Package,
  Plus,
  Trash2,
  History,
  Save,
  Check,
  X,
  Layers,
  Printer,
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

const getDisplayName = (item, fallback) => {
  if (!item) return fallback;
  return item.name || item.supplier_name || item.product_name || item.bin_name || item.label || fallback;
};

export default function BarangMasuk() {
  const [supplier, setSupplier] = useState("");
  const [tanggalMasuk, setTanggalMasuk] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [notes, setNotes] = useState("");

  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [bins, setBins] = useState([]);

  const [items, setItems] = useState([]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedBin, setSelectedBin] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [expiredDate, setExpiredDate] = useState("");

  const [savedTransactions, setSavedTransactions] = useState([]);

  useEffect(() => {
    fetchMasterData();
  }, []);

  useEffect(() => {
    if (!toast.show) return undefined;

    const timer = window.setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 4000);

    return () => window.clearTimeout(timer);
  }, [toast.show]);

  const fetchMasterData = async () => {
    try {
      setLoading(true);

      const [supplierRes, productRes, binRes] = await Promise.all([
        api.get(ENDPOINTS.SUPPLIER),
        api.get(ENDPOINTS.PRODUCT),
        api.get(ENDPOINTS.BIN),
      ]);

      setSuppliers(normalizeListData(supplierRes.data));
      setProducts(normalizeListData(productRes.data));
      setBins(normalizeListData(binRes.data));
    } catch (err) {
      console.error(err);
      showToastMsg("Gagal mengambil master data", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToastMsg = (message, type = "success") => {
    setToast({ show: true, message, type });
  };

  const handleQtyChange = (id, value) => {
    const qty = Number(value);

    if (qty < 1) return;

    setItems(
      items.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: qty,
            }
          : item
      )
    );
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
    showToastMsg("Barang berhasil dihapus", "info");
  };

  const handleReset = () => {
    setSupplier("");
    setTanggalMasuk(new Date().toISOString().split("T")[0]);
    setNotes("");
    setItems([]);
  };

  const handleAddItem = (e) => {
    e.preventDefault();

    if (!selectedProduct || !selectedBin || !quantity || !expiredDate) {
      alert("Lengkapi data.");
      return;
    }

    const product = products.find((p) => String(p.id) === String(selectedProduct));
    const bin = bins.find((b) => String(b.id) === String(selectedBin));

    if (!product || !bin) {
      alert("Data produk atau bin tidak valid.");
      return;
    }

    const newItem = {
      id: Date.now(),
      product: product.id,
      product_name: getDisplayName(product, "Produk"),
      bin: bin.id,
      bin_name: getDisplayName(bin, "Bin"),
      quantity: Number(quantity),
      expired_date: expiredDate,
    };

    setItems([...items, newItem]);
    setSelectedProduct("");
    setSelectedBin("");
    setQuantity(1);
    setExpiredDate("");
    setIsAddOpen(false);

    showToastMsg("Barang berhasil ditambahkan");
  };

  const handleSaveTransaction = async () => {
    if (!supplier) {
      alert("Supplier wajib dipilih.");
      return;
    }

    if (items.length === 0) {
      alert("Minimal ada satu barang.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        supplier: Number(supplier),
        received_date: tanggalMasuk,
        notes,
        items: items.map((item) => ({
          product: item.product,
          bin: item.bin,
          quantity: item.quantity,
          expired_date: item.expired_date,
        })),
      };

      const { data } = await api.post(ENDPOINTS.INBOUND, payload);

      const newTransaction = {
        id: data?.id || Date.now(),
        inbound_number: data?.inbound_number || "-",
        supplier: supplier,
        received_date: tanggalMasuk,
        notes,
        items,
      };

      setSavedTransactions([newTransaction, ...savedTransactions]);
      showToastMsg(`Inbound ${data?.inbound_number || "baru"} berhasil disimpan.`);
      handleReset();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Gagal menyimpan transaksi.");
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (value) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const totalUnit = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalHarga = 0;

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
          <X className="h-4 w-4 rotate-45" />
          <span>Kembali ke Daftar</span>
        </button>

        <Button
          onClick={handleSaveTransaction}
          className="bg-emerald-700 hover:bg-emerald-800 text-white font-medium shadow-sm rounded-lg flex items-center gap-1.5 h-9 px-4 cursor-pointer"
          disabled={loading}
        >
          <Save className="h-4 w-4" />
          <span>{loading ? "Menyimpan..." : "Simpan Barang Masuk"}</span>
        </Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_0.8fr]">
        <div className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 text-emerald-700 mb-1">
                <Package className="h-5 w-5" />
                <h2 className="text-lg font-semibold text-slate-900">Form Barang Masuk</h2>
              </div>
              <p className="text-sm text-slate-500">Catat penerimaan barang dari supplier dan atur lokasi penyimpanan.</p>
            </div>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-lg">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Barang
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                  <DialogTitle>Tambah Barang</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleAddItem} className="space-y-4 py-2">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Produk</Label>
                      <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih produk" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={String(product.id)}>
                              {getDisplayName(product, `Produk ${product.id}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Bin</Label>
                      <Select value={selectedBin} onValueChange={setSelectedBin}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih bin" />
                        </SelectTrigger>
                        <SelectContent>
                          {bins.map((bin) => (
                            <SelectItem key={bin.id} value={String(bin.id)}>
                              {getDisplayName(bin, `Bin ${bin.id}`)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Jumlah</Label>
                      <Input type="number" min="1" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label>Tanggal Kadaluarsa</Label>
                      <Input type="date" value={expiredDate} onChange={(e) => setExpiredDate(e.target.value)} />
                    </div>
                  </div>
                  <DialogFooter className="pt-2">
                    <DialogClose asChild>
                      <Button type="button" variant="outline">
                        Batal
                      </Button>
                    </DialogClose>
                    <Button type="submit" className="bg-emerald-700 hover:bg-emerald-800 text-white">
                      Tambahkan
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Supplier</Label>
              <Select value={supplier} onValueChange={setSupplier}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map((item) => (
                    <SelectItem key={item.id} value={String(item.id)}>
                      {getDisplayName(item, `Supplier ${item.id}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Tanggal Masuk</Label>
              <Input type="date" value={tanggalMasuk} onChange={(e) => setTanggalMasuk(e.target.value)} />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Label>Notes</Label>
            <textarea
              className="flex min-h-[104px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="Tambahkan catatan penerimaan"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-slate-700">
                <Layers className="h-4 w-4" />
                <span className="text-sm font-semibold">Daftar Barang</span>
              </div>
              <span className="text-sm text-slate-500">{items.length} item</span>
            </div>

            <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produk</TableHead>
                    <TableHead>Bin</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead>Tanggal Kadaluarsa</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-6 text-center text-sm text-slate-500">
                        Belum ada barang ditambahkan.
                      </TableCell>
                    </TableRow>
                  ) : (
                    items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium text-slate-900">{item.product_name}</TableCell>
                        <TableCell>{item.bin_name}</TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            min="1"
                            className="h-8 w-20 ml-auto"
                            value={item.quantity}
                            onChange={(e) => handleQtyChange(item.id, e.target.value)}
                          />
                        </TableCell>
                        <TableCell>{item.expired_date}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteItem(item.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-sm">
            <div className="flex items-center gap-2 text-slate-800 mb-4">
              <Printer className="h-5 w-5" />
              <h3 className="font-semibold">Ringkasan</h3>
            </div>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Total Unit</span>
                <span className="font-semibold text-slate-900">{totalUnit}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total Harga</span>
                <span className="font-semibold text-slate-900">{formatRupiah(totalHarga)}</span>
              </div>
            </div>
            <Button onClick={handleSaveTransaction} className="w-full mt-6 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg" disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              {loading ? "Menyimpan..." : "Simpan Transaksi"}
            </Button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200/70 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-slate-800">
                <History className="h-5 w-5" />
                <h3 className="font-semibold">Riwayat</h3>
              </div>
              <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-lg">
                    Lihat
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[640px]">
                  <DialogHeader>
                    <DialogTitle>Riwayat Barang Masuk</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3 py-2">
                    {savedTransactions.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-slate-200 p-4 text-sm text-slate-500">
                        Tidak ada transaksi tersimpan.
                      </div>
                    ) : (
                      savedTransactions.map((transaction) => (
                        <div key={transaction.id} className="rounded-lg border border-slate-200 p-3 text-sm">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-900">{transaction.inbound_number}</span>
                            <span className="text-slate-500">{transaction.received_date}</span>
                          </div>
                          <p className="mt-1 text-slate-600">Supplier: {transaction.supplier}</p>
                          <p className="text-slate-600">Item: {transaction.items?.length || 0}</p>
                        </div>
                      ))
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              Transaksi yang berhasil disimpan akan muncul di sini.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}