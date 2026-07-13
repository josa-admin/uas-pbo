import { useMemo, useState, useEffect, useRef } from "react";
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

const SAMPLE_ROWS = [
  {
    kode: "BRG-001",
    nama: "Kopi Bubuk",
    kategori: "Minuman",
    satuan: "Bungkus",
    harga: "Rp 12.000,00",
    stok: 12,
    status: "Normal",
  },
  {
    kode: "BRG-002",
    nama: "Teh Celup",
    kategori: "Minuman",
    satuan: "Kotak",
    harga: "Rp 9.000,00",
    stok: 5,
    status: "Menipis",
  },
  {
    kode: "BRG-003",
    nama: "Susu Kental Manis",
    kategori: "Minuman",
    satuan: "Kaleng",
    harga: "Rp 14.000,00",
    stok: 2,
    status: "Kritis",
  },
  {
    kode: "BRG-004",
    nama: "Kecap Manis",
    kategori: "Bumbu Dapur",
    satuan: "Botol",
    harga: "Rp 18.000,00",
    stok: 45,
    status: "Normal",
  },
  {
    kode: "BRG-005",
    nama: "Garam Dapur",
    kategori: "Bumbu Dapur",
    satuan: "Bungkus",
    harga: "Rp 4.000,00",
    stok: 24,
    status: "Normal",
  },
];

const CATEGORY_OPTIONS = ["Semua Kategori", "Minuman", "Bumbu Dapur"];
const STATUS_OPTIONS = ["Semua Status", "Normal", "Menipis", "Kritis"];

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

export default function StokBarang() {
  const location = useLocation();
  const searchInputRef = useRef(null);

  const [query, setQuery] = useState("");
  const [kategori, setKategori] = useState("");
  const [status, setStatus] = useState("");

  // Set default status filter and focus search input depending on route pathname
  useEffect(() => {
    if (location.pathname === "/stok-kritis") {
      setStatus("Kritis");
      setQuery("");
      setKategori("");
    } else if (location.pathname === "/pencarian-barang") {
      setStatus("");
      setKategori("");
      // Delay slightly to ensure browser focus handles successfully
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 50);
    } else {
      setStatus("");
      setKategori("");
    }
  }, [location.pathname]);

  const pageTitle = useMemo(() => {
    if (location.pathname === "/stok-kritis") {
      return "Stok Barang Kritis";
    }
    if (location.pathname === "/pencarian-barang") {
      return "Pencarian Barang";
    }
    return "Manajemen Stok Barang";
  }, [location.pathname]);

  const breadcrumb = useMemo(() => {
    if (location.pathname === "/stok-kritis") {
      return "Dashboard > Stok Kritis";
    }
    if (location.pathname === "/pencarian-barang") {
      return "Dashboard > Pencarian Barang";
    }
    return "Dashboard > Manajemen Barang";
  }, [location.pathname]);

  const rows = useMemo(() => {
    return SAMPLE_ROWS.filter((item) => {
      const matchesQuery =
        !query ||
        item.kode.toLowerCase().includes(query.toLowerCase()) ||
        item.nama.toLowerCase().includes(query.toLowerCase()) ||
        item.kategori.toLowerCase().includes(query.toLowerCase());

      const matchesKategori = !kategori || kategori === "Semua Kategori" || item.kategori === kategori;
      const matchesStatus = !status || status === "Semua Status" || item.status === status;

      return matchesQuery && matchesKategori && matchesStatus;
    });
  }, [query, kategori, status]);

  const totalUnits = SAMPLE_ROWS.reduce((sum, item) => sum + item.stok, 0);

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
              ref={searchInputRef}
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
                  {CATEGORY_OPTIONS.map((item) => (
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
                  {STATUS_OPTIONS.map((item) => (
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
                  <TableHead>Harga</TableHead>
                  <TableHead className="text-right">Stok</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((item, index) => (
                  <TableRow key={item.kode}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell className="font-semibold text-slate-700">{item.kode}</TableCell>
                    <TableCell className="max-w-xs truncate">{item.nama}</TableCell>
                    <TableCell>{item.kategori}</TableCell>
                    <TableCell>{item.harga}</TableCell>
                    <TableCell className="text-right font-medium">{item.stok}</TableCell>
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
                <p className="mt-2 text-xl font-bold text-slate-800">3</p>
              </div>
              <div className="rounded-lg bg-amber-50/50 border border-amber-100 p-4">
                <p className="text-xs text-amber-700 font-medium">Barang Menipis</p>
                <p className="mt-2 text-xl font-bold text-amber-800">1</p>
              </div>
              <div className="rounded-lg bg-rose-50/50 border border-rose-100 p-4">
                <p className="text-xs text-rose-700 font-medium">Barang Kritis</p>
                <p className="mt-2 text-xl font-bold text-rose-800">1</p>
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
          <p className="mt-4 text-4xl font-bold text-emerald-800">2.450</p>
          <p className="mt-4 text-sm text-emerald-700">
            Performa persediaan terjaga, dan musim ini kebutuhan stok diprediksi tetap stabil.
          </p>
        </div>
      </div>
    </div>
  );
}
