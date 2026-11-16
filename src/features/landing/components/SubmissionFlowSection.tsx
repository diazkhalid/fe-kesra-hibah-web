"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  UserPlus,
  LogIn,
  FileEdit,
  UploadCloud,
  Send,
  ShieldCheck,
  BellRing,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Info,
  GitCommitHorizontal,
} from "lucide-react";

interface FlowStep {
  number: string;
  shortTitle: string;
  title: string;
  description: string;
  actor: "Pemohon" | "Admin Kesra";
  icon: React.ElementType;
}

const FLOW_STEPS: FlowStep[] = [
  {
    number: "01",
    shortTitle: "Registrasi",
    title: "Registrasi Akun",
    description: "Pemohon membuat akun untuk menggunakan layanan.",
    actor: "Pemohon",
    icon: UserPlus,
  },
  {
    number: "02",
    shortTitle: "Login",
    title: "Login ke Sistem",
    description: "Pemohon masuk menggunakan akun yang telah terdaftar.",
    actor: "Pemohon",
    icon: LogIn,
  },
  {
    number: "03",
    shortTitle: "Isi Formulir",
    title: "Mengisi Formulir Pengajuan",
    description:
      "Pemohon mengisi informasi organisasi dan data permohonan hibah.",
    actor: "Pemohon",
    icon: FileEdit,
  },
  {
    number: "04",
    shortTitle: "Upload Proposal",
    title: "Upload Proposal",
    description: "Pemohon mengunggah proposal dan dokumen persyaratan.",
    actor: "Pemohon",
    icon: UploadCloud,
  },
  {
    number: "05",
    shortTitle: "Kirim Pengajuan",
    title: "Mengirim Pengajuan",
    description: "Pemohon mengirimkan pengajuan kepada Admin Kesra.",
    actor: "Pemohon",
    icon: Send,
  },
  {
    number: "06",
    shortTitle: "Verifikasi Kesra",
    title: "Verifikasi oleh Admin Kesra",
    description: "Admin Kesra memeriksa kelengkapan dan kesesuaian dokumen.",
    actor: "Admin Kesra",
    icon: ShieldCheck,
  },
  {
    number: "07",
    shortTitle: "Hasil Verifikasi",
    title: "Hasil Verifikasi",
    description:
      "Pemohon dapat melihat informasi hasil verifikasi melalui dashboard.",
    actor: "Pemohon",
    icon: BellRing,
  },
];

export default function SubmissionFlowSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const currentStep = FLOW_STEPS[activeIndex];
  const CurrentIcon = currentStep.icon;

  return (
    <section
      id="alur-pengajuan"
      className="py-10 sm:py-14 bg-gradient-to-b from-white via-app-primary-50/35 to-white border-t border-slate-200/70"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-7">
        {/* BARIS 1: HEADER RINGKAS SEJAJAR (KIRI JUDUL, KANAN CTA) */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-app-primary-50 border border-app-primary-100 text-app-primary text-[10px] font-semibold">
              <GitCommitHorizontal className="w-3 h-3 text-app-secondary-600" />
              <span>7 Tahapan Proses Sistem</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Alur Pengajuan Hibah
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Klik pada setiap titik tahapan di bawah untuk melihat rincian
              proses pengajuan hingga hasil verifikasi.
            </p>
          </div>

          <Link
            href="/daftar-pengajuan"
            className="inline-flex items-center gap-2 self-start md:self-auto px-4 py-2 rounded-full text-xs font-bold text-white bg-app-primary hover:bg-app-primary-800 shadow-xs transition-all duration-200 group shrink-0"
          >
            <span>Mulai Pengajuan</span>
            <ArrowRight className="w-3.5 h-3.5 text-app-secondary transition-transform duration-200 group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* BARIS 2: HORIZONTAL STEPPER TRACK (7 NODE SEJAJAR KE SAMPING) */}
        <div className="relative pt-2 pb-1 overflow-x-auto no-scrollbar">
          <div className="min-w-[640px] relative">
            {/* Garis Latar Abu-Abu (Tepat dari pusat step 01 ke pusat step 07) */}
            <div
              aria-hidden="true"
              className="absolute top-5 -translate-y-1/2 left-[calc(100%/14)] right-[calc(100%/14)] h-1 bg-slate-200 rounded-full"
            />
            {/* Garis Progres Aktif Berwarna (Berhenti presisi di pusat step aktif) */}
            <div
              aria-hidden="true"
              style={{
                width: `calc(${
                  (activeIndex / (FLOW_STEPS.length - 1)) * 100
                }% * 6 / 7)`,
              }}
              className="absolute top-5 -translate-y-1/2 left-[calc(100%/14)] h-1 bg-gradient-to-r from-app-primary via-app-primary-500 to-app-secondary rounded-full transition-all duration-300"
            />

            <div className="relative grid grid-cols-7">
              {FLOW_STEPS.map((step, index) => {
                const IconComponent = step.icon;
                const isActive = index === activeIndex;
                const isCompleted = index < activeIndex;

                return (
                  <button
                    key={step.number}
                    type="button"
                    onClick={() => setActiveIndex(index)}
                    className="group flex flex-col items-center text-center px-1 focus:outline-none cursor-pointer"
                  >
                    {/* Lingkaran Node */}
                    <div
                      className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                        isActive
                          ? "bg-app-primary text-white ring-4 ring-app-secondary/40 scale-110 shadow-md"
                          : isCompleted
                            ? "bg-app-primary-700 text-app-secondary-200 hover:scale-105"
                            : "bg-white text-slate-500 border-2 border-slate-200 hover:border-app-primary-400 hover:text-app-primary"
                      }`}
                    >
                      <IconComponent className="w-4 h-4 stroke-[2.2]" />
                      <span
                        className={`absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full text-[8.5px] font-extrabold leading-none ${
                          isActive
                            ? "bg-app-secondary text-app-primary-950"
                            : "bg-slate-800 text-white"
                        }`}
                      >
                        {step.number}
                      </span>
                    </div>

                    {/* Label Singkat di Bawah Node */}
                    <span
                      className={`mt-2.5 text-[11px] leading-tight transition-colors ${
                        isActive
                          ? "font-extrabold text-app-primary"
                          : isCompleted
                            ? "font-semibold text-slate-700"
                            : "font-medium text-slate-500 group-hover:text-slate-800"
                      }`}
                    >
                      {step.shortTitle}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* BARIS 3: PANEL DETAIL AKTIF (BANNER STRIP BERWARNA, BUKAN KARTU BERTUMPUK) */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-app-primary-950 via-app-primary to-app-primary-800 p-4 sm:p-5 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -bottom-10 w-36 h-36 rounded-full bg-app-secondary/20 blur-2xl"
          />

          {/* Konten Langkah Terpilih */}
          <div className="relative flex items-start sm:items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-app-secondary text-app-primary-950 flex items-center justify-center shrink-0 shadow-sm">
              <CurrentIcon className="w-5 h-5 stroke-[2.2]" />
            </div>

            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-app-secondary-300">
                  Tahap {currentStep.number} dari 07
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold ${
                    currentStep.actor === "Admin Kesra"
                      ? "bg-amber-400/20 text-amber-200 border border-amber-300/30"
                      : "bg-white/15 text-white"
                  }`}
                >
                  Oleh: {currentStep.actor}
                </span>
              </div>

              <h3 className="text-sm sm:text-base font-extrabold text-white leading-snug">
                {currentStep.title}
              </h3>
              <p className="text-xs text-app-primary-100 leading-relaxed">
                {currentStep.description}
              </p>
            </div>
          </div>

          {/* Tombol Navigasi Langkah Sebelumnya / Berikutnya */}
          <div className="relative flex items-center gap-2 self-end sm:self-center shrink-0">
            <button
              type="button"
              onClick={() => setActiveIndex((prev) => Math.max(0, prev - 1))}
              disabled={activeIndex === 0}
              aria-label="Tahap sebelumnya"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-white/10 hover:bg-white/20 disabled:opacity-35 disabled:pointer-events-none border border-white/15 transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Sebelumnya</span>
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveIndex((prev) =>
                  Math.min(FLOW_STEPS.length - 1, prev + 1),
                )
              }
              disabled={activeIndex === FLOW_STEPS.length - 1}
              aria-label="Tahap berikutnya"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold bg-app-secondary text-app-primary-950 hover:bg-app-secondary-400 disabled:opacity-35 disabled:pointer-events-none transition-colors cursor-pointer"
            >
              <span>Lanjut</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* BARIS 4: CATATAN SINGKAT */}
        <div className="flex items-start sm:items-center gap-2 text-[11px] text-slate-500">
          <Info className="w-3.5 h-3.5 text-app-secondary-600 shrink-0 mt-0.5 sm:mt-0" />
          <p>
            <span className="font-semibold text-slate-700">Catatan:</span> Alur
            ini merupakan alur penggunaan aplikasi pengajuan hibah digital,
            bukan keseluruhan tahapan SOP pemberian maupun pencairan hibah
            daerah.
          </p>
        </div>
      </div>
    </section>
  );
}
