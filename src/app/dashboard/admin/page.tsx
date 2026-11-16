"use client";

import React, { useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import {
  FolderKanban,
  Sparkles,
  Hourglass,
  CheckCircle2,
  XCircle,
  Eye,
  ArrowUpRight,
  Building2,
  Calendar,
  TrendingUp,
  BarChart3,
  PieChart,
  FileSpreadsheet,
  FileCheck2,
  ChevronRight,
} from "lucide-react";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

type AdminSubmissionStatus =
  | "menunggu_verifikasi"
  | "terverifikasi"
  | "ditolak";

interface RecentAdminSubmission {
  id: string;
  nomorPengajuan: string;
  namaOrganisasi: string;
  tanggalMasuk: string;
  perihal: string;
  nominalUsulan: string;
  status: AdminSubmissionStatus;
}

const ADMIN_STATUS_META: Record<
  AdminSubmissionStatus,
  {
    label: string;
    badgeClass: string;
    dotClass: string;
  }
> = {
  menunggu_verifikasi: {
    label: "Menunggu Verifikasi",
    badgeClass: "bg-sky-50 text-sky-700 border-sky-200",
    dotClass: "bg-sky-500",
  },
  terverifikasi: {
    label: "Terverifikasi",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-500",
  },
  ditolak: {
    label: "Ditolak",
    badgeClass: "bg-red-50 text-red-700 border-red-200",
    dotClass: "bg-red-500",
  },
};

const MONTHLY_SERIES_BY_YEAR: Record<
  "2026" | "2025",
  { total: number[]; terverifikasi: number[]; ditolak: number[] }
> = {
  "2026": {
    total: [8, 12, 15, 11, 18, 14, 21, 24, 19, 28, 32, 14],
    terverifikasi: [7, 11, 14, 10, 16, 13, 19, 21, 17, 22, 18, 6],
    ditolak: [1, 1, 1, 1, 2, 1, 2, 3, 2, 2, 1, 1],
  },
  "2025": {
    total: [6, 9, 14, 10, 16, 13, 19, 22, 17, 25, 27, 12],
    terverifikasi: [5, 8, 13, 9, 15, 12, 18, 20, 16, 23, 25, 11],
    ditolak: [1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 2, 1],
  },
};

const RECENT_SUBMISSIONS: RecentAdminSubmission[] = [
  {
    id: "hb-2026-001",
    nomorPengajuan: "HIB-2026-001",
    namaOrganisasi: "Yayasan Nurul Iman Sumbawa",
    tanggalMasuk: "16 Nov 2026",
    perihal: "Bantuan Pendidikan & Rehabilitasi Ruang Belajar TPQ Al-Hikmah",
    nominalUsulan: "Rp 50.000.000",
    status: "menunggu_verifikasi",
  },
  {
    id: "hb-2026-002",
    nomorPengajuan: "HIB-2026-002",
    namaOrganisasi: "Masjid Besar Al-Ikhlas Sumbawa",
    tanggalMasuk: "15 Nov 2026",
    perihal: "Bantuan Sarana Ibadah dan Pengadaan Sistem Tata Suara Masjid",
    nominalUsulan: "Rp 30.000.000",
    status: "menunggu_verifikasi",
  },
  {
    id: "hb-2026-003",
    nomorPengajuan: "HIB-2026-003",
    namaOrganisasi: "Lembaga Sosial Samawa Peduli",
    tanggalMasuk: "14 Nov 2026",
    perihal: "Bantuan Sosial Santunan Anak Yatim & Lansia Kecamatan Sumbawa",
    nominalUsulan: "Rp 25.000.000",
    status: "menunggu_verifikasi",
  },
  {
    id: "hb-2026-004",
    nomorPengajuan: "HIB-2026-004",
    namaOrganisasi: "Yayasan Nurul Iman Sumbawa",
    tanggalMasuk: "10 Nov 2026",
    perihal: "Pengadaan Perlengkapan Seni Islami dan Pembinaan Remaja Masjid",
    nominalUsulan: "Rp 18.500.000",
    status: "terverifikasi",
  },
  {
    id: "hb-2025-009",
    nomorPengajuan: "HIB-2025-009",
    namaOrganisasi: "Kelompok Pemuda Moyo Hilir",
    tanggalMasuk: "04 Jul 2025",
    perihal: "Permohonan Bantuan Pengadaan Perlengkapan Turnamen Olahraga",
    nominalUsulan: "Rp 40.000.000",
    status: "ditolak",
  },
];

export default function AdminDashboardPage() {
  const [selectedYear, setSelectedYear] = useState<"2026" | "2025">("2026");
  const [tableFilter, setTableFilter] = useState<"all" | AdminSubmissionStatus>(
    "all",
  );

  // C. Data Statistik Pengajuan
  const stats = {
    totalPengajuan: 216,
    menungguVerifikasi: 36,
    terverifikasi: 162,
    ditolak: 18,
  };

  // =========================================================================
  // 1. KONFIGURASI APEXCHART: JUMLAH PENGAJUAN PER BULAN
  // =========================================================================
  const currentYearData = MONTHLY_SERIES_BY_YEAR[selectedYear];

  const monthlyChartOptions: ApexOptions = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      fontFamily: "inherit",
      zoom: { enabled: false },
    },
    colors: ["#0f766e", "#10b981", "#ef4444"],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "56%",
        borderRadius: 5,
        borderRadiusApplication: "end",
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "Mei",
        "Jun",
        "Jul",
        "Agu",
        "Sep",
        "Okt",
        "Nov",
        "Des",
      ],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: "#64748b", fontSize: "11px", fontWeight: 600 },
      },
    },
    yaxis: {
      labels: {
        style: { colors: "#64748b", fontSize: "11px" },
        formatter: (val) => `${Math.round(val)}`,
      },
    },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 4,
      yaxis: { lines: { show: true } },
    },
    legend: {
      position: "top",
      horizontalAlign: "left",
      fontSize: "11px",
      fontWeight: 600,
      markers: { size: 5, shape: "circle" },
    },
    tooltip: {
      theme: "light",
      y: {
        formatter: (val) => `${val} Pengajuan`,
      },
    },
  };

  const monthlyChartSeries = [
    { name: "Total Masuk", data: currentYearData.total },
    { name: "Terverifikasi", data: currentYearData.terverifikasi },
    { name: "Ditolak", data: currentYearData.ditolak },
  ];

  // =========================================================================
  // 2. KONFIGURASI APEXCHART: GRAFIK BERDASARKAN STATUS (DONUT)
  // =========================================================================
  const statusChartOptions: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "inherit",
    },
    labels: ["Terverifikasi", "Menunggu Verifikasi", "Ditolak"],
    colors: ["#10b981", "#0ea5e9", "#ef4444"],
    stroke: {
      width: 3,
      colors: ["#ffffff"],
    },
    plotOptions: {
      pie: {
        donut: {
          size: "68%",
          labels: {
            show: true,
            name: {
              show: true,
              fontSize: "11px",
              fontWeight: 600,
              color: "#64748b",
            },
            value: {
              show: true,
              fontSize: "20px",
              fontWeight: 800,
              color: "#0f172a",
            },
            total: {
              show: true,
              label: "Total Berkas",
              fontSize: "10px",
              fontWeight: 700,
              color: "#64748b",
              formatter: () => `${stats.totalPengajuan}`,
            },
          },
        },
      },
    },
    dataLabels: { enabled: false },
    legend: {
      position: "bottom",
      fontSize: "11px",
      fontWeight: 600,
      markers: { size: 5, shape: "circle" },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} Pengajuan`,
      },
    },
  };

  const statusChartSeries = [
    stats.terverifikasi,
    stats.menungguVerifikasi,
    stats.ditolak,
  ];

  // =========================================================================
  // 3. KONFIGURASI APEXCHART: GRAFIK BERDASARKAN TAHUN (AREA / BAR)
  // =========================================================================
  const yearlyChartOptions: ApexOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      fontFamily: "inherit",
      sparkline: { enabled: false },
      zoom: { enabled: false },
    },
    colors: ["#0f766e", "#f59e0b"],
    stroke: {
      curve: "smooth",
      width: 2.5,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.05,
        stops: [0, 95, 100],
      },
    },
    markers: {
      size: 4,
      strokeColors: "#ffffff",
      strokeWidth: 2,
      hover: { size: 6 },
    },
    dataLabels: {
      enabled: true,
      style: { fontSize: "10px", fontWeight: 700 },
      background: {
        enabled: true,
        borderRadius: 4,
        padding: 3,
      },
    },
    xaxis: {
      categories: ["2023", "2024", "2025", "2026"],
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { colors: "#64748b", fontSize: "11px", fontWeight: 700 },
      },
    },
    yaxis: {
      show: false,
    },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 4,
      padding: { left: 10, right: 10 },
    },
    legend: {
      position: "bottom",
      fontSize: "11px",
      fontWeight: 600,
      markers: { size: 5, shape: "circle" },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} Pengajuan`,
      },
    },
  };

  const yearlyChartSeries = [
    { name: "Total Pengajuan", data: [142, 168, 190, 216] },
    { name: "Terverifikasi", data: [128, 151, 175, 162] },
  ];

  const filteredSubmissions =
    tableFilter === "all"
      ? RECENT_SUBMISSIONS
      : RECENT_SUBMISSIONS.filter((s) => s.status === tableFilter);

  return (
    <div className="space-y-6 pb-10">
      {/* =====================================================================
          HEADER DASHBOARD ADMIN
      ====================================================================== */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-app-primary-950 via-app-primary-900 to-app-primary p-5 sm:p-7 text-white shadow-md">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 w-64 h-64 rounded-full bg-app-secondary/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 left-1/3 w-60 h-60 rounded-full bg-sky-400/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff14_1px,transparent_1px)] [background-size:20px_20px] opacity-50"
        />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-sm border border-white/15 text-[10.5px] font-semibold text-app-secondary-200">
              <Sparkles className="w-3 h-3 text-app-secondary" />
              <span>Panel Verifikator • Bagian Kesra Setda Kab. Sumbawa</span>
            </div>

            <h1 className="text-lg sm:text-2xl font-extrabold tracking-tight text-white leading-snug">
              Dashboard Monitoring & Verifikasi Hibah
            </h1>

            <p className="text-xs sm:text-[13px] text-app-primary-100 leading-relaxed">
              Pantau statistik permohonan masuk, antrean pemeriksaan berkas
              lembaga, serta rekapitulasi hasil verifikasi bantuan hibah daerah
              Kabupaten Sumbawa.
            </p>
          </div>

          {/* Pintasan Cepat Admin */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <Link
              href="/dashboard/admin/laporan-verifikasi"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold text-white bg-white/12 hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all"
            >
              <FileCheck2 className="w-4 h-4 text-app-secondary" />
              <span>Laporan Verifikasi</span>
            </Link>

            <Link
              href="/dashboard/admin/data-pengajuan"
              className="inline-flex items-center justify-center gap-2 px-4.5 py-2.5 rounded-full text-xs font-bold text-app-primary-950 bg-gradient-to-r from-app-secondary to-app-secondary-400 hover:from-app-secondary-400 hover:to-app-secondary-300 shadow-lg shadow-black/20 transition-all group"
            >
              <FileSpreadsheet className="w-4 h-4 stroke-[2.3]" />
              <span>Verifikasi Pengajuan</span>
              <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* =====================================================================
          C. STATISTIK PENGAJUAN (4 CARD)
      ====================================================================== */}
      <section aria-label="Statistik Pengajuan Hibah" className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* 1. Total Pengajuan */}
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
                {stats.totalPengajuan}
              </p>
              <span className="text-[10.5px] font-semibold text-app-primary">
                Seluruh proposal masuk
              </span>
            </div>
            <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full w-full rounded-full bg-app-primary" />
            </div>
          </div>

          {/* 2. Menunggu Verifikasi */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-4.5 shadow-2xs hover:border-sky-300 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-500">
                Menunggu Verifikasi
              </span>
              <div className="w-8.5 h-8.5 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Hourglass className="w-4 h-4 stroke-[2.2]" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline justify-between">
              <p className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {stats.menungguVerifikasi}
              </p>
              <span className="text-[10.5px] font-semibold text-sky-600">
                {Math.round(
                  (stats.menungguVerifikasi / stats.totalPengajuan) * 100,
                )}
                % antrean periksa
              </span>
            </div>
            <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-sky-500 transition-all"
                style={{
                  width: `${
                    (stats.menungguVerifikasi / stats.totalPengajuan) * 100
                  }%`,
                }}
              />
            </div>
          </div>

          {/* 3. Terverifikasi */}
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
                {Math.round((stats.terverifikasi / stats.totalPengajuan) * 100)}
                % lolos verifikasi
              </span>
            </div>
            <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500 transition-all"
                style={{
                  width: `${
                    (stats.terverifikasi / stats.totalPengajuan) * 100
                  }%`,
                }}
              />
            </div>
          </div>

          {/* 4. Ditolak */}
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
                {Math.round((stats.ditolak / stats.totalPengajuan) * 100)}%
                tidak memenuhi syarat
              </span>
            </div>
            <div className="mt-3 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-red-500 transition-all"
                style={{
                  width: `${(stats.ditolak / stats.totalPengajuan) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          D. GRAFIK PENGAJUAN (APEXCHARTS)
      ====================================================================== */}
      <section
        aria-label="Grafik Statistik Pengajuan"
        className="grid grid-cols-1 xl:grid-cols-12 gap-5"
      >
        {/* 1. APEXCHART: JUMLAH PENGAJUAN PER BULAN (6 KOLOM) */}
        <div className="xl:col-span-6 rounded-2xl bg-white border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-start gap-2.5">
              <div className="w-8.5 h-8.5 rounded-xl bg-app-primary-50 text-app-primary flex items-center justify-center shrink-0">
                <BarChart3 className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900">
                  Jumlah Pengajuan per Bulan
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Perbandingan total masuk, terverifikasi, dan ditolak
                </p>
              </div>
            </div>

            <div className="inline-flex rounded-xl bg-slate-100 p-0.5 text-[11px] font-bold">
              {(["2026", "2025"] as const).map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => setSelectedYear(yr)}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    selectedYear === yr
                      ? "bg-white text-app-primary shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <Chart
              options={monthlyChartOptions}
              series={monthlyChartSeries}
              type="bar"
              height={265}
              width="100%"
            />
          </div>
        </div>

        {/* 2. APEXCHART: BERDASARKAN STATUS (3 KOLOM) */}
        <div className="xl:col-span-3 rounded-2xl bg-white border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8.5 h-8.5 rounded-xl bg-app-secondary-50 text-app-secondary-700 flex items-center justify-center shrink-0">
              <PieChart className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">
                Berdasarkan Status
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Proporsi status berkas terkini
              </p>
            </div>
          </div>

          <div className="my-auto pt-2">
            <Chart
              options={statusChartOptions}
              series={statusChartSeries}
              type="donut"
              height={265}
              width="100%"
            />
          </div>
        </div>

        {/* 3. APEXCHART: BERDASARKAN TAHUN (3 KOLOM) */}
        <div className="xl:col-span-3 rounded-2xl bg-white border border-slate-200/80 p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-start gap-2.5 pb-3 border-b border-slate-100">
            <div className="w-8.5 h-8.5 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <TrendingUp className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900">
                Berdasarkan Tahun
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Tren pengajuan 4 tahun terakhir
              </p>
            </div>
          </div>

          <div className="my-auto pt-2">
            <Chart
              options={yearlyChartOptions}
              series={yearlyChartSeries}
              type="area"
              height={265}
              width="100%"
            />
          </div>
        </div>
      </section>

      {/* =====================================================================
          E. PENGAJUAN TERBARU
      ====================================================================== */}
      <section
        aria-label="Pengajuan Terbaru"
        className="rounded-2xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden"
      >
        <div className="p-4 sm:p-5 border-b border-slate-100 space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                Pengajuan Terbaru
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Daftar permohonan bantuan hibah terbaru yang masuk ke Bagian
                Kesejahteraan Rakyat.
              </p>
            </div>

            <Link
              href="/dashboard/admin/data-pengajuan"
              className="inline-flex items-center gap-1 text-xs font-bold text-app-primary hover:text-app-primary-800 transition-colors self-start sm:self-auto"
            >
              <span>Kelola Semua Pengajuan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Tab Filter Cepat */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              type="button"
              onClick={() => setTableFilter("all")}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors shrink-0 cursor-pointer ${
                tableFilter === "all"
                  ? "bg-app-primary text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
              }`}
            >
              Semua ({RECENT_SUBMISSIONS.length})
            </button>

            {(Object.keys(ADMIN_STATUS_META) as AdminSubmissionStatus[]).map(
              (key) => {
                const cfg = ADMIN_STATUS_META[key];
                const count = RECENT_SUBMISSIONS.filter(
                  (s) => s.status === key,
                ).length;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setTableFilter(key)}
                    className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-colors shrink-0 cursor-pointer ${
                      tableFilter === key
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
                <th className="py-3.5 px-4 whitespace-nowrap">
                  Nomor Pengajuan
                </th>
                <th className="py-3.5 px-4">Nama Organisasi</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Tanggal Masuk</th>
                <th className="py-3.5 px-4">Perihal</th>
                <th className="py-3.5 px-4 whitespace-nowrap">Status</th>
                <th className="py-3.5 px-4 text-right whitespace-nowrap">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-10 text-center text-xs text-slate-500"
                  >
                    Tidak ada pengajuan dengan status tersebut.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((item) => {
                  const statusInfo = ADMIN_STATUS_META[item.status];
                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="py-3.5 px-4 align-top whitespace-nowrap">
                        <span className="font-extrabold text-app-primary text-[11.5px]">
                          {item.nomorPengajuan}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 align-top max-w-[200px]">
                        <div className="flex items-start gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-app-secondary-600 shrink-0 mt-0.5" />
                          <span className="font-bold text-slate-800 leading-snug line-clamp-2">
                            {item.namaOrganisasi}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 align-top whitespace-nowrap text-slate-600">
                        <div className="flex items-center gap-1.5 text-[11.5px]">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.tanggalMasuk}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 align-top max-w-xs">
                        <p className="font-semibold text-slate-700 leading-snug line-clamp-2">
                          {item.perihal}
                        </p>
                        <p className="text-[10.5px] font-bold text-slate-400 mt-0.5">
                          Usulan: {item.nominalUsulan}
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
                          href={`/dashboard/admin/data-pengajuan/${item.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-app-primary hover:border-app-primary text-slate-700 hover:text-white text-[11px] font-bold transition-all shadow-2xs"
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
            const statusInfo = ADMIN_STATUS_META[item.status];
            return (
              <div key={item.id} className="p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11.5px] font-extrabold text-app-primary">
                    {item.nomorPengajuan}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${statusInfo.badgeClass}`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`}
                    />
                    {statusInfo.label}
                  </span>
                </div>

                <div>
                  <p className="text-[11px] font-bold text-slate-600">
                    {item.namaOrganisasi}
                  </p>
                  <p className="text-xs font-semibold text-slate-800 leading-snug mt-0.5">
                    {item.perihal}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-1.5 border-t border-slate-100">
                  <span className="text-[10.5px] text-slate-500">
                    {item.tanggalMasuk} • {item.nominalUsulan}
                  </span>
                  <Link
                    href={`/dashboard/admin/data-pengajuan/${item.id}`}
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
    </div>
  );
}
