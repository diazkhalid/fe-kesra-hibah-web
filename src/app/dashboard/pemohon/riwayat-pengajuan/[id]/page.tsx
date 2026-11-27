"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ChevronRight,
  User,
  Building2,
  FileText,
  FileCheck2,
  Eye,
  Download,
  Calendar,
  CheckCircle2,
  Hourglass,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  Award,
  PhoneCall,
  MapPin,
  Banknote,
  Layers,
  X,
  Info,
  Loader2,
  AlertCircle,
  ArrowLeft,
} from "lucide-react";
import APP_CONFIG from "@/shared/global/app_config"; // Sesuaikan path import APP_CONFIG Anda
import {
  GrantApplicationDocument,
  GrantApplicationStatus,
  GrantDocumentReviewStatus,
} from "@/features/pemohon-pengajuan/types/pengajuan.type";
import { usePemohonPengajuan } from "@/features/pemohon-pengajuan/hooks/usePengajuan.hook";

const STATUS_META: Record<
  GrantApplicationStatus,
  {
    label: string;
    badgeClass: string;
    dotClass: string;
    icon: React.ElementType;
    summaryText: string;
  }
> = {
  menunggu_verifikasi: {
    label: "Menunggu Verifikasi",
    badgeClass: "bg-sky-50 text-sky-700 border-sky-200",
    dotClass: "bg-sky-500",
    icon: Hourglass,
    summaryText:
      "Berkas pengajuan telah diterima sistem dan sedang menunggu proses verifikasi oleh Tim Admin Bagian Kesra.",
  },
  terverifikasi: {
    label: "Terverifikasi",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-500",
    icon: CheckCircle2,
    summaryText:
      "Seluruh data dan kelengkapan dokumen administrasi dinyatakan lengkap serta lolos verifikasi.",
  },
  ditolak: {
    label: "Ditolak",
    badgeClass: "bg-red-50 text-red-700 border-red-200",
    dotClass: "bg-red-500",
    icon: XCircle,
    summaryText:
      "Permohonan bantuan hibah tidak dapat disetujui/diproses lebih lanjut berdasarkan hasil evaluasi administrasi.",
  },
};

const DOC_REVIEW_META: Record<
  GrantDocumentReviewStatus,
  {
    label: string;
    badgeClass: string;
  }
> = {
  belum_diperiksa: {
    label: "Belum Diperiksa",
    badgeClass: "bg-slate-100 text-slate-600 border-slate-200",
  },
  sesuai: {
    label: "Sesuai",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  },
  tidak_sesuai: {
    label: "Tidak Sesuai",
    badgeClass: "bg-red-50 text-red-700 border-red-200/80",
  },
};

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return "0 KB";
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function formatDateTime(isoString?: string | null): {
  date: string;
  time: string;
} {
  if (!isoString) return { date: "-", time: "-" };
  const parsed = new Date(isoString);
  if (Number.isNaN(parsed.getTime())) return { date: isoString, time: "" };

  return {
    date: parsed.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
    time:
      parsed.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }) + " WITA",
  };
}

function resolveFileUrl(rawUrl?: string | null): string {
  if (!rawUrl) return "";
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
    return rawUrl;
  }
  return `${APP_CONFIG.STORAGE_URL}${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`;
}

export default function DetailPengajuanPage() {
  const params = useParams();
  const idParam = typeof params?.id === "string" ? params.id : "";

  const {
    detailHistory,
    isLoadingDetail,
    fetchDetailHistory,
    error: detailError,
  } = usePemohonPengajuan();

  const [previewDoc, setPreviewDoc] = useState<GrantApplicationDocument | null>(
    null,
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (idParam) {
      fetchDetailHistory(idParam);
    }
  }, [idParam, fetchDetailHistory]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  if (isLoadingDetail) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-center">
        <Loader2 className="w-7 h-7 animate-spin text-app-primary" />
        <p className="text-xs font-semibold text-slate-600">
          Memuat detail pengajuan hibah...
        </p>
      </div>
    );
  }

  if (detailError || !detailHistory) {
    return (
      <div className="py-12 max-w-lg mx-auto">
        <div className="rounded-3xl bg-white border border-red-200 p-6 text-center space-y-4 shadow-2xs">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-extrabold text-slate-900">
              Gagal Memuat Detail Pengajuan
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              {detailError || "Data pengajuan tidak ditemukan."}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2.5 pt-1">
            <Link
              href="/dashboard/pemohon/riwayat-pengajuan"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </Link>
            {idParam && (
              <button
                type="button"
                onClick={() => fetchDetailHistory(idParam)}
                className="px-4 py-2 rounded-xl bg-app-primary hover:bg-app-primary-800 text-white text-xs font-bold cursor-pointer"
              >
                Coba Lagi
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const submission = detailHistory;
  const statusInfo =
    STATUS_META[submission.status] ?? STATUS_META.menunggu_verifikasi;
  const StatusIcon = statusInfo.icon;
  const submittedDateTime = formatDateTime(submission.submitted_at);

  const attachedDocuments = submission.documents.filter((d) =>
    Boolean(d.download_url),
  );
  const completionPercent =
    submission.documents.length > 0
      ? Math.round(
          (attachedDocuments.length / submission.documents.length) * 100,
        )
      : 0;

  const handleDownloadReceipt = () => {
    const receiptText = `BUKTI REGISTRASI PENGAJUAN HIBAH\nPemerintah Kabupaten Sumbawa - Bagian Kesejahteraan Rakyat\n====================================================\nNomor Pengajuan : ${submission.submission_number}\nTanggal         : ${submittedDateTime.date} (${submittedDateTime.time})\nPemohon         : ${submission.applicant.full_name} (NIK: ${submission.applicant.nik})\nOrganisasi      : ${submission.organization.name}\nKegiatan        : ${submission.activity.activity_name}\nJumlah Dana     : ${formatRupiah(submission.requested_amount)}\nStatus Terkini  : ${statusInfo.label}\n`;
    const blob = new Blob([receiptText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Bukti_Pengajuan_${submission.submission_number}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(
      `Bukti pengajuan ${submission.submission_number} berhasil diunduh.`,
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* =====================================================================
          1. BREADCRUMB & HEADER HALAMAN
      ====================================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-slate-500"
          >
            <Link
              href="/dashboard/pemohon"
              className="hover:text-app-primary transition-colors"
            >
              Dashboard
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <Link
              href="/dashboard/pemohon/riwayat-pengajuan"
              className="hover:text-app-primary transition-colors"
            >
              Daftar Pengajuan
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-app-primary font-bold">
              {submission.submission_number}
            </span>
          </nav>

          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Detail Pengajuan Hibah
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold ${statusInfo.badgeClass}`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`}
              />
              {statusInfo.label}
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Nomor Registrasi:{" "}
            <strong className="text-app-primary">
              {submission.submission_number}
            </strong>{" "}
            • Dikirim pada {submittedDateTime.date} pukul{" "}
            {submittedDateTime.time}
          </p>
        </div>

        {/* Tombol Download Bukti Pengajuan */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          <button
            type="button"
            onClick={handleDownloadReceipt}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-app-primary hover:bg-app-primary-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-app-secondary" />
            <span>Download Bukti Pengajuan</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="flex items-center justify-between gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs font-semibold text-emerald-800">
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
          2. KARTU RINGKASAN & STATUS VERIFIKASI (BANNER ATAS)
      ====================================================================== */}
      <section className="rounded-3xl bg-gradient-to-br from-app-primary-950 via-app-primary-900 to-app-primary p-5 sm:p-6 text-white shadow-md relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-14 -top-14 w-56 h-56 rounded-full bg-app-secondary/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff14_1px,transparent_1px)] [background-size:20px_20px] opacity-50"
        />

        <div className="relative grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
          <div className="lg:col-span-8 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] font-bold text-app-secondary-200">
              <span>TA {submission.fiscal_year}</span>
              <span>•</span>
              <span>{submission.field}</span>
            </div>

            <h2 className="text-base sm:text-xl font-extrabold text-white leading-snug">
              {submission.activity.activity_name}
            </h2>

            <p className="text-xs text-app-primary-100 leading-relaxed">
              {statusInfo.summaryText}
            </p>
          </div>

          <div className="lg:col-span-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4 space-y-1">
            <p className="text-[10.5px] font-semibold text-app-primary-200">
              Total Dana yang Dimohon
            </p>
            <p className="text-xl sm:text-2xl font-extrabold text-app-secondary-300 tracking-tight">
              {formatRupiah(submission.requested_amount)}
            </p>
            <p className="text-[10.5px] text-app-primary-100 truncate pt-0.5">
              Oleh: {submission.organization.name}
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================================
          3. KONTEN UTAMA (GRID 12 KOLOM: DATA RINCI & TRACKING STATUS)
      ====================================================================== */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* KOLOM KIRI (8 KOLOM): 4 BLOK DATA SESUAI FORM PENGAJUAN */}
        <div className="xl:col-span-8 space-y-5">
          {/* BLOK 1: IDENTITAS PEMOHON */}
          <section className="rounded-2xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-100 flex items-center gap-2.5">
              <div className="w-7.5 h-7.5 rounded-lg bg-app-primary-50 text-app-primary flex items-center justify-center">
                <User className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                  1. Identitas Pemohon
                </h3>
                <p className="text-[10.5px] text-slate-500">
                  Data penanggung jawab permohonan bantuan hibah
                </p>
              </div>
            </div>

            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-[10.5px] text-slate-400">Nama Lengkap</p>
                <p className="font-bold text-slate-800 mt-0.5">
                  {submission.applicant.full_name}
                </p>
              </div>

              <div>
                <p className="text-[10.5px] text-slate-400">NIK</p>
                <p className="font-bold text-slate-800 mt-0.5">
                  {submission.applicant.nik}
                </p>
              </div>

              <div>
                <p className="text-[10.5px] text-slate-400">
                  Tempat, Tanggal Lahir
                </p>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {submission.applicant.birth_place},{" "}
                  {formatDateTime(submission.applicant.birth_date).date}
                </p>
              </div>

              <div>
                <p className="text-[10.5px] text-slate-400">Jenis Kelamin</p>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {submission.applicant.gender === "L"
                    ? "Laki-laki"
                    : submission.applicant.gender === "P"
                      ? "Perempuan"
                      : submission.applicant.gender || "-"}
                </p>
              </div>

              <div>
                <p className="text-[10.5px] text-slate-400">
                  Nomor HP / WhatsApp
                </p>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {submission.applicant.phone}
                </p>
              </div>

              <div>
                <p className="text-[10.5px] text-slate-400">Alamat Email</p>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {submission.applicant.email}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-[10.5px] text-slate-400">
                  Alamat Lengkap Pemohon
                </p>
                <p className="font-semibold text-slate-800 mt-0.5 leading-relaxed">
                  {submission.applicant.address}
                </p>
              </div>
            </div>
          </section>

          {/* BLOK 2: IDENTITAS ORGANISASI / LEMBAGA */}
          <section className="rounded-2xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-100 flex items-center gap-2.5">
              <div className="w-7.5 h-7.5 rounded-lg bg-app-secondary-50 text-app-secondary-700 flex items-center justify-center">
                <Building2 className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                  2. Identitas Organisasi / Lembaga
                </h3>
                <p className="text-[10.5px] text-slate-500">
                  Legalitas dan susunan pengurus lembaga penerima hibah
                </p>
              </div>
            </div>

            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-[10.5px] text-slate-400">
                  Nama Organisasi / Lembaga
                </p>
                <p className="font-bold text-slate-800 mt-0.5">
                  {submission.organization.name}
                </p>
              </div>

              <div>
                <p className="text-[10.5px] text-slate-400">Jenis Organisasi</p>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {submission.organization.organization_type}
                </p>
              </div>

              <div>
                <p className="text-[10.5px] text-slate-400">
                  Nomor Akta Pendirian
                </p>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {submission.organization.deed_number}
                </p>
              </div>

              <div>
                <p className="text-[10.5px] text-slate-400">
                  Tanggal Pendirian
                </p>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {formatDateTime(submission.organization.established_on).date}
                </p>
              </div>

              <div>
                <p className="text-[10.5px] text-slate-400">
                  Nomor SK Organisasi
                </p>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {submission.organization.registration_number || "-"}
                </p>
              </div>

              <div>
                <p className="text-[10.5px] text-slate-400">
                  Ketua / Pimpinan & No. HP
                </p>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {submission.organization.chair_name} (
                  {submission.organization.chair_phone})
                </p>
              </div>

              <div>
                <p className="text-[10.5px] text-slate-400">Nama Sekretaris</p>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {submission.organization.secretary_name}
                </p>
              </div>

              <div>
                <p className="text-[10.5px] text-slate-400">Nama Bendahara</p>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {submission.organization.treasurer_name}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-[10.5px] text-slate-400">
                  Alamat Organisasi / Sekretariat
                </p>
                <p className="font-semibold text-slate-800 mt-0.5 leading-relaxed">
                  {submission.organization.address}
                </p>
              </div>
            </div>
          </section>

          {/* BLOK 3: INFORMASI PENGAJUAN */}
          <section className="rounded-2xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-100 flex items-center gap-2.5">
              <div className="w-7.5 h-7.5 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
                <FileText className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-extrabold text-slate-900">
                  3. Informasi Pengajuan Kegiatan
                </h3>
                <p className="text-[10.5px] text-slate-500">
                  Rincian usulan kegiatan, anggaran, lokasi, dan manfaat
                </p>
              </div>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-2.5 rounded-xl bg-slate-50/80 border border-slate-100 p-3">
                  <Layers className="w-4 h-4 text-app-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-slate-400">
                      Tahun & Bidang Pengajuan
                    </p>
                    <p className="font-bold text-slate-800 mt-0.5">
                      TA {submission.fiscal_year} • {submission.field}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 rounded-xl bg-app-primary-50/60 border border-app-primary-100 p-3">
                  <Banknote className="w-4 h-4 text-app-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-slate-500">
                      Jumlah Dana yang Dimohon
                    </p>
                    <p className="font-extrabold text-app-primary text-sm mt-0.5">
                      {formatRupiah(submission.activity.requested_amount)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 rounded-xl bg-slate-50/80 border border-slate-100 p-3">
                  <MapPin className="w-4 h-4 text-app-secondary-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-slate-400">
                      Lokasi Kegiatan
                    </p>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      {submission.activity.activity_location}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 rounded-xl bg-slate-50/80 border border-slate-100 p-3">
                  <Calendar className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] text-slate-400">
                      Waktu Pelaksanaan
                    </p>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      {submission.activity.activity_period}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                <div>
                  <p className="text-[10.5px] font-bold text-slate-500">
                    Nama / Perihal Kegiatan
                  </p>
                  <p className="font-extrabold text-slate-900 mt-0.5">
                    {submission.activity.activity_name}
                  </p>
                </div>

                <div>
                  <p className="text-[10.5px] font-bold text-slate-500">
                    Latar Belakang
                  </p>
                  <p className="text-slate-700 leading-relaxed mt-0.5">
                    {submission.activity.background}
                  </p>
                </div>

                <div>
                  <p className="text-[10.5px] font-bold text-slate-500">
                    Maksud dan Tujuan
                  </p>
                  <p className="text-slate-700 leading-relaxed mt-0.5">
                    {submission.activity.objectives}
                  </p>
                </div>

                <div>
                  <p className="text-[10.5px] font-bold text-slate-500">
                    Manfaat Kegiatan
                  </p>
                  <p className="text-slate-700 leading-relaxed mt-0.5">
                    {submission.activity.expected_benefits}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* =================================================================
              BLOK 4: DOKUMEN PERSYARATAN — DESAIN MODERN BENTO FILE GRID
          ================================================================== */}
          <section
            id="dokumen"
            className="rounded-3xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden scroll-mt-20"
          >
            {/* Header Modern dengan Progress Bar Kelengkapan */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-50 via-white to-app-primary-50/40 border-b border-slate-100 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-app-primary to-app-primary-800 text-white flex items-center justify-center shrink-0 shadow-sm shadow-app-primary/20">
                    <FileCheck2 className="w-5 h-5 text-app-secondary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-extrabold text-slate-900 tracking-tight">
                        4. Dokumen Persyaratan
                      </h3>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-extrabold">
                        {attachedDocuments.length}/{submission.documents.length}{" "}
                        Berkas
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Arsip digital dokumen pendukung permohonan bantuan hibah
                    </p>
                  </div>
                </div>

                {/* Tombol Preview Semua Berkas Sekaligus */}
                {attachedDocuments.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setPreviewDoc(attachedDocuments[0])}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-app-primary-50 hover:bg-app-primary text-app-primary hover:text-white border border-app-primary-200/80 text-[11px] font-bold transition-all self-start sm:self-auto cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Buka Penampil Berkas</span>
                  </button>
                )}
              </div>

              {/* Progress Bar Kelengkapan Berkas */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10.5px]">
                  <span className="font-semibold text-slate-500">
                    Kelengkapan Berkas Terunggah
                  </span>
                  <span className="font-extrabold text-app-primary">
                    {completionPercent}%
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-app-primary to-emerald-500 transition-all duration-300"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Bento Grid 2 Kolom Kartu Dokumen */}
            <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {submission.documents.map((doc, idx) => {
                const isAttached = Boolean(doc.download_url);
                const fileUrl = resolveFileUrl(doc.download_url);
                const reviewMeta =
                  DOC_REVIEW_META[doc.review_status] ??
                  DOC_REVIEW_META.belum_diperiksa;
                const fileExtLabel = doc.mime_type?.startsWith("image/")
                  ? "IMG"
                  : "PDF";

                return (
                  <div
                    key={doc.id}
                    className={`group relative rounded-2xl border p-4 flex flex-col justify-between transition-all duration-200 ${
                      isAttached
                        ? "bg-white border-slate-200/90 hover:border-app-primary/50 hover:shadow-md hover:shadow-slate-900/5"
                        : "bg-slate-50/70 border-dashed border-slate-200 opacity-80"
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`relative w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 font-extrabold text-[9px] tracking-wider ${
                              isAttached
                                ? "bg-rose-50 text-rose-600 border border-rose-200/80"
                                : "bg-slate-100 text-slate-400 border border-slate-200/70"
                            }`}
                          >
                            <FileText className="w-4 h-4 mb-0.5" />
                            <span>{fileExtLabel}</span>
                          </div>

                          <div>
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                              Dokumen {String(idx + 1).padStart(2, "0")}
                            </span>
                            <h4 className="text-xs font-extrabold text-slate-900 leading-snug line-clamp-2">
                              {doc.display_name}
                            </h4>
                          </div>
                        </div>

                        {/* Status Verifikasi Dokumen */}
                        {isAttached ? (
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9.5px] font-bold shrink-0 ${reviewMeta.badgeClass}`}
                          >
                            <span>{reviewMeta.label}</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9.5px] font-semibold shrink-0">
                            {doc.is_required ? "Kosong" : "Opsional"}
                          </span>
                        )}
                      </div>

                      {/* Box Metadata Nama File & Ukuran */}
                      <div
                        className={`rounded-xl px-3 py-2 text-[10.5px] ${
                          isAttached
                            ? "bg-slate-50 border border-slate-100 text-slate-600"
                            : "bg-white/60 border border-slate-100 text-slate-400"
                        }`}
                      >
                        {isAttached ? (
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate font-semibold text-slate-700">
                              {doc.original_filename}
                            </span>
                            <span className="px-1.5 py-0.5 rounded-md bg-white border border-slate-200/80 text-[9.5px] font-bold text-slate-500 shrink-0">
                              {formatBytes(doc.file_size_bytes)}
                            </span>
                          </div>
                        ) : (
                          <span>Tidak ada berkas terunggah</span>
                        )}
                      </div>

                      {/* Catatan Review Verifikator jika ada */}
                      {doc.review_note && (
                        <div className="rounded-xl bg-amber-50/80 border border-amber-200/80 px-3 py-2 text-[10.5px] text-amber-900">
                          <span className="font-bold">Catatan: </span>
                          <span>{doc.review_note}</span>
                        </div>
                      )}
                    </div>

                    {/* Bagian Bawah Kartu: Tombol Aksi */}
                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-medium text-slate-400">
                        {doc.uploaded_at
                          ? `Diunggah: ${formatDateTime(doc.uploaded_at).date}`
                          : doc.is_required
                            ? "Dokumen Wajib"
                            : "Dokumen Opsional"}
                      </span>

                      {isAttached ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setPreviewDoc(doc)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-app-primary hover:bg-app-primary-800 text-white text-[10.5px] font-bold shadow-2xs transition-colors cursor-pointer"
                          >
                            <Eye className="w-3 h-3 text-app-secondary" />
                            <span>Preview</span>
                          </button>

                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={doc.original_filename}
                            aria-label={`Unduh ${doc.display_name}`}
                            title="Unduh Dokumen"
                            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 hover:text-app-primary transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ) : (
                        <span className="text-[10.5px] font-semibold text-slate-400">
                          —
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* KOLOM KANAN (4 KOLOM): RIWAYAT STATUS (#tracking) & BANTUAN */}
        <aside className="xl:col-span-4 space-y-5">
          {/* Panel Tracking Status */}
          <div
            id="tracking"
            className="rounded-2xl bg-white border border-slate-200/80 p-5 shadow-2xs space-y-4 scroll-mt-20"
          >
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-8 h-8 rounded-xl bg-app-primary-50 text-app-primary flex items-center justify-center shrink-0">
                <StatusIcon className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Jejak Status Pengajuan
                </h3>
                <p className="text-[11px] text-slate-500">
                  Linimasa proses administrasi berkas
                </p>
              </div>
            </div>

            <ol className="relative border-l-2 border-slate-200 ml-3 space-y-5 py-1">
              {/* Tahap 1: Pengiriman Berkas */}
              <li className="pl-5 relative">
                <span className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-app-primary ring-4 ring-white flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </span>
                <p className="text-xs font-extrabold text-slate-900">
                  Pengajuan Dikirim
                </p>
                <p className="text-[10.5px] text-slate-400 mt-0.5">
                  {submittedDateTime.date} • {submittedDateTime.time}
                </p>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  Pemohon mengirimkan formulir pengajuan dan dokumen
                  persyaratan.
                </p>
              </li>

              {/* Tahap 2: Menunggu Verifikasi */}
              <li className="pl-5 relative">
                <span className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-sky-500 ring-4 ring-white flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </span>
                <p className="text-xs font-extrabold text-slate-900">
                  Menunggu Verifikasi Admin
                </p>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  Berkas masuk ke antrean pemeriksaan Bagian Kesejahteraan
                  Rakyat.
                </p>
              </li>

              {/* Tahap 3: Keputusan Akhir */}
              <li className="pl-5 relative">
                <span
                  className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full ring-4 ring-white flex items-center justify-center ${
                    submission.status === "terverifikasi"
                      ? "bg-emerald-500"
                      : submission.status === "ditolak"
                        ? "bg-red-500"
                        : "bg-slate-200"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </span>
                <p
                  className={`text-xs font-extrabold ${
                    submission.status === "terverifikasi"
                      ? "text-emerald-700"
                      : submission.status === "ditolak"
                        ? "text-red-700"
                        : "text-slate-400"
                  }`}
                >
                  {submission.status === "terverifikasi"
                    ? "Terverifikasi"
                    : submission.status === "ditolak"
                      ? "Ditolak"
                      : "Hasil Verifikasi"}
                </p>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  {submission.status === "terverifikasi"
                    ? "Berkas dinyatakan lengkap dan memenuhi persyaratan."
                    : submission.status === "ditolak"
                      ? "Permohonan ditolak berdasarkan hasil verifikasi."
                      : "Menunggu keputusan hasil verifikasi dari Admin Kesra."}
                </p>
              </li>
            </ol>
          </div>

          {/* Panel Pernyataan & Bantuan */}
          <div className="rounded-2xl bg-app-primary-50/70 border border-app-primary-200/80 p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold text-app-primary-950">
              <ShieldCheck className="w-4 h-4 text-app-primary" />
              <span>Keabsahan & Informasi Layanan</span>
            </div>
            <p className="text-[11px] text-slate-700 leading-relaxed">
              Seluruh data dan dokumen pada halaman ini merupakan arsip resmi
              pengajuan hibah melalui layanan digital{" "}
              <strong>Bagian Kesejahteraan Rakyat Setda Kab. Sumbawa</strong>.
            </p>
            <div className="pt-1 flex items-center gap-3 text-[11px] font-bold">
              <Link
                href="/#kontak"
                className="inline-flex items-center gap-1.5 text-app-primary hover:underline underline-offset-4"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Hubungi Admin Kesra</span>
              </Link>
              <span className="text-slate-300">•</span>
              <Link
                href="/#persyaratan"
                className="inline-flex items-center gap-1 text-slate-600 hover:text-app-primary"
              >
                <Info className="w-3.5 h-3.5" />
                <span>Ketentuan Hibah</span>
              </Link>
            </div>
          </div>
        </aside>
      </div>

      {/* =====================================================================
          MODAL LIVE PREVIEW DOKUMEN (DENGAN SIDEBAR NAVIGASI BERKAS)
      ====================================================================== */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-3 sm:p-5">
          <div className="w-full max-w-5xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header Modal */}
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-app-secondary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-extrabold text-white truncate">
                    {previewDoc.display_name}
                  </p>
                  <p className="text-[10.5px] text-slate-300 truncate">
                    {previewDoc.original_filename} •{" "}
                    {formatBytes(previewDoc.file_size_bytes)}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={resolveFileUrl(previewDoc.download_url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={previewDoc.original_filename}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-app-secondary hover:bg-app-secondary-400 text-app-primary-950 text-[11px] font-bold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Unduh File</span>
                </a>

                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  aria-label="Tutup Preview"
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Body Modal: Daftar Berkas Kiri + File Viewer Kanan */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-slate-100">
              {/* Daftar Berkas Terlampir (Desktop) */}
              <div className="hidden lg:flex lg:col-span-4 flex-col bg-white border-r border-slate-200 overflow-y-auto p-3 space-y-1.5">
                <p className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Daftar Berkas ({attachedDocuments.length})
                </p>

                {attachedDocuments.map((itemDoc, idx) => {
                  const isSelected = previewDoc.id === itemDoc.id;

                  return (
                    <button
                      key={itemDoc.id}
                      type="button"
                      onClick={() => setPreviewDoc(itemDoc)}
                      className={`w-full text-left rounded-xl p-2.5 transition-all cursor-pointer ${
                        isSelected
                          ? "bg-app-primary-50 border border-app-primary-200 text-app-primary"
                          : "hover:bg-slate-50 border border-transparent text-slate-700"
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <span
                          className={`w-5 h-5 rounded-md text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected
                              ? "bg-app-primary text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-[11.5px] font-bold truncate">
                            {itemDoc.display_name}
                          </p>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5">
                            {itemDoc.original_filename}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* PDF / Image Viewer */}
              <div className="lg:col-span-8 p-3 sm:p-4 overflow-auto flex items-center justify-center">
                {previewDoc.mime_type?.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={resolveFileUrl(previewDoc.download_url)}
                    alt={previewDoc.display_name}
                    className="max-h-[68vh] w-auto rounded-2xl shadow-md object-contain"
                  />
                ) : (
                  <iframe
                    src={resolveFileUrl(previewDoc.download_url)}
                    title={previewDoc.display_name}
                    className="w-full h-[68vh] rounded-2xl border border-slate-200 bg-white shadow-sm"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
