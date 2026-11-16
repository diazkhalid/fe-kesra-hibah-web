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
  Clock,
  CheckCircle2,
  Hourglass,
  XCircle,
  FileEdit,
  ShieldCheck,
  ShieldAlert,
  Award,
  PhoneCall,
  MapPin,
  Banknote,
  Layers,
  X,
  Trash2,
  Info,
} from "lucide-react";

type SubmissionStatus = "draft" | "menunggu" | "terverifikasi" | "ditolak";

interface UploadedDoc {
  file: File;
  previewUrl: string;
  sizeLabel: string;
  uploadedAt: string;
}

interface DocRequirement {
  key: string;
  label: string;
  required: boolean;
  formatLabel: string;
}

interface SubmissionDetailData {
  id: string;
  nomorPengajuan: string;
  tanggalPengajuan: string;
  waktuPengajuan: string;
  status: SubmissionStatus;
  catatanVerifikator?: string;
  tanggalVerifikasi?: string;
  namaVerifikator?: string;
  step1: {
    namaLengkap: string;
    nik: string;
    tempatLahir: string;
    tanggalLahir: string;
    jenisKelamin: string;
    alamatLengkap: string;
    nomorHp: string;
    email: string;
  };
  step2: {
    namaOrganisasi: string;
    jenisOrganisasi: string;
    nomorAktaPendirian: string;
    tanggalPendirian: string;
    nomorSkOrganisasi: string;
    alamatOrganisasi: string;
    namaKetua: string;
    nomorHpKetua: string;
    namaSekretaris: string;
    namaBendahara: string;
  };
  step3: {
    tahunPengajuan: string;
    bidangPengajuan: string;
    namaKegiatan: string;
    latarBelakang: string;
    maksudTujuan: string;
    jumlahDana: number;
    lokasiKegiatan: string;
    waktuPelaksanaan: string;
    manfaatKegiatan: string;
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
  SubmissionStatus,
  {
    label: string;
    badgeClass: string;
    dotClass: string;
    icon: React.ElementType;
    summaryText: string;
  }
> = {
  draft: {
    label: "Draft",
    badgeClass: "bg-slate-100 text-slate-700 border-slate-200",
    dotClass: "bg-slate-500",
    icon: FileEdit,
    summaryText:
      "Pengajuan masih tersimpan sebagai draft dan belum dikirimkan ke Bagian Kesejahteraan Rakyat.",
  },
  menunggu: {
    label: "Menunggu",
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

const DUMMY_SUBMISSIONS_DETAIL: Record<string, SubmissionDetailData> = {
  "hb-2026-001": {
    id: "hb-2026-001",
    nomorPengajuan: "HIB-2026-001",
    tanggalPengajuan: "14 November 2026",
    waktuPengajuan: "09:42 WITA",
    status: "menunggu",
    step1: {
      namaLengkap: "Ahmad Fauzi",
      nik: "5204081205880003",
      tempatLahir: "Sumbawa Besar",
      tanggalLahir: "12 Mei 1988",
      jenisKelamin: "Laki-laki",
      alamatLengkap:
        "Jl. Kebayan No. 14, Kelurahan Uma Sima, Kecamatan Sumbawa, Kabupaten Sumbawa",
      nomorHp: "081237889910",
      email: "ahmad.fauzi@nuruliman.or.id",
    },
    step2: {
      namaOrganisasi: "Yayasan Nurul Iman Sumbawa",
      jenisOrganisasi: "Yayasan / Lembaga Keagamaan",
      nomorAktaPendirian: "AHU-0014829.AH.01.04.Tahun 2019",
      tanggalPendirian: "17 Agustus 2019",
      nomorSkOrganisasi: "SK-04/YNI-SBW/2024",
      alamatOrganisasi:
        "Jl. Garuda Gg. Melati No. 08, Kelurahan Lempeh, Kecamatan Sumbawa, Kabupaten Sumbawa",
      namaKetua: "Ahmad Fauzi",
      nomorHpKetua: "081237889910",
      namaSekretaris: "Siti Rahmawati, S.Pd.",
      namaBendahara: "Muhammad Ridwan, S.E.",
    },
    step3: {
      tahunPengajuan: "2026",
      bidangPengajuan: "Pendidikan & Pembinaan Keagamaan",
      namaKegiatan:
        "Bantuan Pendidikan & Rehabilitasi Ruang Belajar TPQ Al-Hikmah",
      latarBelakang:
        "Kondisi atap dan ruang kelas Taman Pendidikan Al-Quran (TPQ) Al-Hikmah saat ini mengalami kerusakan ringan hingga sedang akibat usia bangunan, sementara jumlah santri aktif terus meningkat setiap tahunnya sehingga dibutuhkan perbaikan ruang belajar yang layak dan nyaman.",
      maksudTujuan:
        "Meningkatkan kelayakan sarana dan prasarana pendidikan keagamaan non-formal serta menciptakan lingkungan belajar mengaji yang aman, bersih, dan kondusif bagi 145 santri.",
      jumlahDana: 50000000,
      lokasiKegiatan:
        "Jl. Garuda Gg. Melati No. 08, Kelurahan Lempeh, Kecamatan Sumbawa, Kabupaten Sumbawa",
      waktuPelaksanaan: "Desember 2026 – Februari 2027",
      manfaatKegiatan:
        "Memberikan fasilitas belajar Al-Quran yang representatif bagi 145 santri serta mendukung program pembinaan generasi muda berakhlak mulia di Kecamatan Sumbawa.",
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
    tanggalPengajuan: "19 Oktober 2026",
    waktuPengajuan: "14:15 WITA",
    status: "terverifikasi",
    tanggalVerifikasi: "26 Oktober 2026",
    namaVerifikator: "Tim Verifikator Bagian Kesra Setda Kab. Sumbawa",
    catatanVerifikator:
      "Seluruh persyaratan administrasi dan kelengkapan dokumen dinyatakan LENGKAP & VALID oleh Tim Verifikator Bagian Kesejahteraan Rakyat Setda Kabupaten Sumbawa.",
    step1: {
      namaLengkap: "Ahmad Fauzi",
      nik: "5204081205880003",
      tempatLahir: "Sumbawa Besar",
      tanggalLahir: "12 Mei 1988",
      jenisKelamin: "Laki-laki",
      alamatLengkap:
        "Jl. Kebayan No. 14, Kelurahan Uma Sima, Kecamatan Sumbawa, Kabupaten Sumbawa",
      nomorHp: "081237889910",
      email: "ahmad.fauzi@nuruliman.or.id",
    },
    step2: {
      namaOrganisasi: "Yayasan Nurul Iman Sumbawa",
      jenisOrganisasi: "Yayasan / Lembaga Keagamaan",
      nomorAktaPendirian: "AHU-0014829.AH.01.04.Tahun 2019",
      tanggalPendirian: "17 Agustus 2019",
      nomorSkOrganisasi: "SK-04/YNI-SBW/2024",
      alamatOrganisasi:
        "Jl. Garuda Gg. Melati No. 08, Kelurahan Lempeh, Kecamatan Sumbawa, Kabupaten Sumbawa",
      namaKetua: "Ahmad Fauzi",
      nomorHpKetua: "081237889910",
      namaSekretaris: "Siti Rahmawati, S.Pd.",
      namaBendahara: "Muhammad Ridwan, S.E.",
    },
    step3: {
      tahunPengajuan: "2026",
      bidangPengajuan: "Keagamaan & Sarana Ibadah",
      namaKegiatan:
        "Pengadaan Perlengkapan Seni Islami dan Pembinaan Remaja Masjid",
      latarBelakang:
        "Remaja masjid di lingkungan Kelurahan Lempeh aktif menyelenggarakan kegiatan syiar dan seni budaya Islam, namun keterbatasan peralatan pendukung menghambat latihan rutin dan partisipasi kegiatan tingkat kabupaten.",
      maksudTujuan:
        "Menyediakan perlengkapan seni islami yang memadai serta wadah pembinaan positif bagi generasi muda dan remaja masjid.",
      jumlahDana: 18500000,
      lokasiKegiatan: "Masjid Nurul Iman, Kelurahan Lempeh, Kecamatan Sumbawa",
      waktuPelaksanaan: "November – Desember 2026",
      manfaatKegiatan:
        "Meningkatkan partisipasi 80 anggota remaja masjid dalam kegiatan keagamaan dan pelestarian seni budaya Islami di Kabupaten Sumbawa.",
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
  "hb-2026-005": {
    id: "hb-2026-005",
    nomorPengajuan: "DRAFT-2026-005",
    tanggalPengajuan: "16 November 2026",
    waktuPengajuan: "10:05 WITA",
    status: "draft",
    step1: {
      namaLengkap: "Ahmad Fauzi",
      nik: "5204081205880003",
      tempatLahir: "Sumbawa Besar",
      tanggalLahir: "12 Mei 1988",
      jenisKelamin: "Laki-laki",
      alamatLengkap:
        "Jl. Kebayan No. 14, Kelurahan Uma Sima, Kecamatan Sumbawa, Kabupaten Sumbawa",
      nomorHp: "081237889910",
      email: "ahmad.fauzi@nuruliman.or.id",
    },
    step2: {
      namaOrganisasi: "Yayasan Nurul Iman Sumbawa",
      jenisOrganisasi: "Yayasan / Lembaga Keagamaan",
      nomorAktaPendirian: "AHU-0014829.AH.01.04.Tahun 2019",
      tanggalPendirian: "17 Agustus 2019",
      nomorSkOrganisasi: "SK-04/YNI-SBW/2024",
      alamatOrganisasi:
        "Jl. Garuda Gg. Melati No. 08, Kelurahan Lempeh, Kecamatan Sumbawa, Kabupaten Sumbawa",
      namaKetua: "Ahmad Fauzi",
      nomorHpKetua: "081237889910",
      namaSekretaris: "Siti Rahmawati, S.Pd.",
      namaBendahara: "Muhammad Ridwan, S.E.",
    },
    step3: {
      tahunPengajuan: "2027",
      bidangPengajuan: "Keagamaan & Sarana Ibadah",
      namaKegiatan:
        "Permohonan Bantuan Kegiatan Peringatan Hari Besar Islam (PHBI)",
      latarBelakang:
        "Penyelenggaraan syiar Islam tingkat kecamatan membutuhkan dukungan sarana kegiatan masyarakat yang tertib dan terkoordinasi.",
      maksudTujuan:
        "Memfasilitasi pelaksanaan kegiatan keagamaan dan silaturahmi masyarakat di wilayah Kecamatan Sumbawa.",
      jumlahDana: 20000000,
      lokasiKegiatan: "Lapangan Kelurahan Lempeh, Kecamatan Sumbawa",
      waktuPelaksanaan: "April 2027",
      manfaatKegiatan:
        "Mempererat ukhuwah Islamiyah dan partisipasi masyarakat dalam kegiatan keagamaan daerah.",
    },
    uploadedDocKeys: ["proposal", "suratPermohonan", "ktpKetua"],
  },
  "hb-2025-009": {
    id: "hb-2025-009",
    nomorPengajuan: "HIB-2025-009",
    tanggalPengajuan: "04 Juli 2025",
    waktuPengajuan: "11:20 WITA",
    status: "ditolak",
    tanggalVerifikasi: "11 Juli 2025",
    namaVerifikator: "Tim Verifikator Bagian Kesra Setda Kab. Sumbawa",
    catatanVerifikator:
      "Organisasi pemohon belum memenuhi masa terdaftar minimal 3 tahun berturut-turut sesuai ketentuan pengelolaan hibah daerah Kabupaten Sumbawa.",
    step1: {
      namaLengkap: "Zulkifli Hasan",
      nik: "5204100809920001",
      tempatLahir: "Moyo Hilir",
      tanggalLahir: "08 September 1992",
      jenisKelamin: "Laki-laki",
      alamatLengkap:
        "Dusun Moyo Mekar, Desa Moyo, Kecamatan Moyo Hilir, Kabupaten Sumbawa",
      nomorHp: "085239112233",
      email: "pemudamoyo@gmail.com",
    },
    step2: {
      namaOrganisasi: "Kelompok Pemuda Moyo Hilir",
      jenisOrganisasi: "Kelompok Masyarakat / Karang Taruna",
      nomorAktaPendirian: "SK-KADES/12/2024",
      tanggalPendirian: "10 Januari 2024",
      nomorSkOrganisasi: "02/KPMH/2024",
      alamatOrganisasi: "Desa Moyo, Kecamatan Moyo Hilir, Kabupaten Sumbawa",
      namaKetua: "Zulkifli Hasan",
      nomorHpKetua: "085239112233",
      namaSekretaris: "Rina Marlina",
      namaBendahara: "Dedi Kurniawan",
    },
    step3: {
      tahunPengajuan: "2025",
      bidangPengajuan: "Kepemudaan & Kemasyarakatan",
      namaKegiatan:
        "Permohonan Bantuan Pengadaan Perlengkapan Turnamen Olahraga",
      latarBelakang:
        "Mendorong kegiatan olahraga kepemudaan antar desa di Kecamatan Moyo Hilir.",
      maksudTujuan:
        "Menyediakan sarana pertandingan dan perlengkapan turnamen pemuda.",
      jumlahDana: 40000000,
      lokasiKegiatan: "Lapangan Desa Moyo, Kecamatan Moyo Hilir",
      waktuPelaksanaan: "Agustus 2025",
      manfaatKegiatan:
        "Meningkatkan sportivitas dan aktivitas positif pemuda desa.",
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

// Helper PDF dummy agar tombol Preview Dokumen berfungsi penuh
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
(DOKUMEN PENGAJUAN - E-HIBAH KAB. SUMBAWA) Tj
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

export default function DetailPengajuanPage() {
  const params = useParams();
  const router = useRouter();
  const idParam = typeof params?.id === "string" ? params.id : "hb-2026-001";

  // Ambil data sesuai ID URL (fallback ke hb-2026-001 jika ID contoh lain diklik)
  const submission: SubmissionDetailData = DUMMY_SUBMISSIONS_DETAIL[
    idParam
  ] || {
    ...DUMMY_SUBMISSIONS_DETAIL["hb-2026-001"],
    id: idParam,
    nomorPengajuan: idParam.toUpperCase(),
  };

  const statusInfo = STATUS_META[submission.status];
  const StatusIcon = statusInfo.icon;

  const [documents, setDocuments] = useState<Record<string, UploadedDoc>>({});
  const [previewModal, setPreviewModal] = useState<{
    title: string;
    doc: UploadedDoc;
  } | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Buat object URL PDF dummy untuk dokumen yang terunggah
  useEffect(() => {
    const generated: Record<string, UploadedDoc> = {};

    submission.uploadedDocKeys.forEach((key) => {
      const req = DOC_REQUIREMENTS.find((r) => r.key === key);
      if (!req) return;
      const cleanName = `${req.label.replace(/[^a-zA-Z0-9]+/g, "_")}_${
        submission.nomorPengajuan
      }.pdf`;
      const file = createDummyPdfFile(
        cleanName,
        `${req.label} - ${submission.nomorPengajuan}`,
      );
      generated[key] = {
        file,
        previewUrl: URL.createObjectURL(file),
        sizeLabel: "420 KB",
        uploadedAt: submission.tanggalPengajuan,
      };
    });

    setDocuments(generated);

    return () => {
      Object.values(generated).forEach((d) =>
        URL.revokeObjectURL(d.previewUrl),
      );
    };
  }, [
    submission.id,
    submission.nomorPengajuan,
    submission.tanggalPengajuan,
    submission.uploadedDocKeys,
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleDownloadReceipt = () => {
    const receiptText = `BUKTI REGISTRASI PENGAJUAN HIBAH\nPemerintah Kabupaten Sumbawa - Bagian Kesejahteraan Rakyat\n====================================================\nNomor Pengajuan : ${submission.nomorPengajuan}\nTanggal         : ${submission.tanggalPengajuan} (${submission.waktuPengajuan})\nPemohon         : ${submission.step1.namaLengkap} (NIK: ${submission.step1.nik})\nOrganisasi      : ${submission.step2.namaOrganisasi}\nKegiatan        : ${submission.step3.namaKegiatan}\nJumlah Dana     : ${formatRupiah(submission.step3.jumlahDana)}\nStatus Terkini  : ${statusInfo.label}\n`;
    const blob = new Blob([receiptText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Bukti_Pengajuan_${submission.nomorPengajuan}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast(`Bukti pengajuan ${submission.nomorPengajuan} berhasil diunduh.`);
  };

  const handleDeleteDraft = () => {
    setShowDeleteConfirm(false);
    router.push("/dashboard/pemohon/riwayat-pengajuan?deleted=true");
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
              {submission.nomorPengajuan}
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
              {submission.nomorPengajuan}
            </strong>{" "}
            • Dibuat pada {submission.tanggalPengajuan} pukul{" "}
            {submission.waktuPengajuan}
          </p>
        </div>

        {/* Tombol Aksi Utama Sesuai Status */}
        <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
          {submission.status === "draft" ? (
            <>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-red-200 bg-red-50/70 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Draft</span>
              </button>

              <Link
                href={`/dashboard/pemohon/buat-pengajuan?edit=${submission.id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-app-primary hover:bg-app-primary-800 text-white text-xs font-bold shadow-xs transition-colors"
              >
                <FileEdit className="w-3.5 h-3.5 text-app-secondary" />
                <span>Lanjutkan Pengisian</span>
              </Link>
            </>
          ) : (
            <button
              type="button"
              onClick={handleDownloadReceipt}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-app-primary hover:bg-app-primary-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-app-secondary" />
              <span>Download Bukti Pengajuan</span>
            </button>
          )}
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
              <span>TA {submission.step3.tahunPengajuan}</span>
              <span>•</span>
              <span>{submission.step3.bidangPengajuan}</span>
            </div>

            <h2 className="text-base sm:text-xl font-extrabold text-white leading-snug">
              {submission.step3.namaKegiatan}
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
              {formatRupiah(submission.step3.jumlahDana)}
            </p>
            <p className="text-[10.5px] text-app-primary-100 truncate pt-0.5">
              Oleh: {submission.step2.namaOrganisasi}
            </p>
          </div>
        </div>

        {/* Box Keterangan Khusus Jika Status Terverifikasi atau Ditolak */}
        {(submission.status === "terverifikasi" ||
          submission.status === "ditolak") &&
          submission.catatanVerifikator && (
            <div
              className={`relative mt-5 rounded-2xl p-4 border ${
                submission.status === "terverifikasi"
                  ? "bg-emerald-950/60 border-emerald-400/30 text-emerald-100"
                  : "bg-red-950/60 border-red-400/30 text-red-100"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    submission.status === "terverifikasi"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-red-500/20 text-red-300"
                  }`}
                >
                  {submission.status === "terverifikasi" ? (
                    <Award className="w-4 h-4" />
                  ) : (
                    <ShieldAlert className="w-4 h-4" />
                  )}
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-extrabold text-white">
                      {submission.status === "terverifikasi"
                        ? "Hasil Verifikasi Administrasi"
                        : "Alasan Penolakan Pengajuan"}
                    </p>
                    {submission.tanggalVerifikasi && (
                      <span className="text-[10px] opacity-80">
                        ({submission.tanggalVerifikasi})
                      </span>
                    )}
                  </div>
                  <p className="leading-relaxed">
                    {submission.catatanVerifikator}
                  </p>
                  {submission.namaVerifikator && (
                    <p className="text-[10.5px] opacity-75 pt-0.5">
                      Pemeriksa: {submission.namaVerifikator}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
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
                  {submission.step1.namaLengkap}
                </p>
              </div>

              <div>
                <p className="text-[10.5px] text-slate-400">NIK</p>
                <p className="font-bold text-slate-800 mt-0.5">
                  {submission.step1.nik}
                </p>
              </div>

              <div>
                <p className="text-[10.5px] text-slate-400">
                  Tempat, Tanggal Lahir
                </p>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {submission.step1.tempatLahir},{" "}
                  {submission.step1.tanggalLahir}
                </p>
              </div>

              <div>
                <p className="text-[10.5px] text-slate-400">Jenis Kelamin</p>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {submission.step1.jenisKelamin}
                </p>
              </div>

              <div>
                <p className="text-[10.5px] text-slate-400">
                  Nomor HP / WhatsApp
                </p>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {submission.step1.nomorHp}
                </p>
              </div>

              <div>
                <p className="text-[10.5px] text-slate-400">Alamat Email</p>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {submission.step1.email}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-[10.5px] text-slate-400">
                  Alamat Lengkap Pemohon
                </p>
                <p className="font-semibold text-slate-800 mt-0.5 leading-relaxed">
                  {submission.step1.alamatLengkap}
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
                  {submission.step2.namaOrganisasi}
                </p>
              </div>

              <div>
                <p className="text-[10.5px] text-slate-400">Jenis Organisasi</p>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {submission.step2.jenisOrganisasi}
                </p>
              </div>

              <div>
                <p className="text-[10.5px] text-slate-400">
                  Nomor Akta Pendirian
                </p>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {submission.step2.nomorAktaPendirian}
                </p>
              </div>

              <div>
                <p className="text-[10.5px] text-slate-400">
                  Tanggal Pendirian
                </p>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {submission.step2.tanggalPendirian}
                </p>
              </div>

              <div>
                <p className="text-[10.5px] text-slate-400">
                  Nomor SK Organisasi
                </p>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {submission.step2.nomorSkOrganisasi || "-"}
                </p>
              </div>

              <div>
                <p className="text-[10.5px] text-slate-400">
                  Ketua / Pimpinan & No. HP
                </p>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {submission.step2.namaKetua} ({submission.step2.nomorHpKetua})
                </p>
              </div>

              <div>
                <p className="text-[10.5px] text-slate-400">Nama Sekretaris</p>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {submission.step2.namaSekretaris}
                </p>
              </div>

              <div>
                <p className="text-[10.5px] text-slate-400">Nama Bendahara</p>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {submission.step2.namaBendahara}
                </p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-[10.5px] text-slate-400">
                  Alamat Organisasi / Sekretariat
                </p>
                <p className="font-semibold text-slate-800 mt-0.5 leading-relaxed">
                  {submission.step2.alamatOrganisasi}
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
                      TA {submission.step3.tahunPengajuan} •{" "}
                      {submission.step3.bidangPengajuan}
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
                      {formatRupiah(submission.step3.jumlahDana)}
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
                      {submission.step3.lokasiKegiatan}
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
                      {submission.step3.waktuPelaksanaan}
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
                    {submission.step3.namaKegiatan}
                  </p>
                </div>

                <div>
                  <p className="text-[10.5px] font-bold text-slate-500">
                    Latar Belakang
                  </p>
                  <p className="text-slate-700 leading-relaxed mt-0.5">
                    {submission.step3.latarBelakang}
                  </p>
                </div>

                <div>
                  <p className="text-[10.5px] font-bold text-slate-500">
                    Maksud dan Tujuan
                  </p>
                  <p className="text-slate-700 leading-relaxed mt-0.5">
                    {submission.step3.maksudTujuan}
                  </p>
                </div>

                <div>
                  <p className="text-[10.5px] font-bold text-slate-500">
                    Manfaat Kegiatan
                  </p>
                  <p className="text-slate-700 leading-relaxed mt-0.5">
                    {submission.step3.manfaatKegiatan}
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
                        {submission.uploadedDocKeys.length}/
                        {DOC_REQUIREMENTS.length} Berkas
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Arsip digital dokumen pendukung permohonan bantuan hibah
                    </p>
                  </div>
                </div>

                {/* Tombol Preview Semua Berkas Sekaligus */}
                {submission.uploadedDocKeys.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const firstKey = submission.uploadedDocKeys[0];
                      const firstReq = DOC_REQUIREMENTS.find(
                        (r) => r.key === firstKey,
                      );
                      const firstDoc = documents[firstKey];
                      if (firstReq && firstDoc) {
                        setPreviewModal({
                          title: firstReq.label,
                          doc: firstDoc,
                        });
                      }
                    }}
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
                    {Math.round(
                      (submission.uploadedDocKeys.length /
                        DOC_REQUIREMENTS.length) *
                        100,
                    )}
                    %
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-app-primary to-emerald-500 transition-all duration-300"
                    style={{
                      width: `${
                        (submission.uploadedDocKeys.length /
                          DOC_REQUIREMENTS.length) *
                        100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Bento Grid 2 Kolom Kartu Dokumen */}
            <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {DOC_REQUIREMENTS.map((req, idx) => {
                const doc = documents[req.key];
                const isAttached = Boolean(doc);

                return (
                  <div
                    key={req.key}
                    className={`group relative rounded-2xl border p-4 flex flex-col justify-between transition-all duration-200 ${
                      isAttached
                        ? "bg-white border-slate-200/90 hover:border-app-primary/50 hover:shadow-md hover:shadow-slate-900/5"
                        : "bg-slate-50/70 border-dashed border-slate-200 opacity-80"
                    }`}
                  >
                    {/* Bagian Atas Kartu: Ikon Tipe File + Badge Status */}
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2.5">
                        {/* File Type Badge Modern */}
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`relative w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0 font-extrabold text-[9px] tracking-wider ${
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
                              Dokumen 0{idx + 1}
                            </span>
                            <h4 className="text-xs font-extrabold text-slate-900 leading-snug line-clamp-2">
                              {req.label}
                            </h4>
                          </div>
                        </div>

                        {/* Status Pill */}
                        {isAttached ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[9.5px] font-bold shrink-0">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                            <span>Terlampir</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[9.5px] font-semibold shrink-0">
                            {req.required ? "Kosong" : "Opsional"}
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
                        {doc ? (
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate font-semibold text-slate-700">
                              {doc.file.name}
                            </span>
                            <span className="px-1.5 py-0.5 rounded-md bg-white border border-slate-200/80 text-[9.5px] font-bold text-slate-500 shrink-0">
                              {doc.sizeLabel}
                            </span>
                          </div>
                        ) : (
                          <span>
                            Tidak ada berkas terunggah ({req.formatLabel})
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bagian Bawah Kartu: Tombol Aksi */}
                    <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span className="text-[10px] font-medium text-slate-400">
                        Format: {req.formatLabel}
                      </span>

                      {doc ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() =>
                              setPreviewModal({ title: req.label, doc })
                            }
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-app-primary hover:bg-app-primary-800 text-white text-[10.5px] font-bold shadow-2xs transition-colors cursor-pointer"
                          >
                            <Eye className="w-3 h-3 text-app-secondary" />
                            <span>Preview</span>
                          </button>

                          <a
                            href={doc.previewUrl}
                            download={doc.file.name}
                            aria-label={`Unduh ${req.label}`}
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
              {/* Tahap 1: Pembuatan Berkas */}
              <li className="pl-5 relative">
                <span className="absolute -left-[9px] top-0.5 w-4 h-4 rounded-full bg-app-primary ring-4 ring-white flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </span>
                <p className="text-xs font-extrabold text-slate-900">
                  Formulir & Dokumen Dibuat
                </p>
                <p className="text-[10.5px] text-slate-400 mt-0.5">
                  {submission.tanggalPengajuan} • {submission.waktuPengajuan}
                </p>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  Pemohon melengkapi identitas lembaga, rincian kegiatan, dan
                  dokumen persyaratan.
                </p>
              </li>

              {/* Tahap 2: Pengiriman / Menunggu */}
              <li className="pl-5 relative">
                <span
                  className={`absolute -left-[9px] top-0.5 w-4 h-4 rounded-full ring-4 ring-white flex items-center justify-center ${
                    submission.status === "draft"
                      ? "bg-slate-300"
                      : "bg-sky-500"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </span>
                <p
                  className={`text-xs font-extrabold ${
                    submission.status === "draft"
                      ? "text-slate-400"
                      : "text-slate-900"
                  }`}
                >
                  Menunggu Verifikasi Admin
                </p>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  {submission.status === "draft"
                    ? "Menunggu pemohon menekan tombol Kirim Pengajuan."
                    : "Berkas masuk ke antrean pemeriksaan Bagian Kesejahteraan Rakyat."}
                </p>
              </li>

              {/* Tahap 3: Keputusan Akhir (Terverifikasi / Ditolak) */}
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
                {submission.tanggalVerifikasi && (
                  <p className="text-[10.5px] text-slate-400 mt-0.5">
                    {submission.tanggalVerifikasi}
                  </p>
                )}
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
      {previewModal && (
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
                  <span className="hidden sm:inline">Unduh File</span>
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

            {/* Body Modal: Daftar Berkas Kiri + PDF Viewer Kanan */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden bg-slate-100">
              {/* Daftar Berkas Terlampir (Desktop) */}
              <div className="hidden lg:flex lg:col-span-4 flex-col bg-white border-r border-slate-200 overflow-y-auto p-3 space-y-1.5">
                <p className="px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400">
                  Daftar Berkas ({submission.uploadedDocKeys.length})
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

              {/* PDF Viewer */}
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
          MODAL KONFIRMASI HAPUS DRAFT
      ====================================================================== */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-slate-900">
                  Hapus Draft Pengajuan?
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Draft{" "}
                  <strong className="text-slate-900">
                    {submission.nomorPengajuan}
                  </strong>{" "}
                  akan dihapus secara permanen dan tidak dapat dipulihkan.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleDeleteDraft}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer"
              >
                Ya, Hapus Draft
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
