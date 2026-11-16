"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  FileCheck2,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Sparkles,
  Users,
  FileSpreadsheet,
} from "lucide-react";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative overflow-hidden bg-gradient-to-br from-app-primary-950 via-app-primary to-app-primary-800 text-white pt-10 pb-16 lg:pt-14 lg:pb-22"
    >
      {/* Elemen Dekoratif Warna-Warni (Glow & Pola Geometris Modern) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -right-24 h-[420px] w-[420px] rounded-full bg-app-secondary/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 h-[380px] w-[380px] rounded-full bg-sky-400/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff18_1px,transparent_1px)] [background-size:22px_22px] opacity-40"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* KOLOM KIRI: Konten Utama & CTA */}
          <div className="lg:col-span-6 space-y-4 text-left">
            {/* Badge Berwarna */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-sm">
              <span className="flex items-center justify-center w-3.5 h-3.5 rounded-full bg-app-secondary text-app-primary-950">
                <Sparkles className="w-2 h-2 stroke-[2.5]" />
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-app-secondary-100 tracking-wide">
                Layanan Digital Pemerintah Kabupaten Sumbawa
              </span>
            </div>

            {/* Headline Utama */}
            <h1 className="text-[22px] sm:text-[27px] lg:text-[33px] font-extrabold tracking-tight leading-[1.2] text-white">
              Pengajuan Hibah Kini Lebih{" "}
              <span className="bg-gradient-to-r from-app-secondary-300 via-app-secondary to-amber-200 bg-clip-text text-transparent">
                Mudah dan Transparan
              </span>
            </h1>

            {/* Deskripsi Singkat */}
            <p className="text-xs sm:text-[13.5px] text-app-primary-100 leading-relaxed max-w-lg">
              Layanan digital pengajuan bantuan hibah Pemerintah Kabupaten
              Sumbawa melalui{" "}
              <span className="font-semibold text-white underline decoration-app-secondary decoration-2 underline-offset-4">
                Bagian Kesejahteraan Rakyat
              </span>
              . Ajukan proposal, lengkapi persyaratan, dan pantau proses
              verifikasi secara online.
            </p>

            {/* Tombol CTA */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 pt-1">
              <Link
                href="/daftar-pengajuan"
                className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 rounded-full text-[11.5px] sm:text-xs font-bold text-app-primary-950 bg-gradient-to-r from-app-secondary to-app-secondary-400 hover:from-app-secondary-400 hover:to-app-secondary-300 shadow-lg shadow-app-secondary/25 transition-all duration-200 group"
              >
                <span>Mulai Pengajuan</span>
                <span className="flex items-center justify-center w-4.5 h-4.5 rounded-full bg-app-primary text-white transition-transform duration-200 group-hover:translate-x-1">
                  <ArrowRight className="w-2.5 h-2.5 stroke-[2.5]" />
                </span>
              </Link>

              <Link
                href="/persyaratan"
                className="inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-full text-[11.5px] sm:text-xs font-semibold text-white bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/25 transition-all duration-200"
              >
                <FileCheck2 className="w-3.5 h-3.5 text-app-secondary-300" />
                <span>Lihat Persyaratan</span>
              </Link>
            </div>

            {/* Indikator Keunggulan (Glass Pill Cards) */}
            <div className="pt-2.5 grid grid-cols-1 sm:grid-cols-3 gap-2 max-w-lg">
              <div className="flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 px-2.5 py-2">
                <div className="w-6.5 h-6.5 rounded-lg bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white leading-tight">
                    Resmi & Aman
                  </p>
                  <p className="text-[9px] text-app-primary-200">Bag. Kesra</p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 px-2.5 py-2">
                <div className="w-6.5 h-6.5 rounded-lg bg-app-secondary/25 text-app-secondary-300 flex items-center justify-center shrink-0">
                  <Clock className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white leading-tight">
                    Real-Time
                  </p>
                  <p className="text-[9px] text-app-primary-200">
                    Pantau Status
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/15 px-2.5 py-2">
                <div className="w-6.5 h-6.5 rounded-lg bg-sky-400/20 text-sky-300 flex items-center justify-center shrink-0">
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-white leading-tight">
                    100% Online
                  </p>
                  <p className="text-[9px] text-app-primary-200">Tanpa Antre</p>
                </div>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: Kolase Foto Pelayanan Publik + Kartu Status Mengambang */}
          <div className="lg:col-span-6 relative">
            {/* Bingkai Aksen Miring di Belakang Foto */}
            <div
              aria-hidden="true"
              className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-app-secondary via-amber-300 to-sky-400 opacity-85 rotate-2 blur-[1px]"
            />

            {/* Kontainer Foto Utama */}
            <div className="relative rounded-3xl overflow-hidden bg-app-primary-900 border-2 border-white/30 shadow-2xl aspect-[4/3]">
              <Image
                src="/images/hero-pelayanan-hibah.jpg"
                alt="Pelayanan Publik dan Koordinasi Pengajuan Hibah Pemerintah Kabupaten Sumbawa"
                fill
                priority
                className="object-cover object-center"
              />
              {/* Overlay Gradient Halus agar Teks di Bawah Foto Tetap Terbaca */}
              <div className="absolute inset-0 bg-gradient-to-t from-app-primary-950/85 via-app-primary-950/20 to-transparent" />

              {/* Info Bar di Bagian Bawah Foto */}
              <div className="absolute bottom-3.5 left-3.5 right-3.5 sm:bottom-4 sm:left-4 sm:right-4 flex items-center justify-between gap-2.5 rounded-2xl bg-white/95 backdrop-blur-md p-2.5 sm:p-3 text-slate-800 shadow-lg">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-app-primary to-app-primary-700 text-white flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4 text-app-secondary" />
                  </div>
                  <div>
                    <p className="text-[10px] sm:text-[11px] font-bold text-app-primary leading-tight">
                      Layanan Lembaga & Masyarakat
                    </p>
                    <p className="text-[9px] sm:text-[10px] text-slate-500">
                      Keagamaan, Sosial, Pendidikan & Kemasyarakatan
                    </p>
                  </div>
                </div>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                  Aktif
                </span>
              </div>
            </div>

            {/* Floating Badge Kiri Atas (Status Verifikasi) */}
            <div className="hidden sm:flex items-center gap-2 absolute -top-4 -left-4 rounded-2xl bg-white p-2.5 shadow-xl border border-slate-100 text-slate-800">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-slate-900 leading-tight">
                  Verifikasi Terintegrasi
                </p>
                <p className="text-[9px] font-medium text-emerald-600">
                  Notifikasi progres otomatis
                </p>
              </div>
            </div>

            {/* Floating Pill Kanan Atas */}
            <div className="hidden sm:flex items-center gap-1.5 absolute -top-3.5 right-3.5 rounded-full bg-app-secondary text-app-primary-950 px-3 py-1 text-[9.5px] font-extrabold shadow-lg">
              <span>Bagian Kesra Kab. Sumbawa</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
