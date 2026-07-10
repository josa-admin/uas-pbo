import { Routes, Route } from 'react-router-dom';
import SplashScreen from '../pages/splashscreen';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashbboard';
import ManajemenBarang from '../pages/ManajemenBarang';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/manajemen-barang" element={<ManajemenBarang />} />
    </Routes>
  );
}
