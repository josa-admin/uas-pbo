import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import SplashScreen from "../pages/SplashScreen";
import Login from "../pages/Login";
import Dashbboard from "../pages/Dashbboard";
import DashboardLayout from "../components/DashboardLayout";

import MasterProduct from "../pages/MasterProduct";
import MasterSupplier from "../pages/MasterSupplier";
import MasterCategory from "../pages/MasterCategory";
import MasterBin from "../pages/MasterBin";
import StokBarang from "../pages/StokBarang";
import BarangMasuk from "../pages/BarangMasuk";
import BarangKeluar from "../pages/BarangKeluar";
import Laporan from "../pages/Laporan";
import BarangExpired from "../pages/BarangExpired";
import PencarianBarang from "../pages/PencarianBarang";

export default function AppRoutes() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<SplashScreen />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route element={<DashboardLayout />}>

          <Route
            path="/dashboard"
            element={<Dashbboard />}
          />


          {/* MASTER DATA */}

          <Route
            path="/master-product"
            element={<MasterProduct />}
          />

          <Route
            path="/master-bin"
            element={<MasterBin />}
          />

          <Route
            path="/master-supplier"
            element={<MasterSupplier />}
          />

          <Route
            path="/master-category"
            element={<MasterCategory />}
          />

          {/* TRANSAKSI */}

          <Route
            path="/stok-barang"
            element={<StokBarang />}
          />

          <Route
            path="/barang-masuk"
            element={<BarangMasuk />}
          />

          <Route
            path="/barang-keluar"
            element={<BarangKeluar />}
          />

          {/* LAPORAN */}

          <Route
            path="/laporan"
            element={<Laporan />}
          />

          <Route
            path="/pencarian-barang"
            element={<PencarianBarang />}
          />

          <Route
            path="/stok-kritis"
            element={<StokBarang />}
          />

          <Route
            path="/barang-expired"
            element={<BarangExpired />}
          />

        </Route>

        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />

      </Routes>

    </BrowserRouter>
  );
}