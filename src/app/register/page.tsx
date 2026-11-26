"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Landmark,
  CreditCard,
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  FileCheck2,
  Clock,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth.hook";

interface RegisterFormData {
  nik: string;
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

export default function RegisterPage() {
  const { register, isLoading, error: authError, clearError } = useAuth();

  const [formData, setFormData] = useState<RegisterFormData>({
    nik: "",
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const errorMessage = validationError || authError;

  const handleNikChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Hanya mengizinkan angka dan maksimal 16 digit sesuai standar NIK
    const numericValue = e.target.value.replace(/\D/g, "").slice(0, 16);
    setFormData((prev) => ({ ...prev, nik: numericValue }));
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Hanya mengizinkan angka dan maksimal 15 digit
    const numericValue = e.target.value.replace(/\D/g, "").slice(0, 15);
    setFormData((prev) => ({ ...prev, phone: numericValue }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (formData.nik.length !== 16) {
      setValidationError("NIK harus terdiri dari 16 digit angka yang valid.");
      return;
    }

    if (!formData.fullName.trim()) {
      setValidationError("Nama lengkap wajib diisi.");
      return;
    }

    if (!formData.email.trim()) {
      setValidationError("Alamat email wajib diisi.");
      return;
    }

    if (formData.phone.length < 10) {
      setValidationError("Nomor HP minimal terdiri dari 10 digit angka.");
      return;
    }

    if (formData.password.length < 8) {
      setValidationError("Password minimal terdiri dari 8 karakter.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setValidationError("Konfirmasi password tidak cocok dengan password.");
      return;
    }

    if (!formData.agreeTerms) {
      setValidationError(
        "Anda harus menyetujui syarat dan ketentuan layanan terlebih dahulu.",
      );
      return;
    }

    await register({
      nik: formData.nik,
      full_name: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone,
      password: formData.password,
      password_confirmation: formData.confirmPassword,
      agree_to_terms: formData.agreeTerms,
    });
  };

  const isPasswordMatch =
    formData.confirmPassword.length > 0 &&
    formData.password === formData.confirmPassword;

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white">
      {/* KOLOM KIRI (7 KOLOM): Kanvas Form Registrasi */}
      <div className="lg:col-span-7 flex flex-col justify-between px-6 py-7 sm:px-12 lg:px-14">
        {/* Bar Atas: Navigasi Kembali */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-app-primary transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-150 group-hover:-translate-x-0.5" />
            <span>Kembali ke Beranda</span>
          </Link>

          <Link href="/" className="flex items-center gap-2 lg:hidden">
            <div className="w-7 h-7 rounded-lg bg-app-primary text-white flex items-center justify-center">
              <Landmark className="w-3.5 h-3.5 text-app-secondary" />
            </div>
            <span className="text-sm font-extrabold text-app-primary">
              E-Hibah
            </span>
          </Link>
        </div>

        {/* Tengah: Form Registrasi */}
        <div className="w-full max-w-lg mx-auto my-auto py-6 space-y-5">
          {/* Header Form */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-app-primary-50 border border-app-primary-100 text-app-primary text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-app-secondary" />
              <span>Langkah 01 • Pendaftaran Akun Pemohon</span>
            </div>

            <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight">
              Buat Akun E-Hibah
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              Lengkapi data penanggung jawab di bawah ini untuk mulai mengajukan
              proposal bantuan hibah Kabupaten Sumbawa.
            </p>
          </div>

          {/* Alert Error */}
          {errorMessage && (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-200 px-3.5 py-2.5 text-[11.5px] font-medium text-red-700"
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Baris 1: NIK & Nama Lengkap */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* NIK */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="nik"
                    className="block text-xs font-bold text-slate-700"
                  >
                    NIK <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] font-medium text-slate-400">
                    {formData.nik.length}/16 digit
                  </span>
                </div>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <CreditCard className="w-4 h-4" />
                  </span>
                  <input
                    id="nik"
                    name="nik"
                    type="text"
                    inputMode="numeric"
                    required
                    disabled={isLoading}
                    value={formData.nik}
                    onChange={handleNikChange}
                    placeholder="16 digit NIK KTP"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15 disabled:opacity-60 transition-all"
                  />
                </div>
              </div>

              {/* Nama Lengkap */}
              <div className="space-y-1.5">
                <label
                  htmlFor="fullName"
                  className="block text-xs font-bold text-slate-700"
                >
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    disabled={isLoading}
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        fullName: e.target.value,
                      }))
                    }
                    placeholder="Sesuai KTP penanggung jawab"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15 disabled:opacity-60 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Baris 2: Email & Nomor HP */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Email */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="block text-xs font-bold text-slate-700"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    disabled={isLoading}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="nama@email.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15 disabled:opacity-60 transition-all"
                  />
                </div>
              </div>

              {/* Nomor HP */}
              <div className="space-y-1.5">
                <label
                  htmlFor="phone"
                  className="block text-xs font-bold text-slate-700"
                >
                  Nomor HP (WhatsApp) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    disabled={isLoading}
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="0812xxxxxxxx"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15 disabled:opacity-60 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Baris 3: Password & Konfirmasi Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Password */}
              <div className="space-y-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs font-bold text-slate-700"
                >
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    disabled={isLoading}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        password: e.target.value,
                      }))
                    }
                    placeholder="Minimal 8 karakter"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15 disabled:opacity-60 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword
                        ? "Sembunyikan password"
                        : "Tampilkan password"
                    }
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Konfirmasi Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="confirmPassword"
                    className="block text-xs font-bold text-slate-700"
                  >
                    Konfirmasi Password <span className="text-red-500">*</span>
                  </label>
                  {isPasswordMatch && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600">
                      <CheckCircle2 className="w-3 h-3" />
                      Cocok
                    </span>
                  )}
                </div>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    disabled={isLoading}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    placeholder="Ulangi password"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15 disabled:opacity-60 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={
                      showConfirmPassword
                        ? "Sembunyikan konfirmasi password"
                        : "Tampilkan konfirmasi password"
                    }
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Persetujuan Ketentuan Layanan */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  disabled={isLoading}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      agreeTerms: e.target.checked,
                    }))
                  }
                  className="mt-0.5 w-3.5 h-3.5 rounded border-slate-300 text-app-primary focus:ring-app-primary/25 cursor-pointer shrink-0"
                />
                <span className="text-[11px] text-slate-600 leading-relaxed">
                  Saya menyatakan bahwa data yang diisikan adalah benar dan
                  menyetujui{" "}
                  <Link
                    href="/#persyaratan"
                    className="font-semibold text-app-primary hover:underline underline-offset-4"
                  >
                    Syarat & Ketentuan Layanan
                  </Link>{" "}
                  pengajuan hibah Pemerintah Kabupaten Sumbawa.
                </span>
              </label>
            </div>

            {/* Tombol Daftar */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-app-primary hover:bg-app-primary-800 disabled:opacity-60 text-white text-xs font-bold py-2.5 px-5 shadow-md shadow-app-primary/15 transition-all duration-200 cursor-pointer mt-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-app-secondary" />
                  <span>Mendaftarkan Akun...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 text-app-secondary" />
                  <span>Daftar</span>
                </>
              )}
            </button>
          </form>

          {/* Link Login */}
          <p className="text-center text-xs text-slate-600 pt-1">
            Sudah memiliki akun?{" "}
            <Link
              href="/login"
              className="font-bold text-app-primary hover:text-app-secondary-600 underline decoration-app-secondary decoration-2 underline-offset-4 transition-colors"
            >
              Login di Sini
            </Link>
          </p>
        </div>

        {/* Footer Kecil di Bawah Form */}
        <p className="text-center text-[10.5px] text-slate-400">
          &copy; {new Date().getFullYear()} E-Hibah • Bagian Kesejahteraan
          Rakyat Kab. Sumbawa
        </p>
      </div>

      {/* KOLOM KANAN (5 KOLOM): Panel Panduan & Identitas Layanan (Desktop) */}
      <div className="hidden lg:flex lg:col-span-5 relative bg-gradient-to-br from-app-primary-950 via-app-primary-900 to-app-primary p-10 xl:p-12 text-white flex-col justify-between overflow-hidden">
        {/* Dekorasi Cahaya & Pola */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-app-secondary/25 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-sky-400/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff16_1px,transparent_1px)] [background-size:20px_20px] opacity-50"
        />

        {/* Brand Atas */}
        <div className="relative flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 border border-white/20 text-white">
            <Landmark className="w-5 h-5 text-app-secondary" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-app-secondary" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold tracking-tight text-white leading-none">
                E-Hibah
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-app-secondary" />
            </div>
            <span className="text-[10px] font-medium text-app-secondary-200 block mt-1">
              Pemerintah Kabupaten Sumbawa
            </span>
          </div>
        </div>

        {/* Highlight Panduan Registrasi di Tengah */}
        <div className="relative space-y-5 my-auto">
          <div className="space-y-2">
            <span className="inline-block px-2.5 py-1 rounded-full bg-app-secondary/20 border border-app-secondary/30 text-app-secondary-200 text-[10px] font-bold">
              Ketentuan Akun Pemohon
            </span>
            <h2 className="text-xl xl:text-2xl font-extrabold leading-snug text-white">
              Satu Akun untuk Pengajuan Proposal Lembaga Anda
            </h2>
            <p className="text-xs text-app-primary-100 leading-relaxed">
              Gunakan identitas penanggung jawab yang aktif untuk memudahkan
              koordinasi dan notifikasi selama proses verifikasi.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-3.5">
              <div className="w-8 h-8 rounded-lg bg-app-secondary text-app-primary-950 flex items-center justify-center shrink-0">
                <FileCheck2 className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  Validasi Identitas 16 Digit NIK
                </p>
                <p className="text-[11px] text-app-primary-200 mt-0.5">
                  Memastikan setiap akun terhubung dengan penanggung jawab resmi
                  lembaga.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-3.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  Notifikasi & Pemantauan Cepat
                </p>
                <p className="text-[11px] text-app-primary-200 mt-0.5">
                  Informasi kelengkapan dokumen dan hasil verifikasi langsung
                  terpantau dari dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Panel Kanan */}
        <div className="relative pt-4 border-t border-white/15 flex items-center gap-2 text-[11px] text-app-primary-200">
          <ShieldCheck className="w-4 h-4 text-app-secondary shrink-0" />
          <span>Bagian Kesejahteraan Rakyat • Setda Kabupaten Sumbawa</span>
        </div>
      </div>
    </div>
  );
}
