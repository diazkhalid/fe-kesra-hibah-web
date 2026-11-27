"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FolderKanban,
  Hourglass,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  RotateCcw,
  MoreVertical,
  Eye,
  FileText,
  Download,
  ClipboardCheck,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Building2,
  User,
  X,
  FileCheck2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { GrantApplicationStatus } from "@/features/pemohon-pengajuan/types/pengajuan.type";
import { AdminGrantApplicationData } from "@/features/admin-pengajuan/types/pengajuan.type";
import { useAdminPengajuan } from "@/features/admin-pengajuan/hooks/usePengajuan.hook";

const STATUS_META: Record<
  GrantApplicationStatus,
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

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatSubmittedDate(isoDate: string): string {
  if (!isoDate) return "-";
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return parsed.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function downloadSummaryReceipt(item: AdminGrantApplicationData) {
  const statusLabel = STATUS_META[item.status]?.label ?? item.status;
  const content = `RINGKASAN PENGAJUAN HIBAH - ${item.submission_number}
Pemerintah Kabupaten Sumbawa - Bagian Kesejahteraan Rakyat
===========================================================
Nomor Registrasi : ${item.submission_number}
Tanggal Masuk    : ${formatSubmittedDate(item.submitted_at)}
Tahun Anggaran   : ${item.fiscal_year}
Organisasi       : ${item.organization_name}
Pemohon          : ${item.applicant_name}
Perihal          : ${item.activity_name}
Jumlah Dana      : ${formatRupiah(item.requested_amount)}
Status Terkini   : ${statusLabel}
`;
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Ringkasan_${item.submission_number}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminDataPengajuanPage() {
  const router = useRouter();

  const {
    pengajuanList,
    isLoadingList,
    params,
    pagination,
    fetchPengajuanList,
    updateFilters,
    setPage,
    setRowsPerPage,
    resetFilters,
    error: listError,
    clearError,
  } = useAdminPengajuan();

  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // State Input Pencarian & Filter Lokal sebelum tombol "Terapkan Filter" diklik
  const [nomorInput, setNomorInput] = useState("");
  const [pemohonInput, setPemohonInput] = useState("");
  const [organisasiInput, setOrganisasiInput] = useState("");
  const [tahunInput, setTahunInput] = useState("all");
  const [submittedFromInput, setSubmittedFromInput] = useState("");
  const [submittedUntilInput, setSubmittedUntilInput] = useState("");
  const [statusInput, setStatusInput] = useState<
    "all" | GrantApplicationStatus
  >("all");

  // Dropdown Action Menu
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  // Fetch data otomatis setiap kali params (filter / page / rows_per_page) berubah
  useEffect(() => {
    fetchPengajuanList();
  }, [fetchPengajuanList]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 3500);
  };

  // Statistik ringkas berdasarkan total pagination & daftar halaman aktif
  const stats = {
    total: pagination.total,
    menungguVerifikasi: pengajuanList.filter(
      (s) => s.status === "menunggu_verifikasi",
    ).length,
    terverifikasi: pengajuanList.filter((s) => s.status === "terverifikasi")
      .length,
    ditolak: pengajuanList.filter((s) => s.status === "ditolak").length,
  };

  const availableYears = [2027, 2026, 2025, 2024];
  const startIndex = (pagination.page - 1) * pagination.rows_per_page;

  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    updateFilters({
      submission_number: nomorInput.trim() || undefined,
      applicant_name: pemohonInput.trim() || undefined,
      organization_name: organisasiInput.trim() || undefined,
      fiscal_year: tahunInput === "all" ? undefined : Number(tahunInput),
      submitted_from: submittedFromInput || undefined,
      submitted_until: submittedUntilInput || undefined,
      status: statusInput === "all" ? undefined : statusInput,
    });
  };

  const handleResetFilter = () => {
    setNomorInput("");
    setPemohonInput("");
    setOrganisasiInput("");
    setTahunInput("all");
    setSubmittedFromInput("");
    setSubmittedUntilInput("");
    setStatusInput("all");
    clearError();
    resetFilters();
  };

  const handleQuickStatFilter = (status: "all" | GrantApplicationStatus) => {
    setStatusInput(status);
    clearError();
    updateFilters({
      status: status === "all" ? undefined : status,
    });
  };

  const handleDownloadSummaryClick = (item: AdminGrantApplicationData) => {
    setOpenMenuId(null);
    downloadSummaryReceipt(item);
    showToast(`Ringkasan ${item.submission_number} berhasil diunduh.`);
  };

  // Menu Aksi Admin
  const renderAdminActionsMenu = (item: AdminGrantApplicationData) => (
    <>
      <Link
        href={`/dashboard/admin/data-pengajuan/${item.id}`}
        onClick={() => setOpenMenuId(null)}
        className="flex items-center gap-2 px-3.5 py-2 text-[11.5px] font-semibold text-slate-700 hover:bg-slate-50"
      >
        <Eye className="w-3.5 h-3.5 text-app-primary" />
        <span>Lihat Detail</span>
      </Link>

      <Link
        href={`/dashboard/admin/data-pengajuan/${item.id}#dokumen`}
        onClick={() => setOpenMenuId(null)}
        className="flex items-center gap-2 px-3.5 py-2 text-[11.5px] font-semibold text-slate-700 hover:bg-slate-50"
      >
        <FileText className="w-3.5 h-3.5 text-sky-600" />
        <span>Lihat Dokumen</span>
      </Link>

      <button
        type="button"
        onClick={() => handleDownloadSummaryClick(item)}
        className="w-full flex items-center gap-2 px-3.5 py-2 text-[11.5px] font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
      >
        <Download className="w-3.5 h-3.5 text-emerald-600" />
        <span>Unduh Ringkasan</span>
      </button>

      <div className="my-1 border-t border-slate-100" />

      <button
        type="button"
        onClick={() => {
          setOpenMenuId(null);
          router.push(`/dashboard/admin/data-pengajuan/${item.id}#verifikasi`);
        }}
        className="w-full flex items-center gap-2 px-3.5 py-2 text-[11.5px] font-bold text-app-primary hover:bg-app-primary-50/70 cursor-pointer"
      >
        <ClipboardCheck className="w-3.5 h-3.5 text-app-secondary-600" />
        <span>
          {item.status === "menunggu_verifikasi"
            ? "Mulai Verifikasi"
            : "Tinjau Hasil Verifikasi"}
        </span>
      </button>
    </>
  );

  return (
    <div className="space-y-6 pb-10">
      {/* =====================================================================
          HEADER HALAMAN
      ====================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
            <span className="text-app-primary font-bold">Data Pengajuan</span>
          </nav>

          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Data Pengajuan Hibah
          </h1>
          <p className="text-xs text-slate-500">
            Kelola, periksa kelengkapan dokumen, dan lakukan verifikasi seluruh
            proposal bantuan hibah yang masuk.
          </p>
        </div>

        <Link
          href="/dashboard/admin/laporan-verifikasi"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-app-primary-50 text-slate-700 hover:text-app-primary text-xs font-bold shadow-2xs transition-colors self-start sm:self-auto"
        >
          <FileCheck2 className="w-4 h-4 text-app-primary" />
          <span>Laporan Hasil Verifikasi</span>
        </Link>
      </div>

      {/* Notifikasi Toast */}
      {toastNotice && (
        <div className="flex items-center justify-between gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs font-semibold text-emerald-800 shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastNotice(null)}
            className="text-emerald-600 hover:text-emerald-900 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Banner Error API */}
      {listError && (
        <div
          role="alert"
          className="flex items-center justify-between gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs font-semibold text-red-700"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{listError}</span>
          </div>
          <button
            type="button"
            onClick={() => fetchPengajuanList()}
            className="px-3 py-1 rounded-lg bg-white border border-red-200 text-red-700 hover:bg-red-100 text-[11px] font-bold cursor-pointer shrink-0"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* =====================================================================
          A. STATISTIK PENGAJUAN (4 CARD SESUAI STATUS API)
      ====================================================================== */}
      <section
        aria-label="Statistik Data Pengajuan"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5"
      >
        {/* 1. Total Pengajuan */}
        <button
          type="button"
          onClick={() => handleQuickStatFilter("all")}
          className={`text-left rounded-2xl bg-white border p-4 shadow-2xs transition-all cursor-pointer ${
            !params.status
              ? "border-app-primary ring-2 ring-app-primary/15"
              : "border-slate-200/80 hover:border-app-primary-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">
              Total Pengajuan
            </span>
            <div className="w-8 h-8 rounded-xl bg-app-primary-50 text-app-primary flex items-center justify-center">
              <FolderKanban className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <p className="mt-2.5 text-2xl font-extrabold text-slate-900">
            {stats.total}
          </p>
          <p className="mt-0.5 text-[10px] text-slate-400">
            Seluruh proposal masuk
          </p>
        </button>

        {/* 2. Menunggu Verifikasi */}
        <button
          type="button"
          onClick={() => handleQuickStatFilter("menunggu_verifikasi")}
          className={`text-left rounded-2xl bg-white border p-4 shadow-2xs transition-all cursor-pointer ${
            params.status === "menunggu_verifikasi"
              ? "border-sky-500 ring-2 ring-sky-500/15"
              : "border-slate-200/80 hover:border-sky-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">
              Menunggu Verifikasi
            </span>
            <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Hourglass className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <p className="mt-2.5 text-2xl font-extrabold text-slate-900">
            {stats.menungguVerifikasi}
          </p>
          <p className="mt-0.5 text-[10px] font-semibold text-sky-600">
            Antrean pemeriksaan
          </p>
        </button>

        {/* 3. Terverifikasi */}
        <button
          type="button"
          onClick={() => handleQuickStatFilter("terverifikasi")}
          className={`text-left rounded-2xl bg-white border p-4 shadow-2xs transition-all cursor-pointer ${
            params.status === "terverifikasi"
              ? "border-emerald-500 ring-2 ring-emerald-500/15"
              : "border-slate-200/80 hover:border-emerald-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">
              Terverifikasi
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <p className="mt-2.5 text-2xl font-extrabold text-slate-900">
            {stats.terverifikasi}
          </p>
          <p className="mt-0.5 text-[10px] font-semibold text-emerald-600">
            Lolos verifikasi berkas
          </p>
        </button>

        {/* 4. Ditolak */}
        <button
          type="button"
          onClick={() => handleQuickStatFilter("ditolak")}
          className={`text-left rounded-2xl bg-white border p-4 shadow-2xs transition-all cursor-pointer ${
            params.status === "ditolak"
              ? "border-red-500 ring-2 ring-red-500/15"
              : "border-slate-200/80 hover:border-red-300"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">
              Ditolak
            </span>
            <div className="w-8 h-8 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
              <XCircle className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <p className="mt-2.5 text-2xl font-extrabold text-slate-900">
            {stats.ditolak}
          </p>
          <p className="mt-0.5 text-[10px] font-semibold text-red-600">
            Tidak memenuhi syarat
          </p>
        </button>
      </section>

      {/* =====================================================================
          B. PENCARIAN DAN FILTER (SESUAI AdminGrantApplicationAdminParams)
      ====================================================================== */}
      <section
        aria-label="Pencarian dan Filter Data Pengajuan"
        className="rounded-2xl bg-white border border-slate-200/80 p-4 sm:p-5 shadow-2xs"
      >
        <form onSubmit={handleApplyFilter} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
            {/* 1. Nomor Pengajuan (submission_number) */}
            <div className="lg:col-span-3 space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700">
                Nomor Pengajuan
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={nomorInput}
                  onChange={(e) => setNomorInput(e.target.value)}
                  placeholder="HIB-2026-..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-8.5 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15"
                />
              </div>
            </div>

            {/* 2. Nama Pemohon (applicant_name) */}
            <div className="lg:col-span-3 space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700">
                Nama Pemohon
              </label>
              <input
                type="text"
                value={pemohonInput}
                onChange={(e) => setPemohonInput(e.target.value)}
                placeholder="Cari nama pemohon..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15"
              />
            </div>

            {/* 3. Nama Organisasi (organization_name) */}
            <div className="lg:col-span-3 space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700">
                Nama Organisasi
              </label>
              <input
                type="text"
                value={organisasiInput}
                onChange={(e) => setOrganisasiInput(e.target.value)}
                placeholder="Cari nama lembaga..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15"
              />
            </div>

            {/* 4. Tahun Pengajuan (fiscal_year) */}
            <div className="lg:col-span-3 space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700">
                Tahun Anggaran
              </label>
              <select
                value={tahunInput}
                onChange={(e) => setTahunInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15"
              >
                <option value="all">Semua Tahun</option>
                {availableYears.map((yr) => (
                  <option key={yr} value={String(yr)}>
                    Tahun {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Status Pengajuan (status) */}
            <div className="lg:col-span-4 space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700">
                Status Pengajuan
              </label>
              <select
                value={statusInput}
                onChange={(e) =>
                  setStatusInput(
                    e.target.value as "all" | GrantApplicationStatus,
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15"
              >
                <option value="all">Semua Status</option>
                <option value="menunggu_verifikasi">Menunggu Verifikasi</option>
                <option value="terverifikasi">Terverifikasi</option>
                <option value="ditolak">Ditolak</option>
              </select>
            </div>

            {/* 6. Rentang Tanggal Masuk (submitted_from - submitted_until) */}
            <div className="lg:col-span-4 space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700">
                Tanggal Masuk (Dari)
              </label>
              <input
                type="date"
                value={submittedFromInput}
                onChange={(e) => setSubmittedFromInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15"
              />
            </div>

            <div className="lg:col-span-4 space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700">
                Tanggal Masuk (Sampai)
              </label>
              <input
                type="date"
                value={submittedUntilInput}
                onChange={(e) => setSubmittedUntilInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleResetFilter}
              disabled={isLoadingList}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-60 text-slate-600 text-xs font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </button>

            <button
              type="submit"
              disabled={isLoadingList}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-app-primary hover:bg-app-primary-800 disabled:opacity-60 text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            >
              {isLoadingList ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-app-secondary" />
              ) : (
                <Filter className="w-3.5 h-3.5 text-app-secondary" />
              )}
              <span>Terapkan Filter</span>
            </button>
          </div>
        </form>
      </section>

      {/* =====================================================================
          C. TABEL DATA PENGAJUAN & D. AKSI ADMIN
      ====================================================================== */}
      <section
        aria-label="Tabel Data Pengajuan"
        className="rounded-2xl bg-white border border-slate-200/80 shadow-2xs overflow-visible"
      >
        {/* DESKTOP TABLE */}
        <div className="hidden xl:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200/70 text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-3 w-11 text-center">No.</th>
                <th className="py-3.5 px-3 whitespace-nowrap">
                  Nomor Registrasi
                </th>
                <th className="py-3.5 px-3 whitespace-nowrap">Tanggal Masuk</th>
                <th className="py-3.5 px-3">Nama Organisasi</th>
                <th className="py-3.5 px-3">Nama Pemohon</th>
                <th className="py-3.5 px-3">Perihal Pengajuan</th>
                <th className="py-3.5 px-3 whitespace-nowrap">Jumlah Dana</th>
                <th className="py-3.5 px-3 whitespace-nowrap">Status</th>
                <th className="py-3.5 px-3 text-right whitespace-nowrap">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {isLoadingList ? (
                <tr>
                  <td colSpan={9} className="py-14 text-center">
                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
                      <Loader2 className="w-4 h-4 animate-spin text-app-primary" />
                      <span>Memuat data pengajuan hibah...</span>
                    </div>
                  </td>
                </tr>
              ) : pengajuanList.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="py-12 text-center text-xs text-slate-500"
                  >
                    Tidak ada data pengajuan yang sesuai dengan filter
                    pencarian.
                  </td>
                </tr>
              ) : (
                pengajuanList.map((item, idx) => {
                  const statusInfo =
                    STATUS_META[item.status] ?? STATUS_META.menunggu_verifikasi;
                  const isMenuOpen = openMenuId === item.id;

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      {/* 1. Nomor */}
                      <td className="py-3.5 px-3 text-center font-semibold text-slate-500 align-top">
                        {startIndex + idx + 1}
                      </td>

                      {/* 2. Nomor Registrasi */}
                      <td className="py-3.5 px-3 align-top whitespace-nowrap">
                        <span className="font-extrabold text-app-primary text-[11.5px]">
                          {item.submission_number}
                        </span>
                      </td>

                      {/* 3. Tanggal Masuk */}
                      <td className="py-3.5 px-3 align-top whitespace-nowrap text-slate-600">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{formatSubmittedDate(item.submitted_at)}</span>
                        </div>
                      </td>

                      {/* 4. Nama Organisasi */}
                      <td className="py-3.5 px-3 align-top max-w-[165px]">
                        <div className="flex items-start gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-app-secondary-600 shrink-0 mt-0.5" />
                          <span className="font-bold text-slate-800 leading-snug line-clamp-2">
                            {item.organization_name}
                          </span>
                        </div>
                      </td>

                      {/* 5. Nama Pemohon */}
                      <td className="py-3.5 px-3 align-top whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{item.applicant_name}</span>
                        </div>
                      </td>

                      {/* 6. Perihal Pengajuan */}
                      <td className="py-3.5 px-3 align-top max-w-[210px]">
                        <p className="font-semibold text-slate-700 leading-snug line-clamp-2">
                          {item.activity_name}
                        </p>
                      </td>

                      {/* 7. Jumlah Dana */}
                      <td className="py-3.5 px-3 align-top whitespace-nowrap font-extrabold text-slate-900">
                        {formatRupiah(item.requested_amount)}
                      </td>

                      {/* 8. Status */}
                      <td className="py-3.5 px-3 align-top whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10.5px] font-bold ${statusInfo.badgeClass}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`}
                          />
                          {statusInfo.label}
                        </span>
                      </td>

                      {/* 9. Aksi */}
                      <td className="py-3.5 px-3 align-top text-right whitespace-nowrap">
                        <div
                          ref={isMenuOpen ? menuRef : null}
                          className="relative inline-flex items-center gap-1.5"
                        >
                          <Link
                            href={`/dashboard/admin/data-pengajuan/${item.id}`}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-app-primary hover:border-app-primary text-slate-700 hover:text-white text-[11px] font-bold transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Detail</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              setOpenMenuId(isMenuOpen ? null : item.id)
                            }
                            aria-label="Aksi Admin Lainnya"
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              isMenuOpen
                                ? "border-app-primary bg-app-primary-50 text-app-primary"
                                : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600"
                            }`}
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>

                          {isMenuOpen && (
                            <div className="absolute right-0 top-9 w-52 rounded-2xl bg-white shadow-xl shadow-slate-900/15 border border-slate-200/90 py-1.5 z-40 text-left">
                              {renderAdminActionsMenu(item)}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE & TABLET CARDS (< xl) */}
        <div className="xl:hidden divide-y divide-slate-100">
          {isLoadingList ? (
            <div className="p-10 text-center">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
                <Loader2 className="w-4 h-4 animate-spin text-app-primary" />
                <span>Memuat data pengajuan hibah...</span>
              </div>
            </div>
          ) : pengajuanList.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              Tidak ada data pengajuan yang sesuai dengan filter.
            </div>
          ) : (
            pengajuanList.map((item, idx) => {
              const statusInfo =
                STATUS_META[item.status] ?? STATUS_META.menunggu_verifikasi;
              const isMenuOpen = openMenuId === item.id;

              return (
                <div key={item.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-400">
                        #{startIndex + idx + 1}
                      </span>
                      <span className="text-xs font-extrabold text-app-primary">
                        {item.submission_number}
                      </span>
                    </div>

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
                    <p className="text-xs font-bold text-slate-900">
                      {item.organization_name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Pemohon: {item.applicant_name} •{" "}
                      {formatSubmittedDate(item.submitted_at)}
                    </p>
                    <p className="text-xs text-slate-700 mt-1 leading-snug">
                      {item.activity_name}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-xs font-extrabold text-slate-900">
                      {formatRupiah(item.requested_amount)}
                    </span>

                    <div
                      ref={isMenuOpen ? menuRef : null}
                      className="relative inline-flex items-center gap-1.5"
                    >
                      <Link
                        href={`/dashboard/admin/data-pengajuan/${item.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-app-primary text-slate-700 hover:text-white text-[11px] font-bold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detail</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          setOpenMenuId(isMenuOpen ? null : item.id)
                        }
                        aria-label="Aksi Admin Lainnya"
                        className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 cursor-pointer"
                      >
                        <MoreVertical className="w-3.5 h-3.5" />
                      </button>

                      {isMenuOpen && (
                        <div className="absolute right-0 bottom-9 w-52 rounded-2xl bg-white shadow-xl shadow-slate-900/15 border border-slate-200/90 py-1.5 z-40 text-left">
                          {renderAdminActionsMenu(item)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* PAGINATION (BACKEND PAGINATION META) */}
        <div className="px-4 py-3.5 bg-slate-50/70 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5">
              <span>Tampilkan</span>
              <select
                value={pagination.rows_per_page}
                disabled={isLoadingList}
                onChange={(e) => setRowsPerPage(Number(e.target.value))}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-800 focus:border-app-primary focus:outline-none disabled:opacity-60"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>data</span>
            </div>

            <span className="text-slate-300">|</span>

            <span>
              Menampilkan{" "}
              <strong className="text-slate-800">
                {pagination.total === 0 ? 0 : startIndex + 1}
              </strong>
              –
              <strong className="text-slate-800">
                {Math.min(
                  startIndex + pagination.rows_per_page,
                  pagination.total,
                )}
              </strong>{" "}
              dari{" "}
              <strong className="text-slate-800">{pagination.total}</strong>{" "}
              pengajuan
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage(pagination.page - 1)}
              disabled={isLoadingList || pagination.page <= 1}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-45 text-[11px] font-semibold text-slate-700 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sebelumnya</span>
            </button>

            {Array.from(
              { length: pagination.total_pages },
              (_, i) => i + 1,
            ).map((num) => (
              <button
                key={num}
                type="button"
                disabled={isLoadingList}
                onClick={() => setPage(num)}
                className={`w-8 h-8 rounded-lg text-[11px] font-extrabold transition-colors cursor-pointer disabled:opacity-60 ${
                  num === pagination.page
                    ? "bg-app-primary text-white shadow-2xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {num}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setPage(pagination.page + 1)}
              disabled={
                isLoadingList || pagination.page >= pagination.total_pages
              }
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-45 text-[11px] font-semibold text-slate-700 cursor-pointer disabled:cursor-not-allowed"
            >
              <span className="hidden sm:inline">Berikutnya</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
