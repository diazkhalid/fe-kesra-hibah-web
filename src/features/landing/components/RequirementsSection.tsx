"use client";

import React from "react";
import Link from "next/link";
import {
  FileCheck2,
  FileText,
  ArrowUpRight,
  CheckCircle2,
  FileType2,
  HardDrive,
  ScanLine,
  AlertCircle,
} from "lucide-react";

interface RequirementDoc {
  number: string;
  title: string;
  description: string;
  format: string;
  isMandatory: boolean;
}

const REQUIREMENT_DOCS: RequirementDoc[] = [
  {
    number: "01",
    title: "Surat Permohonan Bantuan Hibah",
    description:
      "Ditujukan kepada Bupati Sumbawa c.q. Kepala Bagian Kesejahteraan Rakyat, ditandatangani ketua dan sekretaris serta berstempel resmi.",
    format: "PDF",
    isMandatory: true,
  },
  {
    number: "02",
    title: "Proposal Kegiatan & Rencana Anggaran Biaya (RAB)",
    description:
      "Memuat latar belakang, maksud dan tujuan, susunan kepengurusan, serta rincian kebutuhan anggaran secara jelas dan wajar.",
    format: "PDF",
    isMandatory: true,
  },
  {
    number: "03",
    title: "Akta Notaris / SK Pendirian & Pengesahan Lembaga",
    description:
      "Dokumen legalitas badan hukum atau surat keterangan terdaftar (SKT) dari instansi berwenang yang masih berlaku.",
    format: "PDF",
    isMandatory: true,
  },
  {
    number: "04",
    title: "Surat Keterangan Domisili Lembaga",
    description:
      "Diterbitkan oleh Kepala Desa atau Lurah setempat yang menerangkan keberadaan sekretariat/lokasi kegiatan di wilayah Kabupaten Sumbawa.",
    format: "PDF",
    isMandatory: true,
  },
  {
    number: "05",
    title: "Fotokopi KTP Pengurus Inti (Ketua, Sekretaris, Bendahara)",
    description:
      "Identitas diri pengurus aktif yang tercantum di dalam surat keputusan kepengurusan lembaga.",
    format: "PDF / JPG",
    isMandatory: true,
  },
  {
    number: "06",
    title: "Buku Rekening Bank Aktif atas Nama Lembaga",
    description:
      "Halaman depan buku tabungan yang menampilkan nomor rekening dan nama resmi lembaga/organisasi (bukan rekening pribadi).",
    format: "PDF / JPG",
    isMandatory: true,
  },
];

export default function RequirementsSection() {
  return (
    <section
      id="persyaratan"
      className="py-12 sm:py-16 bg-slate-50/80 border-t border-slate-200/70"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* KOLOM KIRI (5 KOLOM): Judul, Deskripsi, Spesifikasi Format File & CTA */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-app-primary-50 border border-app-primary-100 text-app-primary text-[10.5px] font-semibold">
              <FileCheck2 className="w-3.5 h-3.5 text-app-secondary-600" />
              <span>Kelengkapan Administrasi</span>
            </div>

            {/* Judul & Deskripsi Singkat */}
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Persyaratan Pengajuan
              </h2>
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                Pastikan seluruh dokumen administrasi dan proposal telah
                disiapkan dalam format digital sebelum mengisi formulir agar
                proses verifikasi berjalan lancar.
              </p>
            </div>

            {/* Panel Format File yang Diterima */}
            <div className="rounded-2xl bg-gradient-to-br from-app-primary-950 via-app-primary-900 to-app-primary p-4 sm:p-5 text-white shadow-md space-y-3.5">
              <div className="flex items-center justify-between border-b border-white/15 pb-2.5">
                <span className="text-xs font-bold text-white">
                  Format File yang Diterima
                </span>
                <span className="px-2 py-0.5 rounded-full bg-app-secondary text-app-primary-950 text-[9.5px] font-extrabold">
                  Ketentuan Unggah
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-white/10 border border-white/15 p-2.5">
                  <FileType2 className="w-4 h-4 text-app-secondary mx-auto mb-1" />
                  <p className="text-[11px] font-extrabold text-white">
                    PDF / JPG
                  </p>
                  <p className="text-[9.5px] text-app-primary-200">
                    Jenis Berkas
                  </p>
                </div>

                <div className="rounded-xl bg-white/10 border border-white/15 p-2.5">
                  <HardDrive className="w-4 h-4 text-sky-300 mx-auto mb-1" />
                  <p className="text-[11px] font-extrabold text-white">
                    Maks. 5 MB
                  </p>
                  <p className="text-[9.5px] text-app-primary-200">
                    Per Dokumen
                  </p>
                </div>

                <div className="rounded-xl bg-white/10 border border-white/15 p-2.5">
                  <ScanLine className="w-4 h-4 text-emerald-300 mx-auto mb-1" />
                  <p className="text-[11px] font-extrabold text-white">
                    Scan Jelas
                  </p>
                  <p className="text-[9.5px] text-app-primary-200">
                    Asli / Legalisir
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-0.5 text-[10.5px] text-app-primary-100 leading-relaxed">
                <AlertCircle className="w-3.5 h-3.5 text-app-secondary shrink-0 mt-0.5" />
                <span>
                  Dokumen hasil pindai (scan) harus terbaca utuh, tidak
                  terpotong, dan sesuai dengan dokumen fisik asli.
                </span>
              </div>
            </div>

            {/* Tombol Lihat Persyaratan Lengkap */}
            <div className="pt-1">
              <Link
                href="/persyaratan"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-app-primary-950 bg-gradient-to-r from-app-secondary to-app-secondary-400 hover:from-app-secondary-400 hover:to-app-secondary-300 shadow-sm transition-all duration-200 group"
              >
                <span>Lihat Persyaratan Lengkap</span>
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-app-primary text-white transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                </span>
              </Link>
            </div>
          </div>

          {/* KOLOM KANAN (7 KOLOM): Daftar Dokumen Persyaratan (Structured Checklist) */}
          <div className="lg:col-span-7 rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
            {/* Header Daftar */}
            <div className="px-4 sm:px-5 py-3.5 bg-slate-50/90 border-b border-slate-200/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-app-primary" />
                <span className="text-xs font-bold text-slate-800">
                  Daftar Dokumen Persyaratan Utama
                </span>
              </div>
              <span className="text-[10.5px] font-semibold text-app-primary bg-app-primary-50 px-2.5 py-0.5 rounded-full">
                {REQUIREMENT_DOCS.length} Dokumen Wajib
              </span>
            </div>

            {/* Baris Item Dokumen */}
            <ul className="divide-y divide-slate-100">
              {REQUIREMENT_DOCS.map((doc) => (
                <li
                  key={doc.number}
                  className="group px-4 sm:px-5 py-3.5 hover:bg-app-primary-50/35 transition-colors duration-150"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {/* Nomor Urut */}
                      <span className="mt-0.5 flex items-center justify-center w-6 h-6 rounded-lg bg-app-primary-50 text-app-primary group-hover:bg-app-primary group-hover:text-white text-[10.5px] font-extrabold shrink-0 transition-colors">
                        {doc.number}
                      </span>

                      {/* Judul & Keterangan Dokumen */}
                      <div className="space-y-0.5">
                        <h3 className="text-xs font-bold text-slate-800 group-hover:text-app-primary transition-colors">
                          {doc.title}
                        </h3>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {doc.description}
                        </p>
                      </div>
                    </div>

                    {/* Badge Format & Wajib */}
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[9.5px] font-bold">
                        {doc.format}
                      </span>
                      {doc.isMandatory && (
                        <span className="inline-flex items-center gap-0.5 text-[9.5px] font-semibold text-emerald-600">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Wajib
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
