"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Building2,
  FileText,
  UploadCloud,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Save,
  Send,
  Eye,
  Trash2,
  RefreshCw,
  AlertCircle,
  FileCheck2,
  X,
  Info,
  Loader2,
  ArrowLeft,
  ShieldCheck,
  ExternalLink,
  BadgeCheck,
} from "lucide-react";
import { useAuthUser } from "@/shared/contexts/SessionContext";
import { usePemohonProfile } from "@/features/pemohon-profile/hooks/useProfile.hook";
import { usePemohonOrganization } from "@/features/pemohon-profile/hooks/useOrganization.hook";
import { GrantDocumentOptionType } from "@/shared/types/option.type"; // Sesuaikan path import type Anda
import { usePemohonPengajuan } from "@/features/pemohon-pengajuan/hooks/usePengajuan.hook";
import { useOptions } from "@/shared/hooks/useOption.hook";
import { GrantDocument } from "@/features/pemohon-pengajuan/types/pengajuan.type";

type StepId = 1 | 2 | 3;

interface UploadedDoc {
  file: File;
  previewUrl: string;
  sizeLabel: string;
  uploadedAt: string;
}

const STEPS = [
  {
    id: 1 as StepId,
    title: "Informasi Pengajuan",
    short: "Pengajuan",
    icon: FileText,
  },
  {
    id: 2 as StepId,
    title: "Upload Dokumen",
    short: "Dokumen",
    icon: UploadCloud,
  },
  {
    id: 3 as StepId,
    title: "Review dan Kirim",
    short: "Review",
    icon: CheckCircle2,
  },
];

// Helper konversi MIME types dari backend ke label & atribut accept input file
function formatMimeTypesLabel(mimeTypes: string[]): string {
  if (!mimeTypes || mimeTypes.length === 0) return "PDF";
  const map: Record<string, string> = {
    "application/pdf": "PDF",
    "image/jpeg": "JPG",
    "image/jpg": "JPG",
    "image/png": "PNG",
    "image/webp": "WEBP",
  };
  const labels = Array.from(
    new Set(
      mimeTypes.map(
        (m) => map[m.toLowerCase()] || m.split("/")[1]?.toUpperCase() || m,
      ),
    ),
  );
  return labels.join(" / ");
}

function formatMaxFileSize(bytes: number): string {
  if (!bytes || bytes <= 0) return "5 MB";
  const mb = bytes / (1024 * 1024);
  return mb >= 1
    ? `${Number.isInteger(mb) ? mb : mb.toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} KB`;
}

export default function BuatPengajuanPage() {
  const router = useRouter();
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  const { user } = useAuthUser();
  const { profile, fetchProfile } = usePemohonProfile();
  const { organization, fetchOrganization } = usePemohonOrganization();
  const {
    isSaving,
    error: pengajuanError,
    clearError: clearPengajuanError,
    upsertPengajuan,
  } = usePemohonPengajuan();
  const {
    documentOptions,
    isLoadingDocuments,
    error: optionError,
    clearError: clearOptionError,
    fetchDocumentOptions,
  } = useOptions();

  const [currentStep, setCurrentStep] = useState<StepId>(1);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [draftSavedNotice, setDraftSavedNotice] = useState<string | null>(null);

  // Modal Preview Dokumen
  const [previewModal, setPreviewModal] = useState<{
    title: string;
    doc: UploadedDoc;
  } | null>(null);

  // STEP 1: Informasi Pengajuan
  const [pengajuanForm, setPengajuanForm] = useState({
    tahunPengajuan: "2027",
    bidangPengajuan: "Keagamaan & Sarana Ibadah",
    namaKegiatan: "",
    latarBelakang: "",
    maksudTujuan: "",
    jumlahDana: "",
    lokasiKegiatan: "",
    waktuPelaksanaan: "",
    manfaatKegiatan: "",
  });

  // STEP 2: Upload Dokumen (key berdasarkan option.document_type)
  const [documents, setDocuments] = useState<Record<string, UploadedDoc>>({});

  // STEP 3: Pernyataan Kebenaran Data
  const [isDeclaredTrue, setIsDeclaredTrue] = useState(false);

  // Fetch data profil, lembaga, dan daftar persyaratan dokumen dari API
  useEffect(() => {
    fetchProfile();
    fetchOrganization();
    fetchDocumentOptions();
  }, [fetchProfile, fetchOrganization, fetchDocumentOptions]);

  // Bersihkan Object URL saat komponen unmount
  useEffect(() => {
    return () => {
      Object.values(documents).forEach((d) =>
        URL.revokeObjectURL(d.previewUrl),
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const errorBanner = validationError || pengajuanError || optionError;

  const formatRupiahInput = (raw: string) => {
    const numeric = raw.replace(/\D/g, "");
    if (!numeric) return "";
    return Number(numeric).toLocaleString("id-ID");
  };

  const parseRupiahNumber = (formatted: string): number => {
    const numeric = formatted.replace(/\D/g, "");
    return numeric ? Number(numeric) : 0;
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024 * 1024)
      return `${Math.max(1, Math.round(bytes / 1024))} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Handler Upload File berdasarkan GrantDocumentOptionType
  const handleFileChange = (
    option: GrantDocumentOptionType,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setValidationError(null);
    clearPengajuanError();
    clearOptionError();

    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi MIME type jika tersedia dari option
    if (
      option.allowed_mime_types &&
      option.allowed_mime_types.length > 0 &&
      !option.allowed_mime_types.includes(file.type)
    ) {
      setValidationError(
        `Format berkas "${option.display_name}" harus berupa ${formatMimeTypesLabel(option.allowed_mime_types)}.`,
      );
      e.target.value = "";
      return;
    }

    // Validasi ukuran file berdasarkan max_file_size_bytes
    if (
      option.max_file_size_bytes > 0 &&
      file.size > option.max_file_size_bytes
    ) {
      setValidationError(
        `Ukuran berkas "${option.display_name}" melebihi batas maksimal ${formatMaxFileSize(option.max_file_size_bytes)}.`,
      );
      e.target.value = "";
      return;
    }

    if (documents[option.document_type]?.previewUrl) {
      URL.revokeObjectURL(documents[option.document_type].previewUrl);
    }

    const previewUrl = URL.createObjectURL(file);
    setDocuments((prev) => ({
      ...prev,
      [option.document_type]: {
        file,
        previewUrl,
        sizeLabel: formatBytes(file.size),
        uploadedAt: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    }));

    e.target.value = "";
  };

  const handleRemoveFile = (documentType: string) => {
    if (documents[documentType]?.previewUrl) {
      URL.revokeObjectURL(documents[documentType].previewUrl);
    }
    setDocuments((prev) => {
      const updated = { ...prev };
      delete updated[documentType];
      return updated;
    });
  };

  // Validasi Tiap Tahap
  const validateStep = (step: StepId): boolean => {
    setValidationError(null);
    clearPengajuanError();
    clearOptionError();

    if (step === 1) {
      const requestedAmount = parseRupiahNumber(pengajuanForm.jumlahDana);
      if (
        !pengajuanForm.tahunPengajuan ||
        !pengajuanForm.bidangPengajuan ||
        !pengajuanForm.namaKegiatan.trim() ||
        !pengajuanForm.latarBelakang.trim() ||
        !pengajuanForm.maksudTujuan.trim() ||
        requestedAmount <= 0 ||
        !pengajuanForm.lokasiKegiatan.trim() ||
        !pengajuanForm.waktuPelaksanaan.trim() ||
        !pengajuanForm.manfaatKegiatan.trim()
      ) {
        setValidationError(
          "Mohon lengkapi seluruh rincian Informasi Pengajuan sebelum melanjutkan.",
        );
        return false;
      }
    }

    if (step === 2) {
      const missingDocs = documentOptions.filter(
        (opt) => opt.is_required && !documents[opt.document_type],
      );
      if (missingDocs.length > 0) {
        setValidationError(
          `Masih terdapat ${missingDocs.length} dokumen wajib yang belum diunggah (${missingDocs[0].display_name}).`,
        );
        return false;
      }
    }

    return true;
  };

  const handleNextStep = () => {
    if (!validateStep(currentStep)) return;
    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as StepId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevStep = () => {
    setValidationError(null);
    clearPengajuanError();
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as StepId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Konversi form & dokumen dinamis dari documentOptions ke PemohonUpsertGrantApplicationDto
  const buildUpsertPayload = (declarationAccepted: boolean) => {
    const mappedDocuments: GrantDocument[] = documentOptions.map((opt) => ({
      document_type: opt.document_type,
      file: documents[opt.document_type]?.file ?? null,
    }));

    return {
      fiscal_year: Number(pengajuanForm.tahunPengajuan),
      field: pengajuanForm.bidangPengajuan,
      activity_name: pengajuanForm.namaKegiatan.trim(),
      background: pengajuanForm.latarBelakang.trim(),
      objectives: pengajuanForm.maksudTujuan.trim(),
      requested_amount: parseRupiahNumber(pengajuanForm.jumlahDana),
      activity_location: pengajuanForm.lokasiKegiatan.trim(),
      activity_period: pengajuanForm.waktuPelaksanaan.trim(),
      expected_benefits: pengajuanForm.manfaatKegiatan.trim(),
      declaration_accepted: declarationAccepted,
      documents: mappedDocuments,
    };
  };

  const handleSaveDraft = async () => {
    setValidationError(null);
    clearPengajuanError();

    const result = await upsertPengajuan(buildUpsertPayload(isDeclaredTrue));
    if (result.success) {
      setDraftSavedNotice(
        `Draft pengajuan berhasil disimpan pada pukul ${new Date().toLocaleTimeString(
          "id-ID",
          { hour: "2-digit", minute: "2-digit" },
        )} WITA.`,
      );
      setTimeout(() => setDraftSavedNotice(null), 4000);
    }
  };

  const handleFinalSubmit = async () => {
    setValidationError(null);
    clearPengajuanError();

    if (!validateStep(1) || !validateStep(2)) return;

    if (!isDeclaredTrue) {
      setValidationError(
        "Anda wajib mencentang pernyataan kebenaran data sebelum mengirim pengajuan.",
      );
      return;
    }

    const result = await upsertPengajuan(buildUpsertPayload(true));
    if (result.success) {
      router.push("/dashboard/pemohon/riwayat-pengajuan");
    }
  };

  const requiredDocsCount = documentOptions.filter((d) => d.is_required).length;
  const uploadedRequiredCount = documentOptions.filter(
    (d) => d.is_required && Boolean(documents[d.document_type]),
  ).length;

  const pemohonNama = profile?.full_name || user?.full_name || "-";
  const pemohonNik = profile?.nik || "-";
  const pemohonBirthPlace = profile?.birth_place || "-";
  const pemohonBirthDate = profile?.birth_date
    ? profile.birth_date.split("T")[0]
    : "-";
  const pemohonPhone = user?.phone || "-";
  const pemohonEmail = user?.email || "-";
  const pemohonAddress = profile?.address || "-";

  const orgName =
    organization?.name ||
    profile?.organization ||
    "Belum melengkapi data lembaga";
  const orgType = organization?.organization_type || "-";
  const orgDeedNumber = organization?.deed_number || "-";
  const orgEstablishedOn = organization?.established_on
    ? organization.established_on.split("T")[0]
    : "-";
  const orgRegNumber = organization?.registration_number || "-";
  const orgChairName = organization?.chair_name || "-";
  const orgChairPhone = organization?.chair_phone || "-";
  const orgSecretaryName = organization?.secretary_name || "-";
  const orgTreasurerName = organization?.treasurer_name || "-";
  const orgAddress = organization?.address || "-";

  return (
    <div className="space-y-6 pb-10">
      {/* =====================================================================
          HEADER HALAMAN
      ====================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <Link
            href="/dashboard/pemohon"
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 hover:text-app-primary transition-colors mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Dashboard</span>
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              Formulir Pengajuan Bantuan Hibah
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
              <BadgeCheck className="w-3 h-3" />
              <span>Terhubung Data Profil</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Bagian Kesejahteraan Rakyat • Sekretariat Daerah Kabupaten Sumbawa
          </p>
        </div>

        <button
          type="button"
          onClick={handleSaveDraft}
          disabled={isSaving}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-60 text-slate-700 text-xs font-bold shadow-2xs transition-colors self-start sm:self-auto cursor-pointer"
        >
          {isSaving ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin text-app-primary" />
          ) : (
            <Save className="w-3.5 h-3.5 text-app-primary" />
          )}
          <span>Simpan Draft</span>
        </button>
      </div>

      {/* Notifikasi Draft Tersimpan */}
      {draftSavedNotice && (
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-xs font-semibold text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{draftSavedNotice}</span>
        </div>
      )}

      {/* =====================================================================
          BANNER IDENTITAS PEMOHON & LEMBAGA DARI PROFIL
      ====================================================================== */}
      <div className="rounded-2xl bg-gradient-to-r from-app-primary-50/90 via-white to-slate-50 border border-app-primary-200/80 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3.5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3.5 min-w-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-app-primary text-white flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4 text-app-secondary" />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-app-primary">
                Lembaga & Pemohon Terdaftar
              </p>
              <p className="text-xs font-extrabold text-slate-900 truncate">
                {orgName}
              </p>
              <p className="text-[11px] text-slate-600 truncate">
                Pemohon: <strong>{pemohonNama}</strong> (NIK: {pemohonNik})
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/dashboard/pemohon/profil"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-app-primary-50 border border-slate-200 hover:border-app-primary-200 text-[11px] font-bold text-app-primary transition-colors self-start md:self-auto shrink-0"
        >
          <span>Perbarui di Profil Saya</span>
          <ExternalLink className="w-3 h-3" />
        </Link>
      </div>

      {/* =====================================================================
          STEPPER PROGRESS BAR (3 TAHAPAN INTI)
      ====================================================================== */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-4 sm:p-5 shadow-2xs">
        <div className="grid grid-cols-3 gap-2 relative max-w-2xl mx-auto">
          <div
            aria-hidden="true"
            className="absolute top-4.5 left-[16%] right-[16%] h-0.5 bg-slate-200"
          >
            <div
              className="h-full bg-app-primary transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
            />
          </div>

          {STEPS.map((step) => {
            const StepIcon = step.icon;
            const isCompleted = currentStep > step.id;
            const isActive = currentStep === step.id;

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => {
                  setValidationError(null);
                  clearPengajuanError();
                  setCurrentStep(step.id);
                }}
                className="relative z-10 flex flex-col items-center text-center group focus:outline-none cursor-pointer"
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-extrabold border-2 transition-all duration-200 ${
                    isCompleted
                      ? "bg-app-primary border-app-primary text-white group-hover:scale-105"
                      : isActive
                        ? "bg-app-secondary border-app-secondary text-app-primary-950 ring-4 ring-app-secondary/25"
                        : "bg-white border-slate-300 text-slate-500 group-hover:border-app-primary group-hover:text-app-primary"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <StepIcon className="w-4 h-4" />
                  )}
                </div>

                <span
                  className={`mt-2 text-[10.5px] sm:text-xs font-bold leading-tight transition-colors ${
                    isActive
                      ? "text-app-primary"
                      : isCompleted
                        ? "text-slate-700"
                        : "text-slate-500 group-hover:text-app-primary"
                  }`}
                >
                  <span className="hidden sm:inline">{step.title}</span>
                  <span className="sm:hidden">{step.short}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* =====================================================================
          BANNER ERROR VALIDASI / API
      ====================================================================== */}
      {errorBanner && (
        <div
          role="alert"
          className="flex items-start gap-2.5 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-700"
        >
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <p className="font-bold text-red-800">Periksa Kembali Isian Anda</p>
            <p>{errorBanner}</p>
          </div>
        </div>
      )}

      {/* =====================================================================
          KONTEN FORM PER STEP
      ====================================================================== */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden">
        {/* Header Step Aktif */}
        <div className="px-5 py-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-app-secondary-600">
              Tahap {currentStep} dari 3
            </span>
            <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
              {STEPS[currentStep - 1].title}
            </h2>
          </div>

          {currentStep === 2 && !isLoadingDocuments && (
            <span className="px-2.5 py-1 rounded-full bg-app-primary-50 border border-app-primary-200 text-app-primary text-[10.5px] font-bold">
              Dokumen Wajib: {uploadedRequiredCount}/{requiredDocsCount}
            </span>
          )}
        </div>

        <div className="p-5 sm:p-6">
          {/* -----------------------------------------------------------------
              STEP 1: INFORMASI PENGAJUAN
          ------------------------------------------------------------------ */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Tahun Pengajuan <span className="text-red-500">*</span>
                </label>
                <select
                  disabled={isSaving}
                  value={pengajuanForm.tahunPengajuan}
                  onChange={(e) =>
                    setPengajuanForm({
                      ...pengajuanForm,
                      tahunPengajuan: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15 disabled:opacity-60"
                >
                  <option value="2026">Tahun Anggaran 2026</option>
                  <option value="2027">Tahun Anggaran 2027</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Bidang Pengajuan <span className="text-red-500">*</span>
                </label>
                <select
                  disabled={isSaving}
                  value={pengajuanForm.bidangPengajuan}
                  onChange={(e) =>
                    setPengajuanForm({
                      ...pengajuanForm,
                      bidangPengajuan: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15 disabled:opacity-60"
                >
                  <option value="Keagamaan & Sarana Ibadah">
                    Keagamaan & Sarana Ibadah
                  </option>
                  <option value="Pendidikan & Pembinaan Keagamaan">
                    Pendidikan & Pembinaan Keagamaan
                  </option>
                  <option value="Sosial & Kemanusiaan">
                    Sosial & Kemanusiaan
                  </option>
                  <option value="Kepemudaan & Kemasyarakatan">
                    Kepemudaan & Kemasyarakatan
                  </option>
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Nama / Perihal Kegiatan{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  disabled={isSaving}
                  value={pengajuanForm.namaKegiatan}
                  onChange={(e) =>
                    setPengajuanForm({
                      ...pengajuanForm,
                      namaKegiatan: e.target.value,
                    })
                  }
                  placeholder="Contoh: Permohonan Bantuan Rehabilitasi Ruang Belajar TPQ"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15 disabled:opacity-60"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Jumlah Dana yang Dimohon{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-xs font-bold text-slate-500">
                    Rp
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    disabled={isSaving}
                    value={pengajuanForm.jumlahDana}
                    onChange={(e) =>
                      setPengajuanForm({
                        ...pengajuanForm,
                        jumlahDana: formatRupiahInput(e.target.value),
                      })
                    }
                    placeholder="0"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-10 pr-3.5 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15 disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Waktu Pelaksanaan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  disabled={isSaving}
                  value={pengajuanForm.waktuPelaksanaan}
                  onChange={(e) =>
                    setPengajuanForm({
                      ...pengajuanForm,
                      waktuPelaksanaan: e.target.value,
                    })
                  }
                  placeholder="Contoh: Maret – Mei 2027"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15 disabled:opacity-60"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Lokasi Kegiatan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  disabled={isSaving}
                  value={pengajuanForm.lokasiKegiatan}
                  onChange={(e) =>
                    setPengajuanForm({
                      ...pengajuanForm,
                      lokasiKegiatan: e.target.value,
                    })
                  }
                  placeholder="Desa/Kelurahan dan Kecamatan lokasi pelaksanaan kegiatan"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15 disabled:opacity-60"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Latar Belakang <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  disabled={isSaving}
                  value={pengajuanForm.latarBelakang}
                  onChange={(e) =>
                    setPengajuanForm({
                      ...pengajuanForm,
                      latarBelakang: e.target.value,
                    })
                  }
                  placeholder="Uraikan kondisi saat ini dan urgensi pengajuan bantuan hibah..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15 disabled:opacity-60"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Maksud dan Tujuan <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  disabled={isSaving}
                  value={pengajuanForm.maksudTujuan}
                  onChange={(e) =>
                    setPengajuanForm({
                      ...pengajuanForm,
                      maksudTujuan: e.target.value,
                    })
                  }
                  placeholder="Jelaskan sasaran serta target yang ingin dicapai..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15 disabled:opacity-60"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">
                  Manfaat Kegiatan <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  disabled={isSaving}
                  value={pengajuanForm.manfaatKegiatan}
                  onChange={(e) =>
                    setPengajuanForm({
                      ...pengajuanForm,
                      manfaatKegiatan: e.target.value,
                    })
                  }
                  placeholder="Uraikan dampak manfaat bagi masyarakat / anggota lembaga..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15 disabled:opacity-60"
                />
              </div>
            </div>
          )}

          {/* -----------------------------------------------------------------
              STEP 2: UPLOAD DOKUMEN (DIRENDER DARI documentOptions)
          ------------------------------------------------------------------ */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className="flex items-start gap-2.5 rounded-xl bg-app-primary-50/80 border border-app-primary-200/80 p-3.5 text-[11.5px] text-app-primary-900">
                <Info className="w-4 h-4 text-app-primary shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  Pastikan hasil pindai (scan) dokumen terbaca dengan jelas dan
                  tidak terpotong.{" "}
                  <strong className="font-bold">
                    Persyaratan final mengikuti ketentuan Bagian Kesejahteraan
                    Rakyat Sekretariat Daerah Kabupaten Sumbawa.
                  </strong>
                </p>
              </div>

              {isLoadingDocuments ? (
                <div className="py-12 flex flex-col items-center justify-center text-center gap-2.5">
                  <Loader2 className="w-6 h-6 animate-spin text-app-primary" />
                  <p className="text-xs font-semibold text-slate-600">
                    Memuat daftar persyaratan dokumen...
                  </p>
                </div>
              ) : documentOptions.length === 0 ? (
                <div className="py-10 rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 flex flex-col items-center justify-center text-center px-4 gap-3">
                  <p className="text-xs font-bold text-slate-700">
                    Daftar persyaratan dokumen belum tersedia.
                  </p>
                  <button
                    type="button"
                    onClick={() => fetchDocumentOptions()}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-bold text-app-primary cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Muat Ulang Daftar Dokumen</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {documentOptions.map((option, idx) => {
                    const uploaded = documents[option.document_type];
                    const acceptAttr = option.allowed_mime_types?.length
                      ? option.allowed_mime_types.join(",")
                      : ".pdf";
                    const formatLabel = formatMimeTypesLabel(
                      option.allowed_mime_types,
                    );
                    const maxSizeLabel = formatMaxFileSize(
                      option.max_file_size_bytes,
                    );

                    return (
                      <div
                        key={option.document_type}
                        className={`rounded-2xl border p-4 transition-all ${
                          uploaded
                            ? "bg-emerald-50/35 border-emerald-200"
                            : "bg-slate-50/60 border-slate-200/80 hover:border-app-primary-300"
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[11px] font-extrabold text-slate-400">
                                {String(idx + 1).padStart(2, "0")}.
                              </span>
                              <h3 className="text-xs font-extrabold text-slate-900">
                                {option.display_name}
                              </h3>

                              {uploaded ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9.5px] font-bold">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  Terunggah
                                </span>
                              ) : option.is_required ? (
                                <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[9.5px] font-bold">
                                  Wajib
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-600 text-[9.5px] font-bold">
                                  Opsional
                                </span>
                              )}
                            </div>

                            <p className="text-[10.5px] text-slate-500">
                              Format:{" "}
                              <strong className="text-slate-700">
                                {formatLabel}
                              </strong>{" "}
                              • Ukuran maksimal:{" "}
                              <strong className="text-slate-700">
                                {maxSizeLabel}
                              </strong>
                            </p>

                            {uploaded && (
                              <div className="inline-flex items-center gap-2 pt-1 text-[11px] font-semibold text-app-primary">
                                <FileCheck2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                <span className="truncate max-w-[240px] sm:max-w-xs">
                                  {uploaded.file.name}
                                </span>
                                <span className="text-slate-400 font-normal">
                                  ({uploaded.sizeLabel})
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            <input
                              ref={(el) => {
                                fileInputRefs.current[option.document_type] =
                                  el;
                              }}
                              type="file"
                              accept={acceptAttr}
                              disabled={isSaving}
                              onChange={(e) => handleFileChange(option, e)}
                              className="hidden"
                            />

                            {!uploaded ? (
                              <button
                                type="button"
                                disabled={isSaving}
                                onClick={() =>
                                  fileInputRefs.current[
                                    option.document_type
                                  ]?.click()
                                }
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-app-primary hover:bg-app-primary-800 disabled:opacity-60 text-white text-[11px] font-bold shadow-2xs transition-colors cursor-pointer"
                              >
                                <UploadCloud className="w-3.5 h-3.5 text-app-secondary" />
                                <span>Upload File</span>
                              </button>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setPreviewModal({
                                      title: option.display_name,
                                      doc: uploaded,
                                    })
                                  }
                                  title="Preview Dokumen"
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-app-primary-50 text-slate-700 hover:text-app-primary text-[11px] font-bold transition-colors cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Preview</span>
                                </button>

                                <button
                                  type="button"
                                  disabled={isSaving}
                                  onClick={() =>
                                    fileInputRefs.current[
                                      option.document_type
                                    ]?.click()
                                  }
                                  title="Ganti Dokumen"
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-amber-50 disabled:opacity-60 text-slate-700 hover:text-amber-700 text-[11px] font-bold transition-colors cursor-pointer"
                                >
                                  <RefreshCw className="w-3.5 h-3.5" />
                                  <span>Ganti</span>
                                </button>

                                <button
                                  type="button"
                                  disabled={isSaving}
                                  onClick={() =>
                                    handleRemoveFile(option.document_type)
                                  }
                                  title="Hapus Dokumen"
                                  className="p-1.5 rounded-xl border border-red-200 bg-red-50/70 hover:bg-red-100 disabled:opacity-60 text-red-600 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* -----------------------------------------------------------------
              STEP 3: REVIEW DAN KIRIM
          ------------------------------------------------------------------ */}
          {currentStep === 3 && (
            <div className="space-y-5">
              {/* 1. Data Pemohon (Otomatis dari Profil) */}
              <div className="rounded-2xl border border-slate-200/80 overflow-hidden">
                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-app-primary" />
                    <span className="text-xs font-extrabold text-slate-800">
                      1. Identitas Pemohon (Dari Profil)
                    </span>
                  </div>
                  <Link
                    href="/dashboard/pemohon/profil"
                    className="text-[11px] font-bold text-app-primary hover:underline"
                  >
                    Edit di Profil
                  </Link>
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-[10.5px] text-slate-400">Nama Lengkap</p>
                    <p className="font-bold text-slate-800">{pemohonNama}</p>
                  </div>
                  <div>
                    <p className="text-[10.5px] text-slate-400">NIK</p>
                    <p className="font-bold text-slate-800">{pemohonNik}</p>
                  </div>
                  <div>
                    <p className="text-[10.5px] text-slate-400">
                      Tempat, Tanggal Lahir
                    </p>
                    <p className="font-semibold text-slate-800">
                      {pemohonBirthPlace}, {pemohonBirthDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10.5px] text-slate-400">
                      Nomor HP / Email
                    </p>
                    <p className="font-semibold text-slate-800">
                      {pemohonPhone} • {pemohonEmail}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-[10.5px] text-slate-400">
                      Alamat Lengkap Pemohon
                    </p>
                    <p className="font-semibold text-slate-800">
                      {pemohonAddress}
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. Data Organisasi / Lembaga (Otomatis dari Profil) */}
              <div className="rounded-2xl border border-slate-200/80 overflow-hidden">
                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-app-primary" />
                    <span className="text-xs font-extrabold text-slate-800">
                      2. Identitas Organisasi / Lembaga (Dari Profil)
                    </span>
                  </div>
                  <Link
                    href="/dashboard/pemohon/profil"
                    className="text-[11px] font-bold text-app-primary hover:underline"
                  >
                    Edit di Profil
                  </Link>
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-[10.5px] text-slate-400">
                      Nama Organisasi
                    </p>
                    <p className="font-bold text-slate-800">{orgName}</p>
                  </div>
                  <div>
                    <p className="text-[10.5px] text-slate-400">
                      Jenis Organisasi
                    </p>
                    <p className="font-semibold text-slate-800">{orgType}</p>
                  </div>
                  <div>
                    <p className="text-[10.5px] text-slate-400">
                      Nomor & Tanggal Akta
                    </p>
                    <p className="font-semibold text-slate-800">
                      {orgDeedNumber} ({orgEstablishedOn})
                    </p>
                  </div>
                  <div>
                    <p className="text-[10.5px] text-slate-400">
                      Nomor SK Organisasi
                    </p>
                    <p className="font-semibold text-slate-800">
                      {orgRegNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10.5px] text-slate-400">
                      Ketua / Pimpinan
                    </p>
                    <p className="font-semibold text-slate-800">
                      {orgChairName} ({orgChairPhone})
                    </p>
                  </div>
                  <div>
                    <p className="text-[10.5px] text-slate-400">
                      Sekretaris & Bendahara
                    </p>
                    <p className="font-semibold text-slate-800">
                      {orgSecretaryName} / {orgTreasurerName}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-[10.5px] text-slate-400">
                      Alamat Organisasi
                    </p>
                    <p className="font-semibold text-slate-800">{orgAddress}</p>
                  </div>
                </div>
              </div>

              {/* 3. Rangkuman Informasi Pengajuan */}
              <div className="rounded-2xl border border-slate-200/80 overflow-hidden">
                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-800">
                    3. Informasi Pengajuan
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-[11px] font-bold text-app-primary hover:underline cursor-pointer"
                  >
                    Ubah
                  </button>
                </div>
                <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-[10.5px] text-slate-400">
                      Tahun & Bidang Pengajuan
                    </p>
                    <p className="font-bold text-slate-800">
                      TA {pengajuanForm.tahunPengajuan} •{" "}
                      {pengajuanForm.bidangPengajuan}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10.5px] text-slate-400">
                      Jumlah Dana Dimohon
                    </p>
                    <p className="font-extrabold text-app-primary text-sm">
                      Rp {pengajuanForm.jumlahDana || "0"}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-[10.5px] text-slate-400">
                      Nama Kegiatan
                    </p>
                    <p className="font-bold text-slate-800">
                      {pengajuanForm.namaKegiatan}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10.5px] text-slate-400">
                      Lokasi Kegiatan
                    </p>
                    <p className="font-semibold text-slate-800">
                      {pengajuanForm.lokasiKegiatan}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10.5px] text-slate-400">
                      Waktu Pelaksanaan
                    </p>
                    <p className="font-semibold text-slate-800">
                      {pengajuanForm.waktuPelaksanaan}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-[10.5px] text-slate-400">
                      Latar Belakang
                    </p>
                    <p className="text-slate-700 leading-relaxed">
                      {pengajuanForm.latarBelakang}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-[10.5px] text-slate-400">
                      Maksud dan Tujuan
                    </p>
                    <p className="text-slate-700 leading-relaxed">
                      {pengajuanForm.maksudTujuan}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-[10.5px] text-slate-400">
                      Manfaat Kegiatan
                    </p>
                    <p className="text-slate-700 leading-relaxed">
                      {pengajuanForm.manfaatKegiatan}
                    </p>
                  </div>
                </div>
              </div>

              {/* 4. Daftar Dokumen yang Diunggah & Preview (Dari documentOptions) */}
              <div className="rounded-2xl border border-slate-200/80 overflow-hidden">
                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-800">
                    4. Daftar Dokumen yang Diunggah
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-[11px] font-bold text-app-primary hover:underline cursor-pointer"
                  >
                    Kelola Dokumen
                  </button>
                </div>
                <div className="divide-y divide-slate-100">
                  {documentOptions.map((option) => {
                    const doc = documents[option.document_type];
                    return (
                      <div
                        key={option.document_type}
                        className="px-4 py-3 flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 truncate">
                            {option.display_name}
                          </p>
                          <p className="text-[10.5px] text-slate-500 truncate">
                            {doc
                              ? `${doc.file.name} (${doc.sizeLabel})`
                              : option.is_required
                                ? "Belum diunggah (Wajib)"
                                : "Tidak diunggah (Opsional)"}
                          </p>
                        </div>

                        {doc ? (
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewModal({
                                title: option.display_name,
                                doc,
                              })
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-app-primary-50 hover:bg-app-primary text-app-primary hover:text-white text-[11px] font-bold transition-colors shrink-0 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Preview</span>
                          </button>
                        ) : (
                          <span className="text-[10.5px] font-semibold text-slate-400 shrink-0">
                            —
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 5. Pernyataan Kebenaran Data & Checkbox Persetujuan */}
              <div className="rounded-2xl bg-app-primary-50/70 border border-app-primary-200 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-extrabold text-app-primary-950">
                  <ShieldCheck className="w-4 h-4 text-app-primary" />
                  <span>Pernyataan Kebenaran Data</span>
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    disabled={isSaving}
                    checked={isDeclaredTrue}
                    onChange={(e) => setIsDeclaredTrue(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded border-slate-300 text-app-primary focus:ring-app-primary/25 cursor-pointer shrink-0"
                  />
                  <span className="text-[11.5px] text-slate-700 leading-relaxed">
                    Saya menyatakan dengan sebenar-benarnya bahwa seluruh data
                    profil, rincian kegiatan, dan dokumen yang diunggah dalam
                    permohonan bantuan hibah ini adalah sah, akurat, dan dapat
                    dipertanggungjawabkan sesuai ketentuan peraturan
                    perundang-undangan yang berlaku di Pemerintah Kabupaten
                    Sumbawa.
                  </span>
                </label>
              </div>
            </div>
          )}
        </div>

        {/* ===================================================================
            FOOTER NAVIGASI TOMBOL STEP
        ==================================================================== */}
        <div className="px-5 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrevStep}
              disabled={isSaving}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-60 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 3 ? (
            <button
              type="button"
              onClick={handleNextStep}
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-app-primary hover:bg-app-primary-800 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              <span>Selanjutnya</span>
              <ChevronRight className="w-4 h-4 text-app-secondary" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-app-primary to-app-primary-700 hover:from-app-primary-800 hover:to-app-primary disabled:opacity-60 text-white text-xs font-bold shadow-md shadow-app-primary/20 transition-all cursor-pointer"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-app-secondary" />
                  <span>Mengirim Pengajuan...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-app-secondary" />
                  <span>Kirim Pengajuan</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* =====================================================================
          MODAL LIVE PREVIEW DOKUMEN (PDF / GAMBAR)
      ====================================================================== */}
      {previewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[88vh]">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-slate-900 truncate">
                  {previewModal.title}
                </p>
                <p className="text-[10.5px] text-slate-500 truncate">
                  {previewModal.doc.file.name} ({previewModal.doc.sizeLabel})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModal(null)}
                aria-label="Tutup Preview"
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200/70 hover:text-slate-900 transition-colors cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="flex-1 bg-slate-100 overflow-auto p-4 flex items-center justify-center min-h-[380px]">
              {previewModal.doc.file.type.startsWith("image/") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewModal.doc.previewUrl}
                  alt={previewModal.title}
                  className="max-h-[68vh] w-auto rounded-xl shadow-md object-contain"
                />
              ) : (
                <iframe
                  src={previewModal.doc.previewUrl}
                  title={previewModal.title}
                  className="w-full h-[68vh] rounded-xl border border-slate-200 bg-white"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
