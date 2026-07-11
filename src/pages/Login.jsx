import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Package, User, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// Google Icon Component using Google Brand Colors
const GoogleIcon = () => (
  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
  </svg>
);

export default function Login() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#052620] to-[#031c18] flex items-center justify-center p-4">
            <div className="w-full max-w-md my-8">
                    {/* Logo */}
                    <div className="mb-10 text-center">
                        <Package className="mx-auto h-12 w-12 text-[#10b981]" />

                        <h1 className="mt-4 text-6xl font-bold text-white tracking-wide">
                            WMS
                        </h1>

                        <p className="mt-2 text-sm">
                            <span className="text-[#059669]">Warehouse </span>
                            <span className="text-[#10b981]">Management System</span>
                        </p>
                    </div>

                    {/* Welcome */}
                    <div className="mb-8 text-center">
                        <h2 className="text-3xl font-semibold text-white">
                            Selamat Datang!
                        </h2>

                        <p className="mt-3 text-sm text-slate-400">
                            Silakan login untuk mengakses sistem
                            <br />
                            manajemen gudang Anda.
                        </p>
                    </div>

                    {/* Form */}
                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); navigate("/barang-masuk"); }}>
                        {/* Username Input */}
                        <div className="space-y-2">
                            <div className="relative">
                                <User className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                                <Input
                                    type="text"
                                    placeholder="Username atau Email"
                                    className="pl-11 pr-4 h-12 bg-transparent border-slate-800 text-white placeholder:text-slate-500 text-base focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-2">
                            <div className="relative">
                                <Lock className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Password"
                                    className="pl-11 pr-11 h-12 bg-transparent border-slate-800 text-white placeholder:text-slate-500 text-base focus-visible:border-emerald-500 focus-visible:ring-emerald-500/20"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-400 focus:outline-none"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between pt-1">
                            <Label className="flex items-center gap-2 text-slate-300 text-sm cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-slate-800 bg-transparent text-emerald-500 focus:ring-emerald-500 focus:ring-offset-0 focus:ring-1"
                                />
                                <span>Ingat saya</span>
                            </Label>

                            <button
                                type="button"
                                className="text-sm font-medium text-emerald-500 hover:text-emerald-400 transition"
                            >
                                Lupa password?
                            </button>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-2">
                            <Button
                                type="submit"
                                className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-base transition-colors rounded-lg flex items-center justify-center gap-2"
                            >
                                Masuk ke Sistem →
                            </Button>
                        </div>

                        {/* Separator */}
                        <div className="flex items-center gap-4 py-4">
                            <Separator className="flex-1 bg-slate-800" />
                            <span className="text-xs text-slate-500 font-semibold tracking-wider">ATAU</span>
                            <Separator className="flex-1 bg-slate-800" />
                        </div>

                        <Button
                            type="button"
                            onClick={() => navigate("/barang-masuk")}
                            className="w-full h-12 bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 hover:text-slate-900 shadow-sm rounded-lg flex items-center justify-center gap-2"
                            >
                             <GoogleIcon />
                             <span>Login dengan Google</span>
                        </Button>
                    </form>
                </div>
        </div>
    );
}