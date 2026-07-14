import { useMemo, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import api from "@/api/api";
import ENDPOINTS from "@/api/endpoints";

const normalizeListData = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.results)) return payload.results;
  if (payload && Array.isArray(payload.data)) return payload.data;
  return [];
};

function statusClasses(status) {
  switch (status) {
    case "Normal":
      return "bg-emerald-50 text-emerald-700 font-semibold";
    case "Menipis":
      return "bg-amber-50 text-amber-700 font-semibold";
    case "Kritis":
    case "Habis":
      return "bg-rose-50 text-rose-700 font-semibold";
    default:
      return "bg-slate-50 text-slate-700";
  }
}

function getStatus(remainingQuantity) {
  const quantity = Number(remainingQuantity ?? 0);

  if (quantity === 0) return "Habis";
  if (quantity <= 10) return "Kritis";
  if (quantity <= 20) return "Menipis";
  return "Normal";
}

export default function StokBarang() {
  const location = useLocation();

  const [items, setItems] = useState([]);
  const [query, setQuery] = useState("");
  const [kategori, setKategori] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (location.pathname === "/stok-kritis") {
      setStatus("Kritis");
      setQuery("");
      setKategori("");
    } else {
      setStatus("");
      setKategori("");
    }
  }, [location.pathname]);

  useEffect(() => {
    const loadStockBatches = async () => {
      try {
        setLoading(true);
        const response = await api.get(ENDPOINTS.STOCK_BATCH);
        const data = normalizeListData(response.data);

        const normalizedItems = data.map((item) => ({
          batchNumber: item.batch_number || item.batchNumber || "-",
          productName: item.product_name || item.productName || "-",
          categoryName: item.category_name || item.categoryName || "-",
          supplierName: item.supplier_name || item.supplierName || "-",
          binName: item.bin_name || item.binName || "-",
          remainingQuantity: Number(item.remaining_quantity ?? item.remainingQuantity ?? 0),
          receivedDate: item.received_date || item.receivedDate || "-",
          expiredDate: item.expired_date || item.expiredDate || "-",
          status: getStatus(item.remaining_quantity ?? item.remainingQuantity ?? 0),
        }));

        setItems(normalizedItems);
      } catch (error) {
        console.error("Gagal mengambil data stock batches", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadStockBatches();
  }, []);

  const pageTitle = useMemo(() => {
    if (location.pathname === "/stok-kritis") {
      return "Stok Barang Kritis";
    }
    return "Manajemen Stok Barang";
  }, [location.pathname]);

  const breadcrumb = useMemo(() => {
    if (location.pathname === "/stok-kritis") {
      return "Dashboard > Stok Kritis";
    }
    return "Dashboard > Manajemen Barang";
  }, [location.pathname]);

  const categoryOptions = useMemo(() => {
    const categories = Array.from(new Set(items.map((item) => item.categoryName).filter(Boolean)));
    return ["Semua Kategori", ...categories];
  }, [items]);

  const statusOptions = useMemo(() => {
    const statuses = Array.from(new Set(items.map((item) => item.status).filter(Boolean)));
    return ["Semua Status", ...statuses];
  }, [items]);

  const rows = useMemo(() => {
    return items.filter((item) => {
      const searchableText = [item.batchNumber, item.productName, item.categoryName, item.supplierName]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesQuery = !query || searchableText.includes(query.toLowerCase());
      const matchesKategori = !kategori || kategori === "Semua Kategori" || item.categoryName === kategori;
      const matchesStatus = !status || status === "Semua Status" || item.status === status;

      return matchesQuery && matchesKategori && matchesStatus;
    });
  }, [items, query, kategori, status]);

  const totalUnits = useMemo(() => {
    return items.reduce((sum, item) => sum + item.remainingQuantity, 0);
  }, [items]);

  const summaryStats = useMemo(() => {
    const normalCount = items.filter((item) => item.status === "Normal").length;
    const menipisCount = items.filter((item) => item.status === "Menipis").length;
    const kritisCount = items.filter((item) => item.status === "Kritis" || item.status === "Habis").length;

    return { normalCount, menipisCount, kritisCount };
  }, [items]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <div className="text-sm text-slate-500 font-medium">{breadcrumb}</div>
          <h1 className="text-2xl font-bold text-slate-800">{pageTitle}</h1>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium">Tambah Barang</Button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[3fr_1fr]">
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="mb-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,260px)]">
            <Input
              placeholder="Cari berdasarkan kode, nama, atau kategori..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="bg-white border-slate-200"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Select value={kategori} onValueChange={setKategori}>
                <SelectTrigger className="w-full bg-white border-slate-200" size="default">
                  <SelectValue placeholder="Semua Kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-full bg-white border-slate-200" size="default">
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">No</TableHead>
                  <TableHead>Kode Barang</TableHead>
                  <TableHead>Nama Barang</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="text-right">Stok</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-400">
                      Memuat data...
                    </TableCell>
                  </TableRow>
                ) : rows.length > 0 ? (
                  rows.map((item, index) => (
                    <TableRow key={`${item.batchNumber}-${index}`}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-semibold text-slate-700">{item.batchNumber}</TableCell>
                      <TableCell className="max-w-xs truncate">{item.productName}</TableCell>
                      <TableCell>{item.categoryName}</TableCell>
                      <TableCell>{item.supplierName}</TableCell>
                      <TableCell className="text-right font-medium">{item.remainingQuantity}</TableCell>
                      <TableCell className="text-center">
                        <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusClasses(item.status)}`}>
                          {item.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-400">
                      Tidak ada data stok yang ditemukan.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Total unit tersedia</p>
            <p className="mt-3 text-4xl font-bold text-slate-800">{totalUnits.toLocaleString()}</p>
            <p className="mt-4 text-sm text-slate-400">
              Tekanan persediaan tetap stabil untuk sebagian besar kategori.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Kondisi Barang</p>
            <div className="mt-4 grid gap-3">
              <div className="rounded-lg bg-slate-50 border border-slate-200/60 p-4">
                <p className="text-xs text-slate-500 font-medium">Barang Normal</p>
                <p className="mt-2 text-xl font-bold text-slate-800">{summaryStats.normalCount}</p>
              </div>
              <div className="rounded-lg bg-amber-50/50 border border-amber-100 p-4">
                <p className="text-xs text-amber-700 font-medium">Barang Menipis</p>
                <p className="mt-2 text-xl font-bold text-amber-800">{summaryStats.menipisCount}</p>
              </div>
              <div className="rounded-lg bg-rose-50/50 border border-rose-100 p-4">
                <p className="text-xs text-rose-700 font-medium">Barang Kritis</p>
                <p className="mt-2 text-xl font-bold text-rose-800">{summaryStats.kritisCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-800">Analisis Pergerakan Stok</h2>
          <p className="mt-3 text-sm text-slate-500">
            Efisiensi operasional gudang meningkat sebesar 14% bulan ini. Pantau item terlaris dan restock item kritis segera.
          </p>
          <Button className="mt-6 border-slate-200 text-slate-700" variant="outline">
            Lihat Laporan Lengkap
          </Button>
        </div>
        <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-6 shadow-sm">
          <p className="text-xs uppercase tracking-wider text-emerald-800 font-semibold">Total Unit Tersedia</p>
          <p className="mt-4 text-4xl font-bold text-emerald-800">{totalUnits.toLocaleString()}</p>
          <p className="mt-4 text-sm text-emerald-700">
            Performa persediaan terjaga, dan musim ini kebutuhan stok diprediksi tetap stabil.
          </p>
        </div>
      </div>
    </div>
  );
}
