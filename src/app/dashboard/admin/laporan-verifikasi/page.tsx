"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronRight,
  FolderKanban,
  CheckCircle2,
  FileCheck2,
  Search,
  Filter,
  RotateCcw,
  Download,
  Printer,
  Calendar,
  Building2,
  User,
  ChevronLeft,
  Eye,
  X,
  Banknote,
} from "lucide-react";

interface VerifiedReportItem {
  id: string;
  nomorPengajuan: string;
  namaOrganisasi: string;
  namaPemohon: string;
  tahunPengajuan: string;
  tanggalPengajuan: string; // YYYY-MM-DD
  tanggalPengajuanLabel: string;
  tanggalVerifikasi: string; // YYYY-MM-DD
  tanggalVerifikasiLabel: string;
  jumlahDana: number;
  catatan: string;
}

const INITIAL_VERIFIED_REPORTS: VerifiedReportItem[] = [
  {
    id: "hb-2026-004",
    nomorPengajuan: "HIB-2026-004",
    namaOrganisasi: "Yayasan Nurul Iman Sumbawa",
    namaPemohon: "Ahmad Fauzi",
    tahunPengajuan: "2026",
    tanggalPengajuan: "2026-10-19",
    tanggalPengajuanLabel: "19 Okt 2026",
    tanggalVerifikasi: "2026-10-26",
    tanggalVerifikasiLabel: "26 Okt 2026",
    jumlahDana: 18500000,
    catatan:
      "Seluruh dokumen persyaratan administrasi, akta pendirian, SK pengurus, dan RAB dinyatakan lengkap serta sesuai ketentuan.",
  },
  {
    id: "hb-2026-006",
    nomorPengajuan: "HIB-2026-006",
    namaOrganisasi: "Pondok Pesantren Darussalam Alas",
    namaPemohon: "Ust. Syamsuddin",
    tahunPengajuan: "2026",
    tanggalPengajuan: "2026-11-05",
    tanggalPengajuanLabel: "05 Nov 2026",
    tanggalVerifikasi: "2026-11-09",
    tanggalVerifikasiLabel: "09 Nov 2026",
    jumlahDana: 75000000,
    catatan:
      "Proposal pembangunan asrama santri telah diverifikasi lapangan dan berkas administrasi valid.",
  },
  {
    id: "hb-2026-008",
    nomorPengajuan: "HIB-2026-008",
    namaOrganisasi: "Sanggar Seni Samawa Lestariku",
    namaPemohon: "Lalu Hendra Wijaya",
    tahunPengajuan: "2026",
    tanggalPengajuan: "2026-10-28",
    tanggalPengajuanLabel: "28 Okt 2026",
    tanggalVerifikasi: "2026-11-03",
    tanggalVerifikasiLabel: "03 Nov 2026",
    jumlahDana: 22000000,
    catatan:
      "Dokumen legalitas sanggar dan proposal kegiatan pelestarian budaya daerah telah memenuhi syarat.",
  },
  {
    id: "hb-2025-014",
    nomorPengajuan: "HIB-2025-014",
    namaOrganisasi: "Yayasan Nurul Iman Sumbawa",
    namaPemohon: "Ahmad Fauzi",
    tahunPengajuan: "2025",
    tanggalPengajuan: "2025-09-12",
    tanggalPengajuanLabel: "12 Sep 2025",
    tanggalVerifikasi: "2025-09-18",
    tanggalVerifikasiLabel: "18 Sep 2025",
    jumlahDana: 35000000,
    catatan:
      "Berkas terverifikasi lengkap dan telah diteruskan ke tahapan penetapan penerima hibah TA 2025.",
  },
  {
    id: "hb-2025-011",
    nomorPengajuan: "HIB-2025-011",
    namaOrganisasi: "Karang Taruna Bhakti Mude",
    namaPemohon: "Rian Hidayat",
    tahunPengajuan: "2025",
    tanggalPengajuan: "2025-08-02",
    tanggalPengajuanLabel: "02 Agu 2025",
    tanggalVerifikasi: "2025-08-09",
    tanggalVerifikasiLabel: "09 Agu 2025",
    jumlahDana: 28000000,
    catatan:
      "Program pembinaan pemuda dan fasilitas olahraga desa disetujui sesuai pagu anggaran.",
  },
];

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function LaporanHasilVerifikasiPage() {
  const [reports] = useState<VerifiedReportItem[]>(INITIAL_VERIFIED_REPORTS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // State A. Filter Laporan
  const [tahunInput, setTahunInput] = useState<string>("all");
  const [startDateInput, setStartDateInput] = useState<string>("");
  const [endDateInput, setEndDateInput] = useState<string>("");
  const [organisasiInput, setOrganisasiInput] = useState<string>("");
  const [nomorInput, setNomorInput] = useState<string>("");

  // State Filter Aktif
  const [appliedFilter, setAppliedFilter] = useState({
    tahun: "all",
    startDate: "",
    endDate: "",
    organisasi: "",
    nomor: "",
  });

  // Pagination
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const availableYears = useMemo(() => {
    return Array.from(new Set(reports.map((r) => r.tahunPengajuan))).sort(
      (a, b) => Number(b) - Number(a),
    );
  }, [reports]);

  // Hasil Penyaringan Tabel
  const filteredReports = useMemo(() => {
    return reports.filter((item) => {
      const matchTahun =
        appliedFilter.tahun === "all" ||
        item.tahunPengajuan === appliedFilter.tahun;

      const matchStart =
        !appliedFilter.startDate ||
        item.tanggalVerifikasi >= appliedFilter.startDate;

      const matchEnd =
        !appliedFilter.endDate ||
        item.tanggalVerifikasi <= appliedFilter.endDate;

      const matchOrganisasi =
        !appliedFilter.organisasi.trim() ||
        item.namaOrganisasi
          .toLowerCase()
          .includes(appliedFilter.organisasi.trim().toLowerCase());

      const matchNomor =
        !appliedFilter.nomor.trim() ||
        item.nomorPengajuan
          .toLowerCase()
          .includes(appliedFilter.nomor.trim().toLowerCase());

      return (
        matchTahun && matchStart && matchEnd && matchOrganisasi && matchNomor
      );
    });
  }, [reports, appliedFilter]);

  // B. Ringkasan Laporan
  const summary = useMemo(() => {
    const totalTerverifikasi = filteredReports.length;
    const totalDanaDisetujui = filteredReports.reduce(
      (acc, cur) => acc + cur.jumlahDana,
      0,
    );

    return {
      totalTerverifikasi,
      totalDanaDisetujui,
    };
  }, [filteredReports]);

  // Pagination Slice
  const totalPages = Math.max(1, Math.ceil(filteredReports.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paginatedReports = filteredReports.slice(
    startIndex,
    startIndex + pageSize,
  );

  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedFilter({
      tahun: tahunInput,
      startDate: startDateInput,
      endDate: endDateInput,
      organisasi: organisasiInput,
      nomor: nomorInput,
    });
    setCurrentPage(1);
  };

  const handleResetFilter = () => {
    setTahunInput("all");
    setStartDateInput("");
    setEndDateInput("");
    setOrganisasiInput("");
    setNomorInput("");
    setAppliedFilter({
      tahun: "all",
      startDate: "",
      endDate: "",
      organisasi: "",
      nomor: "",
    });
    setCurrentPage(1);
  };

  const handleExportCSV = () => {
    const headers = [
      "No",
      "Nomor Pengajuan",
      "Nama Organisasi",
      "Nama Pemohon",
      "Tanggal Pengajuan",
      "Tanggal Verifikasi",
      "Jumlah Dana",
      "Catatan",
    ];

    const rows = filteredReports.map((r, i) => [
      i + 1,
      `"${r.nomorPengajuan}"`,
      `"${r.namaOrganisasi.replace(/"/g, '""')}"`,
      `"${r.namaPemohon.replace(/"/g, '""')}"`,
      `"${r.tanggalPengajuanLabel}"`,
      `"${r.tanggalVerifikasiLabel}"`,
      r.jumlahDana,
      `"${r.catatan.replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      "\uFEFF" +
      [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Laporan_Pengajuan_Terverifikasi_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    link.click();
    URL.revokeObjectURL(url);
    showToast("Laporan berhasil diekspor ke CSV/Excel.");
  };

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-10">
      {/* =====================================================================
          HEADER HALAMAN
      ====================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 print:hidden"
          >
            <Link
              href="/dashboard/admin"
              className="hover:text-app-primary transition-colors"
            >
              Dashboard
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-app-primary font-bold">
              Laporan Hasil Verifikasi
            </span>
          </nav>

          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Laporan Hasil Verifikasi
          </h1>
          <p className="text-xs text-slate-500">
            Rekapitulasi data pengajuan hibah yang telah berhasil{" "}
            <strong className="text-emerald-700">Terverifikasi</strong> oleh
            Bagian Kesejahteraan Rakyat Kabupaten Sumbawa.
          </p>
        </div>

        {/* Tombol Cetak & Export Laporan */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto print:hidden">
          <button
            type="button"
            onClick={handlePrintReport}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-slate-600" />
            <span>Cetak Laporan</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-app-primary hover:bg-app-primary-800 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-app-secondary" />
            <span>Export Excel / CSV</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="flex items-center justify-between gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs font-semibold text-emerald-800 shadow-2xs print:hidden">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-600 hover:text-emerald-900 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* =====================================================================
          B. RINGKASAN LAPORAN (2 KARTU UTAMA KHUSUS TERVERIFIKASI)
      ====================================================================== */}
      <section
        aria-label="Ringkasan Laporan Terverifikasi"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        {/* 1. Total Terverifikasi */}
        <div className="rounded-2xl bg-white border border-slate-200/80 p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">
              Total Pengajuan Terverifikasi
            </span>
            <div className="w-8.5 h-8.5 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <FileCheck2 className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <p className="mt-2.5 text-2xl font-extrabold text-slate-900">
            {summary.totalTerverifikasi}{" "}
            <span className="text-xs font-normal text-slate-500">Proposal</span>
          </p>
          <p className="mt-0.5 text-[10px] font-semibold text-emerald-600">
            Lolos verifikasi administrasi & dokumen
          </p>
        </div>

        {/* 2. Total Nominal Disetujui */}
        <div className="rounded-2xl bg-white border border-slate-200/80 p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">
              Total Akumulasi Dana Disetujui
            </span>
            <div className="w-8.5 h-8.5 rounded-xl bg-app-primary-50 text-app-primary flex items-center justify-center">
              <Banknote className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <p className="mt-2.5 text-2xl font-extrabold text-app-primary">
            {formatRupiah(summary.totalDanaDisetujui)}
          </p>
          <p className="mt-0.5 text-[10px] font-semibold text-slate-500">
            Pagu usulan dari seluruh proposal terverifikasi
          </p>
        </div>
      </section>

      {/* =====================================================================
          A. FILTER LAPORAN (TAHUN, PERIODE TANGGAL, ORGANISASI, NOMOR)
      ====================================================================== */}
      <section
        aria-label="Filter Laporan Terverifikasi"
        className="rounded-2xl bg-white border border-slate-200/80 p-4 sm:p-5 shadow-2xs print:hidden"
      >
        <form onSubmit={handleApplyFilter} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3.5">
            {/* 1. Tahun Pengajuan */}
            <div className="lg:col-span-2 space-y-1.5">
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

            {/* 2. Periode Tanggal (Awal & Akhir) */}
            <div className="lg:col-span-4 grid grid-cols-2 gap-2">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-700">
                  Periode Awal
                </label>
                <input
                  type="date"
                  value={startDateInput}
                  onChange={(e) => setStartDateInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-2.5 py-2 text-[11px] text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold text-slate-700">
                  Periode Akhir
                </label>
                <input
                  type="date"
                  value={endDateInput}
                  onChange={(e) => setEndDateInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-2.5 py-2 text-[11px] text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15"
                />
              </div>
            </div>

            {/* 3. Nama Organisasi */}
            <div className="lg:col-span-3 space-y-1.5">
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

            {/* 4. Nomor Pengajuan */}
            <div className="lg:col-span-3 space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700">
                Nomor Pengajuan
              </label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-400" />
                <input
                  type="text"
                  value={nomorInput}
                  onChange={(e) => setNomorInput(e.target.value)}
                  placeholder="HIB-2026-..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-8 pr-2.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15"
                />
              </div>
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
          C. TABEL HASIL VERIFIKASI (8 KOLOM TANPA KOLOM HASIL VERIFIKASI)
      ====================================================================== */}
      <section
        aria-label="Tabel Hasil Verifikasi Terverifikasi"
        className="rounded-2xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden"
      >
        {/* DESKTOP TABLE */}
        <div className="hidden xl:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200/70 text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-3 w-11 text-center">No.</th>
                <th className="py-3.5 px-3 whitespace-nowrap">
                  Nomor Pengajuan
                </th>
                <th className="py-3.5 px-3">Nama Organisasi</th>
                <th className="py-3.5 px-3">Nama Pemohon</th>
                <th className="py-3.5 px-3 whitespace-nowrap">
                  Tanggal Pengajuan
                </th>
                <th className="py-3.5 px-3 whitespace-nowrap">
                  Tanggal Verifikasi
                </th>
                <th className="py-3.5 px-3 whitespace-nowrap">Jumlah Dana</th>
                <th className="py-3.5 px-3">Catatan Verifikasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedReports.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-12 text-center text-xs text-slate-500"
                  >
                    Tidak ada data pengajuan terverifikasi yang sesuai dengan
                    filter laporan.
                  </td>
                </tr>
              ) : (
                paginatedReports.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* 1. Nomor */}
                    <td className="py-3.5 px-3 text-center font-semibold text-slate-500 align-top">
                      {startIndex + idx + 1}
                    </td>

                    {/* 2. Nomor Pengajuan */}
                    <td className="py-3.5 px-3 align-top whitespace-nowrap">
                      <Link
                        href={`/dashboard/admin/data-pengajuan/${item.id}`}
                        className="font-extrabold text-app-primary hover:underline text-[11.5px]"
                      >
                        {item.nomorPengajuan}
                      </Link>
                    </td>

                    {/* 3. Nama Organisasi */}
                    <td className="py-3.5 px-3 align-top max-w-[175px]">
                      <div className="flex items-start gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-app-secondary-600 shrink-0 mt-0.5" />
                        <span className="font-bold text-slate-800 leading-snug line-clamp-2">
                          {item.namaOrganisasi}
                        </span>
                      </div>
                    </td>

                    {/* 4. Nama Pemohon */}
                    <td className="py-3.5 px-3 align-top whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                        <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{item.namaPemohon}</span>
                      </div>
                    </td>

                    {/* 5. Tanggal Pengajuan */}
                    <td className="py-3.5 px-3 align-top whitespace-nowrap text-slate-600">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.tanggalPengajuanLabel}</span>
                      </div>
                    </td>

                    {/* 6. Tanggal Verifikasi */}
                    <td className="py-3.5 px-3 align-top whitespace-nowrap text-slate-700 font-semibold">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{item.tanggalVerifikasiLabel}</span>
                      </div>
                    </td>

                    {/* 7. Jumlah Dana */}
                    <td className="py-3.5 px-3 align-top whitespace-nowrap font-extrabold text-slate-900">
                      {formatRupiah(item.jumlahDana)}
                    </td>

                    {/* 8. Catatan */}
                    <td className="py-3.5 px-3 align-top max-w-[280px]">
                      <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                        {item.catatan}
                      </p>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE & TABLET CARDS (< xl) */}
        <div className="xl:hidden divide-y divide-slate-100">
          {paginatedReports.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              Tidak ada data laporan terverifikasi.
            </div>
          ) : (
            paginatedReports.map((item, idx) => (
              <div key={item.id} className="p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400">
                      #{startIndex + idx + 1}
                    </span>
                    <span className="text-xs font-extrabold text-app-primary">
                      {item.nomorPengajuan}
                    </span>
                  </div>

                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                    <span>Terverifikasi</span>
                  </span>
                </div>

                <div>
                  <p className="text-xs font-bold text-slate-900">
                    {item.namaOrganisasi}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Pemohon: {item.namaPemohon} • Usulan:{" "}
                    <strong className="text-slate-800">
                      {formatRupiah(item.jumlahDana)}
                    </strong>
                  </p>
                  <p className="text-[10.5px] text-slate-500 mt-1">
                    Diajukan: {item.tanggalPengajuanLabel} • Diverifikasi:{" "}
                    <strong className="text-slate-700">
                      {item.tanggalVerifikasiLabel}
                    </strong>
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 border border-slate-100 p-2.5 text-[11px] text-slate-600 leading-relaxed">
                  <strong className="text-slate-700">Catatan:</strong>{" "}
                  {item.catatan}
                </div>

                <div className="flex justify-end pt-1">
                  <Link
                    href={`/dashboard/admin/data-pengajuan/${item.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-app-primary-50 text-app-primary text-[11px] font-bold"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Lihat Berkas</span>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* PAGINATION */}
        <div className="px-4 py-3.5 bg-slate-50/70 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs print:hidden">
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
                {filteredReports.length === 0 ? 0 : startIndex + 1}
              </strong>
              –
              <strong className="text-slate-800">
                {Math.min(startIndex + pageSize, filteredReports.length)}
              </strong>{" "}
              dari{" "}
              <strong className="text-slate-800">
                {filteredReports.length}
              </strong>{" "}
              laporan
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
