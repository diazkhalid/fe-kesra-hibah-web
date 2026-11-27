"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Plus,
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
  Activity,
  ChevronLeft,
  ChevronRight,
  FileX2,
  Info,
  PhoneCall,
  Calendar,
  Building2,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { usePemohonPengajuan } from "@/features/pemohon-pengajuan/hooks/usePengajuan.hook";
import {
  GrantApplicationStatus,
  PemohonGrantApplicationData,
} from "@/features/pemohon-pengajuan/types/pengajuan.type";

const STATUS_META: Record<
  GrantApplicationStatus,
  {
    label: string;
    badgeClass: string;
    dotClass: string;
    icon: React.ElementType;
  }
> = {
  menunggu_verifikasi: {
    label: "Menunggu Verifikasi",
    badgeClass: "bg-sky-50 text-sky-700 border-sky-200",
    dotClass: "bg-sky-500",
    icon: Hourglass,
  },
  terverifikasi: {
    label: "Terverifikasi",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-500",
    icon: CheckCircle2,
  },
  ditolak: {
    label: "Ditolak",
    badgeClass: "bg-red-50 text-red-700 border-red-200",
    dotClass: "bg-red-500",
    icon: XCircle,
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

export default function RiwayatPengajuanPage() {
  const {
    history,
    isLoadingHistory,
    params,
    pagination,
    fetchHistory,
    updateFilters,
    setPage,
    setRowsPerPage,
    resetFilters,
    error: historyError,
    clearError,
  } = usePemohonPengajuan();

  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // State Input Filter Lokal sebelum tombol "Terapkan Filter" diklik
  const [searchInput, setSearchInput] = useState("");
  const [statusInput, setStatusInput] = useState<
    "all" | GrantApplicationStatus
  >("all");
  const [yearInput, setYearInput] = useState<string>("all");
  const [startDateInput, setStartDateInput] = useState<string>("");
  const [endDateInput, setEndDateInput] = useState<string>("");

  // Dropdown Aksi
  const [openActionId, setOpenActionId] = useState<string | null>(null);
  const actionMenuRef = useRef<HTMLDivElement | null>(null);

  // Fetch riwayat otomatis setiap kali params (filter / page / rows_per_page) berubah
  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(e.target as Node)
      ) {
        setOpenActionId(null);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 4000);
  };

  // Opsi tahun anggaran dinamis (tahun berjalan + 1 ke depan s/d 3 tahun ke belakang)
  const availableYears = [2027, 2026, 2025, 2024];

  // Statistik ringkas berdasarkan data halaman/total aktif
  const stats = {
    total: pagination.total,
    menunggu: history.filter((s) => s.status === "menunggu_verifikasi").length,
    terverifikasi: history.filter((s) => s.status === "terverifikasi").length,
    ditolak: history.filter((s) => s.status === "ditolak").length,
  };

  const hasActiveFilter = Boolean(
    params.search ||
    params.status ||
    params.fiscal_year ||
    params.submitted_from ||
    params.submitted_until,
  );

  const handleApplyFilter = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    clearError();
    updateFilters({
      search: searchInput.trim() || undefined,
      status: statusInput === "all" ? undefined : statusInput,
      fiscal_year: yearInput === "all" ? undefined : Number(yearInput),
      submitted_from: startDateInput || undefined,
      submitted_until: endDateInput || undefined,
    });
  };

  const handleResetFilter = () => {
    setSearchInput("");
    setStatusInput("all");
    setYearInput("all");
    setStartDateInput("");
    setEndDateInput("");
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

  const handleDownloadReceipt = (item: PemohonGrantApplicationData) => {
    setOpenActionId(null);
    const statusLabel = STATUS_META[item.status]?.label ?? item.status;
    const receiptText = `BUKTI REGISTRASI PENGAJUAN HIBAH\nPemerintah Kabupaten Sumbawa - Bagian Kesejahteraan Rakyat\n====================================================\nNomor Pengajuan : ${item.submission_number}\nTanggal         : ${formatSubmittedDate(item.submitted_at)}\nTahun Anggaran  : ${item.fiscal_year}\nOrganisasi      : ${item.organization_name}\nPemohon         : ${item.applicant_name}\nKegiatan        : ${item.activity_name}\nJumlah Dana     : ${formatRupiah(item.requested_amount)}\nStatus Terkini  : ${statusLabel}\n`;
    const blob = new Blob([receiptText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Bukti_Pengajuan_${item.submission_number}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Bukti pengajuan ${item.submission_number} berhasil diunduh.`);
  };

  // Render daftar item menu titik 3 vertikal sesuai status
  const renderContextualMenuItems = (item: PemohonGrantApplicationData) => {
    switch (item.status) {
      case "menunggu_verifikasi":
        return (
          <>
            <Link
              href={`/dashboard/pemohon/riwayat-pengajuan/${item.id}`}
              onClick={() => setOpenActionId(null)}
              className="flex items-center gap-2 px-3.5 py-2 text-[11.5px] font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Eye className="w-3.5 h-3.5 text-app-primary" />
              <span>Lihat Detail</span>
            </Link>
            <Link
              href={`/dashboard/pemohon/riwayat-pengajuan/${item.id}#dokumen`}
              onClick={() => setOpenActionId(null)}
              className="flex items-center gap-2 px-3.5 py-2 text-[11.5px] font-semibold text-slate-700 hover:bg-slate-50"
            >
              <FileText className="w-3.5 h-3.5 text-sky-600" />
              <span>Lihat Dokumen</span>
            </Link>
            <Link
              href={`/dashboard/pemohon/riwayat-pengajuan/${item.id}#tracking`}
              onClick={() => setOpenActionId(null)}
              className="flex items-center gap-2 px-3.5 py-2 text-[11.5px] font-semibold text-sky-700 hover:bg-sky-50/60"
            >
              <Activity className="w-3.5 h-3.5 text-sky-600" />
              <span>Pantau Status</span>
            </Link>
            <button
              type="button"
              onClick={() => handleDownloadReceipt(item)}
              className="w-full flex items-center gap-2 px-3.5 py-2 text-[11.5px] font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-600" />
              <span>Download Bukti Pengajuan</span>
            </button>
          </>
        );

      case "terverifikasi":
      case "ditolak":
        return (
          <>
            <Link
              href={`/dashboard/pemohon/riwayat-pengajuan/${item.id}`}
              onClick={() => setOpenActionId(null)}
              className="flex items-center gap-2 px-3.5 py-2 text-[11.5px] font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Eye className="w-3.5 h-3.5 text-app-primary" />
              <span>Lihat Detail & Hasil Verifikasi</span>
            </Link>
            <button
              type="button"
              onClick={() => handleDownloadReceipt(item)}
              className="w-full flex items-center gap-2 px-3.5 py-2 text-[11.5px] font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-app-primary" />
              <span>Download Bukti Pengajuan</span>
            </button>
          </>
        );
    }
  };

  const startIndex = (pagination.page - 1) * pagination.rows_per_page;
  const isTrulyEmpty =
    !isLoadingHistory &&
    !historyError &&
    history.length === 0 &&
    !hasActiveFilter;

  return (
    <div className="space-y-6 pb-10">
      {/* =====================================================================
          1. HEADER HALAMAN
      ====================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500"
          >
            <Link
              href="/dashboard/pemohon"
              className="hover:text-app-primary transition-colors"
            >
              Dashboard
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-app-primary font-bold">Daftar Pengajuan</span>
          </nav>

          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Daftar Pengajuan
          </h1>
          <p className="text-xs text-slate-500">
            Menampilkan seluruh riwayat pengajuan hibah yang telah dibuat.
          </p>
        </div>

        <Link
          href="/dashboard/pemohon/buat-pengajuan"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-app-primary hover:bg-app-primary-800 text-white text-xs font-bold shadow-sm transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-app-secondary stroke-[2.5]" />
          <span>Buat Pengajuan Baru</span>
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
      {historyError && (
        <div
          role="alert"
          className="flex items-center justify-between gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-xs font-semibold text-red-700"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{historyError}</span>
          </div>
          <button
            type="button"
            onClick={() => fetchHistory()}
            className="px-3 py-1 rounded-lg bg-white border border-red-200 text-red-700 hover:bg-red-100 text-[11px] font-bold cursor-pointer shrink-0"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {/* =====================================================================
          2. STATISTIK PENGAJUAN (4 CARD SESUAI STATUS API)
      ====================================================================== */}
      <section
        aria-label="Statistik Pengajuan"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5"
      >
        {/* Card 1: Total Pengajuan */}
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
            Seluruh pengajuan terdaftar
          </p>
        </button>

        {/* Card 2: Menunggu Verifikasi */}
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
            {stats.menunggu}
          </p>
          <p className="mt-0.5 text-[10px] text-sky-600 font-medium">
            Menunggu verifikasi Admin
          </p>
        </button>

        {/* Card 3: Terverifikasi */}
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
          <p className="mt-0.5 text-[10px] text-emerald-600 font-medium">
            Lolos verifikasi berkas
          </p>
        </button>

        {/* Card 4: Ditolak */}
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
          <p className="mt-0.5 text-[10px] text-red-600 font-medium">
            Tidak memenuhi ketentuan
          </p>
        </button>
      </section>

      {/* =====================================================================
          EMPTY STATE JIKA BELUM ADA PENGAJUAN SAMA SEKALI
      ====================================================================== */}
      {isTrulyEmpty ? (
        <section className="rounded-3xl bg-white border border-slate-200/80 p-10 sm:p-14 text-center shadow-2xs">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-app-primary-50 border border-app-primary-100 text-app-primary flex items-center justify-center mb-4">
            <FileX2 className="w-8 h-8 stroke-[1.8]" />
          </div>
          <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
            Belum Ada Pengajuan
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1.5 leading-relaxed">
            Anda belum memiliki riwayat pengajuan hibah. Mulai buat permohonan
            bantuan hibah untuk lembaga atau organisasi Anda sekarang.
          </p>
          <div className="mt-5">
            <Link
              href="/dashboard/pemohon/buat-pengajuan"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-app-primary hover:bg-app-primary-800 text-white text-xs font-bold shadow-md shadow-app-primary/15 transition-all"
            >
              <Plus className="w-4 h-4 text-app-secondary" />
              <span>Buat Pengajuan Sekarang</span>
            </Link>
          </div>
        </section>
      ) : (
        <>
          {/* ===================================================================
              3. SEARCH DAN FILTER (BACKEND PARAMS)
          ==================================================================== */}
          <section
            aria-label="Pencarian dan Filter Pengajuan"
            className="rounded-2xl bg-white border border-slate-200/80 p-4 sm:p-5 shadow-2xs"
          >
            <form onSubmit={handleApplyFilter} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
                {/* A. Kolom Pencarian */}
                <div className="md:col-span-4 space-y-1.5">
                  <label
                    htmlFor="searchQuery"
                    className="block text-[11px] font-bold text-slate-700"
                  >
                    Pencarian
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                      <Search className="w-3.5 h-3.5" />
                    </span>
                    <input
                      id="searchQuery"
                      type="text"
                      value={searchInput}
                      onChange={(e) => setSearchInput(e.target.value)}
                      placeholder="No. pengajuan, kegiatan, organisasi..."
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15"
                    />
                  </div>
                </div>

                {/* B. Filter Status */}
                <div className="md:col-span-3 space-y-1.5">
                  <label
                    htmlFor="filterStatus"
                    className="block text-[11px] font-bold text-slate-700"
                  >
                    Status Pengajuan
                  </label>
                  <select
                    id="filterStatus"
                    value={statusInput}
                    onChange={(e) =>
                      setStatusInput(
                        e.target.value as "all" | GrantApplicationStatus,
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15"
                  >
                    <option value="all">Semua Status</option>
                    <option value="menunggu_verifikasi">
                      Menunggu Verifikasi
                    </option>
                    <option value="terverifikasi">Terverifikasi</option>
                    <option value="ditolak">Ditolak</option>
                  </select>
                </div>

                {/* C. Filter Tahun */}
                <div className="md:col-span-2 space-y-1.5">
                  <label
                    htmlFor="filterYear"
                    className="block text-[11px] font-bold text-slate-700"
                  >
                    Tahun
                  </label>
                  <select
                    id="filterYear"
                    value={yearInput}
                    onChange={(e) => setYearInput(e.target.value)}
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

                {/* D. Filter Tanggal */}
                <div className="md:col-span-3 grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="startDate"
                      className="block text-[11px] font-bold text-slate-700"
                    >
                      Tanggal Awal
                    </label>
                    <input
                      id="startDate"
                      type="date"
                      value={startDateInput}
                      onChange={(e) => setStartDateInput(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-2.5 py-2 text-[11px] text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="endDate"
                      className="block text-[11px] font-bold text-slate-700"
                    >
                      Tanggal Akhir
                    </label>
                    <input
                      id="endDate"
                      type="date"
                      value={endDateInput}
                      onChange={(e) => setEndDateInput(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-2.5 py-2 text-[11px] text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15"
                    />
                  </div>
                </div>
              </div>

              {/* E. Tombol Terapkan & Reset Filter */}
              <div className="flex flex-wrap items-center justify-end gap-2 pt-1 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleResetFilter}
                  disabled={isLoadingHistory}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-60 text-slate-600 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Filter</span>
                </button>

                <button
                  type="submit"
                  disabled={isLoadingHistory}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-app-primary hover:bg-app-primary-800 disabled:opacity-60 text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                >
                  {isLoadingHistory ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-app-secondary" />
                  ) : (
                    <Filter className="w-3.5 h-3.5 text-app-secondary" />
                  )}
                  <span>Terapkan Filter</span>
                </button>
              </div>
            </form>
          </section>

          {/* ===================================================================
              4. TABEL DAFTAR PENGAJUAN & 6. AKSI
          ==================================================================== */}
          <section
            aria-label="Tabel Daftar Pengajuan"
            className="rounded-2xl bg-white border border-slate-200/80 shadow-2xs overflow-visible"
          >
            {/* TAMPILAN DESKTOP TABLE */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/90 border-b border-slate-200/70 text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-3.5 w-12 text-center">No.</th>
                    <th className="py-3.5 px-3.5 whitespace-nowrap">
                      Nomor Pengajuan
                    </th>
                    <th className="py-3.5 px-3.5 whitespace-nowrap">
                      Tanggal Pengajuan
                    </th>
                    <th className="py-3.5 px-3.5">Nama Organisasi</th>
                    <th className="py-3.5 px-3.5">Nama Kegiatan</th>
                    <th className="py-3.5 px-3.5 whitespace-nowrap">
                      Jumlah Dana
                    </th>
                    <th className="py-3.5 px-3.5 whitespace-nowrap">Status</th>
                    <th className="py-3.5 px-3.5 text-right whitespace-nowrap">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {isLoadingHistory ? (
                    <tr>
                      <td colSpan={8} className="py-14 text-center">
                        <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
                          <Loader2 className="w-4 h-4 animate-spin text-app-primary" />
                          <span>Memuat daftar pengajuan...</span>
                        </div>
                      </td>
                    </tr>
                  ) : history.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="py-12 text-center text-xs text-slate-500"
                      >
                        Tidak ada data pengajuan yang sesuai dengan kriteria
                        filter Anda.
                      </td>
                    </tr>
                  ) : (
                    history.map((item, idx) => {
                      const statusInfo =
                        STATUS_META[item.status] ??
                        STATUS_META.menunggu_verifikasi;
                      const isMenuOpen = openActionId === item.id;

                      return (
                        <tr
                          key={item.id}
                          className="hover:bg-slate-50/70 transition-colors"
                        >
                          {/* 1. No. */}
                          <td className="py-3.5 px-3.5 text-center font-semibold text-slate-500 align-top">
                            {startIndex + idx + 1}
                          </td>

                          {/* 2. Nomor Pengajuan */}
                          <td className="py-3.5 px-3.5 align-top whitespace-nowrap">
                            <span className="font-extrabold text-app-primary text-[11.5px]">
                              {item.submission_number}
                            </span>
                          </td>

                          {/* 3. Tanggal Pengajuan */}
                          <td className="py-3.5 px-3.5 align-top whitespace-nowrap text-slate-600">
                            <div className="flex items-center gap-1.5 text-[11.5px]">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              <span>
                                {formatSubmittedDate(item.submitted_at)}
                              </span>
                            </div>
                          </td>

                          {/* 4. Nama Organisasi */}
                          <td className="py-3.5 px-3.5 align-top max-w-[180px]">
                            <div className="flex items-start gap-1.5">
                              <Building2 className="w-3.5 h-3.5 text-app-secondary-600 shrink-0 mt-0.5" />
                              <span className="font-semibold text-slate-700 leading-snug line-clamp-2">
                                {item.organization_name}
                              </span>
                            </div>
                          </td>

                          {/* 5. Nama Kegiatan */}
                          <td className="py-3.5 px-3.5 align-top max-w-[230px]">
                            <p className="font-bold text-slate-800 leading-snug line-clamp-2">
                              {item.activity_name}
                            </p>
                          </td>

                          {/* 6. Jumlah Dana */}
                          <td className="py-3.5 px-3.5 align-top whitespace-nowrap font-extrabold text-slate-800">
                            {formatRupiah(item.requested_amount)}
                          </td>

                          {/* 7. Status */}
                          <td className="py-3.5 px-3.5 align-top whitespace-nowrap">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10.5px] font-bold ${statusInfo.badgeClass}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`}
                              />
                              {statusInfo.label}
                            </span>
                          </td>

                          {/* 8. Aksi: Tombol Detail Seragam di Luar + Menu Titik 3 Vertikal */}
                          <td className="py-3.5 px-3.5 align-top text-right whitespace-nowrap">
                            <div
                              ref={isMenuOpen ? actionMenuRef : null}
                              className="relative inline-flex items-center gap-1.5"
                            >
                              <Link
                                href={`/dashboard/pemohon/riwayat-pengajuan/${item.id}`}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-app-primary hover:border-app-primary text-slate-700 hover:text-white text-[11px] font-bold transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Detail</span>
                              </Link>

                              <button
                                type="button"
                                onClick={() =>
                                  setOpenActionId(isMenuOpen ? null : item.id)
                                }
                                aria-label="Menu Aksi Lainnya"
                                className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                                  isMenuOpen
                                    ? "border-app-primary bg-app-primary-50 text-app-primary"
                                    : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600"
                                }`}
                              >
                                <MoreVertical className="w-3.5 h-3.5" />
                              </button>

                              {isMenuOpen && (
                                <div className="absolute right-0 top-9 w-56 rounded-2xl bg-white shadow-xl shadow-slate-900/15 border border-slate-200/90 py-1.5 z-40 text-left">
                                  {renderContextualMenuItems(item)}
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

            {/* TAMPILAN MOBILE CARDS (< lg) */}
            <div className="lg:hidden divide-y divide-slate-100">
              {isLoadingHistory ? (
                <div className="p-10 text-center">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <Loader2 className="w-4 h-4 animate-spin text-app-primary" />
                    <span>Memuat daftar pengajuan...</span>
                  </div>
                </div>
              ) : history.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  Tidak ada data pengajuan yang sesuai dengan filter.
                </div>
              ) : (
                history.map((item, idx) => {
                  const statusInfo =
                    STATUS_META[item.status] ?? STATUS_META.menunggu_verifikasi;
                  const isMenuOpen = openActionId === item.id;

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
                        <p className="text-[11px] font-semibold text-slate-500">
                          {item.organization_name}
                        </p>
                        <p className="text-xs font-bold text-slate-900 mt-0.5 leading-snug">
                          {item.activity_name}
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                        <div>
                          <p className="text-[10px] text-slate-400">
                            {formatSubmittedDate(item.submitted_at)}
                          </p>
                          <p className="text-xs font-extrabold text-slate-900">
                            {formatRupiah(item.requested_amount)}
                          </p>
                        </div>

                        <div
                          ref={isMenuOpen ? actionMenuRef : null}
                          className="relative inline-flex items-center gap-1.5"
                        >
                          <Link
                            href={`/dashboard/pemohon/riwayat-pengajuan/${item.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-app-primary text-slate-700 hover:text-white text-[11px] font-bold transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Detail</span>
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              setOpenActionId(isMenuOpen ? null : item.id)
                            }
                            aria-label="Menu Aksi Lainnya"
                            className="p-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-600 cursor-pointer"
                          >
                            <MoreVertical className="w-3.5 h-3.5" />
                          </button>

                          {isMenuOpen && (
                            <div className="absolute right-0 bottom-9 w-56 rounded-2xl bg-white shadow-xl shadow-slate-900/15 border border-slate-200/90 py-1.5 z-40 text-left">
                              {renderContextualMenuItems(item)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* =================================================================
                7. PAGINATION (BACKEND PAGINATION META)
            ================================================================== */}
            <div className="px-4 py-3.5 bg-slate-50/70 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span>Tampilkan</span>
                  <select
                    aria-label="Jumlah data per halaman"
                    value={pagination.rows_per_page}
                    disabled={isLoadingHistory}
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
                  disabled={isLoadingHistory || pagination.page <= 1}
                  aria-label="Halaman Sebelumnya"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-45 text-[11px] font-semibold text-slate-700 cursor-pointer disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sebelumnya</span>
                </button>

                {Array.from(
                  { length: pagination.total_pages },
                  (_, i) => i + 1,
                ).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    disabled={isLoadingHistory}
                    onClick={() => setPage(pageNum)}
                    className={`w-8 h-8 rounded-lg text-[11px] font-extrabold transition-colors cursor-pointer disabled:opacity-60 ${
                      pageNum === pagination.page
                        ? "bg-app-primary text-white shadow-2xs"
                        : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setPage(pagination.page + 1)}
                  disabled={
                    isLoadingHistory ||
                    pagination.page >= pagination.total_pages
                  }
                  aria-label="Halaman Berikutnya"
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-45 text-[11px] font-semibold text-slate-700 cursor-pointer disabled:cursor-not-allowed"
                >
                  <span className="hidden sm:inline">Berikutnya</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </section>
        </>
      )}

      {/* =====================================================================
          9. INFORMASI TAMBAHAN
      ====================================================================== */}
      <section
        aria-label="Informasi Tambahan Pengajuan"
        className="rounded-2xl bg-app-primary-50/70 border border-app-primary-200/80 p-4 sm:p-5 space-y-2.5"
      >
        <div className="flex items-center gap-2 text-xs font-extrabold text-app-primary-950">
          <Info className="w-4 h-4 text-app-primary" />
          <span>Informasi Penting Layanan Pengajuan Hibah</span>
        </div>

        <ul className="space-y-1.5 text-[11.5px] text-slate-700 pl-6 list-disc">
          <li>
            Setiap pengajuan yang dibuat dan dikirim memiliki{" "}
            <strong className="text-slate-900">
              nomor registrasi otomatis
            </strong>{" "}
            sebagai identitas pelacakan berkas pada sistem.
          </li>
          <li>
            Pengajuan yang sudah berstatus{" "}
            <strong className="text-slate-900">Menunggu Verifikasi</strong>,{" "}
            <strong className="text-emerald-700">Terverifikasi</strong>, maupun{" "}
            <strong className="text-red-700">Ditolak</strong> tidak dapat diubah
            secara langsung.
          </li>
          <li>
            Apabila mengalami kendala teknis maupun konsultasi persyaratan
            administrasi, silakan hubungi{" "}
            <Link
              href="/#kontak"
              className="inline-flex items-center gap-1 font-bold text-app-primary hover:underline underline-offset-4"
            >
              <PhoneCall className="w-3 h-3" />
              <span>
                Admin Bagian Kesejahteraan Rakyat Setda Kabupaten Sumbawa
              </span>
            </Link>
            .
          </li>
        </ul>
      </section>
    </div>
  );
}
