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
  Banknote,
  Layers,
  X,
  AlertCircle,
  Hash,
  FileSpreadsheet,
  Send,
  Phone,
  Mail,
  Users2,
  Maximize2,
  Sparkles,
} from "lucide-react";

type AdminSubmissionStatus =
  | "menunggu_verifikasi"
  | "terverifikasi"
  | "ditolak";

interface UploadedDoc {
  file: File;
  previewUrl: string;
  sizeLabel: string;
}

interface DocRequirement {
  key: string;
  label: string;
  required: boolean;
  formatLabel: string;
}

interface AdminSubmissionDetail {
  id: string;
  nomorPengajuan: string;
  tanggalMasuk: string;
  waktuMasuk: string;
  status: AdminSubmissionStatus;
  catatanVerifikasi?: string;
  tanggalVerifikasi?: string;
  verifikator?: string;
  pemohon: {
    namaLengkap: string;
    nik: string;
    nomorHp: string;
    email: string;
    alamat: string;
  };
  organisasi: {
    namaOrganisasi: string;
    jenisOrganisasi: string;
    alamat: string;
    ketua: string;
    sekretaris: string;
    bendahara: string;
  };
  permohonan: {
    tahunAnggaran: string;
    bidang: string;
    namaKegiatan: string;
    tujuan: string;
    latarBelakang: string;
    jumlahDana: number;
    lokasiKegiatan: string;
    waktuPelaksanaan: string;
  };
  uploadedDocKeys: string[];
}

const DOC_REQUIREMENTS: DocRequirement[] = [
  {
    key: "proposal",
    label: "Proposal Permohonan Hibah",
    required: true,
    formatLabel: "PDF",
  },
  {
    key: "suratPermohonan",
    label: "Surat Permohonan Hibah",
    required: true,
    formatLabel: "PDF",
  },
  {
    key: "profilOrganisasi",
    label: "Profil Organisasi / Lembaga",
    required: true,
    formatLabel: "PDF",
  },
  {
    key: "aktaPendirian",
    label: "Akta Pendirian / SKT",
    required: true,
    formatLabel: "PDF",
  },
  {
    key: "skKepengurusan",
    label: "SK Kepengurusan Aktif",
    required: true,
    formatLabel: "PDF",
  },
  {
    key: "ktpKetua",
    label: "KTP Ketua / Pimpinan",
    required: true,
    formatLabel: "PDF / JPG",
  },
  {
    key: "dokumenPendukung",
    label: "Dokumen Pendukung Lainnya",
    required: false,
    formatLabel: "PDF / JPG",
  },
];

const STATUS_META: Record<
  AdminSubmissionStatus,
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

const DUMMY_ADMIN_DETAILS: Record<string, AdminSubmissionDetail> = {
  "hb-2026-001": {
    id: "hb-2026-001",
    nomorPengajuan: "HIB-2026-001",
    tanggalMasuk: "16 November 2026",
    waktuMasuk: "09:42 WITA",
    status: "menunggu_verifikasi",
    pemohon: {
      namaLengkap: "Ahmad Fauzi",
      nik: "5204081205880003",
      nomorHp: "081237889910",
      email: "ahmad.fauzi@nuruliman.or.id",
      alamat:
        "Jl. Kebayan No. 14, Kelurahan Uma Sima, Kecamatan Sumbawa, Kabupaten Sumbawa",
    },
    organisasi: {
      namaOrganisasi: "Yayasan Nurul Iman Sumbawa",
      jenisOrganisasi: "Yayasan / Lembaga Keagamaan",
      alamat:
        "Jl. Garuda Gg. Melati No. 08, Kelurahan Lempeh, Kecamatan Sumbawa, Kabupaten Sumbawa",
      ketua: "Ahmad Fauzi",
      sekretaris: "Siti Rahmawati, S.Pd.",
      bendahara: "Muhammad Ridwan, S.E.",
    },
    permohonan: {
      tahunAnggaran: "2026",
      bidang: "Pendidikan & Pembinaan Keagamaan",
      namaKegiatan:
        "Bantuan Pendidikan & Rehabilitasi Ruang Belajar TPQ Al-Hikmah",
      tujuan:
        "Meningkatkan kelayakan sarana dan prasarana pendidikan keagamaan non-formal serta menciptakan lingkungan belajar mengaji yang aman, bersih, dan kondusif bagi 145 santri.",
      latarBelakang:
        "Kondisi atap dan ruang kelas Taman Pendidikan Al-Quran (TPQ) Al-Hikmah saat ini mengalami kerusakan ringan hingga sedang akibat usia bangunan, sementara jumlah santri aktif terus meningkat setiap tahunnya sehingga dibutuhkan perbaikan ruang belajar yang layak dan nyaman.",
      jumlahDana: 50000000,
      lokasiKegiatan:
        "Jl. Garuda Gg. Melati No. 08, Kelurahan Lempeh, Kecamatan Sumbawa, Kabupaten Sumbawa",
      waktuPelaksanaan: "Desember 2026 – Februari 2027",
    },
    uploadedDocKeys: [
      "proposal",
      "suratPermohonan",
      "profilOrganisasi",
      "aktaPendirian",
      "skKepengurusan",
      "ktpKetua",
      "dokumenPendukung",
    ],
  },
  "hb-2026-004": {
    id: "hb-2026-004",
    nomorPengajuan: "HIB-2026-004",
    tanggalMasuk: "10 November 2026",
    waktuMasuk: "14:15 WITA",
    status: "terverifikasi",
    tanggalVerifikasi: "12 November 2026",
    verifikator: "H. Muhammad Zainuddin, S.Sos.",
    catatanVerifikasi:
      "Seluruh berkas administrasi, akta pendirian, dan rincian RAB dinyatakan lengkap serta memenuhi ketentuan pengelolaan hibah daerah.",
    pemohon: {
      namaLengkap: "Ahmad Fauzi",
      nik: "5204081205880003",
      nomorHp: "081237889910",
      email: "ahmad.fauzi@nuruliman.or.id",
      alamat:
        "Jl. Kebayan No. 14, Kelurahan Uma Sima, Kecamatan Sumbawa, Kabupaten Sumbawa",
    },
    organisasi: {
      namaOrganisasi: "Yayasan Nurul Iman Sumbawa",
      jenisOrganisasi: "Yayasan / Lembaga Keagamaan",
      alamat:
        "Jl. Garuda Gg. Melati No. 08, Kelurahan Lempeh, Kecamatan Sumbawa, Kabupaten Sumbawa",
      ketua: "Ahmad Fauzi",
      sekretaris: "Siti Rahmawati, S.Pd.",
      bendahara: "Muhammad Ridwan, S.E.",
    },
    permohonan: {
      tahunAnggaran: "2026",
      bidang: "Keagamaan & Sarana Ibadah",
      namaKegiatan:
        "Pengadaan Perlengkapan Seni Islami dan Pembinaan Remaja Masjid",
      tujuan:
        "Menyediakan perlengkapan seni islami yang memadai serta wadah pembinaan positif bagi generasi muda dan remaja masjid.",
      latarBelakang:
        "Remaja masjid di lingkungan Kelurahan Lempeh aktif menyelenggarakan kegiatan syiar dan seni budaya Islam, namun keterbatasan peralatan pendukung menghambat latihan rutin.",
      jumlahDana: 18500000,
      lokasiKegiatan: "Masjid Nurul Iman, Kelurahan Lempeh, Kecamatan Sumbawa",
      waktuPelaksanaan: "November – Desember 2026",
    },
    uploadedDocKeys: [
      "proposal",
      "suratPermohonan",
      "profilOrganisasi",
      "aktaPendirian",
      "skKepengurusan",
      "ktpKetua",
    ],
  },
  "hb-2025-009": {
    id: "hb-2025-009",
    nomorPengajuan: "HIB-2025-009",
    tanggalMasuk: "04 Juli 2025",
    waktuMasuk: "11:20 WITA",
    status: "ditolak",
    tanggalVerifikasi: "11 Juli 2025",
    verifikator: "H. Muhammad Zainuddin, S.Sos.",
    catatanVerifikasi:
      "Organisasi pemohon belum memenuhi masa terdaftar minimal 3 tahun berturut-turut sesuai peraturan hibah daerah Kabupaten Sumbawa.",
    pemohon: {
      namaLengkap: "Zulkifli Hasan",
      nik: "5204100809920001",
      nomorHp: "085239112233",
      email: "pemudamoyo@gmail.com",
      alamat:
        "Dusun Moyo Mekar, Desa Moyo, Kecamatan Moyo Hilir, Kabupaten Sumbawa",
    },
    organisasi: {
      namaOrganisasi: "Kelompok Pemuda Moyo Hilir",
      jenisOrganisasi: "Kelompok Masyarakat / Karang Taruna",
      alamat: "Desa Moyo, Kecamatan Moyo Hilir, Kabupaten Sumbawa",
      ketua: "Zulkifli Hasan",
      sekretaris: "Rina Marlina",
      bendahara: "Dedi Kurniawan",
    },
    permohonan: {
      tahunAnggaran: "2025",
      bidang: "Kepemudaan & Kemasyarakatan",
      namaKegiatan:
        "Permohonan Bantuan Pengadaan Perlengkapan Turnamen Olahraga",
      tujuan:
        "Menyediakan sarana pertandingan dan perlengkapan turnamen pemuda antar desa.",
      latarBelakang:
        "Mendorong kegiatan olahraga kepemudaan antar desa di Kecamatan Moyo Hilir.",
      jumlahDana: 40000000,
      lokasiKegiatan: "Lapangan Desa Moyo, Kecamatan Moyo Hilir",
      waktuPelaksanaan: "Agustus 2025",
    },
    uploadedDocKeys: [
      "proposal",
      "suratPermohonan",
      "profilOrganisasi",
      "aktaPendirian",
      "skKepengurusan",
      "ktpKetua",
    ],
  },
};

function createDummyPdfFile(fileName: string, titleText: string): File {
  const safeText = titleText.replace(/[()\\]/g, "");
  const pdfContent = `%PDF-1.4
1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj
2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj
3 0 obj << /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 595 842] /Contents 5 0 R >> endobj
4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >> endobj
5 0 obj << /Length 130 >>
stream
BT
/F1 16 Tf
50 760 Td
(ARSIP DOKUMEN VERIFIKASI - E-HIBAH KAB. SUMBAWA) Tj
0 -30 Td
/F1 12 Tf
(${safeText}) Tj
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
482
%%EOF`;

  return new File([pdfContent], fileName, { type: "application/pdf" });
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function AdminDetailPengajuanPage() {
  const params = useParams();
  const router = useRouter();
  const idParam = typeof params?.id === "string" ? params.id : "hb-2026-001";

  const initialData: AdminSubmissionDetail = DUMMY_ADMIN_DETAILS[idParam] || {
    ...DUMMY_ADMIN_DETAILS["hb-2026-001"],
    id: idParam,
    nomorPengajuan: idParam.toUpperCase(),
  };

  const [detail, setDetail] = useState<AdminSubmissionDetail>(initialData);
  const [documents, setDocuments] = useState<Record<string, UploadedDoc>>({});
  const [activeDocKey, setActiveDocKey] = useState<string>("proposal");

  // State Form Verifikasi Inline (Tanpa Modal & Tanpa Checkbox)
  const [verifyDecision, setVerifyDecision] = useState<
    "terverifikasi" | "ditolak"
  >(initialData.status === "ditolak" ? "ditolak" : "terverifikasi");
  const [verifyNote, setVerifyNote] = useState<string>(
    initialData.catatanVerifikasi || "",
  );
  const [isSaving, setIsSaving] = useState(false);
  const [toastBanner, setToastBanner] = useState<string | null>(null);

  // Inisialisasi file PDF dummy
  useEffect(() => {
    const generated: Record<string, UploadedDoc> = {};

    detail.uploadedDocKeys.forEach((key) => {
      const req = DOC_REQUIREMENTS.find((r) => r.key === key);
      if (!req) return;
      const cleanName = `${req.label.replace(/[^a-zA-Z0-9]+/g, "_")}_${
        detail.nomorPengajuan
      }.pdf`;
      const file = createDummyPdfFile(
        cleanName,
        `${req.label} - ${detail.nomorPengajuan}`,
      );
      generated[key] = {
        file,
        previewUrl: URL.createObjectURL(file),
        sizeLabel: "420 KB",
      };
    });

    setDocuments(generated);
    if (detail.uploadedDocKeys.length > 0) {
      setActiveDocKey(detail.uploadedDocKeys[0]);
    }

    return () => {
      Object.values(generated).forEach((d) =>
        URL.revokeObjectURL(d.previewUrl),
      );
    };
  }, [detail.id, detail.nomorPengajuan, detail.uploadedDocKeys]);

  const statusInfo = STATUS_META[detail.status];
  const StatusIcon = statusInfo.icon;

  const requiredDocs = DOC_REQUIREMENTS.filter((d) => d.required);
  const uploadedRequiredCount = requiredDocs.filter((d) =>
    detail.uploadedDocKeys.includes(d.key),
  ).length;
  const isAllRequiredComplete = uploadedRequiredCount === requiredDocs.length;

  const activeDoc = documents[activeDocKey];
  const activeDocMeta = DOC_REQUIREMENTS.find((r) => r.key === activeDocKey);

  const handleSelectDecision = (decision: "terverifikasi" | "ditolak") => {
    setVerifyDecision(decision);
    if (!verifyNote.trim()) {
      setVerifyNote(VERIFICATION_TEMPLATES[decision][0]);
    }
  };

  const handleSaveVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyNote.trim()) return;

    setIsSaving(true);
    setTimeout(() => {
      setDetail((prev) => ({
        ...prev,
        status: verifyDecision,
        catatanVerifikasi: verifyNote.trim(),
        tanggalVerifikasi: "25 November 2026",
        verifikator: "H. Muhammad Zainuddin, S.Sos.",
      }));
      setIsSaving(false);
      setToastBanner(
        `Keputusan verifikasi untuk ${detail.nomorPengajuan} berhasil ditetapkan sebagai "${STATUS_META[verifyDecision].label}".`,
      );
      setTimeout(() => setToastBanner(null), 5000);
    }, 300);
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
            {detail.nomorPengajuan}
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

      {/* Notifikasi Toast */}
      {toastBanner && (
        <div className="flex items-center justify-between gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs font-semibold text-emerald-800 shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toastBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastBanner(null)}
            className="text-emerald-600 hover:text-emerald-900 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
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
                {detail.nomorPengajuan}
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
                TA {detail.permohonan.tahunAnggaran}
              </span>
            </div>

            <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {detail.permohonan.namaKegiatan}
            </h1>

            <p className="text-xs sm:text-sm font-semibold text-app-primary">
              {detail.organisasi.namaOrganisasi}{" "}
              <span className="text-slate-400 font-normal">
                • Diajukan oleh {detail.pemohon.namaLengkap} pada{" "}
                {detail.tanggalMasuk} ({detail.waktuMasuk})
              </span>
            </p>
          </div>

          {/* Kartu Nilai Usulan */}
          <div className="rounded-2xl bg-app-primary-50/80 border border-app-primary-100 px-5 py-4 shrink-0 lg:text-right">
            <p className="text-[11px] font-bold uppercase tracking-wider text-app-primary">
              Total Dana Dimohon
            </p>
            <p className="text-xl sm:text-2xl font-extrabold text-app-primary-950 mt-0.5">
              {formatRupiah(detail.permohonan.jumlahDana)}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Bidang: {detail.permohonan.bidang}
            </p>
          </div>
        </div>

        {/* Banner Catatan Verifikasi Jika Sudah Diproses */}
        {detail.catatanVerifikasi && (
          <div className="rounded-2xl bg-slate-50 border border-slate-200/80 p-3.5 flex items-start gap-2.5 text-xs text-slate-700">
            <ShieldCheck className="w-4 h-4 text-app-primary shrink-0 mt-0.5" />
            <div>
              <span className="font-extrabold text-slate-900">
                Hasil Verifikasi ({detail.verifikator} •{" "}
                {detail.tanggalVerifikasi}):{" "}
              </span>
              <span>{detail.catatanVerifikasi}</span>
            </div>
          </div>
        )}
      </header>

      {/* =====================================================================
          3. SPLIT WORKSPACE: LEMBAR EVALUASI (8 KOLOM) & PANEL KEPUTUSAN (4 KOLOM)
      ====================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* -------------------------------------------------------------------
            KOLOM KIRI (8 KOLOM): DOKUMEN INSPECTOR + DETAIL DATA
        -------------------------------------------------------------------- */}
        <div className="lg:col-span-8 space-y-6">
          {/* A. INLINE DOCUMENT INSPECTOR (TANPA BUKA-TUTUP MODAL) */}
          <section className="rounded-3xl bg-white border border-slate-200/90 shadow-2xs overflow-hidden">
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

            {/* Split Viewer: Daftar File (4 col) + PDF Frame (8 col) */}
            <div className="grid grid-cols-1 md:grid-cols-12">
              {/* Daftar Berkas */}
              <div className="md:col-span-5 border-b md:border-b-0 md:border-r border-slate-100 p-3 space-y-1.5 bg-slate-50/40 max-h-[540px] overflow-y-auto">
                {DOC_REQUIREMENTS.map((req, idx) => {
                  const doc = documents[req.key];
                  const isAttached = Boolean(doc);
                  const isSelected = activeDocKey === req.key;

                  return (
                    <button
                      key={req.key}
                      type="button"
                      disabled={!isAttached}
                      onClick={() => isAttached && setActiveDocKey(req.key)}
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
                          0{idx + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-xs font-bold leading-snug truncate">
                            {req.label}
                          </p>
                          <p
                            className={`text-[10px] mt-0.5 ${
                              isSelected
                                ? "text-app-primary-100"
                                : "text-slate-400"
                            }`}
                          >
                            {isAttached
                              ? `${doc.sizeLabel} • ${req.formatLabel}`
                              : req.required
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

              {/* Area Pratinjau PDF Inline */}
              <div className="md:col-span-7 flex flex-col bg-slate-100/80">
                {activeDoc ? (
                  <>
                    <div className="px-4 py-2.5 bg-white border-b border-slate-200/80 flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-slate-900 truncate">
                          {activeDocMeta?.label}
                        </p>
                        <p className="text-[10.5px] text-slate-400 truncate">
                          {activeDoc.file.name}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <a
                          href={activeDoc.previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Buka di Tab Baru"
                          className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={activeDoc.previewUrl}
                          download={activeDoc.file.name}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold transition-colors"
                        >
                          <Download className="w-3.5 h-3.5 text-app-secondary" />
                          <span>Unduh</span>
                        </a>
                      </div>
                    </div>

                    <div className="p-3 flex-1">
                      <iframe
                        src={activeDoc.previewUrl}
                        title={activeDocMeta?.label || "Pratinjau Dokumen"}
                        className="w-full h-[460px] rounded-2xl border border-slate-200 bg-white shadow-2xs"
                      />
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
                  Latar belakang, tujuan kegiatan, lokasi, dan jadwal
                </p>
              </div>
            </div>

            <div className="p-5 sm:p-6 space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3.5 flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-app-secondary-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10.5px] font-semibold text-slate-400">
                      Lokasi Kegiatan
                    </p>
                    <p className="font-bold text-slate-800 mt-0.5 leading-snug">
                      {detail.permohonan.lokasiKegiatan}
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
                      {detail.permohonan.waktuPelaksanaan}
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
                    {detail.permohonan.tujuan}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50/60 p-4 border border-slate-100">
                  <p className="text-[10.5px] font-extrabold uppercase tracking-wider text-slate-400">
                    Latar Belakang Permohonan
                  </p>
                  <p className="text-slate-700 leading-relaxed mt-1">
                    {detail.permohonan.latarBelakang}
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
                    {detail.organisasi.jenisOrganisasi}
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-[10.5px] text-slate-400">
                    Nama Organisasi
                  </span>
                  <p className="font-bold text-slate-900">
                    {detail.organisasi.namaOrganisasi}
                  </p>
                </div>

                <div>
                  <span className="text-[10.5px] text-slate-400">
                    Alamat Sekretariat
                  </span>
                  <p className="font-semibold text-slate-700 leading-relaxed">
                    {detail.organisasi.alamat}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[10.5px] font-bold text-slate-500">
                    <Users2 className="w-3.5 h-3.5 text-app-primary" />
                    <span>Pengurus Inti</span>
                  </div>
                  <p className="text-slate-700">
                    <span className="text-slate-400">Ketua:</span>{" "}
                    <strong>{detail.organisasi.ketua}</strong>
                  </p>
                  <p className="text-slate-700">
                    <span className="text-slate-400">Sekretaris:</span>{" "}
                    {detail.organisasi.sekretaris}
                  </p>
                  <p className="text-slate-700">
                    <span className="text-slate-400">Bendahara:</span>{" "}
                    {detail.organisasi.bendahara}
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
                    {detail.pemohon.namaLengkap}
                  </p>
                  <p className="font-mono text-[11px] text-slate-500">
                    NIK: {detail.pemohon.nik}
                  </p>
                </div>

                <div className="flex flex-col gap-1 text-slate-700">
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {detail.pemohon.nomorHp}
                  </span>
                  <span className="inline-flex items-center gap-1.5 break-all">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {detail.pemohon.email}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10.5px] text-slate-400">
                    Alamat Domisili
                  </span>
                  <p className="font-semibold text-slate-700 leading-relaxed mt-0.5">
                    {detail.pemohon.alamat}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* -------------------------------------------------------------------
            KOLOM KANAN (4 KOLOM): STICKY DECISION DESK (TANPA MODAL & CENTANG)
        -------------------------------------------------------------------- */}
        <aside className="lg:col-span-4 lg:sticky lg:top-20">
          <form
            onSubmit={handleSaveVerification}
            className="rounded-3xl bg-white border border-slate-200/90 shadow-sm overflow-hidden"
          >
            {/* Header Panel Keputusan */}
            <div className="px-5 py-4 bg-gradient-to-r from-app-primary-950 to-app-primary text-white">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-app-secondary">
                Meja Verifikator • {detail.nomorPengajuan}
              </span>
              <h2 className="text-sm font-extrabold mt-0.5">
                Keputusan Hasil Verifikasi
              </h2>
            </div>

            <div className="p-5 space-y-5 text-xs">
              {/* 1. Pill Selektor Keputusan */}
              <div className="space-y-2">
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                  1. Tetapkan Status Pengajuan
                </label>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => handleSelectDecision("terverifikasi")}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
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
                    onClick={() => handleSelectDecision("ditolak")}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col gap-1.5 ${
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

              {/* 2. Quick-Reason Chips (Pengganti Checklist Berkas) */}
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
                      onClick={() => setVerifyNote(tpl)}
                      className={`w-full text-left p-2.5 rounded-xl border text-[11px] leading-snug transition-colors cursor-pointer ${
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

              {/* 3. Catatan Resmi untuk Pemohon */}
              <div className="space-y-1.5">
                <label
                  htmlFor="berita-acara-verifikasi"
                  className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-500"
                >
                  3.{" "}
                  {verifyDecision === "terverifikasi"
                    ? "Catatan Hasil Verifikasi"
                    : "Alasan Penolakan"}{" "}
                  <span className="text-rose-500">*</span>
                </label>
                <textarea
                  id="berita-acara-verifikasi"
                  rows={4}
                  required
                  value={verifyNote}
                  onChange={(e) => setVerifyNote(e.target.value)}
                  placeholder={
                    verifyDecision === "terverifikasi"
                      ? "Tuliskan ringkasan kelengkapan dokumen dan rekomendasi..."
                      : "Jelaskan alasan penolakan agar diketahui oleh pemohon..."
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15 leading-relaxed"
                />
              </div>

              {verifyDecision === "ditolak" && (
                <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 p-3 text-[11px] text-amber-800">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Alasan penolakan ini akan otomatis ditampilkan pada riwayat
                    pengajuan pemohon.
                  </span>
                </div>
              )}

              {/* Tombol Simpan Keputusan */}
              <button
                type="submit"
                disabled={isSaving || !verifyNote.trim()}
                className={`w-full py-3 px-4 rounded-2xl text-xs font-extrabold text-white shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50 ${
                  verifyDecision === "terverifikasi"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                <Send className="w-3.5 h-3.5" />
                <span>
                  {isSaving
                    ? "Menyimpan..."
                    : verifyDecision === "terverifikasi"
                      ? "Tetapkan Terverifikasi"
                      : "Tetapkan Ditolak"}
                </span>
              </button>
            </div>
          </form>
        </aside>
      </div>
    </div>
  );
}
