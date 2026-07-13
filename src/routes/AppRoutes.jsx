import { Routes, Route } from 'react-router-dom';
import SplashScreen from '../pages/splashscreen';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashbboard';
import StokBarang from '../pages/StokBarang';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/stokbarang" element={<StokBarang />} />
    </Routes>
  );
}
