"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Landmark,
  Mail,
  Send,
  ArrowLeft,
  Loader2,
  AlertCircle,
  CheckCircle2,
  KeyRound,
  MailCheck,
  RotateCcw,
  ShieldCheck,
  LockKeyhole,
  Lock,
  Eye,
  EyeOff,
  ShieldAlert,
} from "lucide-react";

type StepNumber = 1 | 2 | 3;

type AlertBanner = {
  type: "error" | "success";
  title: string;
  message: string;
} | null;

function ForgotPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Baca query params: ?step=1|2|3, ?email=..., ?token=...
  const rawStep = searchParams.get("step");
  const emailParam = searchParams.get("email") || "";
  const tokenParam = searchParams.get("token") || "";

  // Tentukan step aktif (jika ada token di URL tanpa step, otomatis arahkan ke step 3)
  const activeStep: StepNumber = (() => {
    if (rawStep === "3" || (!rawStep && tokenParam)) return 3;
    if (rawStep === "2") return 2;
    return 1;
  })();

  // State Step 1 (Input Email)
  const [email, setEmail] = useState(emailParam);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // State Step 3 (Validasi Token & Form Password Baru)
  const [isValidatingToken, setIsValidatingToken] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState<boolean>(false);
  const [tokenErrorMessage, setTokenErrorMessage] = useState<string>("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [isPasswordUpdated, setIsPasswordUpdated] = useState(false);

  // State Notifikasi Umum
  const [alertBanner, setAlertBanner] = useState<AlertBanner>(null);

  // Sinkronisasi input email jika query param berubah
  useEffect(() => {
    if (emailParam) setEmail(emailParam);
  }, [emailParam]);

  // Validasi Token otomatis saat memasuki Step 3
  useEffect(() => {
    if (activeStep !== 3) return;

    let isMounted = true;
    const verifyResetToken = async () => {
      setAlertBanner(null);

      if (!tokenParam.trim()) {
        setIsTokenValid(false);
        setTokenErrorMessage(
          "Token validasi tidak ditemukan pada tautan. Silakan ajukan permintaan reset password kembali.",
        );
        return;
      }

      setIsValidatingToken(true);
      try {
        // Simulasi verifikasi token ke backend API Anda (misal: GET /api/auth/verify-reset-token?token=...)
        await new Promise((resolve) => setTimeout(resolve, 650));

        if (!isMounted) return;

        // Simulasi token tidak valid / kedaluwarsa (minimal 8 karakter & bukan "expired")
        if (
          tokenParam.trim().length < 8 ||
          tokenParam.toLowerCase() === "expired" ||
          tokenParam.toLowerCase() === "invalid"
        ) {
          setIsTokenValid(false);
          setTokenErrorMessage(
            "Tautan reset password tidak valid atau masa berlakunya telah habis. Silakan minta tautan baru.",
          );
          return;
        }

        setIsTokenValid(true);
      } catch {
        if (!isMounted) return;
        setIsTokenValid(false);
        setTokenErrorMessage(
          "Terjadi gangguan saat memverifikasi token keamanan. Silakan coba beberapa saat lagi.",
        );
      } finally {
        if (isMounted) setIsValidatingToken(false);
      }
    };

    verifyResetToken();
    return () => {
      isMounted = false;
    };
  }, [activeStep, tokenParam]);

  // Helper navigasi query params
  const goToStep = (step: StepNumber, extraParams?: Record<string, string>) => {
    const params = new URLSearchParams();
    params.set("step", String(step));
    if (extraParams) {
      Object.entries(extraParams).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });
    }
    router.push(`/lupa-password?${params.toString()}`);
  };

  // Handler Step 1: Kirim Instruksi ke Email
  const handleSendResetLink = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAlertBanner(null);

    const trimmedEmail = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setAlertBanner({
        type: "error",
        title: "Format Email Tidak Valid",
        message: "Masukkan alamat email terdaftar yang valid.",
      });
      return;
    }

    setIsSendingEmail(true);
    try {
      // Simulasi request API kirim email reset password
      await new Promise((resolve) => setTimeout(resolve, 900));

      if (trimmedEmail.toLowerCase() === "tidakada@contoh.com") {
        setAlertBanner({
          type: "error",
          title: "Email Tidak Terdaftar",
          message:
            "Alamat email tersebut tidak terdaftar pada sistem E-Hibah Kabupaten Sumbawa.",
        });
        return;
      }

      // Arahkan ke Step 2 melalui query params
      goToStep(2, { email: trimmedEmail });
    } catch {
      setAlertBanner({
        type: "error",
        title: "Gagal Mengirim Instruksi",
        message:
          "Periksa koneksi internet Anda dan silakan coba beberapa saat lagi.",
      });
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Handler Step 3: Simpan Password Baru
  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAlertBanner(null);

    if (newPassword.length < 8) {
      setAlertBanner({
        type: "error",
        title: "Password Terlalu Pendek",
        message: "Password baru minimal terdiri dari 8 karakter.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      setAlertBanner({
        type: "error",
        title: "Konfirmasi Tidak Cocok",
        message: "Konfirmasi password baru harus sama dengan password baru.",
      });
      return;
    }

    setIsResettingPassword(true);
    try {
      // Simulasi submit password baru beserta token ke API backend
      await new Promise((resolve) => setTimeout(resolve, 950));
      setIsPasswordUpdated(true);
      setAlertBanner({
        type: "success",
        title: "Password Berhasil Diperbarui",
        message:
          "Kata sandi akun E-Hibah Anda telah berhasil diubah. Silakan login menggunakan password baru Anda.",
      });
    } catch {
      setAlertBanner({
        type: "error",
        title: "Gagal Memperbarui Password",
        message:
          "Terjadi kesalahan saat menyimpan password baru. Silakan ulangi kembali.",
      });
    } finally {
      setIsResettingPassword(false);
    }
  };

  const isPasswordMatch =
    confirmPassword.length > 0 && newPassword === confirmPassword;

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-app-primary-950 text-white px-4 py-7 sm:px-6 overflow-hidden">
      {/* Ambient Mesh Glow & Pola Geometris */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-24 w-96 h-96 rounded-full bg-app-primary-600/35 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -right-24 w-80 h-80 rounded-full bg-app-secondary/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-sky-500/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff12_1px,transparent_1px)] [background-size:22px_22px] opacity-60"
      />

      {/* TOP BAR */}
      <header className="relative z-10 w-full max-w-4xl mx-auto flex items-center justify-between">
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/15 text-xs font-semibold text-white transition-all group"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-app-secondary transition-transform duration-150 group-hover:-translate-x-0.5" />
          <span>Kembali ke Login</span>
        </Link>

        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center w-8.5 h-8.5 rounded-xl bg-white/10 border border-white/20 text-white transition-transform duration-200 group-hover:scale-105">
            <Landmark className="w-4 h-4 text-app-secondary" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-app-secondary" />
          </div>
          <div className="text-left">
            <p className="text-xs font-extrabold tracking-tight text-white leading-none">
              E-Hibah
            </p>
            <p className="text-[9.5px] font-medium text-app-secondary-300 mt-0.5">
              Kabupaten Sumbawa
            </p>
          </div>
        </Link>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative z-10 w-full max-w-md mx-auto my-auto py-8 space-y-4">
        {/* STEPPER TAB TERHUBUNG QUERY PARAMS (?step=1 | 2 | 3) */}
        <nav
          aria-label="Tahapan Pemulihan Password"
          className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 px-3.5 py-2.5 flex items-center justify-between gap-1.5 text-[10.5px]"
        >
          {/* Tab Step 1 */}
          <button
            type="button"
            onClick={() => {
              setAlertBanner(null);
              goToStep(1, email ? { email } : undefined);
            }}
            className="flex items-center gap-1.5 cursor-pointer group focus:outline-none"
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold transition-all ${
                activeStep === 1
                  ? "bg-app-secondary text-app-primary-950 ring-3 ring-app-secondary/30"
                  : "bg-emerald-400 text-app-primary-950"
              }`}
            >
              1
            </span>
            <span
              className={`font-bold transition-colors ${
                activeStep === 1
                  ? "text-white"
                  : "text-app-primary-100 group-hover:text-white"
              }`}
            >
              Input Email
            </span>
          </button>

          <div
            className={`h-px flex-1 transition-colors ${
              activeStep >= 2 ? "bg-emerald-400/70" : "bg-white/20"
            }`}
          />

          {/* Tab Step 2 */}
          <button
            type="button"
            onClick={() => {
              if (email.trim()) {
                setAlertBanner(null);
                goToStep(2, { email: email.trim() });
              }
            }}
            disabled={!email.trim() && activeStep < 2}
            className="flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed group focus:outline-none"
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold transition-all ${
                activeStep === 2
                  ? "bg-app-secondary text-app-primary-950 ring-3 ring-app-secondary/30"
                  : activeStep > 2
                    ? "bg-emerald-400 text-app-primary-950"
                    : "bg-white/15 text-white/60"
              }`}
            >
              2
            </span>
            <span
              className={`font-semibold transition-colors ${
                activeStep === 2
                  ? "text-app-secondary-200 font-bold"
                  : activeStep > 2
                    ? "text-app-primary-100"
                    : "text-white/60"
              }`}
            >
              Cek Tautan
            </span>
          </button>

          <div
            className={`h-px flex-1 transition-colors ${
              activeStep === 3 ? "bg-emerald-400/70" : "bg-white/20"
            }`}
          />

          {/* Tab Step 3 */}
          <div className="flex items-center gap-1.5">
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold transition-all ${
                activeStep === 3
                  ? "bg-app-secondary text-app-primary-950 ring-3 ring-app-secondary/30"
                  : "bg-white/15 text-white/60"
              }`}
            >
              3
            </span>
            <span
              className={`font-semibold ${
                activeStep === 3
                  ? "text-app-secondary-200 font-bold"
                  : "text-white/60"
              }`}
            >
              Password Baru
            </span>
          </div>
        </nav>

        {/* KARTU UTAMA */}
        <div className="rounded-3xl bg-white text-slate-800 shadow-2xl shadow-black/30 border border-white/20 overflow-hidden">
          <div className="p-6 sm:p-8 space-y-5">
            {/* Header Kartu */}
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-app-primary to-app-primary-800 text-white flex items-center justify-center shrink-0 shadow-md shadow-app-primary/20">
                <LockKeyhole className="w-5 h-5 text-app-secondary" />
              </div>
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-app-secondary-600">
                  <KeyRound className="w-3 h-3" />
                  Tahap 0{activeStep} • Pemulihan Akun
                </span>
                <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {activeStep === 1 && "Lupa Password?"}
                  {activeStep === 2 && "Periksa Email Anda"}
                  {activeStep === 3 && "Buat Password Baru"}
                </h1>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {activeStep === 1 &&
                    "Masukkan alamat email terdaftar untuk menerima tautan pengaturan ulang kata sandi."}
                  {activeStep === 2 &&
                    "Tautan verifikasi reset password telah dikirimkan ke alamat email akun Anda."}
                  {activeStep === 3 &&
                    "Silakan tentukan kata sandi baru untuk mengamankan kembali akun E-Hibah Anda."}
                </p>
              </div>
            </div>

            {/* BANNER INFORMASI BERHASIL / GAGAL */}
            {alertBanner && (
              <div
                role={alertBanner.type === "error" ? "alert" : "status"}
                className={`flex items-start gap-2.5 rounded-2xl border px-3.5 py-3 text-[11.5px] ${
                  alertBanner.type === "error"
                    ? "bg-red-50 border-red-200/90 text-red-700"
                    : "bg-emerald-50 border-emerald-200/90 text-emerald-800"
                }`}
              >
                {alertBanner.type === "error" ? (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-0.5">
                  <p
                    className={`font-bold ${
                      alertBanner.type === "error"
                        ? "text-red-800"
                        : "text-emerald-900"
                    }`}
                  >
                    {alertBanner.title}
                  </p>
                  <p className="leading-relaxed">{alertBanner.message}</p>
                </div>
              </div>
            )}

            {/* =========================================================
                STEP 1: FORM INPUT EMAIL
            ========================================================= */}
            {activeStep === 1 && (
              <form onSubmit={handleSendResetLink} className="space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="email"
                    className="block text-xs font-bold text-slate-700"
                  >
                    Email Terdaftar <span className="text-red-500">*</span>
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
                      disabled={isSendingEmail}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@lembaga.org"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15 disabled:opacity-60 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSendingEmail}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-app-primary to-app-primary-700 hover:from-app-primary-800 hover:to-app-primary disabled:opacity-60 text-white text-xs font-bold py-2.5 px-5 shadow-md shadow-app-primary/20 transition-all duration-200 cursor-pointer"
                >
                  {isSendingEmail ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-app-secondary" />
                      <span>Mengirim Instruksi...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 text-app-secondary" />
                      <span>Kirim Instruksi Reset Password</span>
                    </>
                  )}
                </button>
              </form>
            )}

            {/* =========================================================
                STEP 2: KONFIRMASI CEK TAUTAN EMAIL (?step=2&email=...)
            ========================================================= */}
            {activeStep === 2 && (
              <div className="rounded-2xl bg-gradient-to-b from-emerald-50 to-teal-50/50 border border-emerald-200 p-4.5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <CheckCircle2 className="w-4.5 h-4.5" />
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-xs sm:text-sm font-extrabold text-emerald-950">
                      Instruksi Reset Terkirim!
                    </h2>
                    <p className="text-[11px] text-emerald-800 leading-relaxed">
                      Silakan buka kotak masuk atau folder spam pada email di
                      bawah ini, lalu klik tautan untuk melanjutkan ke tahap
                      pembuatan password baru.
                    </p>
                  </div>
                </div>

                {/* Kotak Alamat Email Tujuan */}
                <div className="rounded-xl bg-white border border-emerald-200/80 px-3.5 py-2.5 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <MailCheck className="w-4 h-4 text-app-primary shrink-0" />
                    <span className="truncate text-xs font-bold text-slate-800">
                      {emailParam || email || "Email terdaftar Anda"}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9.5px] font-bold shrink-0">
                    Terkirim
                  </span>
                </div>

                {/* Tombol Aksi Lanjutan */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-0.5">
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center rounded-xl bg-app-primary hover:bg-app-primary-800 text-white text-xs font-bold py-2.5 px-4 shadow-xs transition-colors"
                  >
                    Ke Halaman Login
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setAlertBanner(null);
                      goToStep(
                        1,
                        emailParam ? { email: emailParam } : undefined,
                      );
                    }}
                    className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold py-2.5 px-3.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Ganti / Kirim Ulang</span>
                  </button>
                </div>
              </div>
            )}

            {/* =========================================================
                STEP 3: VALIDASI TOKEN & FORM PASSWORD BARU (?step=3&token=...)
            ========================================================= */}
            {activeStep === 3 && (
              <>
                {isValidatingToken ? (
                  <div className="py-8 flex flex-col items-center justify-center text-center space-y-2.5">
                    <Loader2 className="w-7 h-7 animate-spin text-app-primary" />
                    <p className="text-xs font-bold text-slate-800">
                      Memvalidasi Token Keamanan...
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Mohon tunggu sebentar, sistem sedang memeriksa keabsahan
                      tautan Anda.
                    </p>
                  </div>
                ) : !isTokenValid ? (
                  /* TAMPILAN JIKA TOKEN TIDAK VALID / KOSONG / EXPIRED */
                  <div className="rounded-2xl bg-red-50/90 border border-red-200 p-4.5 space-y-3.5">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center shrink-0">
                        <ShieldAlert className="w-4.5 h-4.5" />
                      </div>
                      <div className="space-y-1">
                        <h2 className="text-xs sm:text-sm font-extrabold text-red-900">
                          Token Tidak Valid atau Kedaluwarsa
                        </h2>
                        <p className="text-[11px] text-red-700 leading-relaxed">
                          {tokenErrorMessage}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setAlertBanner(null);
                        goToStep(1);
                      }}
                      className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-app-primary hover:bg-app-primary-800 text-white text-xs font-bold py-2.5 px-4 transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-app-secondary" />
                      <span>Minta Tautan Reset Baru</span>
                    </button>
                  </div>
                ) : isPasswordUpdated ? (
                  /* TAMPILAN SETELAH PASSWORD BARU BERHASIL DISIMPAN */
                  <div className="pt-1">
                    <Link
                      href="/login"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-app-primary hover:bg-app-primary-800 text-white text-xs font-bold py-2.5 px-5 shadow-md shadow-app-primary/20 transition-colors"
                    >
                      <span>Login dengan Password Baru</span>
                    </Link>
                  </div>
                ) : (
                  /* FORM INPUT PASSWORD BARU */
                  <form onSubmit={handleUpdatePassword} className="space-y-3.5">
                    {/* Password Baru */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="newPassword"
                        className="block text-xs font-bold text-slate-700"
                      >
                        Password Baru <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                          <Lock className="w-4 h-4" />
                        </span>
                        <input
                          id="newPassword"
                          name="newPassword"
                          type={showNewPassword ? "text" : "password"}
                          autoComplete="new-password"
                          required
                          disabled={isResettingPassword}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Minimal 8 karakter"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15 disabled:opacity-60 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword((prev) => !prev)}
                          aria-label={
                            showNewPassword
                              ? "Sembunyikan password"
                              : "Tampilkan password"
                          }
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Konfirmasi Password Baru */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="confirmNewPassword"
                          className="block text-xs font-bold text-slate-700"
                        >
                          Konfirmasi Password Baru{" "}
                          <span className="text-red-500">*</span>
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
                          id="confirmNewPassword"
                          name="confirmNewPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          autoComplete="new-password"
                          required
                          disabled={isResettingPassword}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Ulangi password baru"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-10 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15 disabled:opacity-60 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword((prev) => !prev)
                          }
                          aria-label={
                            showConfirmPassword
                              ? "Sembunyikan konfirmasi password"
                              : "Tampilkan konfirmasi password"
                          }
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isResettingPassword}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-app-primary to-app-primary-700 hover:from-app-primary-800 hover:to-app-primary disabled:opacity-60 text-white text-xs font-bold py-2.5 px-5 shadow-md shadow-app-primary/20 transition-all duration-200 cursor-pointer mt-1"
                    >
                      {isResettingPassword ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-app-secondary" />
                          <span>Menyimpan Password...</span>
                        </>
                      ) : (
                        <>
                          <KeyRound className="w-4 h-4 text-app-secondary" />
                          <span>Simpan Password Baru</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </>
            )}

            {/* Footer Dalam Kartu */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]">
              <p className="text-slate-500">
                Ingat password?{" "}
                <Link
                  href="/login"
                  className="font-bold text-app-primary hover:underline underline-offset-4"
                >
                  Login
                </Link>
              </p>

              <Link
                href="/#kontak"
                className="font-semibold text-slate-500 hover:text-app-secondary-600 transition-colors"
              >
                Butuh Bantuan Admin?
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* BOTTOM BAR */}
      <footer className="relative z-10 text-center">
        <div className="inline-flex items-center gap-1.5 text-[10.5px] text-app-primary-200">
          <ShieldCheck className="w-3.5 h-3.5 text-app-secondary" />
          <span>
            Bagian Kesejahteraan Rakyat • Sekretariat Daerah Kabupaten Sumbawa
          </span>
        </div>
      </footer>
    </div>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-app-primary-950 text-white">
          <Loader2 className="w-6 h-6 animate-spin text-app-secondary" />
        </div>
      }
    >
      <ForgotPasswordContent />
    </Suspense>
  );
}
