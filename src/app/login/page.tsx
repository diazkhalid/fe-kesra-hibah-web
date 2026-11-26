"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Landmark,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ArrowLeft,
  Loader2,
  AlertCircle,
  ShieldCheck,
  FileCheck2,
  Activity,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth.hook";

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading, error: authError, clearError } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const errorMessage = validationError || authError;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError(null);
    clearError();

    if (!email.trim() || !password.trim()) {
      setValidationError("Email dan password wajib diisi.");
      return;
    }

    await login({
      email: email.trim(),
      password,
    });
  };

  const handleGoogleLogin = async () => {
    setValidationError(null);
    clearError();
    setIsGoogleLoading(true);
    try {
      // Hubungkan dengan NextAuth signIn("google") atau OAuth provider Anda
      await new Promise((resolve) => setTimeout(resolve, 900));
      router.push("/dashboard/admin");
    } catch {
      setValidationError("Gagal menghubungkan dengan akun Google.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const isBusy = isLoading || isGoogleLoading;

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-12 bg-white">
      {/* KOLOM KIRI (7 KOLOM): Kanvas Form Minimalis Tanpa Kotak Card */}
      <div className="lg:col-span-7 flex flex-col justify-between px-6 py-8 sm:px-12 lg:px-16">
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

        {/* Tengah: Area Form Utama */}
        <div className="w-full max-w-sm mx-auto my-auto py-8 space-y-6">
          {/* Header Form */}
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-app-primary-50 border border-app-primary-100 text-app-primary text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-app-secondary" />
              <span>Akses Portal Pemohon</span>
            </div>

            <h1 className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight">
              Selamat Datang Kembali
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              Masuk menggunakan email yang terdaftar pada layanan pengajuan
              hibah Kabupaten Sumbawa.
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

          {/* Form Kredensial Utama */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="block text-xs font-bold text-slate-700"
              >
                Email
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
                  disabled={isBusy}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15 disabled:opacity-60 transition-all"
                />
              </div>
            </div>

            {/* Password + Lupa Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-xs font-bold text-slate-700"
                >
                  Password
                </label>
                <Link
                  href="/lupa-password"
                  className="text-[11px] font-semibold text-app-primary hover:text-app-secondary-600 hover:underline underline-offset-4 transition-colors"
                >
                  Lupa Password?
                </Link>
              </div>

              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  disabled={isBusy}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password Anda"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15 disabled:opacity-60 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword ? "Sembunyikan password" : "Tampilkan password"
                  }
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Tombol Login Utama */}
            <button
              type="submit"
              disabled={isBusy}
              className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-app-primary hover:bg-app-primary-800 disabled:opacity-60 text-white text-xs font-bold py-2.5 px-5 shadow-md shadow-app-primary/15 transition-all duration-200 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-app-secondary" />
                  <span>Memproses Login...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 text-app-secondary" />
                  <span>Login</span>
                </>
              )}
            </button>
          </form>

          {/* Divider Opsi Alternatif */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200/80 w-full" />
            <span className="bg-white px-3 text-[10.5px] font-medium text-slate-400 shrink-0">
              atau lanjutkan dengan
            </span>
            <div className="border-t border-slate-200/80 w-full" />
          </div>

          {/* Tombol Login Google di Bagian Bawah */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isBusy}
            className="w-full inline-flex items-center justify-center gap-2.5 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-slate-100/80 disabled:opacity-60 px-4 py-2.5 text-xs font-bold text-slate-700 transition-all duration-150 cursor-pointer"
          >
            {isGoogleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-app-primary" />
            ) : (
              <svg
                aria-hidden="true"
                className="w-4 h-4 shrink-0"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                />
              </svg>
            )}
            <span>
              {isGoogleLoading
                ? "Menghubungkan ke Google..."
                : "Login dengan Google"}
            </span>
          </button>

          {/* Link Registrasi */}
          <p className="text-center text-xs text-slate-600 pt-1">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="font-bold text-app-primary hover:text-app-secondary-600 underline decoration-app-secondary decoration-2 underline-offset-4 transition-colors"
            >
              Registrasi Sekarang
            </Link>
          </p>
        </div>

        {/* Footer Kecil di Bawah Form */}
        <p className="text-center text-[10.5px] text-slate-400">
          &copy; {new Date().getFullYear()} E-Hibah • Bagian Kesejahteraan
          Rakyat Kab. Sumbawa
        </p>
      </div>

      {/* KOLOM KANAN (5 KOLOM): Panel Visual & Ringkasan Layanan (Desktop) */}
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

        {/* Highlight Fitur di Tengah */}
        <div className="relative space-y-5 my-auto">
          <div className="space-y-2">
            <span className="inline-block px-2.5 py-1 rounded-full bg-app-secondary/20 border border-app-secondary/30 text-app-secondary-200 text-[10px] font-bold">
              Bagian Kesejahteraan Rakyat
            </span>
            <h2 className="text-xl xl:text-2xl font-extrabold leading-snug text-white">
              Kelola Pengajuan Hibah Secara Digital & Terukur
            </h2>
            <p className="text-xs text-app-primary-100 leading-relaxed">
              Satu pintu layanan pengajuan proposal bantuan hibah bagi lembaga
              dan masyarakat di Kabupaten Sumbawa.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-3.5">
              <div className="w-8 h-8 rounded-lg bg-app-secondary text-app-primary-950 flex items-center justify-center shrink-0">
                <FileCheck2 className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  Pengunggahan Proposal Terpusat
                </p>
                <p className="text-[11px] text-app-primary-200 mt-0.5">
                  Lengkapi formulir dan unggah seluruh berkas dalam format PDF.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 p-3.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">
                  Pantau Progres Verifikasi
                </p>
                <p className="text-[11px] text-app-primary-200 mt-0.5">
                  Lihat status pemeriksaan dan catatan hasil verifikasi kapan
                  saja.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Panel Kanan */}
        <div className="relative pt-4 border-t border-white/15 flex items-center gap-2 text-[11px] text-app-primary-200">
          <ShieldCheck className="w-4 h-4 text-app-secondary shrink-0" />
          <span>Sekretariat Daerah Kabupaten Sumbawa</span>
        </div>
      </div>
    </div>
  );
}
