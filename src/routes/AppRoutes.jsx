import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashbboard from "../pages/Dashbboard";
import StokBarang from "../pages/StokBarang";
import BarangMasuk from "../pages/BarangMasuk";
import BarangKeluar from "../pages/BarangKeluar";
import Laporan from "../pages/Laporan";
import DashboardLayout from "../components/DashboardLayout";

export default function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                
                {/* Dashboard layout routes */}
                <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<Dashbboard />} />
                    <Route path="/stok-barang" element={<StokBarang />} />
                    <Route path="/barang-masuk" element={<BarangMasuk />} />
                    <Route path="/barang-keluar" element={<BarangKeluar />} />
                    <Route path="/laporan" element={<Laporan />} />
                    <Route path="/pencarian-barang" element={<StokBarang />} />
                    <Route path="/stok-kritis" element={<StokBarang />} />
                    <Route path="/profil" element={<StokBarang />} />
                </Route>

                {/* Redirect any other path to login */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}