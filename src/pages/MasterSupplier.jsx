import { useEffect, useState } from "react";

import {
  Truck,
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

export default function MasterSupplier() {

  /* ==========================
          STATE
  ========================== */

  const [suppliers, setSuppliers] = useState([]);

  const [loading, setLoading] = useState(false);

  const [openAdd, setOpenAdd] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);

  const [selectedSupplier, setSelectedSupplier] =
    useState(null);

  /* ==========================
          FORM
  ========================== */

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");

  const [address, setAddress] = useState("");

  /* ==========================
          LOAD DATA
  ========================== */

  useEffect(() => {

    fetchSupplier();

  }, []);

  const fetchSupplier = async () => {

    try {

      setLoading(true);

      const { data } = await api.get(
        ENDPOINTS.SUPPLIER
      );

      setSuppliers(data);

    } catch (err) {

      console.error(err);

      alert("Gagal mengambil data supplier.");

    } finally {

      setLoading(false);

    }

  };

  /* ==========================
          RESET FORM
  ========================== */

  const resetForm = () => {

    setName("");

    setEmail("");

    setPhone("");

    setAddress("");

    setSelectedSupplier(null);

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

  const handleOpenEdit = (supplier) => {

    setSelectedSupplier(supplier);

    setName(supplier.name);

    setEmail(supplier.email);

    setPhone(supplier.phone);

    setAddress(supplier.address);

    setOpenEdit(true);

  };

  /* ==========================
          OPEN DELETE
  ========================== */

  const handleOpenDelete = (supplier) => {

    setSelectedSupplier(supplier);

    setOpenDelete(true);

  };

  /* ==========================
        CREATE SUPPLIER
  ========================== */

  const handleCreate = async () => {

    if (
      !name ||
      !email ||
      !phone ||
      !address
    ) {

      alert("Semua field wajib diisi.");

      return;

    }

    try {

      await api.post(

        ENDPOINTS.SUPPLIER,

        {
          name,
          email,
          phone,
          address,
        }

      );

      setOpenAdd(false);

      fetchSupplier();

    } catch (err) {

      console.error(err);

      alert(

        err.response?.data?.message ||

        "Gagal menambah supplier."

      );

    }

  };

  /* ==========================
        UPDATE SUPPLIER
  ========================== */

  const handleUpdate = async () => {

    if (!selectedSupplier) return;

    try {

      await api.put(

        ENDPOINTS.SUPPLIER_DETAIL(
          selectedSupplier.id
        ),

        {
          name,
          email,
          phone,
          address,
        }

      );

      setOpenEdit(false);

      fetchSupplier();

    } catch (err) {

      console.error(err);

      alert(

        err.response?.data?.message ||

        "Gagal mengubah supplier."

      );

    }

  };
    /* ==========================
        DELETE SUPPLIER
  ========================== */

  const handleDelete = async () => {

    if (!selectedSupplier) return;

    try {

      await api.delete(

        ENDPOINTS.SUPPLIER_DETAIL(
          selectedSupplier.id
        )

      );

      setOpenDelete(false);

      fetchSupplier();

    } catch (err) {

      console.error(err);

      alert(

        err.response?.data?.message ||

        "Gagal menghapus supplier."

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

            Dashboard &gt; Master Supplier

          </p>

          <h1 className="text-2xl font-bold text-slate-800">

            Master Supplier

          </h1>

        </div>

        <Button
          onClick={handleOpenAdd}
          className="bg-emerald-600 hover:bg-emerald-500"
        >

          <Plus className="mr-2 h-4 w-4"/>

          Tambah Supplier

        </Button>

      </div>

      {/* Table */}

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

        <Table>

          <TableHeader>

            <TableRow>

              <TableHead>No</TableHead>

              <TableHead>Nama Supplier</TableHead>

              <TableHead>Email</TableHead>

              <TableHead>Telepon</TableHead>

              <TableHead>Alamat</TableHead>

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
                    colSpan={6}
                    className="text-center py-10"
                  >

                    Loading...

                  </TableCell>

                </TableRow>

              )

              :

              suppliers.map((supplier,index)=>(

                <TableRow
                  key={supplier.id}
                >

                  <TableCell>

                    {index+1}

                  </TableCell>

                  <TableCell>

                    {supplier.name}

                  </TableCell>

                  <TableCell>

                    {supplier.email}

                  </TableCell>

                  <TableCell>

                    {supplier.phone}

                  </TableCell>

                  <TableCell>

                    {supplier.address}

                  </TableCell>

                  <TableCell className="text-center">

                    <div className="flex justify-center gap-2">

                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          handleOpenEdit(supplier)
                        }
                      >

                        <Pencil className="h-4 w-4"/>

                      </Button>

                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() =>
                          handleOpenDelete(supplier)
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
            ADD SUPPLIER
      ========================== */}

      <Dialog
        open={openAdd}
        onOpenChange={setOpenAdd}
      >

        <DialogContent>

          <DialogHeader>

            <DialogTitle>

              Tambah Supplier

            </DialogTitle>

          </DialogHeader>

          <div className="space-y-4">

            <div>

              <Label>Nama Supplier</Label>

              <Input
                value={name}
                onChange={(e)=>
                  setName(e.target.value)
                }
              />

            </div>

            <div>

              <Label>Email</Label>

              <Input
                type="email"
                value={email}
                onChange={(e)=>
                  setEmail(e.target.value)
                }
              />

            </div>

            <div>

              <Label>Nomor Telepon</Label>

              <Input
                value={phone}
                onChange={(e)=>
                  setPhone(e.target.value)
                }
              />

            </div>

            <div>

              <Label>Alamat</Label>

              <Input
                value={address}
                onChange={(e)=>
                  setAddress(e.target.value)
                }
              />

            </div>

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
            EDIT SUPPLIER
      ========================== */}

      <Dialog
        open={openEdit}
        onOpenChange={setOpenEdit}
      >

        <DialogContent>

          <DialogHeader>

            <DialogTitle>

              Edit Supplier

            </DialogTitle>

          </DialogHeader>

          <div className="space-y-4">

            <div>

              <Label>Nama Supplier</Label>

              <Input
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />

            </div>

            <div>

              <Label>Email</Label>

              <Input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

            </div>

            <div>

              <Label>Nomor Telepon</Label>

              <Input
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
              />

            </div>

            <div>

              <Label>Alamat</Label>

              <Input
                value={address}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
              />

            </div>

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
            DELETE SUPPLIER
      ========================== */}

      <Dialog
        open={openDelete}
        onOpenChange={setOpenDelete}
      >

        <DialogContent>

          <DialogHeader>

            <DialogTitle>

              Hapus Supplier

            </DialogTitle>

          </DialogHeader>

          <div className="py-2">

            <p className="text-slate-600">

              Apakah yakin ingin menghapus supplier

              <span className="font-semibold">

                {" "}

                {selectedSupplier?.name}

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