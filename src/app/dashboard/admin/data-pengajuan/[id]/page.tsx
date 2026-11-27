"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  User,
  Building2,
  FileText,
  FileCheck2,
  Download,
  Calendar,
  CheckCircle2,
  Hourglass,
  XCircle,
  ShieldCheck,
  MapPin,
  Layers,
  Send,
  Phone,
  Mail,
  Users2,
  Maximize2,
  Sparkles,
  Hash,
  FileSpreadsheet,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  GrantApplicationDocument,
  GrantApplicationStatus,
} from "@/features/pemohon-pengajuan/types/pengajuan.type";
import APP_CONFIG from "@/shared/global/app_config"; // Sesuaikan path import APP_CONFIG Anda
import { useAdminPengajuan } from "@/features/admin-pengajuan/hooks/usePengajuan.hook";

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
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
    dotClass: "bg-amber-500",
    icon: Hourglass,
  },
  terverifikasi: {
    label: "Terverifikasi",
    badgeClass: "bg-emerald-50 text-emerald-800 border-emerald-200",
    dotClass: "bg-emerald-500",
    icon: CheckCircle2,
  },
  ditolak: {
    label: "Ditolak",
    badgeClass: "bg-rose-50 text-rose-800 border-rose-200",
    dotClass: "bg-rose-500",
    icon: XCircle,
  },
};

const VERIFICATION_TEMPLATES: Record<"terverifikasi" | "ditolak", string[]> = {
  terverifikasi: [
    "Seluruh berkas administrasi, akta pendirian, dan rincian RAB dinyatakan lengkap serta memenuhi ketentuan pengelolaan hibah daerah.",
    "Proposal dan dokumen legalitas organisasi dinyatakan sah dan layak dilanjutkan ke tahap evaluasi teknis.",
  ],
  ditolak: [
    "Organisasi pemohon belum memenuhi masa terdaftar minimal 3 tahun berturut-turut sesuai peraturan hibah daerah.",
    "Dokumen legalitas (Akta Pendirian / SK Kepengurusan) tidak sesuai atau masa berlakunya telah habis.",
    "Rincian Rencana Anggaran Biaya (RAB) dalam proposal tidak sesuai dengan ketentuan belanja hibah.",
  ],
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

export default function AdminDetailPengajuanPage() {
  const params = useParams();
  const router = useRouter();
  const idParam = typeof params?.id === "string" ? params.id : "";

  const {
    detailPengajuan,
    isLoadingDetail,
    isVerifying,
    fetchDetailPengajuan,
    verifikasiPengajuan,
    error: apiError,
    clearError,
  } = useAdminPengajuan();

  const [activeDocId, setActiveDocId] = useState<string>("");

  // State Form Verifikasi Inline
  const [verifyDecision, setVerifyDecision] = useState<
    "terverifikasi" | "ditolak"
  >("terverifikasi");
  const [verifyNote, setVerifyNote] = useState<string>("");

  // Fetch detail pengajuan saat halaman dimuat
  useEffect(() => {
    if (idParam) {
      fetchDetailPengajuan(idParam);
    }
  }, [idParam, fetchDetailPengajuan]);

  // Sinkronkan dokumen aktif & status awal form verifikasi saat detailPengajuan dimuat
  useEffect(() => {
    if (!detailPengajuan) return;

    const firstAttached = detailPengajuan.documents.find((d) =>
      Boolean(d.download_url),
    );
    if (firstAttached) {
      setActiveDocId(firstAttached.id);
    } else if (detailPengajuan.documents.length > 0) {
      setActiveDocId(detailPengajuan.documents[0].id);
    }

    if (detailPengajuan.status === "ditolak") {
      setVerifyDecision("ditolak");
    } else {
      setVerifyDecision("terverifikasi");
    }
  }, [detailPengajuan]);

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

  if (!detailPengajuan) {
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
              {apiError || "Data pengajuan tidak ditemukan."}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => router.push("/dashboard/admin/data-pengajuan")}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </button>
            {idParam && (
              <button
                type="button"
                onClick={() => fetchDetailPengajuan(idParam)}
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

  const detail = detailPengajuan;
  const statusInfo =
    STATUS_META[detail.status] ?? STATUS_META.menunggu_verifikasi;
  const submittedDateTime = formatDateTime(detail.submitted_at);

  const requiredDocs = detail.documents.filter((d) => d.is_required);
  const uploadedRequiredCount = requiredDocs.filter((d) =>
    Boolean(d.download_url),
  ).length;
  const isAllRequiredComplete = uploadedRequiredCount === requiredDocs.length;

  const activeDoc: GrantApplicationDocument | undefined =
    detail.documents.find((d) => d.id === activeDocId) ??
    detail.documents.find((d) => Boolean(d.download_url));

  const activeDocUrl = resolveFileUrl(activeDoc?.download_url);

  const handleSelectDecision = (decision: "terverifikasi" | "ditolak") => {
    clearError();
    setVerifyDecision(decision);
    if (!verifyNote.trim()) {
      setVerifyNote(VERIFICATION_TEMPLATES[decision][0]);
    }
  };

  const handleSaveVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyNote.trim() || !detail.id) return;

    clearError();
    await verifikasiPengajuan(detail.id, {
      decision: verifyDecision,
      note: verifyNote.trim(),
    });
  };

  return (
    <div className="space-y-6 pb-16">
      {/* =====================================================================
          1. TOP BREADCRUMB & KEMBALI
      ====================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-slate-500"
        >
          <Link
            href="/dashboard/admin"
            className="hover:text-app-primary transition-colors"
          >
            Dashboard
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <Link
            href="/dashboard/admin/data-pengajuan"
            className="hover:text-app-primary transition-colors"
          >
            Data Pengajuan
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-app-primary font-bold">
            {detail.submission_number}
          </span>
        </nav>

        <button
          type="button"
          onClick={() => router.push("/dashboard/admin/data-pengajuan")}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Daftar Pengajuan</span>
        </button>
      </div>

      {/* Banner Error API */}
      {apiError && (
        <div
          role="alert"
          className="flex items-center gap-2.5 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-xs font-semibold text-red-700"
        >
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{apiError}</span>
        </div>
      )}

      {/* =====================================================================
          2. RINGKASAN EKSEKUTIF PROPOSAL (HEADER DOSSIER)
      ====================================================================== */}
      <header className="rounded-3xl bg-white border border-slate-200/90 shadow-2xs p-5 sm:p-7 space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 text-white font-mono text-xs font-extrabold">
                <Hash className="w-3.5 h-3.5 text-app-secondary" />
                {detail.submission_number}
              </span>

              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${statusInfo.badgeClass}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${statusInfo.dotClass}`}
                />
                {statusInfo.label}
              </span>

              <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold">
                TA {detail.fiscal_year}
              </span>
            </div>

            <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {detail.activity.activity_name}
            </h1>

            <p className="text-xs sm:text-sm font-semibold text-app-primary">
              {detail.organization.name}{" "}
              <span className="text-slate-400 font-normal">
                • Diajukan oleh {detail.applicant.full_name} pada{" "}
                {submittedDateTime.date} ({submittedDateTime.time})
              </span>
            </p>
          </div>

          {/* Kartu Nilai Usulan */}
          <div className="rounded-2xl bg-app-primary-50/80 border border-app-primary-100 px-5 py-4 shrink-0 lg:text-right">
            <p className="text-[11px] font-bold uppercase tracking-wider text-app-primary">
              Total Dana Dimohon
            </p>
            <p className="text-xl sm:text-2xl font-extrabold text-app-primary-950 mt-0.5">
              {formatRupiah(detail.requested_amount)}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Bidang: {detail.field}
            </p>
          </div>
        </div>
      </header>

      {/* =====================================================================
          3. SPLIT WORKSPACE: LEMBAR EVALUASI (8 KOLOM) & PANEL KEPUTUSAN (4 KOLOM)
      ====================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* -------------------------------------------------------------------
            KOLOM KIRI (8 KOLOM): DOKUMEN INSPECTOR + DETAIL DATA
        -------------------------------------------------------------------- */}
        <div className="lg:col-span-8 space-y-6">
          {/* A. INLINE DOCUMENT INSPECTOR */}
          <section
            id="dokumen"
            className="rounded-3xl bg-white border border-slate-200/90 shadow-2xs overflow-hidden scroll-mt-20"
          >
            <div className="px-5 sm:px-6 py-4 bg-slate-50/80 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-app-primary text-white flex items-center justify-center shrink-0">
                  <FileCheck2 className="w-4 h-4 text-app-secondary" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">
                    Pemeriksaan Berkas Persyaratan
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Pilih berkas di sebelah kiri untuk membaca isi dokumen
                    secara langsung
                  </p>
                </div>
              </div>

              <span
                className={`px-3 py-1 rounded-full border text-[11px] font-extrabold self-start sm:self-auto ${
                  isAllRequiredComplete
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-amber-50 border-amber-200 text-amber-800"
                }`}
              >
                {uploadedRequiredCount}/{requiredDocs.length} Dokumen Wajib
                Terlampir
              </span>
            </div>

            {/* Split Viewer: Daftar File (5 col) + File Frame (7 col) */}
            <div className="grid grid-cols-1 md:grid-cols-12">
              {/* Daftar Berkas */}
              <div className="md:col-span-5 border-b md:border-b-0 md:border-r border-slate-100 p-3 space-y-1.5 bg-slate-50/40 max-h-[540px] overflow-y-auto">
                {detail.documents.map((doc, idx) => {
                  const isAttached = Boolean(doc.download_url);
                  const isSelected = activeDoc?.id === doc.id;
                  const formatLabel = doc.mime_type?.startsWith("image/")
                    ? "Gambar"
                    : "PDF";

                  return (
                    <button
                      key={doc.id}
                      type="button"
                      disabled={!isAttached}
                      onClick={() => isAttached && setActiveDocId(doc.id)}
                      className={`w-full text-left rounded-2xl p-3 transition-all flex items-start justify-between gap-2 ${
                        !isAttached
                          ? "opacity-50 cursor-not-allowed bg-transparent"
                          : isSelected
                            ? "bg-app-primary text-white shadow-xs cursor-pointer"
                            : "bg-white hover:bg-slate-50 border border-slate-200/70 text-slate-800 cursor-pointer"
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <span
                          className={`w-5 h-5 rounded-lg text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-0.5 ${
                            isSelected
                              ? "bg-white/20 text-white"
                              : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {String(idx + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold leading-snug truncate">
                            {doc.display_name}
                          </p>
                          <p
                            className={`text-[10px] mt-0.5 ${
                              isSelected
                                ? "text-app-primary-100"
                                : "text-slate-400"
                            }`}
                          >
                            {isAttached
                              ? `${formatBytes(doc.file_size_bytes)} • ${formatLabel}`
                              : doc.is_required
                                ? "Berkas wajib tidak dilampirkan"
                                : "Opsional (Tidak dilampirkan)"}
                          </p>
                        </div>
                      </div>

                      {isAttached && (
                        <span
                          className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold shrink-0 ${
                            isSelected
                              ? "bg-app-secondary text-app-primary-950"
                              : "bg-emerald-50 text-emerald-700"
                          }`}
                        >
                          Ada
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Area Pratinjau File Inline */}
              <div className="md:col-span-7 flex flex-col bg-slate-100/80">
                {activeDoc && activeDocUrl ? (
                  <>
                    <div className="px-4 py-2.5 bg-white border-b border-slate-200/80 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-slate-900 truncate">
                          {activeDoc.display_name}
                        </p>
                        <p className="text-[10.5px] text-slate-400 truncate">
                          {activeDoc.original_filename}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <a
                          href={activeDocUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Buka di Tab Baru"
                          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={activeDocUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={activeDoc.original_filename}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold transition-colors"
                        >
                          <Download className="w-3.5 h-3.5 text-app-secondary" />
                          <span>Unduh</span>
                        </a>
                      </div>
                    </div>

                    <div className="p-3 flex-1 flex items-center justify-center">
                      {activeDoc.mime_type?.startsWith("image/") ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={activeDocUrl}
                          alt={activeDoc.display_name}
                          className="max-h-[460px] w-auto rounded-2xl border border-slate-200 bg-white object-contain shadow-2xs"
                        />
                      ) : (
                        <iframe
                          src={activeDocUrl}
                          title={activeDoc.display_name}
                          className="w-full h-[460px] rounded-2xl border border-slate-200 bg-white shadow-2xs"
                        />
                      )}
                    </div>
                  </>
                ) : (
                  <div className="h-[460px] flex flex-col items-center justify-center p-6 text-center text-xs text-slate-400">
                    <FileText className="w-8 h-8 mb-2 text-slate-300" />
                    <p>
                      Pilih dokumen yang tersedia untuk menampilkan pratinjau.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* B. DETAIL SUBSTANSI PERMOHONAN */}
          <section className="rounded-3xl bg-white border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="px-5 sm:px-6 py-4 bg-slate-50/80 border-b border-slate-100 flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-extrabold text-slate-900">
                  Substansi Proposal & Pelaksanaan
                </h2>
                <p className="text-[11px] text-slate-500">
                  Latar belakang, tujuan kegiatan, lokasi, manfaat, dan jadwal
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3.5 flex items-start gap-2.5">
                  <Layers className="w-4 h-4 text-app-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10.5px] font-semibold text-slate-400">
                      Bidang & Tahun
                    </p>
                    <p className="font-bold text-slate-800 mt-0.5 leading-snug">
                      {detail.field} (TA {detail.fiscal_year})
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3.5 flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-app-secondary-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10.5px] font-semibold text-slate-400">
                      Lokasi Kegiatan
                    </p>
                    <p className="font-bold text-slate-800 mt-0.5 leading-snug">
                      {detail.activity.activity_location}
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3.5 flex items-start gap-2.5">
                  <Calendar className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10.5px] font-semibold text-slate-400">
                      Waktu Pelaksanaan
                    </p>
                    <p className="font-bold text-slate-800 mt-0.5">
                      {detail.activity.activity_period}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-1">
                <div className="rounded-2xl bg-slate-50/60 p-4 border border-slate-100">
                  <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400">
                    Tujuan Kegiatan
                  </p>
                  <p className="text-slate-700 leading-relaxed mt-1">
                    {detail.activity.objectives}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50/60 p-4 border border-slate-100">
                  <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400">
                    Latar Belakang Permohonan
                  </p>
                  <p className="text-slate-700 leading-relaxed mt-1">
                    {detail.activity.background}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50/60 p-4 border border-slate-100">
                  <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400">
                    Manfaat yang Diharapkan
                  </p>
                  <p className="text-slate-700 leading-relaxed mt-1">
                    {detail.activity.expected_benefits}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* C. PROFIL LEMBAGA & PENANGGUNG JAWAB (2 KOLOM RINGKAS) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Identitas Organisasi */}
            <section className="rounded-3xl bg-white border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">
                    Profil Lembaga Pengusul
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    {detail.organization.organization_type}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10.5px] text-slate-400">
                    Nama Organisasi
                  </span>
                  <p className="font-bold text-slate-900">
                    {detail.organization.name}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-[10.5px] text-slate-400">
                      No. Akta Pendirian
                    </span>
                    <p className="font-semibold text-slate-800">
                      {detail.organization.deed_number || "-"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10.5px] text-slate-400">
                      No. SK / Registrasi
                    </span>
                    <p className="font-semibold text-slate-800">
                      {detail.organization.registration_number || "-"}
                    </p>
                  </div>
                </div>

                <div>
                  <span className="text-[10.5px] text-slate-400">
                    Alamat Sekretariat
                  </span>
                  <p className="font-semibold text-slate-700 leading-relaxed">
                    {detail.organization.address}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-500">
                    <Users2 className="w-3.5 h-3.5 text-app-primary" />
                    <span>Pengurus Inti</span>
                  </div>
                  <p className="text-slate-700">
                    <span className="text-slate-400">Ketua:</span>{" "}
                    <strong>{detail.organization.chair_name}</strong> (
                    {detail.organization.chair_phone})
                  </p>
                  <p className="text-slate-700">
                    <span className="text-slate-400">Sekretaris:</span>{" "}
                    {detail.organization.secretary_name}
                  </p>
                  <p className="text-slate-700">
                    <span className="text-slate-400">Bendahara:</span>{" "}
                    {detail.organization.treasurer_name}
                  </p>
                </div>
              </div>
            </section>

            {/* Identitas Pemohon */}
            <section className="rounded-3xl bg-white border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-app-primary-50 text-app-primary flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">
                    Penanggung Jawab Akun
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Data kontak pemohon
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10.5px] text-slate-400">
                    Nama & NIK
                  </span>
                  <p className="font-bold text-slate-900">
                    {detail.applicant.full_name}
                  </p>
                  <p className="font-mono text-[11px] text-slate-500">
                    NIK: {detail.applicant.nik}
                  </p>
                </div>

                <div>
                  <span className="text-[10.5px] text-slate-400">
                    Tempat, Tanggal Lahir
                  </span>
                  <p className="font-semibold text-slate-800">
                    {detail.applicant.birth_place},{" "}
                    {formatDateTime(detail.applicant.birth_date).date}
                  </p>
                </div>

                <div className="flex flex-col gap-1 text-slate-700">
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {detail.applicant.phone}
                  </span>
                  <span className="inline-flex items-center gap-1.5 break-all">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {detail.applicant.email}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10.5px] text-slate-400">
                    Alamat Domisili
                  </span>
                  <p className="font-semibold text-slate-700 leading-relaxed mt-0.5">
                    {detail.applicant.address}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* -------------------------------------------------------------------
            KOLOM KANAN (4 KOLOM): STICKY DECISION DESK
        -------------------------------------------------------------------- */}
        <aside
          id="verifikasi"
          className="lg:col-span-4 lg:sticky lg:top-20 scroll-mt-20"
        >
          <form
            onSubmit={handleSaveVerification}
            className="rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden"
          >
            {/* Header Panel Keputusan */}
            <div className="px-5 py-4 bg-gradient-to-r from-app-primary-950 to-app-primary text-white">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-app-secondary">
                Meja Verifikator • {detail.submission_number}
              </span>
              <h2 className="text-sm font-extrabold mt-0.5">
                Keputusan Hasil Verifikasi
              </h2>
            </div>

            <div className="p-5 space-y-5 text-xs">
              {!detail.can_verify && (
                <div className="flex items-start gap-2 rounded-xl bg-slate-50 border border-slate-200 p-3 text-[11px] text-slate-600">
                  <ShieldCheck className="w-4 h-4 text-app-primary shrink-0 mt-0.5" />
                  <span>
                    Pengajuan ini sudah berstatus{" "}
                    <strong className="text-slate-900">
                      {statusInfo.label}
                    </strong>{" "}
                    dan tidak lagi memerlukan tindakan verifikasi ulang.
                  </span>
                </div>
              )}

              {/* 1. Pill Selektor Keputusan */}
              <div className="space-y-2">
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  1. Tetapkan Status Pengajuan
                </label>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    disabled={!detail.can_verify || isVerifying}
                    onClick={() => handleSelectDecision("terverifikasi")}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${
                      verifyDecision === "terverifikasi"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-900 ring-2 ring-emerald-500/20"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <CheckCircle2
                      className={`w-5 h-5 ${
                        verifyDecision === "terverifikasi"
                          ? "text-emerald-600"
                          : "text-slate-300"
                      }`}
                    />
                    <div>
                      <p className="font-extrabold text-xs">Terverifikasi</p>
                      <p className="text-[10px] opacity-80">
                        Berkas lengkap & sah
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    disabled={!detail.can_verify || isVerifying}
                    onClick={() => handleSelectDecision("ditolak")}
                    className={`p-3 rounded-2xl border text-left transition-all flex flex-col gap-1.5 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${
                      verifyDecision === "ditolak"
                        ? "bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/20"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <XCircle
                      className={`w-5 h-5 ${
                        verifyDecision === "ditolak"
                          ? "text-rose-600"
                          : "text-slate-300"
                      }`}
                    />
                    <div>
                      <p className="font-extrabold text-xs">Ditolak</p>
                      <p className="text-[10px] opacity-80">
                        Tidak memenuhi syarat
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* 2. Quick-Reason Chips */}
              {detail.can_verify && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                    <Sparkles className="w-3.5 h-3.5 text-app-primary" />
                    <span>2. Pilih Template Berita Acara</span>
                  </div>

                  <div className="space-y-1.5">
                    {VERIFICATION_TEMPLATES[verifyDecision].map((tpl, i) => (
                      <button
                        key={i}
                        type="button"
                        disabled={isVerifying}
                        onClick={() => setVerifyNote(tpl)}
                        className={`w-full text-left p-2.5 rounded-xl border text-[11px] leading-snug transition-colors cursor-pointer disabled:opacity-60 ${
                          verifyNote === tpl
                            ? "bg-app-primary-50 border-app-primary text-app-primary-950 font-semibold"
                            : "bg-slate-50/80 border-slate-200/80 text-slate-600 hover:bg-slate-100"
                        }`}
                      >
                        {tpl}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. Catatan Resmi untuk Pemohon */}
              <div className="space-y-1.5">
                <label
                  htmlFor="berita-acara-verifikasi"
                  className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500"
                >
                  {detail.can_verify ? "3. " : "2. "}
                  {verifyDecision === "terverifikasi"
                    ? "Catatan Hasil Verifikasi"
                    : "Alasan Penolakan"}{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="berita-acara-verifikasi"
                  rows={4}
                  required
                  disabled={!detail.can_verify || isVerifying}
                  value={verifyNote}
                  onChange={(e) => setVerifyNote(e.target.value)}
                  placeholder={
                    verifyDecision === "terverifikasi"
                      ? "Tuliskan ringkasan kelengkapan dokumen dan rekomendasi..."
                      : "Jelaskan alasan penolakan agar diketahui oleh pemohon..."
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15 leading-relaxed disabled:opacity-60"
                />
              </div>

              {verifyDecision === "ditolak" && detail.can_verify && (
                <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3 text-[11px] text-amber-800">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Alasan penolakan ini akan otomatis ditampilkan pada riwayat
                    pengajuan pemohon.
                  </span>
                </div>
              )}

              {/* Tombol Simpan Keputusan */}
              {detail.can_verify && (
                <button
                  type="submit"
                  disabled={isVerifying || !verifyNote.trim()}
                  className={`w-full py-3 px-4 rounded-2xl text-xs font-extrabold text-white shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 ${
                    verifyDecision === "terverifikasi"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-rose-600 hover:bg-rose-700"
                  }`}
                >
                  {isVerifying ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan Keputusan...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>
                        {verifyDecision === "terverifikasi"
                          ? "Tetapkan Terverifikasi"
                          : "Tetapkan Ditolak"}
                      </span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </aside>
      </div>
    </div>
  );
}
