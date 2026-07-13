import { useMemo, useState } from "react";
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
      return "bg-emerald-500/15 text-emerald-500";
    case "Menipis":
      return "bg-amber-500/15 text-amber-500";
    case "Kritis":
      return "bg-destructive/15 text-destructive";
    default:
      return "bg-slate-500/10 text-slate-600";
  }
}

export default function StokBarang() {
  const [query, setQuery] = useState("");
  const [kategori, setKategori] = useState("");
  const [status, setStatus] = useState("");

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
    <div className="p-6 min-h-screen bg-background">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Stok Barang</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Kelola stok barang, pantau level persediaan, dan lihat status ketersediaan barang secara cepat.
          </p>
        </div>
        <Button size="lg">Tambah Barang</Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[3fr_1fr]">
        <div className="rounded-3xl bg-card p-6 shadow-sm">
          <div className="mb-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,260px)]">
            <Input
              placeholder="Cari berdasarkan kode, nama, atau kategori"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Select value={kategori} onValueChange={setKategori}>
                <SelectTrigger className="w-full" size="default">
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
                <SelectTrigger className="w-full" size="default">
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

          <div className="rounded-3xl border border-border bg-background p-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Kode Barang</TableHead>
                  <TableHead>Nama Barang</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Stok</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((item, index) => (
                  <TableRow key={item.kode}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{item.kode}</TableCell>
                    <TableCell className="max-w-xs truncate">{item.nama}</TableCell>
                    <TableCell>{item.kategori}</TableCell>
                    <TableCell>{item.harga}</TableCell>
                    <TableCell>{item.stok}</TableCell>
                    <TableCell>
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses(item.status)}`}>
                        {item.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Total unit tersedia</p>
                <p className="mt-3 text-4xl font-semibold">{totalUnits.toLocaleString()}</p>
              </div>
              <div className="rounded-3xl bg-emerald-500/10 p-3 text-emerald-500">
                <span className="text-lg font-semibold">+</span>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Tekanan persediaan tetap stabil untuk sebagian besar kategori.
            </p>
          </div>
          <div className="rounded-3xl bg-card p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">Kondisi Barang</p>
            <div className="mt-4 grid gap-3">
              <div className="rounded-2xl bg-slate-950/60 p-4">
                <p className="text-xs text-muted-foreground">Barang Normal</p>
                <p className="mt-2 text-xl font-semibold">3</p>
              </div>
              <div className="rounded-2xl bg-slate-950/60 p-4">
                <p className="text-xs text-muted-foreground">Barang Menipis</p>
                <p className="mt-2 text-xl font-semibold">1</p>
              </div>
              <div className="rounded-2xl bg-slate-950/60 p-4">
                <p className="text-xs text-muted-foreground">Barang Kritis</p>
                <p className="mt-2 text-xl font-semibold">1</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[2fr_1fr]">
        <div className="rounded-3xl bg-card p-6 shadow-sm">
          <h2 className="text-xl font-semibold">Analisis Pergerakan Stok</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Efisiensi operasional gudang meningkat sebesar 14% bulan ini. Pantau item terlaris dan restock item kritis segera.
          </p>
          <Button className="mt-6" variant="secondary">
            Lihat Laporan Lengkap
          </Button>
        </div>
        <div className="rounded-3xl bg-emerald-500/5 p-6 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-emerald-700">Total Unit Tersedia</p>
              <p className="mt-4 text-4xl font-semibold text-emerald-900">2.450</p>
            </div>
            <div className="rounded-3xl bg-emerald-500/20 p-3 text-emerald-900">✓</div>
          </div>
          <p className="mt-4 text-sm text-emerald-700">
            Performa persediaan terjaga, dan musim ini kebutuhan stok diprediksi tetap stabil.
          </p>
        </div>
      </div>
    </div>
  );
}
