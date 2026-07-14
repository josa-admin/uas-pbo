import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import api from "@/api/api";
import ENDPOINTS from "@/api/endpoints";

// Google Icon


export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert("Username dan Password harus diisi");
      return;
    }

    try {
      setLoading(true);

      const { data } = await api.post(
      ENDPOINTS.LOGIN,
        {
          username,
          password,
        }
      );

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      if (data.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );
      }

      navigate("/dashboard");
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.detail ||
          "Username atau Password salah"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#052620] to-[#031c18] flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <div className="mb-10 text-center">
          <h1 className="text-6xl font-bold text-white">
            WMS
          </h1>

          <p className="mt-2 text-sm text-emerald-400">
            Warehouse Management System
          </p>
        </div>

        <div className="mb-8 text-center">
          <h2 className="text-3xl font-semibold text-white">
            Selamat Datang!
          </h2>

          <p className="mt-3 text-slate-400 text-sm">
            Silakan login untuk mengakses sistem.
          </p>
        </div>

        <form
          className="space-y-4"
          onSubmit={handleLogin}
        >

          {/* Username */}

          <div className="relative">

            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-5 w-5"/>

            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e)=>setUsername(e.target.value)}
              className="pl-10 h-12 bg-transparent border-slate-700 text-white"
            />

          </div>

          {/* Password */}

          <div className="relative">

            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 h-5 w-5"/>

            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e)=>setPassword(e.target.value)}
              className="pl-10 pr-10 h-12 bg-transparent border-slate-700 text-white"
            />

            <button
              type="button"
              onClick={() =>
                setShowPassword(!showPassword)
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showPassword ? (
                <EyeOff size={18}/>
              ) : (
                <Eye size={18}/>
              )}
            </button>

          </div>

          <div className="flex justify-between items-center">

            <Label className="flex gap-2 text-slate-300">

              <input type="checkbox"/>

              Ingat saya

            </Label>

            <button
              type="button"
              className="text-emerald-500 text-sm"
            >
              Lupa Password?
            </button>

          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-500"
          >
            {loading
              ? "Loading..."
              : "Masuk ke Sistem"}
          </Button>

  

        </form>

      </div>
    </div>
  );
}