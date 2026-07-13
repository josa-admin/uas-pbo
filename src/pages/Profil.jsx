import { useState, useEffect } from "react";
import { 
  User, 
  Lock, 
  Mail, 
  Phone, 
  Shield, 
  Camera, 
  Check, 
  Building2, 
  Calendar, 
  Eye, 
  EyeOff, 
  Save,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

// Preset Avatar Images
const PRESET_AVATARS = [
  { id: 1, url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", label: "Pria Kacamata" },
  { id: 2, url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", label: "Wanita Senyum" },
  { id: 3, url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", label: "Pria Klasik" },
  { id: 4, url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80", label: "Wanita Profesional" }
];

const DEFAULT_PROFILE = {
  nama: "Administrator",
  username: "admin_wms",
  email: "admin@wms.com",
  phone: "+62 812-3456-7890",
  role: "Admin Gudang Utama",
  bio: "Bertanggung jawab atas pengelolaan stok, pencatatan barang masuk dan keluar, serta penyusunan laporan inventaris di Gudang Utama.",
  avatar: PRESET_AVATARS[0].url,
  status: "Aktif",
  joinDate: "Januari 2024",
  stats: {
    barangMasuk: 154,
    barangKeluar: 89,
    stokDikelola: 1240
  }
};

export default function Profil() {
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [editForm, setEditForm] = useState({ ...DEFAULT_PROFILE });
  
  // Security Form State
  const [securityForm, setSecurityForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  // Password Visibility States
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Custom Avatar Toggle State
  const [customAvatarUrl, setCustomAvatarUrl] = useState("");
  const [showCustomAvatarInput, setShowCustomAvatarInput] = useState(false);

  // Feedback Notification state
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });

  const [stats, setStats] = useState({
    barangMasuk: 0,
    barangKeluar: 0,
    stokDikelola: 0
  });

  // Load from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem("wms_user_profile");
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        // Merge with DEFAULT_PROFILE for fallback statistics
        const merged = { ...DEFAULT_PROFILE, ...parsed };
        setProfile(merged);
        setEditForm(merged);
        if (!PRESET_AVATARS.some(av => av.url === merged.avatar)) {
          setCustomAvatarUrl(merged.avatar);
          setShowCustomAvatarInput(true);
        }
      } catch (e) {
        console.error("Gagal memuat profil dari localStorage", e);
      }
    }

    // Load dynamic statistics from history
    let masukTotal = 0;
    let keluarTotal = 0;

    try {
      const masukHist = localStorage.getItem("wms_barang_masuk_history");
      if (masukHist) {
        const parsed = JSON.parse(masukHist);
        masukTotal = parsed.reduce((sum, tx) => sum + (tx.totalUnit || 0), 0);
      }

      const keluarHist = localStorage.getItem("wms_barang_keluar_history");
      if (keluarHist) {
        const parsed = JSON.parse(keluarHist);
        keluarTotal = parsed.reduce((sum, tx) => sum + (tx.totalUnit || 0), 0);
      }
    } catch (e) {
      console.error("Gagal menghitung statistik dari riwayat", e);
    }

    setStats({
      barangMasuk: masukTotal,
      barangKeluar: keluarTotal,
      stokDikelola: Math.max(0, masukTotal - keluarTotal)
    });
  }, []);

  const triggerNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "success" });
    }, 3500);
  };

  // Save profile modifications
  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!editForm.nama.trim()) {
      triggerNotification("Nama tidak boleh kosong!", "error");
      return;
    }
    if (!editForm.email.trim() || !editForm.email.includes("@")) {
      triggerNotification("Email tidak valid!", "error");
      return;
    }

    const updatedProfile = { ...profile, ...editForm };
    setProfile(updatedProfile);
    localStorage.setItem("wms_user_profile", JSON.stringify(updatedProfile));
    
    // Dispatch custom event to trigger navbar update
    window.dispatchEvent(new Event("wms_profile_updated"));
    triggerNotification("Profil berhasil diperbarui!");
  };

  // Save avatar
  const handleSelectAvatar = (url) => {
    const updatedForm = { ...editForm, avatar: url };
    setEditForm(updatedForm);
  };

  const handleApplyCustomAvatar = () => {
    if (customAvatarUrl.trim().startsWith("http")) {
      const updatedForm = { ...editForm, avatar: customAvatarUrl.trim() };
      setEditForm(updatedForm);
      triggerNotification("Avatar kustom diterapkan!");
    } else {
      triggerNotification("URL Avatar tidak valid! Harus diawali dengan http/https", "error");
    }
  };

  // Change Password logic
  const handleChangePassword = (e) => {
    e.preventDefault();
    const { oldPassword, newPassword, confirmPassword } = securityForm;

    if (!oldPassword || !newPassword || !confirmPassword) {
      triggerNotification("Semua kolom kata sandi harus diisi!", "error");
      return;
    }

    if (newPassword.length < 6) {
      triggerNotification("Kata sandi baru minimal harus 6 karakter!", "error");
      return;
    }

    if (newPassword !== confirmPassword) {
      triggerNotification("Konfirmasi kata sandi baru tidak cocok!", "error");
      return;
    }

    // Success Mock save
    triggerNotification("Kata sandi berhasil diperbarui!");
    setSecurityForm({
      oldPassword: "",
      newPassword: "",
      confirmPassword: ""
    });
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notification.show && (
        <div 
          className={`fixed top-4 right-4 z-50 flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-lg border transition-all duration-300 transform translate-y-0 ${
            notification.type === "success" 
              ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
              : "bg-rose-50 border-rose-200 text-rose-800"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-rose-600" />
          )}
          <span className="text-sm font-medium">{notification.message}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <div className="text-sm text-slate-500 font-medium">Pengaturan</div>
        <h1 className="text-2xl font-bold text-slate-800">Profil Pengguna</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Side: Summary Profile Card */}
        <div className="space-y-6">
          <Card className="border-slate-200/80 shadow-sm overflow-visible bg-white">
            <CardContent className="pt-6 text-center">
              {/* Profile Image & Avatar Edit Trigger */}
              <div className="relative w-28 h-28 mx-auto mb-4 group">
                <img 
                  src={profile.avatar} 
                  alt={profile.nama} 
                  className="w-full h-full rounded-full object-cover border-4 border-emerald-50 shadow-inner"
                />
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* User Bio Details */}
              <h2 className="text-xl font-bold text-slate-800 leading-tight">{profile.nama}</h2>
              <p className="text-sm font-medium text-emerald-600 mt-1">{profile.role}</p>
              
              <div className="mt-4 flex items-center justify-center gap-1.5">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {profile.status}
                </span>
              </div>

              <p className="text-xs text-slate-400 mt-3 italic line-clamp-3 px-4">
                "{profile.bio}"
              </p>

              {/* Border Divider */}
              <div className="h-px bg-slate-100 my-5"></div>

              {/* Metadata Details */}
              <div className="space-y-2.5 text-left text-xs text-slate-500 px-2">
                <div className="flex items-center gap-2.5">
                  <Building2 className="h-4 w-4 text-slate-400" />
                  <span>Departemen: <strong className="text-slate-700 font-medium">{profile.role.replace("Admin ", "")}</strong></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span>Email: <span className="text-slate-700 font-medium">{profile.email}</span></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>Bergabung: <strong className="text-slate-700 font-medium">{profile.joinDate}</strong></span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Statistics Card */}
          <Card className="border-slate-200/80 shadow-sm bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-slate-700">Ringkasan Aktivitas</CardTitle>
              <CardDescription className="text-xs text-slate-400">Statistik aktivitas pengerjaan gudang</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-2 text-center pb-6">
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div className="text-lg font-bold text-emerald-600">{stats.barangMasuk}</div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-tight mt-0.5">Masuk</div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div className="text-lg font-bold text-slate-700">{stats.barangKeluar}</div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-tight mt-0.5">Keluar</div>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <div className="text-lg font-bold text-sky-600">{stats.stokDikelola}</div>
                <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-tight mt-0.5">Stok</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Navigation & Form Settings */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="edit" className="w-full bg-white border border-slate-200/80 rounded-xl shadow-sm overflow-hidden">
            <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center justify-between">
              <TabsList className="bg-slate-100 border border-slate-200/40">
                <TabsTrigger value="edit" className="flex items-center gap-1.5 py-1 px-3">
                  <User className="h-4 w-4" />
                  <span>Edit Profil</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-1.5 py-1 px-3">
                  <Lock className="h-4 w-4" />
                  <span>Keamanan</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* TAB CONTENT: EDIT PROFILE */}
            <TabsContent value="edit" className="p-6 focus:outline-none">
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-4">Ubah Informasi Profil</h3>
                  
                  {/* Photo Selection Component */}
                  <div className="space-y-3 mb-6">
                    <Label className="text-xs font-semibold text-slate-600">Pilih Foto Profil (Avatar)</Label>
                    <div className="flex flex-wrap items-center gap-4">
                      {PRESET_AVATARS.map((av) => (
                        <button
                          key={av.id}
                          type="button"
                          onClick={() => handleSelectAvatar(av.url)}
                          className={`relative rounded-full p-0.5 border-2 transition-all cursor-pointer hover:scale-105 ${
                            editForm.avatar === av.url 
                              ? "border-emerald-600 shadow-md ring-2 ring-emerald-500/20" 
                              : "border-slate-200 hover:border-slate-400"
                          }`}
                        >
                          <img 
                            src={av.url} 
                            alt={av.label} 
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          {editForm.avatar === av.url && (
                            <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white rounded-full p-0.5 border border-white">
                              <Check className="h-3 w-3" />
                            </div>
                          )}
                        </button>
                      ))}
                      
                      <button
                        type="button"
                        onClick={() => setShowCustomAvatarInput(!showCustomAvatarInput)}
                        className={`text-xs px-3.5 py-2 rounded-full border border-dashed transition-all cursor-pointer ${
                          showCustomAvatarInput 
                            ? "bg-slate-50 border-slate-300 text-slate-600" 
                            : "border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-500"
                        }`}
                      >
                        {showCustomAvatarInput ? "Tutup URL Kustom" : "Gunakan URL Kustom"}
                      </button>
                    </div>

                    {showCustomAvatarInput && (
                      <div className="flex items-center gap-2 mt-2 pt-1.5 animate-fadeIn">
                        <Input
                          type="url"
                          placeholder="Masukkan URL foto (https://...)"
                          value={customAvatarUrl}
                          onChange={(e) => setCustomAvatarUrl(e.target.value)}
                          className="text-xs h-9"
                        />
                        <Button 
                          type="button" 
                          variant="secondary"
                          onClick={handleApplyCustomAvatar}
                          className="h-9 px-4 text-xs font-semibold cursor-pointer shrink-0"
                        >
                          Terapkan
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Form Fields Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nama" className="text-xs font-semibold text-slate-600">Nama Lengkap</Label>
                      <Input
                        id="nama"
                        type="text"
                        value={editForm.nama}
                        onChange={(e) => setEditForm({ ...editForm, nama: e.target.value })}
                        placeholder="Nama Lengkap"
                        className="h-10 text-sm focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-xs font-semibold text-slate-600">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        value={editForm.username}
                        onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                        placeholder="Username"
                        className="h-10 text-sm focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-xs font-semibold text-slate-600">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        placeholder="Alamat Email"
                        className="h-10 text-sm focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-xs font-semibold text-slate-600">Nomor Telepon</Label>
                      <Input
                        id="phone"
                        type="text"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        placeholder="Nomor Telepon"
                        className="h-10 text-sm focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="role" className="text-xs font-semibold text-slate-600">Jabatan / Role</Label>
                      <Input
                        id="role"
                        type="text"
                        value={editForm.role}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                        placeholder="Hak Akses Gudang"
                        className="h-10 text-sm focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600"
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="bio" className="text-xs font-semibold text-slate-600">Deskripsi / Bio Singkat</Label>
                      <textarea
                        id="bio"
                        rows="3"
                        value={editForm.bio}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        placeholder="Deskripsi tugas dan tanggung jawab..."
                        className="w-full text-sm rounded-lg border border-input bg-transparent px-3 py-2.5 shadow-xs placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600 focus-visible:ring-offset-0 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-slate-100">
                  <Button 
                    type="submit" 
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <Save className="h-4 w-4" />
                    <span>Simpan Perubahan</span>
                  </Button>
                </div>
              </form>
            </TabsContent>

            {/* TAB CONTENT: SECURITY */}
            <TabsContent value="security" className="p-6 focus:outline-none">
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-800 mb-4">Ubah Kata Sandi</h3>
                  
                  <div className="space-y-4 max-w-lg">
                    {/* Old Password */}
                    <div className="space-y-2">
                      <Label htmlFor="oldPassword" className="text-xs font-semibold text-slate-600">Kata Sandi Lama</Label>
                      <div className="relative">
                        <Input
                          id="oldPassword"
                          type={showOldPassword ? "text" : "password"}
                          value={securityForm.oldPassword}
                          onChange={(e) => setSecurityForm({ ...securityForm, oldPassword: e.target.value })}
                          placeholder="Masukkan kata sandi saat ini"
                          className="h-10 text-sm pr-10 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600"
                        />
                        <button
                          type="button"
                          onClick={() => setShowOldPassword(!showOldPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                          {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-2">
                      <Label htmlFor="newPassword" className="text-xs font-semibold text-slate-600">Kata Sandi Baru</Label>
                      <div className="relative">
                        <Input
                          id="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          value={securityForm.newPassword}
                          onChange={(e) => setSecurityForm({ ...securityForm, newPassword: e.target.value })}
                          placeholder="Minimal 6 karakter"
                          className="h-10 text-sm pr-10 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                          {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Confirm New Password */}
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-xs font-semibold text-slate-600">Konfirmasi Kata Sandi Baru</Label>
                      <div className="relative">
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={securityForm.confirmPassword}
                          onChange={(e) => setSecurityForm({ ...securityForm, confirmPassword: e.target.value })}
                          placeholder="Ketik ulang kata sandi baru"
                          className="h-10 text-sm pr-10 focus-visible:ring-emerald-500/20 focus-visible:border-emerald-600"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-3 border-t border-slate-100">
                  <div className="flex items-start gap-3 bg-slate-50 border border-slate-200/60 p-4 rounded-xl max-w-lg">
                    <Shield className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-700">Rekomendasi Keamanan</h4>
                      <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">
                        Gunakan kombinasi huruf besar, huruf kecil, angka, dan karakter khusus (!@#$) untuk menghasilkan kata sandi yang kuat dan aman. Jangan bagikan kata sandi Anda dengan orang lain.
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end max-w-lg">
                    <Button 
                      type="submit" 
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Lock className="h-4 w-4" />
                      <span>Perbarui Kata Sandi</span>
                    </Button>
                  </div>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
