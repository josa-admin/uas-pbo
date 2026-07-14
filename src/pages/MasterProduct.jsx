import { useEffect, useState } from "react";
import {
  Package,
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MasterProduct() {

  /* =====================================
              DATA
  ====================================== */

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  /* =====================================
              LOADING
  ====================================== */

  const [loading, setLoading] = useState(false);

  /* =====================================
              DIALOG
  ====================================== */

  const [openAdd, setOpenAdd] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);

  const [openDelete, setOpenDelete] = useState(false);

  /* =====================================
              SELECTED
  ====================================== */

  const [selectedProduct, setSelectedProduct] =
    useState(null);

  /* =====================================
              FORM
  ====================================== */

  const [name, setName] = useState("");

  const [description, setDescription] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [supplier, setSupplier] =
    useState("");

  /* =====================================
          LOAD DATA
  ====================================== */

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {

    try {

      setLoading(true);

      const [

        productRes,

        categoryRes,

        supplierRes,

      ] = await Promise.all([

        api.get(ENDPOINTS.PRODUCT),

        api.get(ENDPOINTS.CATEGORY),

        api.get(ENDPOINTS.SUPPLIER),

      ]);

      setProducts(productRes.data);

      setCategories(categoryRes.data);

      setSuppliers(supplierRes.data);

    } catch (err) {

      console.error(err);

      alert("Gagal mengambil data.");

    } finally {

      setLoading(false);

    }

  };

  /* =====================================
          RESET FORM
  ====================================== */

  const resetForm = () => {

    setName("");

    setDescription("");

    setCategory("");

    setSupplier("");

    setSelectedProduct(null);

  };

  /* =====================================
          OPEN ADD
  ====================================== */

  const handleOpenAdd = () => {

    resetForm();

    setOpenAdd(true);

  };

  /* =====================================
          OPEN EDIT
  ====================================== */

  const handleOpenEdit = (product) => {

    setSelectedProduct(product);

    setName(product.name);

    setDescription(
      product.description || ""
    );

    setCategory(
      String(product.category)
    );

    setSupplier(
      String(product.supplier)
    );

    setOpenEdit(true);

  };

  /* =====================================
          OPEN DELETE
  ====================================== */

  const handleOpenDelete = (product) => {

    setSelectedProduct(product);

    setOpenDelete(true);

  };

  /* =====================================
          CREATE PRODUCT
  ====================================== */

  const handleCreate = async () => {

    if (
      !name ||
      !category ||
      !supplier
    ) {

      alert(
        "Semua field wajib diisi."
      );

      return;

    }

    try {

      await api.post(
        ENDPOINTS.PRODUCT,
        {
          name,
          description,
          category,
          supplier,
        }
      );

      setOpenAdd(false);

      fetchData();

    } catch (err) {

      console.error(err);

      alert(
        err.response?.data?.message ||
        "Gagal menambah produk."
      );

    }

  };

  /* =====================================
          UPDATE PRODUCT
  ====================================== */

  const handleUpdate = async () => {

    if (!selectedProduct) return;

    try {

      await api.put(

        ENDPOINTS.PRODUCT_DETAIL(
          selectedProduct.id
        ),

        {
          name,
          description,
          category,
          supplier,
        }

      );

      setOpenEdit(false);

      fetchData();

    } catch (err) {

      console.error(err);

      alert(
        err.response?.data?.message ||
        "Gagal mengubah produk."
      );

    }

  };
    /* =====================================
          DELETE PRODUCT
  ====================================== */

  const handleDelete = async () => {

    if (!selectedProduct) return;

    try {

      await api.delete(
        ENDPOINTS.PRODUCT_DETAIL(
          selectedProduct.id
        )
      );

      setOpenDelete(false);

      fetchData();

    } catch (err) {

      console.error(err);

      alert(
        err.response?.data?.message ||
        "Gagal menghapus produk."
      );

    }

  };

  /* =====================================
              RETURN
  ====================================== */

  return (

    <div className="space-y-6">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>

          <p className="text-sm text-slate-500">
            Dashboard &gt; Master Product
          </p>

          <h1 className="text-2xl font-bold text-slate-800">
            Master Product
          </h1>

        </div>

        <Button
          onClick={handleOpenAdd}
          className="bg-emerald-600 hover:bg-emerald-500"
        >
          <Plus className="mr-2 h-4 w-4"/>

          Tambah Product

        </Button>

      </div>

      {/* Table */}

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">

        <Table>

          <TableHeader>

            <TableRow>

              <TableHead>No</TableHead>

              <TableHead>Nama Product</TableHead>

              <TableHead>Category</TableHead>

              <TableHead>Supplier</TableHead>

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
                    colSpan={5}
                    className="text-center py-10"
                  >

                    Loading...

                  </TableCell>

                </TableRow>

              )

              :

              products.map((product,index)=>(

                <TableRow
                  key={product.id}
                >

                  <TableCell>

                    {index+1}

                  </TableCell>

                  <TableCell>

                    {product.name}

                  </TableCell>

                  <TableCell>

                    {product.category_name}

                  </TableCell>

                  <TableCell>

                    {product.supplier_name}

                  </TableCell>

                  <TableCell className="text-center">

                    <div className="flex justify-center gap-2">

                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() =>
                          handleOpenEdit(product)
                        }
                      >

                        <Pencil className="h-4 w-4"/>

                      </Button>

                      <Button
                        size="icon"
                        variant="destructive"
                        onClick={() =>
                          handleOpenDelete(product)
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

      {/* ===========================
            ADD PRODUCT
      =========================== */}

      <Dialog
        open={openAdd}
        onOpenChange={setOpenAdd}
      >

        <DialogContent>

          <DialogHeader>

            <DialogTitle>

              Tambah Product

            </DialogTitle>

          </DialogHeader>

          <div className="space-y-4">

            <div>

              <Label>
                Nama Product
              </Label>

              <Input
                value={name}
                onChange={(e)=>
                  setName(e.target.value)
                }
              />

            </div>

            <div>

              <Label>
                Description
              </Label>

              <Input
                value={description}
                onChange={(e)=>
                  setDescription(
                    e.target.value
                  )
                }
              />

            </div>

            <div>

              <Label>
                Category
              </Label>

              <Select
                value={category}
                onValueChange={setCategory}
              >

                <SelectTrigger>

                  <SelectValue
                    placeholder="Pilih Category"
                  />

                </SelectTrigger>

                <SelectContent>

                  {

                    categories.map(category=>(

                      <SelectItem
                        key={category.id}
                        value={String(category.id)}
                      >

                        {category.name}

                      </SelectItem>

                    ))

                  }

                </SelectContent>

              </Select>

            </div>

            <div>

              <Label>
                Supplier
              </Label>

              <Select
                value={supplier}
                onValueChange={setSupplier}
              >

                <SelectTrigger>

                  <SelectValue
                    placeholder="Pilih Supplier"
                  />

                </SelectTrigger>

                <SelectContent>

                  {

                    suppliers.map(supplier=>(

                      <SelectItem
                        key={supplier.id}
                        value={String(supplier.id)}
                      >

                        {supplier.name}

                      </SelectItem>

                    ))

                  }

                </SelectContent>

              </Select>

            </div>

          </div>

          <DialogFooter>

            <Button
              variant="outline"
              onClick={()=>
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
            {/* ===========================
            EDIT PRODUCT
      =========================== */}

      <Dialog
        open={openEdit}
        onOpenChange={setOpenEdit}
      >

        <DialogContent>

          <DialogHeader>

            <DialogTitle>

              Edit Product

            </DialogTitle>

          </DialogHeader>

          <div className="space-y-4">

            <div>

              <Label>
                Nama Product
              </Label>

              <Input
                value={name}
                onChange={(e)=>
                  setName(e.target.value)
                }
              />

            </div>

            <div>

              <Label>
                Description
              </Label>

              <Input
                value={description}
                onChange={(e)=>
                  setDescription(
                    e.target.value
                  )
                }
              />

            </div>

            <div>

              <Label>
                Category
              </Label>

              <Select
                value={category}
                onValueChange={setCategory}
              >

                <SelectTrigger>

                  <SelectValue/>

                </SelectTrigger>

                <SelectContent>

                  {

                    categories.map(category=>(

                      <SelectItem
                        key={category.id}
                        value={String(category.id)}
                      >

                        {category.name}

                      </SelectItem>

                    ))

                  }

                </SelectContent>

              </Select>

            </div>

            <div>

              <Label>
                Supplier
              </Label>

              <Select
                value={supplier}
                onValueChange={setSupplier}
              >

                <SelectTrigger>

                  <SelectValue/>

                </SelectTrigger>

                <SelectContent>

                  {

                    suppliers.map(supplier=>(

                      <SelectItem
                        key={supplier.id}
                        value={String(supplier.id)}
                      >

                        {supplier.name}

                      </SelectItem>

                    ))

                  }

                </SelectContent>

              </Select>

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
              onClick={handleUpdate}
              className="bg-emerald-600 hover:bg-emerald-500"
            >
              Update
            </Button>

          </DialogFooter>

        </DialogContent>

      </Dialog>

      {/* ===========================
            DELETE PRODUCT
      =========================== */}

      <Dialog
        open={openDelete}
        onOpenChange={setOpenDelete}
      >

        <DialogContent>

          <DialogHeader>

            <DialogTitle>

              Hapus Product

            </DialogTitle>

          </DialogHeader>

          <div className="py-2">

            <p className="text-slate-600">

              Apakah yakin ingin menghapus product

              <span className="font-semibold">

                {" "}

                {selectedProduct?.name}

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