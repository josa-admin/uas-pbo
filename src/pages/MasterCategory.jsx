import { useEffect, useState } from "react";

import {
  FolderTree,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

import api from "@/api/api";
import ENDPOINTS from "@/api/endpoints";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function MasterCategory() {

  /* ==========================
          STATE
  ========================== */

  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);

  const [openAdd, setOpenAdd] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);

  const [selectedCategory, setSelectedCategory] =
    useState(null);

  const [name, setName] = useState("");

  /* ==========================
        LOAD DATA
  ========================== */

  useEffect(() => {

    fetchCategory();

  }, []);

  const fetchCategory = async () => {

    try {

      setLoading(true);

      const { data } =
        await api.get(
          ENDPOINTS.CATEGORY
        );

      setCategories(data);

    } catch (err) {

      console.error(err);

      alert("Gagal mengambil data category.");

    } finally {

      setLoading(false);

    }

  };

  /* ==========================
        RESET FORM
  ========================== */

  const resetForm = () => {

    setName("");

    setSelectedCategory(null);

  };

  /* ==========================
        OPEN ADD
  ========================== */

  const handleOpenAdd = () => {

    resetForm();

    setOpenAdd(true);

  };

  /* ==========================
        OPEN EDIT
  ========================== */

  const handleOpenEdit = (category) => {

    setSelectedCategory(category);

    setName(category.name);

    setOpenEdit(true);

  };

  /* ==========================
        OPEN DELETE
  ========================== */

  const handleOpenDelete = (category) => {

    setSelectedCategory(category);

    setOpenDelete(true);

  };

  /* ==========================
        CREATE CATEGORY
  ========================== */

  const handleCreate = async () => {

    if (!name.trim()) {

      alert("Nama Category wajib diisi.");

      return;

    }

    try {

      await api.post(

        ENDPOINTS.CATEGORY,

        {
          name,
        }

      );

      setOpenAdd(false);

      fetchCategory();

    } catch (err) {

      console.error(err);

      alert(

        err.response?.data?.message ||

        "Gagal menambah category."

      );

    }

  };

  /* ==========================
        UPDATE CATEGORY
  ========================== */

  const handleUpdate = async () => {

    if (!selectedCategory) return;

    try {

      await api.put(

        ENDPOINTS.CATEGORY_DETAIL(
          selectedCategory.id
        ),

        {
          name,
        }

      );

      setOpenEdit(false);

      fetchCategory();

    } catch (err) {

      console.error(err);

      alert(

        err.response?.data?.message ||

        "Gagal mengubah category."

      );

    }

  };
    /* ==========================
        DELETE CATEGORY
  ========================== */

  const handleDelete = async () => {

    if (!selectedCategory) return;

    try {

      await api.delete(

        ENDPOINTS.CATEGORY_DETAIL(
          selectedCategory.id
        )

      );

      setOpenDelete(false);

      fetchCategory();

    } catch (err) {

      console.error(err);

      alert(

        err.response?.data?.message ||

        "Gagal menghapus category."

      );

    }

  };

  /* ==========================
            RETURN
  ========================== */

  return (

    <div className="space-y-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500">

            Dashboard &gt; Master Category

          </p>

          <h1 className="text-2xl font-bold text-slate-800">

            Master Category

          </h1>

        </div>

        <Button
          onClick={handleOpenAdd}
          className="bg-emerald-600 hover:bg-emerald-500"
        >

          <Plus className="mr-2 h-4 w-4"/>

          Tambah Category

        </Button>

      </div>

      {/* Table */}

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

        <Table>

          <TableHeader>

            <TableRow>

              <TableHead>No</TableHead>

              <TableHead>Nama Category</TableHead>

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
                    colSpan={3}
                    className="text-center py-10"
                  >

                    Loading...

                  </TableCell>

                </TableRow>

              )

              :

              categories.map((category,index)=>(

                <TableRow
                  key={category.id}
                >

                  <TableCell>

                    {index+1}

                  </TableCell>

                  <TableCell>

                    {category.name}

                  </TableCell>

                  <TableCell className="text-center">

                    <div className="flex justify-center gap-2">

                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          handleOpenEdit(category)
                        }
                      >

                        <Pencil className="h-4 w-4"/>

                      </Button>

                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() =>
                          handleOpenDelete(category)
                        }
                      >

                        <Trash2 className="h-4 w-4"/>

                      </Button>

                    </div>

                  </TableCell>

                </TableRow>

              ))

            }

          </TableBody>

        </Table>

      </div>

      {/* ==========================
            ADD CATEGORY
      ========================== */}

      <Dialog
        open={openAdd}
        onOpenChange={setOpenAdd}
      >

        <DialogContent>

          <DialogHeader>

            <DialogTitle>

              Tambah Category

            </DialogTitle>

          </DialogHeader>

          <div>

            <Label>

              Nama Category

            </Label>

            <Input
              value={name}
              onChange={(e)=>
                setName(e.target.value)
              }
              placeholder="Masukkan nama category"
            />

          </div>

          <DialogFooter>

            <Button
              variant="outline"
              onClick={() =>
                setOpenAdd(false)
              }
            >

              Batal

            </Button>

            <Button
              onClick={handleCreate}
            >

              Simpan

            </Button>

          </DialogFooter>

        </DialogContent>

      </Dialog>
            {/* ==========================
            EDIT CATEGORY
      ========================== */}

      <Dialog
        open={openEdit}
        onOpenChange={setOpenEdit}
      >

        <DialogContent>

          <DialogHeader>

            <DialogTitle>

              Edit Category

            </DialogTitle>

          </DialogHeader>

          <div>

            <Label>

              Nama Category

            </Label>

            <Input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Masukkan nama category"
            />

          </div>

          <DialogFooter>

            <Button
              variant="outline"
              onClick={() =>
                setOpenEdit(false)
              }
            >

              Batal

            </Button>

            <Button
              className="bg-emerald-600 hover:bg-emerald-500"
              onClick={handleUpdate}
            >

              Update

            </Button>

          </DialogFooter>

        </DialogContent>

      </Dialog>

      {/* ==========================
            DELETE CATEGORY
      ========================== */}

      <Dialog
        open={openDelete}
        onOpenChange={setOpenDelete}
      >

        <DialogContent>

          <DialogHeader>

            <DialogTitle>

              Hapus Category

            </DialogTitle>

          </DialogHeader>

          <div className="py-2">

            <p className="text-slate-600">

              Apakah yakin ingin menghapus category

              <span className="font-semibold">

                {" "}

                {selectedCategory?.name}

              </span>

              ?

            </p>

          </div>

          <DialogFooter>

            <Button
              variant="outline"
              onClick={() =>
                setOpenDelete(false)
              }
            >

              Batal

            </Button>

            <Button
              variant="destructive"
              onClick={handleDelete}
            >

              Hapus

            </Button>

          </DialogFooter>

        </DialogContent>

      </Dialog>

    </div>

  );

}