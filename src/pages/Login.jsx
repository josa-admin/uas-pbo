import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { login } from "../api/authApi";

// Google Icon
const GoogleIcon = () => (
  <svg
    className="h-5 w-5 mr-2"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      fill="#EA4335"
    />
  </svg>
);

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Username dan Password harus diisi");
      return;
    }

    try {
      setLoading(true);

      const res = await login({
        username,
        password,
      });

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

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

          <div className="flex items-center gap-4">

            <Separator className="flex-1"/>

            <span className="text-xs text-slate-500">
              ATAU
            </span>

            <Separator className="flex-1"/>

          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-12"
            onClick={() =>
              alert("Login Google belum tersedia")
            }
          >
            <GoogleIcon/>

            Login dengan Google

          </Button>

        </form>

      </div>
    </div>
  );
}