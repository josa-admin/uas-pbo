import React, { useMemo, useState } from "react";
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

const SAMPLE = [
  { kode: "BRG001", nama: "Mouse Logitech/OPPO", kategori: "Elektronik", stok: 120, satuan: "Unit", status: "OK" },
  { kode: "BRG002", nama: "Keyboard Mekanik RGB", kategori: "Elektronik", stok: 15, satuan: "Unit", status: "LIMIT" },
  { kode: "BRG003", nama: "Monitor Dell 24\"", kategori: "Elektronik", stok: 5, satuan: "Unit", status: "KURANG" },
];

export default function Laporan() {
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    if (!query) return SAMPLE;
    const q = query.toLowerCase();
    return SAMPLE.filter(r => r.kode.toLowerCase().includes(q) || r.nama.toLowerCase().includes(q) || r.kategori.toLowerCase().includes(q));
  }, [query]);

  function exportCSV() {
    const headers = ["Kode Barang", "Nama Barang", "Kategori", "Stok", "Satuan", "Status"];
    const csv = [headers.join(",")]
      .concat(rows.map(r => [r.kode, r.nama, r.kategori, r.stok, r.satuan, r.status].map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "laporan_stok.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportPDF() {
    window.print();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
        <div>
          <div className="text-sm text-slate-500 font-medium">Dashboard &gt; Laporan</div>
          <h1 className="text-2xl font-bold text-slate-800">Laporan Aktivitas Gudang</h1>
        </div>
        <div className="flex items-center gap-2 mt-2 md:mt-0">
          <Input className="w-64 bg-white border-slate-200" placeholder="Cari kode / nama / kategori" value={query} onChange={(e) => setQuery(e.target.value)} />
          <Button variant="outline" className="bg-white border-slate-200 text-slate-700" onClick={() => { /* filter modal placeholder */ }}>Filter</Button>
          <Button onClick={() => { /* generate action placeholder */ }} className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium">Generate</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="text-sm font-medium text-slate-500">Total Item</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{SAMPLE.length}</div>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="text-sm font-medium text-slate-500">Kategori</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{[...new Set(SAMPLE.map(s => s.kategori))].length}</div>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="text-sm font-medium text-slate-500">Stok Rendah</div>
          <div className="text-2xl font-bold text-red-600 mt-1">{SAMPLE.filter(s => s.stok <= 10).length}</div>
        </div>
        <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="text-sm font-medium text-slate-500 mb-2">Aksi Ekspor</div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-slate-200 text-slate-700" onClick={exportCSV}>Excel</Button>
            <Button variant="destructive" size="sm" className="bg-rose-50 hover:bg-rose-100 text-rose-600 border-none shadow-none font-medium" onClick={exportPDF}>PDF</Button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">No</TableHead>
              <TableHead>Kode Barang</TableHead>
              <TableHead>Nama Barang</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead className="text-right">Stok</TableHead>
              <TableHead>Satuan</TableHead>
              <TableHead className="text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r, i) => (
              <TableRow key={r.kode}>
                <TableCell>{i + 1}</TableCell>
                <TableCell className="font-semibold text-slate-700">{r.kode}</TableCell>
                <TableCell className="max-w-xs truncate">{r.nama}</TableCell>
                <TableCell>{r.kategori}</TableCell>
                <TableCell className="text-right font-medium">{r.stok}</TableCell>
                <TableCell>{r.satuan}</TableCell>
                <TableCell className="text-center">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    r.status === "OK" ? "bg-emerald-50 text-emerald-700" :
                    r.status === "LIMIT" ? "bg-amber-50 text-amber-700" :
                    "bg-rose-50 text-rose-700"
                  }`}>
                    {r.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
