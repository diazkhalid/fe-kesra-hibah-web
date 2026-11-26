"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Landmark,
  Loader2,
  Check,
  X,
  LogIn,
  RefreshCw,
  ArrowLeft,
  ShieldCheck,
  MailCheck,
} from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth.hook";

type VerificationStatus = "verifying" | "success" | "error";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { verifyEmail } = useAuth();

  const [status, setStatus] = useState<VerificationStatus>("verifying");
  const [message, setMessage] = useState<string>(
    "Sedang memvalidasi token aktivasi akun Anda...",
  );

  const hasFetched = useRef(false);

  const verifyToken = async (token: string) => {
    setStatus("verifying");
    setMessage("Sedang memvalidasi token aktivasi akun Anda...");

    const result = await verifyEmail(token);

    if (result.success) {
      setStatus("success");
      setMessage(result.message);
    } else {
      setStatus("error");
      setMessage(result.message);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      setMessage(
        "Parameter token tidak ditemukan. Pastikan Anda membuka tautan penuh yang dikirimkan ke email Anda.",
      );
      return;
    }

    verifyToken(token);
  }, []);

  const handleRetry = () => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      verifyToken(token);
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-50/80 text-slate-900 flex flex-col justify-between overflow-hidden selection:bg-app-primary selection:text-white">
      {/* Latar Belakang Dekoratif Modern: Radial Glow + Subtle Grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_40%,#000_55%,transparent_100%)] opacity-55"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[540px] h-[300px] rounded-full bg-app-primary/10 blur-3xl"
      />

      {/* Top Navigation Bar Minimalis */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-app-primary text-white flex items-center justify-center shadow-sm shadow-app-primary/20 group-hover:scale-105 transition-transform">
            <Landmark className="w-4 h-4 text-app-secondary" />
          </div>
          <div className="leading-tight">
            <span className="text-sm font-extrabold tracking-tight text-slate-900 block">
              E-Hibah
            </span>
            <span className="text-[10px] font-medium text-slate-500 block">
              Kabupaten Sumbawa
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/90 bg-white/80 backdrop-blur-sm px-3.5 py-1.5 text-[11px] font-semibold text-slate-600 hover:text-app-primary hover:border-app-primary/30 transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Beranda</span>
        </Link>
      </header>

      {/* Main Centered Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-[440px]">
          {/* Outer Glass Frame */}
          <div className="rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-[0_20px_50px_-15px_rgba(15,23,42,0.08)] p-8 sm:p-10 text-center space-y-6">
            {/* Step Pill */}
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-[10.5px] font-bold tracking-wide uppercase">
                <MailCheck className="w-3.5 h-3.5 text-app-primary" />
                <span>Verifikasi Email</span>
              </span>
            </div>

            {/* Dynamic Status Emblem dengan Multi-Layer Ring */}
            <div className="relative flex items-center justify-center py-2">
              {status === "verifying" && (
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-24 h-24 rounded-full bg-app-primary/10 animate-ping" />
                  <div className="relative w-20 h-20 rounded-full bg-app-primary-50 border border-app-primary/20 flex items-center justify-center text-app-primary">
                    <Loader2 className="w-9 h-9 animate-spin" />
                  </div>
                </div>
              )}

              {status === "success" && (
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-24 h-24 rounded-full bg-emerald-500/10" />
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/25">
                    <Check className="w-9 h-9 stroke-[2.8]" />
                  </div>
                </div>
              )}

              {status === "error" && (
                <div className="relative flex items-center justify-center">
                  <span className="absolute w-24 h-24 rounded-full bg-rose-500/10" />
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center shadow-lg shadow-rose-500/25">
                    <X className="w-9 h-9 stroke-[2.8]" />
                  </div>
                </div>
              )}
            </div>

            {/* Heading & Deskripsi */}
            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {status === "verifying" && "Memverifikasi Akun Anda"}
                {status === "success" && "Email Berhasil Diverifikasi"}
                {status === "error" && "Verifikasi Gagal"}
              </h1>
              <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed max-w-sm mx-auto">
                {message}
              </p>
            </div>

            {/* Action Area */}
            {status === "verifying" && (
              <div className="pt-2">
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-app-primary rounded-full animate-pulse" />
                </div>
                <p className="text-[11px] text-slate-400 mt-2.5">
                  Mohon tidak menutup atau memuat ulang halaman ini
                </p>
              </div>
            )}

            {status === "success" && (
              <div className="pt-2 space-y-3">
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-app-primary hover:bg-app-primary-800 text-white text-xs font-bold py-3 px-6 shadow-lg shadow-app-primary/20 transition-all duration-200 cursor-pointer"
                >
                  <LogIn className="w-4 h-4 text-app-secondary" />
                  <span>Masuk ke Portal Pemohon</span>
                </button>
              </div>
            )}

            {status === "error" && (
              <div className="pt-2 space-y-2.5">
                <button
                  type="button"
                  onClick={handleRetry}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-app-primary hover:bg-app-primary-800 text-white text-xs font-bold py-3 px-6 shadow-lg shadow-app-primary/20 transition-all duration-200 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-app-secondary" />
                  <span>Coba Verifikasi Ulang</span>
                </button>

                <Link
                  href="/login"
                  className="w-full inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100 text-slate-700 text-xs font-bold py-2.5 px-6 transition-all"
                >
                  Kembali ke Halaman Login
                </Link>
              </div>
            )}
          </div>

          {/* Security Footnote di bawah kontainer */}
          <div className="mt-5 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-app-primary/70 shrink-0" />
            <span>Tautan terenkripsi • Bagian Kesra Setda Kab. Sumbawa</span>
          </div>
        </div>
      </main>

      {/* Minimal Bottom Footer */}
      <footer className="relative z-10 py-5 text-center text-[11px] text-slate-400">
        &copy; {new Date().getFullYear()} E-Hibah Pemerintah Kabupaten Sumbawa
      </footer>
    </div>
  );
}
