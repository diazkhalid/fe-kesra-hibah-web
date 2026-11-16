"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FilePlus2,
  FolderKanban,
  Hourglass,
  CheckCircle2,
  XCircle,
  FileEdit,
  Eye,
  ArrowUpRight,
  Calendar,
  Building2,
  Info,
  Sparkles,
  ChevronRight,
} from "lucide-react";

type SubmissionStatus = "draft" | "menunggu" | "terverifikasi" | "ditolak";

interface SubmissionItem {
  id: string;
  submissionNumber: string;
  date: string;
  organizationName: string;
  subject: string;
  requestedAmount: string;
  status: SubmissionStatus;
}

const STATUS_CONFIG: Record<
  SubmissionStatus,
  {
    label: string;
    badgeClass: string;
    dotClass: string;
    icon: React.ElementType;
    iconBg: string;
    description: string;
  }
> = {
  draft: {
    label: "Draft",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    dotClass: "bg-slate-500",
    icon: FileEdit,
    iconBg: "bg-slate-100 text-slate-600",
    description:
      "Pengajuan masih tersimpan sementara dan belum dikirim ke Bagian Kesra.",
  },
  menunggu: {
    label: "Menunggu",
    badgeClass: "bg-sky-50 text-sky-700 border-sky-200",
    dotClass: "bg-sky-500",
    icon: Hourglass,
    iconBg: "bg-sky-100 text-sky-600",
    description:
      "Proposal telah masuk ke sistem dan menunggu verifikasi administrasi dari Admin Kesra.",
  },
  terverifikasi: {
    label: "Terverifikasi",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-500",
    icon: CheckCircle2,
    iconBg: "bg-emerald-100 text-emerald-600",
    description:
      "Seluruh berkas telah dinyatakan lengkap dan lolos verifikasi administrasi.",
  },
  ditolak: {
    label: "Ditolak",
    badgeClass: "bg-red-50 text-red-700 border-red-200",
    dotClass: "bg-red-500",
    icon: XCircle,
    iconBg: "bg-red-100 text-red-600",
    description:
      "Pengajuan tidak dapat diproses lebih lanjut karena tidak memenuhi persyaratan hibah daerah.",
  },
};

const RECENT_SUBMISSIONS: SubmissionItem[] = [
  {
    id: "hb-2026-001",
    submissionNumber: "HIB-2026-001",
    date: "14 Nov 2026",
    organizationName: "Yayasan Nurul Iman Sumbawa",
    subject: "Bantuan Pendidikan & Rehabilitasi Ruang Belajar TPQ Al-Hikmah",
    requestedAmount: "Rp 50.000.000",
    status: "menunggu",
  },
  {
    id: "hb-2026-002",
    submissionNumber: "HIB-2026-002",
    date: "08 Nov 2026",
    organizationName: "Masjid Besar Al-Ikhlas Sumbawa",
    subject: "Bantuan Sarana Ibadah dan Pengadaan Sistem Tata Suara Masjid",
    requestedAmount: "Rp 30.000.000",
    status: "menunggu",
  },
  {
    id: "hb-2026-004",
    submissionNumber: "HIB-2026-004",
    date: "19 Okt 2026",
    organizationName: "Yayasan Nurul Iman Sumbawa",
    subject: "Pengadaan Perlengkapan Seni Islami dan Pembinaan Remaja Masjid",
    requestedAmount: "Rp 18.500.000",
    status: "terverifikasi",
  },
  {
    id: "hb-2026-005",
    submissionNumber: "DRAFT-2026-005",
    date: "16 Nov 2026",
    organizationName: "Yayasan Nurul Iman Sumbawa",
    subject: "Permohonan Bantuan Kegiatan Peringatan Hari Besar Islam (PHBI)",
    requestedAmount: "Rp 20.000.000",
    status: "draft",
  },
  {
    id: "hb-2025-009",
    submissionNumber: "HIB-2025-009",
    date: "04 Jul 2025",
    organizationName: "Kelompok Pemuda Moyo Hilir",
    subject: "Permohonan Bantuan Pengadaan Perlengkapan Turnamen Olahraga",
    requestedAmount: "Rp 40.000.000",
    status: "ditolak",
  },
];

export default function PemohonDashboardPage() {
  const userName = "Ahmad Fauzi";
  const [selectedFilter, setSelectedFilter] = useState<
    "all" | SubmissionStatus
  >("all");

  // Hitung statistik otomatis (Total, Menunggu, Terverifikasi, Ditolak)
  const stats = {
    total: RECENT_SUBMISSIONS.length,
    menunggu: RECENT_SUBMISSIONS.filter((s) => s.status === "menunggu").length,
    terverifikasi: RECENT_SUBMISSIONS.filter(
      (s) => s.status === "terverifikasi",
    ).length,
    ditolak: RECENT_SUBMISSIONS.filter((s) => s.status === "ditolak").length,
  };

  const filteredSubmissions =
    selectedFilter === "all"
      ? RECENT_SUBMISSIONS
      : RECENT_SUBMISSIONS.filter((item) => item.status === selectedFilter);

  return (
    <div className="space-y-6">
      {/* =====================================================================
          C. WELCOME SECTION
      ====================================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-app-primary-950 via-app-primary-900 to-app-primary p-5 sm:p-7 text-white shadow-md">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 w-64 h-64 rounded-full bg-app-secondary/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-20 left-1/3 w-56 h-56 rounded-full bg-sky-400/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff14_1px,transparent_1px)] [background-size:20px_20px] opacity-50"
        />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-[10.5px] font-semibold text-app-secondary-200">
              <Sparkles className="w-3 h-3 text-app-secondary" />
              <span>Portal Layanan Hibah • Bagian Kesra Kab. Sumbawa</span>
            </div>

            <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight text-white leading-snug">
              Selamat Datang,{" "}
              <span className="text-app-secondary-300">{userName}</span>
            </h1>

            <p className="text-xs sm:text-[13px] text-app-primary-100 leading-relaxed">
              Kelola pengajuan proposal bantuan hibah lembaga Anda secara
              online, lengkapi dokumen persyaratan, dan pantau hasil verifikasi
              administrasi dari satu dasbor terpadu.
            </p>
          </div>

          {/* Tombol Aksi Utama */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <Link
              href="/dashboard/pemohon/buat-pengajuan"
              className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 rounded-full text-xs font-bold text-app-primary-950 bg-gradient-to-r from-app-secondary to-app-secondary-400 hover:from-app-secondary-400 hover:to-app-secondary-300 shadow-lg shadow-black/20 transition-all duration-200 group"
            >
              <FilePlus2 className="w-4 h-4 stroke-[2.3]" />
              <span>Buat Pengajuan Baru</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================================
          D. STATISTIK PENGAJUAN (TOTAL, MENUNGGU, TERVERIFIKASI, DITOLAK)
      ====================================================================== */}
      <section aria-label="Statistik Pengajuan" className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Card 1: Total Pengajuan */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-4.5 shadow-2xs hover:border-app-primary-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500">
                Total Pengajuan
              </span>
              <div className="w-8.5 h-8.5 rounded-xl bg-app-primary-50 text-app-primary flex items-center justify-center">
                <FolderKanban className="w-4 h-4 stroke-[2.2]" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <p className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {stats.total}
              </p>
              <span className="text-[10.5px] font-semibold text-app-primary">
                Semua berkas
              </span>
            </div>
            <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full w-full rounded-full bg-app-primary" />
            </div>
          </div>

          {/* Card 2: Menunggu */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-4.5 shadow-2xs hover:border-sky-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500">
                Menunggu
              </span>
              <div className="w-8.5 h-8.5 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Hourglass className="w-4 h-4 stroke-[2.2]" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <p className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {stats.menunggu}
              </p>
              <span className="text-[10.5px] font-semibold text-sky-600">
                Menunggu verifikasi
              </span>
            </div>
            <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-sky-500 transition-all"
                style={{
                  width: `${
                    stats.total ? (stats.menunggu / stats.total) * 100 : 0
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Card 3: Terverifikasi */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-4.5 shadow-2xs hover:border-emerald-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500">
                Terverifikasi
              </span>
              <div className="w-8.5 h-8.5 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <p className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {stats.terverifikasi}
              </p>
              <span className="text-[10.5px] font-semibold text-emerald-600">
                Lolos verifikasi
              </span>
            </div>
            <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{
                  width: `${
                    stats.total ? (stats.terverifikasi / stats.total) * 100 : 0
                  }%`,
                }}
              />
            </div>
          </div>

          {/* Card 4: Ditolak */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-4.5 shadow-2xs hover:border-red-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500">
                Ditolak
              </span>
              <div className="w-8.5 h-8.5 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                <XCircle className="w-4 h-4 stroke-[2.2]" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <p className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {stats.ditolak}
              </p>
              <span className="text-[10.5px] font-semibold text-red-600">
                Tidak memenuhi syarat
              </span>
            </div>
            <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-red-500 transition-all"
                style={{
                  width: `${
                    stats.total ? (stats.ditolak / stats.total) * 100 : 0
                  }%`,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          E. PENGAJUAN TERBARU & F. INFORMASI STATUS (GRID 12 KOLOM)
      ====================================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* KOLOM KIRI (8 KOLOM): E. PENGAJUAN TERBARU */}
        <section className="xl:col-span-8 rounded-2xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                  Pengajuan Terbaru
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Daftar permohonan hibah terbaru beserta status pemeriksaan
                  terkini.
                </p>
              </div>

              <Link
                href="/dashboard/pemohon/riwayat-pengajuan"
                className="inline-flex items-center gap-1 text-xs font-bold text-app-primary hover:text-app-primary-800 transition-colors self-start sm:self-auto"
              >
                <span>Semua Riwayat</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Filter Pill Status */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              <button
                type="button"
                onClick={() => setSelectedFilter("all")}
                className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors shrink-0 cursor-pointer ${
                  selectedFilter === "all"
                    ? "bg-app-primary text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                }`}
              >
                Semua ({RECENT_SUBMISSIONS.length})
              </button>

              {(Object.keys(STATUS_CONFIG) as SubmissionStatus[]).map(
                (statusKey) => {
                  const cfg = STATUS_CONFIG[statusKey];
                  const count = RECENT_SUBMISSIONS.filter(
                    (s) => s.status === statusKey,
                  ).length;

                  return (
                    <button
                      key={statusKey}
                      type="button"
                      onClick={() => setSelectedFilter(statusKey)}
                      className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors shrink-0 cursor-pointer ${
                        selectedFilter === statusKey
                          ? "bg-app-primary text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                      }`}
                    >
                      {cfg.label} ({count})
                    </button>
                  );
                },
              )}
            </div>
          </div>

          {/* TAMPILAN TABEL DESKTOP */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Nomor & Tanggal</th>
                  <th className="py-3 px-4">Organisasi & Perihal</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-10 text-center text-xs text-slate-500"
                    >
                      Tidak ada pengajuan dengan status tersebut.
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((item) => {
                    const statusInfo = STATUS_CONFIG[item.status];
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/70 transition-colors group"
                      >
                        <td className="py-3.5 px-4 align-top whitespace-nowrap">
                          <p className="font-extrabold text-app-primary text-[11.5px]">
                            {item.submissionNumber}
                          </p>
                          <div className="flex items-center gap-1 text-[10.5px] text-slate-400 mt-0.5">
                            <Calendar className="w-3 h-3" />
                            <span>{item.date}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 align-top max-w-xs">
                          <div className="flex items-center gap-1.5 text-[10.5px] font-semibold text-slate-500">
                            <Building2 className="w-3 h-3 text-app-secondary-600 shrink-0" />
                            <span className="truncate">
                              {item.organizationName}
                            </span>
                          </div>
                          <p className="font-bold text-slate-800 leading-snug mt-0.5 line-clamp-2">
                            {item.subject}
                          </p>
                          <p className="text-[10.5px] font-semibold text-slate-500 mt-1">
                            Usulan: {item.requestedAmount}
                          </p>
                        </td>

                        <td className="py-3.5 px-4 align-top whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10.5px] font-bold ${statusInfo.badgeClass}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`}
                            />
                            {statusInfo.label}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 align-top text-right whitespace-nowrap">
                          <Link
                            href={`/dashboard/pemohon/riwayat-pengajuan/${item.id}`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-app-primary hover:border-app-primary text-slate-700 hover:text-white text-[11px] font-bold transition-all duration-150 shadow-2xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Detail</span>
                          </Link>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* TAMPILAN KARTU MOBILE */}
          <div className="md:hidden divide-y divide-slate-100">
            {filteredSubmissions.map((item) => {
              const statusInfo = STATUS_CONFIG[item.status];
              return (
                <div key={item.id} className="p-4 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-extrabold text-app-primary">
                      {item.submissionNumber}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-bold ${statusInfo.badgeClass}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`}
                      />
                      {statusInfo.label}
                    </span>
                  </div>

                  <div>
                    <p className="text-[10.5px] font-semibold text-slate-500">
                      {item.organizationName}
                    </p>
                    <p className="text-xs font-bold text-slate-800 leading-snug mt-0.5">
                      {item.subject}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10.5px] text-slate-400">
                      {item.date} • {item.requestedAmount}
                    </span>
                    <Link
                      href={`/dashboard/pemohon/riwayat-pengajuan/${item.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-app-primary-50 text-app-primary text-[11px] font-bold"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Detail</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* KOLOM KANAN (4 KOLOM): F. INFORMASI STATUS */}
        <aside className="xl:col-span-4 rounded-2xl bg-white border border-slate-200/80 p-5 shadow-2xs space-y-4">
          <div className="flex items-start gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8 h-8 rounded-xl bg-app-primary-50 text-app-primary flex items-center justify-center shrink-0">
              <Info className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 tracking-tight">
                Informasi Status
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Panduan arti setiap tahapan status pengajuan hibah.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {(Object.keys(STATUS_CONFIG) as SubmissionStatus[]).map(
              (statusKey) => {
                const cfg = STATUS_CONFIG[statusKey];
                const IconComponent = cfg.icon;

                return (
                  <div
                    key={statusKey}
                    className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 hover:border-slate-200 transition-colors"
                  >
                    <div
                      className={`w-7.5 h-7.5 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${cfg.iconBg}`}
                    >
                      <IconComponent className="w-3.5 h-3.5 stroke-[2.2]" />
                    </div>

                    <div className="space-y-0.5">
                      <p className="text-xs font-extrabold text-slate-800">
                        {cfg.label}
                      </p>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {cfg.description}
                      </p>
                    </div>
                  </div>
                );
              },
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
