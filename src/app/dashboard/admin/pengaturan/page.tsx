"use client";

import React, { useState, useRef, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  ChevronRight,
  UserCircle2,
  LockKeyhole,
  SlidersHorizontal,
  Camera,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Mail,
  Phone,
  BadgeCheck,
  Eye,
  EyeOff,
  CalendarRange,
  Building,
  BellRing,
} from "lucide-react";

type AdminSettingsTab = "profil" | "keamanan" | "sistem";

function AdminPengaturanContent() {
  const searchParams = useSearchParams();
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  const [activeTab, setActiveTab] = useState<AdminSettingsTab>("profil");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toastBanner, setToastBanner] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // Sinkronisasi tab dari URL query (?tab=profil / ?tab=keamanan / ?tab=sistem)
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (
      tabParam === "profil" ||
      tabParam === "keamanan" ||
      tabParam === "sistem"
    ) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);

  // 1. State Profil Administrator / Verifikator
  const [adminProfile, setAdminProfile] = useState({
    namaLengkap: "H. Muhammad Zainuddin, S.Sos.",
    nip: "197804152005011009",
    jabatan: "Verifikator Bagian Kesra",
    unitKerja: "Bagian Kesejahteraan Rakyat Setda Kab. Sumbawa",
    email: "admin.kesra@sumbawakab.go.id",
    nomorHp: "081237445566",
  });

  // 2. State Keamanan Akun & Kata Sandi
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // 3. State Pengaturan Portal E-Hibah
  const [systemConfig, setSystemConfig] = useState({
    tahunAnggaranAktif: "2026",
    statusPenerimaan: "buka",
    tanggalBuka: "2026-01-10",
    tanggalTutup: "2026-12-15",
    batasMaksimalDana: "100000000",
    notifikasiEmailMasuk: true,
    notifikasiRingkasanHarian: true,
  });

  const showToast = (type: "success" | "error", message: string) => {
    setToastBanner({ type, message });
    setTimeout(() => setToastBanner(null), 4000);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      showToast("error", "Ukuran foto profil maksimal 2 MB (JPG/PNG).");
      return;
    }

    if (avatarPreview) {
      URL.revokeObjectURL(avatarPreview);
    }
    setAvatarPreview(URL.createObjectURL(file));
    showToast("success", "Foto profil administrator berhasil diperbarui.");
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminProfile.namaLengkap.trim() || adminProfile.nip.length !== 18) {
      showToast(
        "error",
        "Pastikan Nama Lengkap terisi dan NIP terdiri dari 18 digit.",
      );
      return;
    }

    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 650));
      showToast("success", "Profil administrator berhasil diperbarui.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      showToast("error", "Masukkan kata sandi saat ini terlebih dahulu.");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      showToast("error", "Kata sandi baru minimal terdiri dari 8 karakter.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast("error", "Konfirmasi kata sandi baru tidak cocok.");
      return;
    }

    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 700));
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      showToast(
        "success",
        "Kata sandi akun administrator berhasil diperbarui.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveSystemConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 650));
      showToast(
        "success",
        "Pengaturan periode dan parameter portal E-Hibah berhasil disimpan.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const adminInitials = adminProfile.namaLengkap
    .replace(/[^a-zA-Z\s]/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { label: "", color: "bg-slate-200", width: "0%" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score++;

    if (score === 1)
      return { label: "Lemah", color: "bg-red-500", width: "33%" };
    if (score === 2)
      return { label: "Sedang", color: "bg-amber-500", width: "66%" };
    return { label: "Kuat", color: "bg-emerald-500", width: "100%" };
  };

  const pwdStrength = getPasswordStrength(passwordForm.newPassword);

  return (
    <div className="space-y-6 pb-12">
      {/* =====================================================================
          1. HEADER & BREADCRUMB
      ====================================================================== */}
      <div className="space-y-1">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500"
        >
          <Link
            href="/dashboard/admin"
            className="hover:text-app-primary transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-app-primary font-bold">Pengaturan</span>
        </nav>

        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Pengaturan Akun & Sistem Admin
        </h1>
        <p className="text-xs text-slate-500">
          Kelola identitas verifikator, keamanan kata sandi akun, serta
          konfigurasi jadwal penerimaan hibah Kabupaten Sumbawa.
        </p>
      </div>

      {/* Notifikasi Toast */}
      {toastBanner && (
        <div
          role={toastBanner.type === "error" ? "alert" : "status"}
          className={`flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-xs font-semibold shadow-2xs ${
            toastBanner.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {toastBanner.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{toastBanner.message}</span>
        </div>
      )}

      {/* =====================================================================
          2. GRID UTAMA (KIRI: KARTU PROFIL ADMIN | KANAN: TABS & FORM)
      ====================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* KOLOM KIRI (4 KOLOM): RINGKASAN AKUN VERIFIKATOR */}
        <aside className="lg:col-span-4 space-y-5">
          <div className="rounded-3xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="h-24 bg-gradient-to-br from-app-primary-950 via-app-primary-900 to-app-primary relative">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff18_1px,transparent_1px)] [background-size:16px_16px] opacity-60"
              />
            </div>

            <div className="px-5 pb-6 -mt-11 relative">
              <div className="flex items-end justify-between">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-app-primary to-app-primary-800 text-white flex items-center justify-center ring-4 ring-white shadow-md">
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt={adminProfile.namaLengkap}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-xl font-extrabold text-app-secondary">
                      {adminInitials}
                    </span>
                  )}
                </div>

                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleAvatarChange}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => avatarInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-app-primary-50 text-slate-700 hover:text-app-primary text-[11px] font-bold shadow-2xs transition-colors cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-app-primary" />
                  <span>Ganti Foto</span>
                </button>
              </div>

              <div className="mt-3.5 space-y-1">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base font-extrabold text-slate-900 truncate">
                    {adminProfile.namaLengkap}
                  </h2>
                  <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>
                <p className="text-xs font-bold text-app-primary">
                  {adminProfile.jabatan}
                </p>
                <p className="text-[11px] font-mono text-slate-400">
                  NIP. {adminProfile.nip}
                </p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5 text-xs">
                <div className="flex items-center gap-2.5 text-slate-600">
                  <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="text-[11px] leading-snug">
                    {adminProfile.unitKerja}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{adminProfile.email}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{adminProfile.nomorHp}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Info Hak Akses */}
          <div className="rounded-2xl bg-app-primary-50/70 border border-app-primary-200/80 p-4 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-extrabold text-app-primary-950">
              <ShieldCheck className="w-4 h-4 text-app-primary shrink-0" />
              <span>Otoritas Administrator</span>
            </div>
            <p className="text-[11px] text-slate-700 leading-relaxed">
              Akun ini memiliki hak akses penuh untuk memverifikasi proposal
              hibah, mencetak berita acara rekapitulasi, dan mengatur periode
              pendaftaran.
            </p>
          </div>
        </aside>

        {/* KOLOM KANAN (8 KOLOM): TABS & FORM PENGATURAN */}
        <div className="lg:col-span-8 space-y-5">
          {/* Navigasi Tab */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-1.5 shadow-2xs grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab("profil")}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "profil"
                  ? "bg-app-primary text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <UserCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Profil Admin</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("keamanan")}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "keamanan"
                  ? "bg-app-primary text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <LockKeyhole className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Keamanan Akun</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("sistem")}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "sistem"
                  ? "bg-app-primary text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Portal Hibah</span>
            </button>
          </div>

          {/* =================================================================
              TAB 1: PROFIL ADMINISTRATOR
          ================================================================== */}
          {activeTab === "profil" && (
            <form
              onSubmit={handleSaveProfile}
              className="rounded-2xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden"
            >
              <div className="px-5 py-4 bg-slate-50/80 border-b border-slate-100">
                <h2 className="text-sm font-extrabold text-slate-900">
                  Identitas Pejabat / Verifikator
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Nama dan jabatan ini akan tercantum pada riwayat pemeriksaan
                  berkas serta laporan hasil verifikasi.
                </p>
              </div>

              <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700">
                    Nama Lengkap & Gelar <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={adminProfile.namaLengkap}
                    onChange={(e) =>
                      setAdminProfile({
                        ...adminProfile,
                        namaLengkap: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold text-slate-700">
                      NIP <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {adminProfile.nip.length}/18 digit
                    </span>
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    value={adminProfile.nip}
                    onChange={(e) =>
                      setAdminProfile({
                        ...adminProfile,
                        nip: e.target.value.replace(/\D/g, "").slice(0, 18),
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs font-mono text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700">
                    Jabatan / Peran <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={adminProfile.jabatan}
                    onChange={(e) =>
                      setAdminProfile({
                        ...adminProfile,
                        jabatan: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700">
                    Unit Kerja / OPD <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={adminProfile.unitKerja}
                    onChange={(e) =>
                      setAdminProfile({
                        ...adminProfile,
                        unitKerja: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700">
                    Email Dinas <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={adminProfile.email}
                    onChange={(e) =>
                      setAdminProfile({
                        ...adminProfile,
                        email: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700">
                    Nomor HP / WhatsApp <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={adminProfile.nomorHp}
                    onChange={(e) =>
                      setAdminProfile({
                        ...adminProfile,
                        nomorHp: e.target.value.replace(/\D/g, "").slice(0, 15),
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15"
                  />
                </div>
              </div>

              <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-app-primary hover:bg-app-primary-800 disabled:opacity-60 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  {isSaving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-app-secondary" />
                  ) : (
                    <Save className="w-3.5 h-3.5 text-app-secondary" />
                  )}
                  <span>Simpan Profil Admin</span>
                </button>
              </div>
            </form>
          )}

          {/* =================================================================
              TAB 2: KEAMANAN AKUN & UBAH KATA SANDI
          ================================================================== */}
          {activeTab === "keamanan" && (
            <form
              onSubmit={handleUpdatePassword}
              className="rounded-2xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden"
            >
              <div className="px-5 py-4 bg-slate-50/80 border-b border-slate-100">
                <h2 className="text-sm font-extrabold text-slate-900">
                  Keamanan Akun & Kata Sandi
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Perbarui kata sandi secara berkala untuk menjaga keamanan
                  panel verifikasi daerah.
                </p>
              </div>

              <div className="p-5 sm:p-6 space-y-4 max-w-lg text-xs">
                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700">
                    Kata Sandi Saat Ini <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPass.current ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value,
                        })
                      }
                      placeholder="Masukkan kata sandi saat ini"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-3.5 pr-10 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPass({ ...showPass, current: !showPass.current })
                      }
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPass.current ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700">
                    Kata Sandi Baru <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPass.new ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder="Minimal 8 karakter"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-3.5 pr-10 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPass({ ...showPass, new: !showPass.new })
                      }
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPass.new ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {passwordForm.newPassword && (
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-400">
                          Kekuatan Kata Sandi
                        </span>
                        <span className="font-bold text-slate-700">
                          {pwdStrength.label}
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${pwdStrength.color}`}
                          style={{ width: pwdStrength.width }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block font-bold text-slate-700">
                    Konfirmasi Kata Sandi Baru{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPass.confirm ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="Ulangi kata sandi baru"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-3.5 pr-10 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPass({ ...showPass, confirm: !showPass.confirm })
                      }
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPass.confirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-app-primary shrink-0" />
                  <span>Proteksi sesi administrator aktif</span>
                </div>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-app-primary hover:bg-app-primary-800 disabled:opacity-60 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  {isSaving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-app-secondary" />
                  ) : (
                    <LockKeyhole className="w-3.5 h-3.5 text-app-secondary" />
                  )}
                  <span>Perbarui Kata Sandi</span>
                </button>
              </div>
            </form>
          )}

          {/* =================================================================
              TAB 3: PENGATURAN PORTAL & PERIODE HIBAH
          ================================================================== */}
          {activeTab === "sistem" && (
            <form
              onSubmit={handleSaveSystemConfig}
              className="rounded-2xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden"
            >
              <div className="px-5 py-4 bg-slate-50/80 border-b border-slate-100">
                <h2 className="text-sm font-extrabold text-slate-900">
                  Konfigurasi Periode & Notifikasi Portal
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Atur status pembukaan pengajuan proposal hibah masyarakat dan
                  preferensi notifikasi verifikator.
                </p>
              </div>

              <div className="p-5 sm:p-6 space-y-5 text-xs">
                {/* Periode Pengajuan */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800">
                    <CalendarRange className="w-4 h-4 text-app-primary" />
                    <span>Jadwal Penerimaan Proposal Hibah</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-700">
                        Tahun Anggaran Aktif
                      </label>
                      <select
                        value={systemConfig.tahunAnggaranAktif}
                        onChange={(e) =>
                          setSystemConfig({
                            ...systemConfig,
                            tahunAnggaranAktif: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15"
                      >
                        <option value="2026">Tahun Anggaran 2026</option>
                        <option value="2027">Tahun Anggaran 2027</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-700">
                        Status Penerimaan Pengajuan
                      </label>
                      <select
                        value={systemConfig.statusPenerimaan}
                        onChange={(e) =>
                          setSystemConfig({
                            ...systemConfig,
                            statusPenerimaan: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15"
                      >
                        <option value="buka">Dibuka (Menerima Proposal)</option>
                        <option value="tutup">Ditutup Sementara</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-700">
                        Tanggal Mulai Pengajuan
                      </label>
                      <input
                        type="date"
                        value={systemConfig.tanggalBuka}
                        onChange={(e) =>
                          setSystemConfig({
                            ...systemConfig,
                            tanggalBuka: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-bold text-slate-700">
                        Batas Akhir Pengajuan
                      </label>
                      <input
                        type="date"
                        value={systemConfig.tanggalTutup}
                        onChange={(e) =>
                          setSystemConfig({
                            ...systemConfig,
                            tanggalTutup: e.target.value,
                          })
                        }
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15"
                      />
                    </div>
                  </div>
                </div>

                {/* Preferensi Notifikasi */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-slate-800">
                    <BellRing className="w-4 h-4 text-app-secondary-600" />
                    <span>Notifikasi Verifikator</span>
                  </div>

                  <div className="space-y-2.5">
                    <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-slate-50/60 px-4 py-3 cursor-pointer">
                      <div>
                        <p className="font-bold text-slate-800">
                          Notifikasi Email Pengajuan Baru
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Kirim pemberitahuan ke email dinas setiap kali ada
                          proposal baru masuk.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={systemConfig.notifikasiEmailMasuk}
                        onChange={(e) =>
                          setSystemConfig({
                            ...systemConfig,
                            notifikasiEmailMasuk: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded border-slate-300 text-app-primary focus:ring-app-primary/25"
                      />
                    </label>

                    <label className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-slate-50/60 px-4 py-3 cursor-pointer">
                      <div>
                        <p className="font-bold text-slate-800">
                          Ringkasan Antrean Verifikasi Harian
                        </p>
                        <p className="text-[11px] text-slate-500">
                          Tampilkan pengingat proposal yang belum diperiksa
                          lebih dari 3 hari kerja.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={systemConfig.notifikasiRingkasanHarian}
                        onChange={(e) =>
                          setSystemConfig({
                            ...systemConfig,
                            notifikasiRingkasanHarian: e.target.checked,
                          })
                        }
                        className="w-4 h-4 rounded border-slate-300 text-app-primary focus:ring-app-primary/25"
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-app-primary hover:bg-app-primary-800 disabled:opacity-60 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  {isSaving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-app-secondary" />
                  ) : (
                    <Save className="w-3.5 h-3.5 text-app-secondary" />
                  )}
                  <span>Simpan Pengaturan Sistem</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminPengaturanPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-xs text-slate-500">
          Memuat pengaturan akun...
        </div>
      }
    >
      <AdminPengaturanContent />
    </Suspense>
  );
}
