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
    <div className="p-6" style={{ minHeight: "100vh", background: "var(--background)" }}>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Laporan</h1>
        <div className="flex items-center gap-2">
          <Input placeholder="Cari kode / nama / kategori" value={query} onChange={(e) => setQuery(e.target.value)} />
          <Button variant="secondary" onClick={() => { /* placeholder - could open filter modal */ }}>Filter</Button>
          <Button onClick={() => { /* generate action, currently noop */ }}>Generate</Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="col-span-1 rounded-lg bg-white/5 p-4">
          <div className="text-sm text-muted-foreground">Total Item</div>
          <div className="text-xl font-bold">{SAMPLE.length}</div>
        </div>
        <div className="col-span-1 rounded-lg bg-white/5 p-4">
          <div className="text-sm text-muted-foreground">Kategori</div>
          <div className="text-xl font-bold">{[...new Set(SAMPLE.map(s=>s.kategori))].length}</div>
        </div>
        <div className="col-span-1 rounded-lg bg-white/5 p-4">
          <div className="text-sm text-muted-foreground">Stok Rendah</div>
          <div className="text-xl font-bold">{SAMPLE.filter(s=>s.stok<=10).length}</div>
        </div>
        <div className="col-span-1 rounded-lg bg-white/5 p-4">
          <div className="text-sm text-muted-foreground">Aksi</div>
          <div className="flex gap-2 mt-2">
            <Button variant="outline" size="sm" onClick={exportCSV}>Export Excel</Button>
            <Button variant="destructive" size="sm" onClick={exportPDF}>Export PDF</Button>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-card p-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Kode Barang</TableHead>
              <TableHead>Nama Barang</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Stok</TableHead>
              <TableHead>Satuan</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r, i) => (
              <TableRow key={r.kode}>
                <TableCell>{i + 1}</TableCell>
                <TableCell>{r.kode}</TableCell>
                <TableCell className="max-w-xs truncate">{r.nama}</TableCell>
                <TableCell>{r.kategori}</TableCell>
                <TableCell>{r.stok}</TableCell>
                <TableCell>{r.satuan}</TableCell>
                <TableCell>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${r.status==="OK"?"bg-green-600/30":""} ${r.status==="LIMIT"?"bg-yellow-600/30":""} ${r.status==="KURANG"?"bg-red-600/30":""}`}>
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
