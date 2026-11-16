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
  Eye,
  Download,
  Calendar,
  CheckCircle2,
  Hourglass,
  XCircle,
  ClipboardCheck,
  ShieldCheck,
  MapPin,
  Banknote,
  Layers,
  X,
  Check,
  AlertCircle,
  Hash,
  FileSpreadsheet,
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
    label: "Akta Pendirian / Surat Keterangan Terdaftar",
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
    label: "KTP Ketua / Pimpinan Lembaga",
    required: true,
    formatLabel: "PDF / JPG / PNG",
  },
  {
    key: "dokumenPendukung",
    label: "Dokumen Pendukung Lainnya",
    required: false,
    formatLabel: "PDF / JPG / PNG",
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
  const [previewModal, setPreviewModal] = useState<{
    title: string;
    doc: UploadedDoc;
  } | null>(null);

  // State Panel / Modal Verifikasi Admin
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false);
  const [verifyDecision, setVerifyDecision] = useState<
    "terverifikasi" | "ditolak"
  >("terverifikasi");
  const [verifyNote, setVerifyNote] = useState("");
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [toastBanner, setToastBanner] = useState<string | null>(null);

  // Inisialisasi file PDF dummy & checklist verifikasi dokumen
  useEffect(() => {
    const generated: Record<string, UploadedDoc> = {};
    const initialChecks: Record<string, boolean> = {};

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
      initialChecks[key] = true;
    });

    setDocuments(generated);
    setCheckedDocs(initialChecks);

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

  const handleSaveVerification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyNote.trim()) return;

    setDetail((prev) => ({
      ...prev,
      status: verifyDecision,
      catatanVerifikasi: verifyNote.trim(),
      tanggalVerifikasi: "16 November 2026",
      verifikator: "H. Muhammad Zainuddin, S.Sos.",
    }));

    setIsVerifyModalOpen(false);
    setToastBanner(
      `Status pengajuan ${detail.nomorPengajuan} berhasil diperbarui menjadi "${STATUS_META[verifyDecision].label}".`,
    );
    setTimeout(() => setToastBanner(null), 4500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* =====================================================================
          HEADER & BREADCRUMB + F. AKSI UTAMA
      ====================================================================== */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1.5">
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

          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
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
        </div>

        {/* F. AKSI: Kembali ke Daftar Pengajuan & Mulai Verifikasi */}
        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
          <Link
            href="/dashboard/admin/data-pengajuan"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Daftar Pengajuan</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              setVerifyDecision(
                detail.status === "ditolak" ? "ditolak" : "terverifikasi",
              );
              setVerifyNote(detail.catatanVerifikasi || "");
              setIsVerifyModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-app-primary hover:bg-app-primary-800 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
          >
            <ClipboardCheck className="w-4 h-4 text-app-secondary" />
            <span>
              {detail.status === "menunggu_verifikasi"
                ? "Mulai Verifikasi"
                : "Ubah Hasil Verifikasi"}
            </span>
          </button>
        </div>
      </div>

      {/* Notifikasi Toast */}
      {toastBanner && (
        <div className="flex items-center justify-between gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-xs font-semibold text-emerald-800 shadow-2xs">
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
          A. INFORMASI REGISTRASI (KARTU RINGKASAN ATAS)
      ====================================================================== */}
      <section
        aria-label="Informasi Registrasi"
        className="rounded-3xl bg-gradient-to-br from-app-primary-950 via-app-primary-900 to-app-primary p-5 sm:p-6 text-white shadow-md relative overflow-hidden"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-14 -top-14 w-56 h-56 rounded-full bg-app-secondary/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff14_1px,transparent_1px)] [background-size:20px_20px] opacity-50"
        />

        <div className="relative grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* 1. Nomor Pengajuan */}
          <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <Hash className="w-5 h-5 text-app-secondary" />
            </div>
            <div>
              <p className="text-[10.5px] font-semibold text-app-primary-200">
                Nomor Pengajuan
              </p>
              <p className="text-sm sm:text-base font-extrabold text-white tracking-wide mt-0.5">
                {detail.nomorPengajuan}
              </p>
            </div>
          </div>

          {/* 2. Tanggal Masuk */}
          <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 text-app-secondary" />
            </div>
            <div>
              <p className="text-[10.5px] font-semibold text-app-primary-200">
                Tanggal Masuk
              </p>
              <p className="text-sm font-extrabold text-white mt-0.5">
                {detail.tanggalMasuk}
              </p>
              <p className="text-[10px] text-app-primary-200">
                Pukul {detail.waktuMasuk}
              </p>
            </div>
          </div>

          {/* 3. Status Pengajuan */}
          <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
              <StatusIcon className="w-5 h-5 text-app-secondary" />
            </div>
            <div>
              <p className="text-[10.5px] font-semibold text-app-primary-200">
                Status Pengajuan
              </p>
              <p className="text-sm font-extrabold text-app-secondary-300 mt-0.5">
                {statusInfo.label}
              </p>
              {detail.tanggalVerifikasi && (
                <p className="text-[10px] text-app-primary-200">
                  Diperiksa: {detail.tanggalVerifikasi}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Catatan Verifikator jika sudah Terverifikasi / Ditolak */}
        {detail.catatanVerifikasi && (
          <div className="relative mt-4 pt-4 border-t border-white/15 flex items-start gap-2.5 text-xs text-app-primary-100">
            <ShieldCheck className="w-4 h-4 text-app-secondary shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-white">
                Catatan Hasil Verifikasi ({detail.verifikator}):{" "}
              </span>
              <span>{detail.catatanVerifikasi}</span>
            </div>
          </div>
        )}
      </section>

      {/* =====================================================================
          B. IDENTITAS PEMOHON & C. IDENTITAS ORGANISASI (2 KOLOM SEJAJAR)
      ====================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* B. IDENTITAS PEMOHON */}
        <section className="rounded-2xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-100 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-app-primary-50 text-app-primary flex items-center justify-center">
              <User className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-extrabold text-slate-900">
                Identitas Pemohon
              </h2>
              <p className="text-[10.5px] text-slate-500">
                Data penanggung jawab pengajuan hibah
              </p>
            </div>
          </div>

          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-[10.5px] text-slate-400">Nama Lengkap</p>
              <p className="font-bold text-slate-900 mt-0.5">
                {detail.pemohon.namaLengkap}
              </p>
            </div>

            <div>
              <p className="text-[10.5px] text-slate-400">NIK</p>
              <p className="font-bold text-slate-900 mt-0.5">
                {detail.pemohon.nik}
              </p>
            </div>

            <div>
              <p className="text-[10.5px] text-slate-400">Nomor HP</p>
              <p className="font-semibold text-slate-800 mt-0.5">
                {detail.pemohon.nomorHp}
              </p>
            </div>

            <div>
              <p className="text-[10.5px] text-slate-400">Email</p>
              <p className="font-semibold text-slate-800 mt-0.5 break-all">
                {detail.pemohon.email}
              </p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-[10.5px] text-slate-400">Alamat</p>
              <p className="font-semibold text-slate-800 mt-0.5 leading-relaxed">
                {detail.pemohon.alamat}
              </p>
            </div>
          </div>
        </section>

        {/* C. IDENTITAS ORGANISASI */}
        <section className="rounded-2xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-100 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-app-secondary-50 text-app-secondary-700 flex items-center justify-center">
              <Building2 className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-extrabold text-slate-900">
                Identitas Organisasi
              </h2>
              <p className="text-[10.5px] text-slate-500">
                Profil lembaga dan struktur pengurus inti
              </p>
            </div>
          </div>

          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <p className="text-[10.5px] text-slate-400">Nama Organisasi</p>
              <p className="font-bold text-slate-900 mt-0.5">
                {detail.organisasi.namaOrganisasi}
              </p>
            </div>

            <div>
              <p className="text-[10.5px] text-slate-400">Jenis Organisasi</p>
              <p className="font-semibold text-slate-800 mt-0.5">
                {detail.organisasi.jenisOrganisasi}
              </p>
            </div>

            <div>
              <p className="text-[10.5px] text-slate-400">Ketua / Pimpinan</p>
              <p className="font-bold text-slate-800 mt-0.5">
                {detail.organisasi.ketua}
              </p>
            </div>

            <div>
              <p className="text-[10.5px] text-slate-400">Sekretaris</p>
              <p className="font-semibold text-slate-800 mt-0.5">
                {detail.organisasi.sekretaris}
              </p>
            </div>

            <div>
              <p className="text-[10.5px] text-slate-400">Bendahara</p>
              <p className="font-semibold text-slate-800 mt-0.5">
                {detail.organisasi.bendahara}
              </p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-[10.5px] text-slate-400">Alamat Organisasi</p>
              <p className="font-semibold text-slate-800 mt-0.5 leading-relaxed">
                {detail.organisasi.alamat}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* =====================================================================
          D. INFORMASI PERMOHONAN
      ====================================================================== */}
      <section className="rounded-2xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-100 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <FileSpreadsheet className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-xs sm:text-sm font-extrabold text-slate-900">
              Informasi Permohonan
            </h2>
            <p className="text-[10.5px] text-slate-500">
              Rincian kegiatan, nominal anggaran, lokasi, dan waktu pelaksanaan
            </p>
          </div>
        </div>

        <div className="p-5 sm:p-6 space-y-5 text-xs">
          {/* Highlight Metrik Permohonan */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            <div className="rounded-xl bg-app-primary-50/70 border border-app-primary-100 p-3.5 flex items-start gap-2.5">
              <Banknote className="w-4 h-4 text-app-primary shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-semibold text-slate-500">
                  Jumlah Dana Dimohon
                </p>
                <p className="text-sm sm:text-base font-extrabold text-app-primary mt-0.5">
                  {formatRupiah(detail.permohonan.jumlahDana)}
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-100 p-3.5 flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-app-secondary-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-semibold text-slate-500">
                  Lokasi Kegiatan
                </p>
                <p className="font-bold text-slate-800 mt-0.5 leading-snug">
                  {detail.permohonan.lokasiKegiatan}
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-slate-50 border border-slate-100 p-3.5 flex items-start gap-2.5">
              <Layers className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-semibold text-slate-500">
                  Waktu Pelaksanaan
                </p>
                <p className="font-bold text-slate-800 mt-0.5">
                  {detail.permohonan.waktuPelaksanaan}
                </p>
                <p className="text-[10px] text-slate-400">
                  TA {detail.permohonan.tahunAnggaran} •{" "}
                  {detail.permohonan.bidang}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3.5 pt-1">
            <div>
              <p className="text-[10.5px] font-bold text-slate-400">
                Nama Kegiatan
              </p>
              <p className="text-sm font-extrabold text-slate-900 mt-0.5">
                {detail.permohonan.namaKegiatan}
              </p>
            </div>

            <div>
              <p className="text-[10.5px] font-bold text-slate-400">Tujuan</p>
              <p className="text-slate-700 leading-relaxed mt-0.5">
                {detail.permohonan.tujuan}
              </p>
            </div>

            <div>
              <p className="text-[10.5px] font-bold text-slate-400">
                Latar Belakang
              </p>
              <p className="text-slate-700 leading-relaxed mt-0.5">
                {detail.permohonan.latarBelakang}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          E. DOKUMEN PENGAJUAN (BENTO FILE GRID + INFORMASI KELENGKAPAN)
      ====================================================================== */}
      <section
        id="dokumen"
        className="rounded-3xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden scroll-mt-20"
      >
        {/* Header Dokumen & Informasi Kelengkapan */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-50 via-white to-app-primary-50/40 border-b border-slate-100 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-app-primary text-white flex items-center justify-center shrink-0 shadow-xs">
                <FileCheck2 className="w-5 h-5 text-app-secondary" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
                    Dokumen Pengajuan
                  </h2>
                  <span
                    className={`px-2.5 py-0.5 rounded-full border text-[10px] font-extrabold ${
                      isAllRequiredComplete
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                        : "bg-amber-50 border-amber-200 text-amber-800"
                    }`}
                  >
                    {isAllRequiredComplete
                      ? `Dokumen Wajib Lengkap (${uploadedRequiredCount}/${requiredDocs.length})`
                      : `Dokumen Wajib Belum Lengkap (${uploadedRequiredCount}/${requiredDocs.length})`}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Periksa keabsahan setiap berkas melalui tombol Preview atau
                  Download sebelum menetapkan hasil verifikasi.
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar Kelengkapan */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10.5px]">
              <span className="font-semibold text-slate-500">
                Informasi Kelengkapan Berkas Persyaratan
              </span>
              <span className="font-extrabold text-app-primary">
                {detail.uploadedDocKeys.length} dari {DOC_REQUIREMENTS.length}{" "}
                berkas tersedia
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-app-primary to-emerald-500 transition-all"
                style={{
                  width: `${
                    (detail.uploadedDocKeys.length / DOC_REQUIREMENTS.length) *
                    100
                  }%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Bento Grid 2 Kolom Dokumen */}
        <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {DOC_REQUIREMENTS.map((req, idx) => {
            const doc = documents[req.key];
            const isAttached = Boolean(doc);

            return (
              <div
                key={req.key}
                className={`rounded-2xl border p-4 flex flex-col justify-between transition-all ${
                  isAttached
                    ? "bg-white border-slate-200/90 hover:border-app-primary/50 hover:shadow-md hover:shadow-slate-900/5"
                    : "bg-slate-50/70 border-dashed border-slate-200 opacity-80"
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 font-extrabold text-[9px] ${
                          isAttached
                            ? "bg-rose-50 text-rose-600 border border-rose-200/80"
                            : "bg-slate-100 text-slate-400 border border-slate-200/70"
                        }`}
                      >
                        <FileText className="w-4 h-4 mb-0.5" />
                        <span>PDF</span>
                      </div>

                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                          Berkas 0{idx + 1}
                        </span>
                        <h3 className="text-xs font-extrabold text-slate-900 leading-snug">
                          {req.label}
                        </h3>
                      </div>
                    </div>

                    {isAttached ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9.5px] font-bold shrink-0">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                        <span>Lengkap</span>
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9.5px] font-semibold shrink-0">
                        {req.required ? "Tidak Ada" : "Opsional"}
                      </span>
                    )}
                  </div>

                  <div className="rounded-xl px-3 py-2 bg-slate-50 border border-slate-100 text-[10.5px] text-slate-600">
                    {doc ? (
                      <div className="flex items-center justify-between gap-2">
                        <span className="truncate font-semibold text-slate-700">
                          {doc.file.name}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[9.5px] font-bold text-slate-500 shrink-0">
                          {doc.sizeLabel}
                        </span>
                      </div>
                    ) : (
                      <span className="text-slate-400">
                        Pemohon tidak melampirkan berkas ini ({req.formatLabel})
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-slate-400">
                    {req.required ? "Persyaratan Wajib" : "Dokumen Tambahan"}
                  </span>

                  {doc ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewModal({ title: req.label, doc })
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-app-primary hover:bg-app-primary-800 text-white text-[10.5px] font-bold transition-colors cursor-pointer"
                      >
                        <Eye className="w-3 h-3 text-app-secondary" />
                        <span>Preview</span>
                      </button>

                      <a
                        href={doc.previewUrl}
                        download={doc.file.name}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-[10.5px] font-bold transition-colors"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </a>
                    </div>
                  ) : (
                    <span className="text-[10.5px] text-slate-400">—</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          FOOTER AKSI BAWAH (KEMBALI & MULAI VERIFIKASI)
      ====================================================================== */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => router.push("/dashboard/admin/data-pengajuan")}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Pengajuan</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setVerifyDecision(
              detail.status === "ditolak" ? "ditolak" : "terverifikasi",
            );
            setVerifyNote(detail.catatanVerifikasi || "");
            setIsVerifyModalOpen(true);
          }}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-app-primary to-app-primary-700 hover:from-app-primary-800 hover:to-app-primary text-white text-xs font-bold shadow-md shadow-app-primary/15 transition-all cursor-pointer"
        >
          <ClipboardCheck className="w-4 h-4 text-app-secondary" />
          <span>Mulai Verifikasi</span>
        </button>
      </div>

      {/* =====================================================================
          MODAL LIVE PREVIEW DOKUMEN (DENGAN NAVIGASI BERKAS)
      ====================================================================== */}
      {previewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-3 sm:p-5">
          <div className="w-full max-w-5xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-app-secondary" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm font-extrabold text-white truncate">
                    {previewModal.title}
                  </p>
                  <p className="text-[10.5px] text-slate-300 truncate">
                    {previewModal.doc.file.name} • {previewModal.doc.sizeLabel}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={previewModal.doc.previewUrl}
                  download={previewModal.doc.file.name}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-app-secondary hover:bg-app-secondary-400 text-app-primary-950 text-[11px] font-bold transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Download</span>
                </a>

                <button
                  type="button"
                  onClick={() => setPreviewModal(null)}
                  aria-label="Tutup Preview"
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-slate-100">
              <div className="hidden lg:flex lg:col-span-4 flex-col bg-white border-r border-slate-200 overflow-y-auto p-3 space-y-1.5">
                <p className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Daftar Berkas ({detail.uploadedDocKeys.length})
                </p>

                {DOC_REQUIREMENTS.filter((r) => Boolean(documents[r.key])).map(
                  (req, idx) => {
                    const itemDoc = documents[req.key];
                    const isSelected = previewModal.title === req.label;

                    return (
                      <button
                        key={req.key}
                        type="button"
                        onClick={() =>
                          setPreviewModal({ title: req.label, doc: itemDoc })
                        }
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
                              {req.label}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">
                              {itemDoc.file.name}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  },
                )}
              </div>

              <div className="lg:col-span-8 p-3 sm:p-4 overflow-auto flex items-center justify-center">
                <iframe
                  src={previewModal.doc.previewUrl}
                  title={previewModal.title}
                  className="w-full h-[68vh] rounded-2xl border border-slate-200 bg-white shadow-sm"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL FORM VERIFIKASI ADMIN (TERVERIFIKASI / DITOLAK)
      ====================================================================== */}
      {isVerifyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 backdrop-blur-xs p-4">
          <form
            onSubmit={handleSaveVerification}
            className="w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden"
          >
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-app-primary">
                  Keputusan Verifikasi • {detail.nomorPengajuan}
                </span>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Penetapan Hasil Verifikasi Administrasi
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsVerifyModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200/70 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Pilihan Status Hasil Verifikasi */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">
                  Status Hasil Verifikasi{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setVerifyDecision("terverifikasi")}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border font-bold transition-all cursor-pointer ${
                      verifyDecision === "terverifikasi"
                        ? "bg-emerald-50 border-emerald-500 text-emerald-800 ring-2 ring-emerald-500/20"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Terverifikasi</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setVerifyDecision("ditolak")}
                    className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border font-bold transition-all cursor-pointer ${
                      verifyDecision === "ditolak"
                        ? "bg-red-50 border-red-500 text-red-800 ring-2 ring-red-500/20"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <XCircle className="w-4 h-4 text-red-600" />
                    <span>Ditolak</span>
                  </button>
                </div>
              </div>

              {/* Checklist Kelengkapan Berkas */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">
                  Checklist Kelengkapan Dokumen Wajib
                </label>
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 space-y-2 max-h-36 overflow-y-auto">
                  {requiredDocs.map((doc) => (
                    <label
                      key={doc.key}
                      className="flex items-center gap-2 text-[11px] text-slate-700 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(checkedDocs[doc.key])}
                        onChange={(e) =>
                          setCheckedDocs({
                            ...checkedDocs,
                            [doc.key]: e.target.checked,
                          })
                        }
                        className="rounded border-slate-300 text-app-primary focus:ring-app-primary/25"
                      />
                      <span>{doc.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Catatan / Berita Acara Verifikator */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">
                  {verifyDecision === "terverifikasi"
                    ? "Catatan Hasil Verifikasi"
                    : "Alasan Penolakan Pengajuan"}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={verifyNote}
                  onChange={(e) => setVerifyNote(e.target.value)}
                  placeholder={
                    verifyDecision === "terverifikasi"
                      ? "Tuliskan keterangan kelengkapan dokumen dan rekomendasi..."
                      : "Jelaskan alasan penolakan agar dapat diketahui oleh pemohon..."
                  }
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15"
                />
              </div>

              {verifyDecision === "ditolak" && (
                <div className="flex items-start gap-2 rounded-xl bg-amber-50 border border-amber-200 p-2.5 text-[11px] text-amber-800">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    Alasan penolakan ini akan dikirimkan sebagai notifikasi dan
                    ditampilkan pada riwayat pengajuan pemohon.
                  </span>
                </div>
              )}
            </div>

            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsVerifyModalOpen(false)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-app-primary hover:bg-app-primary-800 text-white text-xs font-bold cursor-pointer"
              >
                <Check className="w-3.5 h-3.5 text-app-secondary" />
                <span>Simpan Hasil Verifikasi</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
