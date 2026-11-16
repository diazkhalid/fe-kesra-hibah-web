"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  FolderKanban,
  CheckCircle2,
  Hourglass,
  XCircle,
  BadgeCheck,
  ExternalLink,
  FileSpreadsheet,
  ShieldCheck,
  Calendar,
  Hash,
  Users2,
  Landmark,
  Copy,
  Check,
} from "lucide-react";

interface SubmissionHistory {
  id: string;
  nomor: string;
  tahun: string;
  bidang: string;
  kegiatan: string;
  tanggal: string;
  status: "menunggu_verifikasi" | "terverifikasi" | "ditolak";
  dana: string;
  nominalAngka: number;
  catatan?: string;
}

interface ApplicantDetailRecord {
  id: string;
  namaLengkap: string;
  nik: string;
  tempatLahir: string;
  tanggalLahir: string;
  jenisKelamin: string;
  email: string;
  nomorHp: string;
  tanggalRegistrasi: string;
  alamatLengkap: string;
  organisasi: {
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
  riwayat: SubmissionHistory[];
}

const SUBMISSION_STATUS_META: Record<
  SubmissionHistory["status"],
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

const DUMMY_APPLICANT_DETAILS: Record<string, ApplicantDetailRecord> = {
  "usr-001": {
    id: "usr-001",
    namaLengkap: "Ahmad Fauzi",
    nik: "5204081205880003",
    tempatLahir: "Sumbawa Besar",
    tanggalLahir: "12 Mei 1988",
    jenisKelamin: "Laki-laki",
    email: "ahmad.fauzi@nuruliman.or.id",
    nomorHp: "081237889910",
    tanggalRegistrasi: "15 Januari 2026",
    alamatLengkap:
      "Jl. Kebayan No. 14, Kelurahan Uma Sima, Kecamatan Sumbawa, Kabupaten Sumbawa",
    organisasi: {
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
    riwayat: [
      {
        id: "hb-2026-001",
        nomor: "HIB-2026-001",
        tahun: "2026",
        bidang: "Pendidikan & Pembinaan Keagamaan",
        kegiatan:
          "Bantuan Pendidikan & Rehabilitasi Ruang Belajar TPQ Al-Hikmah",
        tanggal: "14 Nov 2026",
        status: "menunggu_verifikasi",
        dana: "Rp 50.000.000",
        nominalAngka: 50000000,
        catatan:
          "Berkas proposal baru masuk dan sedang dalam antrean pemeriksaan verifikator.",
      },
      {
        id: "hb-2026-004",
        nomor: "HIB-2026-004",
        tahun: "2026",
        bidang: "Keagamaan & Sarana Ibadah",
        kegiatan:
          "Pengadaan Perlengkapan Seni Islami dan Pembinaan Remaja Masjid",
        tanggal: "19 Okt 2026",
        status: "terverifikasi",
        dana: "Rp 18.500.000",
        nominalAngka: 18500000,
        catatan:
          "Seluruh kelengkapan administrasi dan akta yayasan dinyatakan lengkap dan sesuai.",
      },
    ],
  },
  "usr-002": {
    id: "usr-002",
    namaLengkap: "H. Abdul Rahman, Lc.",
    nik: "5204010204750001",
    tempatLahir: "Sumbawa",
    tanggalLahir: "02 April 1975",
    jenisKelamin: "Laki-laki",
    email: "alikhlas.sbw@gmail.com",
    nomorHp: "081339556677",
    tanggalRegistrasi: "10 Februari 2026",
    alamatLengkap:
      "Jl. Garuda No. 05, Kelurahan Lempeh, Kecamatan Sumbawa, Kabupaten Sumbawa",
    organisasi: {
      namaOrganisasi: "Masjid Besar Al-Ikhlas Sumbawa",
      jenisOrganisasi: "Yayasan / Lembaga Keagamaan",
      nomorAktaPendirian: "SK-KEMENAG/SBW/2012",
      tanggalPendirian: "10 Mei 2012",
      nomorSkOrganisasi: "01/DKM-AI/2025",
      alamatOrganisasi:
        "Jl. Garuda No. 05, Kelurahan Lempeh, Kecamatan Sumbawa, Kabupaten Sumbawa",
      namaKetua: "H. Abdul Rahman, Lc.",
      nomorHpKetua: "081339556677",
      namaSekretaris: "Drs. H. Mahmud",
      namaBendahara: "H. Ibrahim, S.E.",
    },
    riwayat: [
      {
        id: "hb-2026-002",
        nomor: "HIB-2026-002",
        tahun: "2026",
        bidang: "Sarana Ibadah",
        kegiatan:
          "Bantuan Sarana Ibadah dan Pengadaan Sistem Tata Suara Masjid",
        tanggal: "08 Nov 2026",
        status: "menunggu_verifikasi",
        dana: "Rp 30.000.000",
        nominalAngka: 30000000,
        catatan: "Menunggu penjadwalan pemeriksaan dokumen oleh tim Kesra.",
      },
    ],
  },
};

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function AdminDetailPemohonPage() {
  const params = useParams();
  const router = useRouter();
  const idParam = typeof params?.id === "string" ? params.id : "usr-001";

  const applicant = DUMMY_APPLICANT_DETAILS[idParam] || {
    ...DUMMY_APPLICANT_DETAILS["usr-001"],
    id: idParam,
    namaLengkap: "Ahmad Fauzi",
  };

  const [activeTab, setActiveTab] = useState<"profil" | "riwayat">("profil");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (label: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const initials = applicant.namaLengkap
    .replace(/[^a-zA-Z\s]/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const totalNominalUsulan = applicant.riwayat.reduce(
    (acc, item) => acc + item.nominalAngka,
    0,
  );

  return (
    <div className="space-y-6 pb-14">
      {/* =====================================================================
          1. TOP BAR: BREADCRUMB & TOMBOL KEMBALI
      ====================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
          <Link
            href="/dashboard/admin/data-pemohon"
            className="hover:text-app-primary transition-colors"
          >
            Data Pemohon
          </Link>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-app-primary font-bold">
            {applicant.namaLengkap}
          </span>
        </nav>

        <button
          type="button"
          onClick={() => router.push("/dashboard/admin/data-pemohon")}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold shadow-2xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Daftar Pemohon</span>
        </button>
      </div>

      {/* =====================================================================
          2. SPLIT WORKSPACE LAYOUT (KIRI: STICKY RAIL | KANAN: TAB CONTENT)
      ====================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* KOLOM KIRI (4 KOLOM): IDENTITY RAIL */}
        <aside className="lg:col-span-4 lg:sticky lg:top-20 rounded-3xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden">
          {/* Top Gradient Cover */}
          <div className="h-24 bg-gradient-to-br from-app-primary-950 via-app-primary-900 to-app-primary relative">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff18_1px,transparent_1px)] [background-size:16px_16px] opacity-60"
            />
          </div>

          <div className="px-5 pb-6 -mt-10 relative space-y-5">
            {/* Avatar & Status Badge */}
            <div className="flex items-end justify-between">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-app-secondary to-app-secondary-500 text-app-primary-950 flex items-center justify-center font-extrabold text-2xl ring-4 ring-white shadow-md">
                {initials}
              </div>

              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10.5px] font-bold">
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Akun Terdaftar</span>
              </span>
            </div>

            {/* Nama & Lembaga */}
            <div className="space-y-1">
              <h1 className="text-lg font-extrabold text-slate-900 leading-snug">
                {applicant.namaLengkap}
              </h1>
              <p className="text-xs font-bold text-app-primary">
                {applicant.organisasi.namaOrganisasi}
              </p>
              <p className="text-[11px] text-slate-400">
                Terdaftar sejak {applicant.tanggalRegistrasi}
              </p>
            </div>

            {/* Mini Statistik Pemohon */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3">
                <p className="text-[10px] font-bold uppercase text-slate-400">
                  Total Proposal
                </p>
                <p className="text-base font-extrabold text-slate-900 mt-0.5">
                  {applicant.riwayat.length}{" "}
                  <span className="text-[11px] font-medium text-slate-500">
                    Berkas
                  </span>
                </p>
              </div>

              <div className="rounded-2xl bg-app-primary-50/70 border border-app-primary-100 p-3">
                <p className="text-[10px] font-bold uppercase text-app-primary">
                  Akumulasi Usulan
                </p>
                <p className="text-xs sm:text-[13px] font-extrabold text-app-primary-950 mt-1 truncate">
                  {formatRupiah(totalNominalUsulan)}
                </p>
              </div>
            </div>

            {/* Quick Copy Kontak */}
            <div className="pt-4 border-t border-slate-100 space-y-2.5 text-xs">
              <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-50/80 px-3 py-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Hash className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-mono font-bold text-slate-700 truncate">
                    {applicant.nik}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy("nik", applicant.nik)}
                  title="Salin NIK"
                  className="text-slate-400 hover:text-app-primary transition-colors cursor-pointer shrink-0"
                >
                  {copiedField === "nik" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-50/80 px-3 py-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-700 truncate">
                    {applicant.nomorHp}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy("hp", applicant.nomorHp)}
                  title="Salin Nomor HP"
                  className="text-slate-400 hover:text-app-primary transition-colors cursor-pointer shrink-0"
                >
                  {copiedField === "hp" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-50/80 px-3 py-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="font-semibold text-slate-700 truncate">
                    {applicant.email}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy("email", applicant.email)}
                  title="Salin Email"
                  className="text-slate-400 hover:text-app-primary transition-colors cursor-pointer shrink-0"
                >
                  {copiedField === "email" ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </aside>

        {/* KOLOM KANAN (8 KOLOM): TABS & DETAIL CONTENT */}
        <main className="lg:col-span-8 space-y-5">
          {/* Segmented Tab Switcher */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-1.5 shadow-2xs grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab("profil")}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "profil"
                  ? "bg-app-primary text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Biodata & Profil Lembaga</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("riwayat")}
              className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "riwayat"
                  ? "bg-app-primary text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <FolderKanban className="w-3.5 h-3.5" />
              <span>Riwayat Pengajuan ({applicant.riwayat.length})</span>
            </button>
          </div>

          {/* =================================================================
              TAB 1: BIODATA PEMOHON & PROFIL LEMBAGA
          ================================================================== */}
          {activeTab === "profil" && (
            <div className="rounded-3xl bg-white border border-slate-200/80 shadow-2xs divide-y divide-slate-100 overflow-hidden">
              {/* Bagian 1: Identitas Pribadi */}
              <section className="p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-app-primary-50 text-app-primary flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-slate-900">
                      Identitas Pribadi Pemohon
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Data kependudukan penanggung jawab akun
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 pt-1 text-xs">
                  <div>
                    <span className="text-[10.5px] font-semibold text-slate-400">
                      Nama Lengkap
                    </span>
                    <p className="font-bold text-slate-900 mt-0.5">
                      {applicant.namaLengkap}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10.5px] font-semibold text-slate-400">
                      NIK Kependudukan
                    </span>
                    <p className="font-mono font-bold text-slate-900 mt-0.5">
                      {applicant.nik}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10.5px] font-semibold text-slate-400">
                      Tempat, Tanggal Lahir
                    </span>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      {applicant.tempatLahir}, {applicant.tanggalLahir}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10.5px] font-semibold text-slate-400">
                      Jenis Kelamin
                    </span>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      {applicant.jenisKelamin}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-[10.5px] font-semibold text-slate-400">
                      Alamat Tempat Tinggal
                    </span>
                    <p className="font-semibold text-slate-800 mt-0.5 flex items-start gap-1.5 leading-relaxed">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{applicant.alamatLengkap}</span>
                    </p>
                  </div>
                </div>
              </section>

              {/* Bagian 2: Profil & Legalitas Organisasi */}
              <section className="p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-app-secondary-50 text-app-secondary-700 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-slate-900">
                      Profil & Legalitas Organisasi
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Informasi akta pendirian dan alamat sekretariat
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 pt-1 text-xs">
                  <div>
                    <span className="text-[10.5px] font-semibold text-slate-400">
                      Nama Organisasi / Lembaga
                    </span>
                    <p className="font-bold text-slate-900 mt-0.5">
                      {applicant.organisasi.namaOrganisasi}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10.5px] font-semibold text-slate-400">
                      Jenis Organisasi
                    </span>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      {applicant.organisasi.jenisOrganisasi}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10.5px] font-semibold text-slate-400">
                      Nomor & Tanggal Akta Pendirian
                    </span>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      {applicant.organisasi.nomorAktaPendirian} (
                      {applicant.organisasi.tanggalPendirian})
                    </p>
                  </div>

                  <div>
                    <span className="text-[10.5px] font-semibold text-slate-400">
                      Nomor SK Organisasi
                    </span>
                    <p className="font-semibold text-slate-800 mt-0.5">
                      {applicant.organisasi.nomorSkOrganisasi || "-"}
                    </p>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-[10.5px] font-semibold text-slate-400">
                      Alamat Sekretariat
                    </span>
                    <p className="font-semibold text-slate-800 mt-0.5 flex items-start gap-1.5 leading-relaxed">
                      <Landmark className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{applicant.organisasi.alamatOrganisasi}</span>
                    </p>
                  </div>
                </div>
              </section>

              {/* Bagian 3: Struktur Pengurus Inti */}
              <section className="p-5 sm:p-6 space-y-4 bg-slate-50/40">
                <div className="flex items-center gap-2">
                  <Users2 className="w-4 h-4 text-app-primary" />
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
                    Struktur Pengurus Inti Lembaga
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="rounded-2xl bg-white border border-slate-200/80 p-3.5">
                    <span className="text-[10px] font-bold uppercase text-app-primary">
                      Ketua / Pimpinan
                    </span>
                    <p className="font-extrabold text-slate-900 mt-1">
                      {applicant.organisasi.namaKetua}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {applicant.organisasi.nomorHpKetua}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white border border-slate-200/80 p-3.5">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Sekretaris
                    </span>
                    <p className="font-bold text-slate-900 mt-1">
                      {applicant.organisasi.namaSekretaris}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white border border-slate-200/80 p-3.5">
                    <span className="text-[10px] font-bold uppercase text-slate-400">
                      Bendahara
                    </span>
                    <p className="font-bold text-slate-900 mt-1">
                      {applicant.organisasi.namaBendahara}
                    </p>
                  </div>
                </div>
              </section>
            </div>
          )}

          {/* =================================================================
              TAB 2: RIWAYAT PENGAJUAN HIBAH
          ================================================================== */}
          {activeTab === "riwayat" && (
            <div className="rounded-3xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden">
              <div className="px-5 py-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                    <FileSpreadsheet className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <h2 className="text-sm font-extrabold text-slate-900">
                      Riwayat Pengajuan Hibah ({applicant.riwayat.length})
                    </h2>
                    <p className="text-[11px] text-slate-500">
                      Daftar proposal bantuan hibah yang pernah diajukan
                    </p>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {applicant.riwayat.length === 0 ? (
                  <div className="p-10 text-center text-xs text-slate-500">
                    Pemohon belum pernah mengajukan proposal hibah.
                  </div>
                ) : (
                  applicant.riwayat.map((prop) => {
                    const meta = SUBMISSION_STATUS_META[prop.status];

                    return (
                      <div
                        key={prop.id}
                        className="p-5 hover:bg-slate-50/60 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                      >
                        <div className="space-y-1.5 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-extrabold text-app-primary font-mono">
                              {prop.nomor}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-bold ${meta.badgeClass}`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${meta.dotClass}`}
                              />
                              {meta.label}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-semibold">
                              TA {prop.tahun}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[10.5px] text-slate-400">
                              <Calendar className="w-3 h-3" />
                              {prop.tanggal}
                            </span>
                          </div>

                          <h3 className="text-sm font-extrabold text-slate-900 leading-snug">
                            {prop.kegiatan}
                          </h3>

                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-600">
                            <span>
                              Bidang:{" "}
                              <strong className="text-slate-800">
                                {prop.bidang}
                              </strong>
                            </span>
                            <span>
                              Usulan:{" "}
                              <strong className="text-app-primary">
                                {prop.dana}
                              </strong>
                            </span>
                          </div>

                          {prop.catatan && (
                            <div className="flex items-start gap-1.5 pt-1 text-[11px] text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                              <ShieldCheck className="w-3.5 h-3.5 text-app-primary shrink-0 mt-0.5" />
                              <span>{prop.catatan}</span>
                            </div>
                          )}
                        </div>

                        <div className="shrink-0 self-end sm:self-center">
                          <Link
                            href={`/dashboard/admin/data-pengajuan/${prop.id}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-app-primary hover:bg-app-primary-800 text-white text-xs font-bold transition-colors shadow-2xs"
                          >
                            <span>Detail Proposal</span>
                            <ExternalLink className="w-3.5 h-3.5 text-app-secondary" />
                          </Link>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
