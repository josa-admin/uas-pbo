import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Warehouse,
} from "lucide-react";

import api from "@/api/api";
import ENDPOINTS from "@/api/endpoints";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function MasterBin() {

  const [bins, setBins] = useState([]);

  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);

  const [editMode, setEditMode] = useState(false);

  const [selectedId, setSelectedId] = useState(null);

  const [form, setForm] = useState({
    code: "",
    name: "",
    description: "",
    is_active: true,

  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {

      setLoading(true);

      const { data } = await api.get(
        ENDPOINTS.BIN
      );

      setBins(data);

    } catch (err) {

      console.error(err);

      alert("Gagal mengambil data bin.");

    } finally {

      setLoading(false);

    }
  }

  function handleAdd() {

    setEditMode(false);

    setSelectedId(null);

    setForm({
        code: "",
        name: "",
        description: "",
        is_active: true,
    });

    setOpen(true);
  }

  function handleEdit(item) {

    setEditMode(true);

    setSelectedId(item.id);

    setForm({
      code: item.code,
      name: item.name,
      description: item.description,
      is_active: item.is_active,
    });

    setOpen(true);
  }
    async function handleSubmit(e) {

    e.preventDefault();

    if (!form.name.trim()) {
      alert("Nama Bin wajib diisi.");
      return;
    }

    if (!form.location.trim()) {
      alert("Lokasi wajib diisi.");
      return;
    }

    try {

      if (editMode) {

        await api.put(
          ENDPOINTS.BIN_DETAIL(selectedId),
          {
            code: form.code,
            name: form.name,
            description: form.description,
            is_active: form.is_active,
          }
        );

      } else {

        await api.post(
          ENDPOINTS.BIN,
          {
            code: form.code,
            name: form.name,
            description: form.description,
            is_active: form.is_active,
          }
        );

      }

      setOpen(false);

      fetchData();

    } catch (err) {

      console.error(err);

      alert("Gagal menyimpan data.");

    }

  }

  async function handleDelete(id) {

    const confirmDelete = window.confirm(
      "Yakin ingin menghapus Bin ini?"
    );

    if (!confirmDelete) return;

    try {

      await api.delete(
        ENDPOINTS.BIN_DETAIL(id)
      );

      fetchData();

    } catch (err) {

      console.error(err);

      alert("Gagal menghapus data.");

    }

  }

  return (

    <div className="space-y-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500">
            Dashboard &gt; Master Bin
          </p>

          <h1 className="text-5xl font-bold text-slate-900 mt-2">
            Master Bin
          </h1>

          <p className="text-slate-500 mt-2">
            Kelola lokasi penyimpanan barang di gudang.
          </p>

        </div>

        <Button
          onClick={handleAdd}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Bin
        </Button>

      </div>
            {/* Table */}

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">

        <Table>

          <TableHeader>

            <TableRow>

              <TableHead className="w-20">No</TableHead>

              <TableHead>Nama Bin</TableHead>

              <TableHead>Lokasi</TableHead>

              <TableHead className="text-center">
                Aksi
              </TableHead>

            </TableRow>

          </TableHeader>

          <TableBody>

            {

              loading ?

              (

                <TableRow>

                  <TableCell
                    colSpan={4}
                    className="text-center py-10"
                  >

                    Loading...

                  </TableCell>

                </TableRow>

              )

              :

              bins.length === 0 ?

              (

                <TableRow>

                  <TableCell
                    colSpan={4}
                    className="text-center py-10 text-slate-500"
                  >

                    Belum ada data Bin.

                  </TableCell>

                </TableRow>

              )

              :

              bins.map((item,index)=>(

                <TableRow key={item.id}>

                  <TableCell>

                    {index+1}

                  </TableCell>

                  <TableCell className="font-medium">

                    {item.name}

                  </TableCell>

                  <TableCell>

                    {item.location}

                  </TableCell>

                  <TableCell>

                    <div className="flex justify-center gap-2">

                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          handleEdit(item)
                        }
                      >

                        <Pencil className="w-4 h-4"/>

                      </Button>

                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() =>
                          handleDelete(item.id)
                        }
                      >

                        <Trash2 className="w-4 h-4"/>

                      </Button>

                    </div>

                  </TableCell>

                </TableRow>

              ))

            }

          </TableBody>

        </Table>

      </div>

      {/* Dialog */}

      <Dialog
        open={open}
        onOpenChange={setOpen}
      >

        <DialogContent className="sm:max-w-md">

          <DialogHeader>

            <DialogTitle>

              {

                editMode

                ?

                "Edit Bin"

                :

                "Tambah Bin"

              }

            </DialogTitle>

          </DialogHeader>

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >

            <div>

              <label className="text-sm font-medium">

                Kode bin

              </label>

              <Input
                value={form.name}
                onChange={(e)=>
                  setForm({
                    ...form,
                    name:e.target.value,
                  })
                }
                placeholder="Contoh : A001"
              />

            </div>

            <div>

              <label className="text-sm font-medium">

                Nama Bin

              </label>

              <Input
                value={form.name}
                onChange={(e)=>
                  setForm({
                    ...form,
                    location:e.target.value,
                  })
                }
                placeholder="Contoh : Rack A1"
              />

            </div>
            
            <div>

              <label className="text-sm font-medium">
                Deskripsi

              </label>

              <Input
                value={form.description}
                onChange={(e)=>
                  setForm({
                    ...form,
                    location:e.target.value,
                  })
                }
                placeholder="Masukkan deskripsi bin..."
                className="w-full rounded-md border border-slate-300 p-3 text-sm outline-none focus:border-emerald-500 resize-none"
                rows={4}
              />

            </div>

                  {/* Status */}

            <div className="flex items-center gap-3">

                <input
                    id="status"
                    type="checkbox"
                    checked={form.is_active}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            is_active: e.target.checked,
                        })
                    }
                    className="h-4 w-4 accent-emerald-600"
                />

                <label
                    htmlFor="status"
                    className="text-sm font-medium"
                >
                    Bin Aktif
                </label>

            </div>

            <div className="flex justify-end gap-2 pt-4">

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setOpen(false)
                }
              >

                Batal

              </Button>

              <Button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700"
              >

                {

                  editMode

                  ?

                  "Update"

                  :

                  "Simpan"

                }

              </Button>

            </div>

          </form>

        </DialogContent>

      </Dialog>

    </div>

  );

}