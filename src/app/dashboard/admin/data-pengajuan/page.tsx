"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FolderKanban,
  Sparkles,
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
} from "lucide-react";

type AdminSubmissionStatus =
  | "menunggu_verifikasi"
  | "terverifikasi"
  | "ditolak";

interface AdminSubmissionItem {
  id: string;
  nomorRegistrasi: string;
  tanggalMasuk: string; // YYYY-MM-DD
  tanggalLabel: string;
  tahun: string;
  namaOrganisasi: string;
  namaPemohon: string;
  perihalPengajuan: string;
  jumlahDana: number;
  status: AdminSubmissionStatus;
  isNew?: boolean;
}

const STATUS_META: Record<
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

const INITIAL_SUBMISSIONS: AdminSubmissionItem[] = [
  {
    id: "hb-2026-001",
    nomorRegistrasi: "HIB-2026-001",
    tanggalMasuk: "2026-11-16",
    tanggalLabel: "16 Nov 2026",
    tahun: "2026",
    namaOrganisasi: "Yayasan Nurul Iman Sumbawa",
    namaPemohon: "Ahmad Fauzi",
    perihalPengajuan:
      "Bantuan Pendidikan & Rehabilitasi Ruang Belajar TPQ Al-Hikmah",
    jumlahDana: 50000000,
    status: "menunggu_verifikasi",
    isNew: true,
  },
  {
    id: "hb-2026-002",
    nomorRegistrasi: "HIB-2026-002",
    tanggalMasuk: "2026-11-15",
    tanggalLabel: "15 Nov 2026",
    tahun: "2026",
    namaOrganisasi: "Masjid Besar Al-Ikhlas Sumbawa",
    namaPemohon: "H. Abdul Rahman",
    perihalPengajuan:
      "Bantuan Sarana Ibadah dan Pengadaan Sistem Tata Suara Masjid",
    jumlahDana: 30000000,
    status: "menunggu_verifikasi",
    isNew: true,
  },
  {
    id: "hb-2026-003",
    nomorRegistrasi: "HIB-2026-003",
    tanggalMasuk: "2026-11-14",
    tanggalLabel: "14 Nov 2026",
    tahun: "2026",
    namaOrganisasi: "Lembaga Sosial Samawa Peduli",
    namaPemohon: "Siti Aminah, S.Sos.",
    perihalPengajuan:
      "Bantuan Sosial Santunan Anak Yatim & Lansia Kecamatan Sumbawa",
    jumlahDana: 25000000,
    status: "menunggu_verifikasi",
    isNew: false,
  },
  {
    id: "hb-2026-004",
    nomorRegistrasi: "HIB-2026-004",
    tanggalMasuk: "2026-11-10",
    tanggalLabel: "10 Nov 2026",
    tahun: "2026",
    namaOrganisasi: "Yayasan Nurul Iman Sumbawa",
    namaPemohon: "Ahmad Fauzi",
    perihalPengajuan:
      "Pengadaan Perlengkapan Seni Islami dan Pembinaan Remaja Masjid",
    jumlahDana: 18500000,
    status: "terverifikasi",
    isNew: false,
  },
  {
    id: "hb-2026-006",
    nomorRegistrasi: "HIB-2026-006",
    tanggalMasuk: "2026-11-05",
    tanggalLabel: "05 Nov 2026",
    tahun: "2026",
    namaOrganisasi: "Pondok Pesantren Darussalam Alas",
    namaPemohon: "Ust. Syamsuddin",
    perihalPengajuan: "Pembangunan Asrama Santri Putra dan Fasilitas Sanitasi",
    jumlahDana: 75000000,
    status: "terverifikasi",
    isNew: false,
  },
  {
    id: "hb-2025-009",
    nomorRegistrasi: "HIB-2025-009",
    tanggalMasuk: "2025-07-04",
    tanggalLabel: "04 Jul 2025",
    tahun: "2025",
    namaOrganisasi: "Kelompok Pemuda Moyo Hilir",
    namaPemohon: "Zulkifli Hasan",
    perihalPengajuan:
      "Permohonan Bantuan Pengadaan Perlengkapan Turnamen Olahraga",
    jumlahDana: 40000000,
    status: "ditolak",
    isNew: false,
  },
];

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// Helper membuat PDF proposal dummy untuk tombol Download Proposal
function downloadDummyProposal(item: AdminSubmissionItem) {
  const safeTitle = item.perihalPengajuan.replace(/[()\\]/g, "");
  const pdfContent = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 595 842] /Contents 5 0 R >> endobj
4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> endobj
5 0 obj << /Length 160 >>
stream
BT
/F1 14 Tf
50 760 Td
(PROPOSAL PENGAJUAN HIBAH - ${item.nomorRegistrasi}) Tj
0 -26 Td
/F1 11 Tf
(Organisasi: ${item.namaOrganisasi}) Tj
0 -20 Td
(Perihal: ${safeTitle}) Tj
ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000229 00000 n 
0000000302 00000 n 
trailer << /Size 6 /Root 1 0 R >>
startxref
512
%%EOF`;

  const blob = new Blob([pdfContent], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `Proposal_${item.nomorRegistrasi}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminDataPengajuanPage() {
  const router = useRouter();
  const [submissions] = useState<AdminSubmissionItem[]>(INITIAL_SUBMISSIONS);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  // State Input Pencarian & Filter
  const [nomorInput, setNomorInput] = useState("");
  const [pemohonInput, setPemohonInput] = useState("");
  const [organisasiInput, setOrganisasiInput] = useState("");
  const [tahunInput, setTahunInput] = useState("all");
  const [tanggalInput, setTanggalInput] = useState("");
  const [statusInput, setStatusInput] = useState<"all" | AdminSubmissionStatus>(
    "all",
  );

  // State Filter Aktif
  const [appliedFilter, setAppliedFilter] = useState({
    nomor: "",
    pemohon: "",
    organisasi: "",
    tahun: "all",
    tanggal: "",
    status: "all" as "all" | AdminSubmissionStatus,
  });

  // Pagination & Action Menu
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

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

  // A. Statistik Pengajuan
  const stats = useMemo(() => {
    return {
      total: submissions.length,
      baru: submissions.filter((s) => s.isNew).length,
      menungguVerifikasi: submissions.filter(
        (s) => s.status === "menunggu_verifikasi",
      ).length,
      terverifikasi: submissions.filter((s) => s.status === "terverifikasi")
        .length,
      ditolak: submissions.filter((s) => s.status === "ditolak").length,
    };
  }, [submissions]);

  const availableYears = useMemo(() => {
    return Array.from(new Set(submissions.map((s) => s.tahun))).sort(
      (a, b) => Number(b) - Number(a),
    );
  }, [submissions]);

  // Hasil Filter Tabel
  const filteredData = useMemo(() => {
    return submissions.filter((item) => {
      const matchNomor =
        !appliedFilter.nomor.trim() ||
        item.nomorRegistrasi
          .toLowerCase()
          .includes(appliedFilter.nomor.trim().toLowerCase());

      const matchPemohon =
        !appliedFilter.pemohon.trim() ||
        item.namaPemohon
          .toLowerCase()
          .includes(appliedFilter.pemohon.trim().toLowerCase());

      const matchOrganisasi =
        !appliedFilter.organisasi.trim() ||
        item.namaOrganisasi
          .toLowerCase()
          .includes(appliedFilter.organisasi.trim().toLowerCase());

      const matchTahun =
        appliedFilter.tahun === "all" || item.tahun === appliedFilter.tahun;

      const matchTanggal =
        !appliedFilter.tanggal || item.tanggalMasuk === appliedFilter.tanggal;

      const matchStatus =
        appliedFilter.status === "all" || item.status === appliedFilter.status;

      return (
        matchNomor &&
        matchPemohon &&
        matchOrganisasi &&
        matchTahun &&
        matchTanggal &&
        matchStatus
      );
    });
  }, [submissions, appliedFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedFilter({
      nomor: nomorInput,
      pemohon: pemohonInput,
      organisasi: organisasiInput,
      tahun: tahunInput,
      tanggal: tanggalInput,
      status: statusInput,
    });
    setCurrentPage(1);
  };

  const handleResetFilter = () => {
    setNomorInput("");
    setPemohonInput("");
    setOrganisasiInput("");
    setTahunInput("all");
    setTanggalInput("");
    setStatusInput("all");
    setAppliedFilter({
      nomor: "",
      pemohon: "",
      organisasi: "",
      tahun: "all",
      tanggal: "",
      status: "all",
    });
    setCurrentPage(1);
  };

  const handleDownloadProposalClick = (item: AdminSubmissionItem) => {
    setOpenMenuId(null);
    downloadDummyProposal(item);
    showToast(`File Proposal_${item.nomorRegistrasi}.pdf berhasil diunduh.`);
  };

  // D. Menu Aksi Admin (Lihat Detail, Lihat Dokumen, Download Proposal, Mulai Verifikasi)
  const renderAdminActionsMenu = (item: AdminSubmissionItem) => (
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
        onClick={() => handleDownloadProposalClick(item)}
        className="w-full flex items-center gap-2 px-3.5 py-2 text-[11.5px] font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer"
      >
        <Download className="w-3.5 h-3.5 text-emerald-600" />
        <span>Download Proposal</span>
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

      {/* =====================================================================
          A. STATISTIK PENGAJUAN (5 CARD)
      ====================================================================== */}
      <section
        aria-label="Statistik Data Pengajuan"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5"
      >
        {/* 1. Total Pengajuan */}
        <button
          type="button"
          onClick={() => {
            setStatusInput("all");
            setAppliedFilter((prev) => ({ ...prev, status: "all" }));
            setCurrentPage(1);
          }}
          className={`text-left rounded-2xl bg-white border p-4 shadow-2xs transition-all cursor-pointer ${
            appliedFilter.status === "all"
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

        {/* 2. Pengajuan Baru */}
        <div className="rounded-2xl bg-white border border-slate-200/80 p-4 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">
              Pengajuan Baru
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <p className="mt-2.5 text-2xl font-extrabold text-slate-900">
            {stats.baru}
          </p>
          <p className="mt-0.5 text-[10px] font-semibold text-indigo-600">
            Masuk terbaru
          </p>
        </div>

        {/* 3. Menunggu Verifikasi */}
        <button
          type="button"
          onClick={() => {
            setStatusInput("menunggu_verifikasi");
            setAppliedFilter((prev) => ({
              ...prev,
              status: "menunggu_verifikasi",
            }));
            setCurrentPage(1);
          }}
          className={`text-left rounded-2xl bg-white border p-4 shadow-2xs transition-all cursor-pointer ${
            appliedFilter.status === "menunggu_verifikasi"
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

        {/* 4. Terverifikasi */}
        <button
          type="button"
          onClick={() => {
            setStatusInput("terverifikasi");
            setAppliedFilter((prev) => ({ ...prev, status: "terverifikasi" }));
            setCurrentPage(1);
          }}
          className={`text-left rounded-2xl bg-white border p-4 shadow-2xs transition-all cursor-pointer ${
            appliedFilter.status === "terverifikasi"
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

        {/* 5. Ditolak */}
        <button
          type="button"
          onClick={() => {
            setStatusInput("ditolak");
            setAppliedFilter((prev) => ({ ...prev, status: "ditolak" }));
            setCurrentPage(1);
          }}
          className={`text-left rounded-2xl bg-white border p-4 shadow-2xs transition-all cursor-pointer ${
            appliedFilter.status === "ditolak"
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
          B. PENCARIAN DAN FILTER (6 KRITERIA)
      ====================================================================== */}
      <section
        aria-label="Pencarian dan Filter Data Pengajuan"
        className="rounded-2xl bg-white border border-slate-200/80 p-4 sm:p-5 shadow-2xs"
      >
        <form onSubmit={handleApplyFilter} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
            {/* 1. Nomor Pengajuan */}
            <div className="space-y-1.5">
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

            {/* 2. Nama Pemohon */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700">
                Nama Pemohon
              </label>
              <input
                type="text"
                value={pemohonInput}
                onChange={(e) => setPemohonInput(e.target.value)}
                placeholder="Cari pemohon..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15"
              />
            </div>

            {/* 3. Nama Organisasi */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700">
                Nama Organisasi
              </label>
              <input
                type="text"
                value={organisasiInput}
                onChange={(e) => setOrganisasiInput(e.target.value)}
                placeholder="Cari lembaga..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15"
              />
            </div>

            {/* 4. Tahun Pengajuan */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700">
                Tahun Pengajuan
              </label>
              <select
                value={tahunInput}
                onChange={(e) => setTahunInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15"
              >
                <option value="all">Semua Tahun</option>
                {availableYears.map((yr) => (
                  <option key={yr} value={yr}>
                    Tahun {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* 5. Tanggal Pengajuan */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700">
                Tanggal Pengajuan
              </label>
              <input
                type="date"
                value={tanggalInput}
                onChange={(e) => setTanggalInput(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15"
              />
            </div>

            {/* 6. Status Pengajuan */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700">
                Status Pengajuan
              </label>
              <select
                value={statusInput}
                onChange={(e) =>
                  setStatusInput(
                    e.target.value as "all" | AdminSubmissionStatus,
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
          </div>

          <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={handleResetFilter}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filter</span>
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-app-primary hover:bg-app-primary-800 text-white text-xs font-bold shadow-2xs transition-colors cursor-pointer"
            >
              <Filter className="w-3.5 h-3.5 text-app-secondary" />
              <span>Terapkan Filter</span>
            </button>
          </div>
        </form>
      </section>

      {/* =====================================================================
          C. TABEL DATA PENGAJUAN (9 KOLOM) & D. AKSI ADMIN
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
              {paginatedData.length === 0 ? (
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
                paginatedData.map((item, idx) => {
                  const statusInfo = STATUS_META[item.status];
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
                        <div className="flex flex-col items-start gap-1">
                          <span className="font-extrabold text-app-primary text-[11.5px]">
                            {item.nomorRegistrasi}
                          </span>
                          {item.isNew && (
                            <span className="px-1.5 py-0.2 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 text-[9px] font-extrabold uppercase">
                              Baru
                            </span>
                          )}
                        </div>
                      </td>

                      {/* 3. Tanggal Masuk */}
                      <td className="py-3.5 px-3 align-top whitespace-nowrap text-slate-600">
                        <div className="flex items-center gap-1.5 text-[11px]">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{item.tanggalLabel}</span>
                        </div>
                      </td>

                      {/* 4. Nama Organisasi */}
                      <td className="py-3.5 px-3 align-top max-w-[165px]">
                        <div className="flex items-start gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-app-secondary-600 shrink-0 mt-0.5" />
                          <span className="font-bold text-slate-800 leading-snug line-clamp-2">
                            {item.namaOrganisasi}
                          </span>
                        </div>
                      </td>

                      {/* 5. Nama Pemohon */}
                      <td className="py-3.5 px-3 align-top whitespace-nowrap">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{item.namaPemohon}</span>
                        </div>
                      </td>

                      {/* 6. Perihal Pengajuan */}
                      <td className="py-3.5 px-3 align-top max-w-[210px]">
                        <p className="font-semibold text-slate-700 leading-snug line-clamp-2">
                          {item.perihalPengajuan}
                        </p>
                      </td>

                      {/* 7. Jumlah Dana */}
                      <td className="py-3.5 px-3 align-top whitespace-nowrap font-extrabold text-slate-900">
                        {formatRupiah(item.jumlahDana)}
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

                      {/* 9. Aksi (Tombol Detail Seragam + Menu Titik 3 Vertikal) */}
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
          {paginatedData.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              Tidak ada data pengajuan yang sesuai dengan filter.
            </div>
          ) : (
            paginatedData.map((item, idx) => {
              const statusInfo = STATUS_META[item.status];
              const isMenuOpen = openMenuId === item.id;

              return (
                <div key={item.id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-slate-400">
                        #{startIndex + idx + 1}
                      </span>
                      <span className="text-xs font-extrabold text-app-primary">
                        {item.nomorRegistrasi}
                      </span>
                      {item.isNew && (
                        <span className="px-1.5 py-0.2 rounded bg-indigo-50 border border-indigo-200 text-indigo-700 text-[9px] font-extrabold">
                          BARU
                        </span>
                      )}
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
                      {item.namaOrganisasi}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Pemohon: {item.namaPemohon} • {item.tanggalLabel}
                    </p>
                    <p className="text-xs text-slate-700 mt-1 leading-snug">
                      {item.perihalPengajuan}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-xs font-extrabold text-slate-900">
                      {formatRupiah(item.jumlahDana)}
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

        {/* PAGINATION */}
        <div className="px-4 py-3.5 bg-slate-50/70 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5">
              <span>Tampilkan</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-800 focus:border-app-primary focus:outline-none"
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
                {filteredData.length === 0 ? 0 : startIndex + 1}
              </strong>
              –
              <strong className="text-slate-800">
                {Math.min(startIndex + pageSize, filteredData.length)}
              </strong>{" "}
              dari{" "}
              <strong className="text-slate-800">{filteredData.length}</strong>{" "}
              pengajuan
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-45 text-[11px] font-semibold text-slate-700 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sebelumnya</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setCurrentPage(num)}
                className={`w-8 h-8 rounded-lg text-[11px] font-extrabold transition-colors cursor-pointer ${
                  num === safePage
                    ? "bg-app-primary text-white shadow-2xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {num}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
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
