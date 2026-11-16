"use client";

import React from "react";
import Link from "next/link";
import {
  Globe,
  FolderLock,
  Activity,
  ClipboardCheck,
  FileBarChart2,
  Target,
  Landmark,
  MapPin,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";

interface BenefitItem {
  number: string;
  title: string;
  description: string;
  tag: string;
  icon: React.ElementType;
  cardStyle: string;
  iconStyle: string;
  tagStyle: string;
}

const BENEFITS_DATA: BenefitItem[] = [
  {
    number: "01",
    title: "Pengajuan Secara Online",
    description:
      "Lembaga dan masyarakat dapat mengajukan proposal hibah dari mana saja tanpa perlu datang langsung ke kantor.",
    tag: "Akses 24/7",
    icon: Globe,
    cardStyle:
      "bg-gradient-to-br from-app-primary-50 via-white to-app-primary-50/40 border-app-primary-200/80",
    iconStyle: "bg-app-primary text-white shadow-sm shadow-app-primary/20",
    tagStyle: "bg-app-primary-100 text-app-primary-800",
  },
  {
    number: "02",
    title: "Dokumen Tersimpan Digital",
    description:
      "Seluruh berkas persyaratan dan proposal terarsip terpusat dalam format digital sehingga aman dari risiko hilang.",
    tag: "Arsip Terpadu",
    icon: FolderLock,
    cardStyle:
      "bg-gradient-to-br from-sky-50 via-white to-sky-50/40 border-sky-200/80",
    iconStyle: "bg-sky-600 text-white shadow-sm shadow-sky-600/20",
    tagStyle: "bg-sky-100 text-sky-800",
  },
  {
    number: "03",
    title: "Pemantauan Status Real-Time",
    description:
      "Memudahkan pemohon melacak setiap tahapan pemeriksaan berkas dan tindak lanjut pengajuan secara transparan.",
    tag: "Live Tracking",
    icon: Activity,
    cardStyle:
      "bg-gradient-to-br from-app-secondary-50 via-white to-app-secondary-50/40 border-app-secondary-200/80",
    iconStyle:
      "bg-app-secondary text-app-primary-950 shadow-sm shadow-app-secondary/25",
    tagStyle: "bg-app-secondary-100 text-app-secondary-800",
  },
  {
    number: "04",
    title: "Verifikasi Administrasi Cepat",
    description:
      "Mempermudah tim verifikator memeriksa kelengkapan dan keabsahan dokumen secara sistematis, terukur, dan akurat.",
    tag: "Efisiensi Kerja",
    icon: ClipboardCheck,
    cardStyle:
      "bg-gradient-to-br from-emerald-50 via-white to-emerald-50/40 border-emerald-200/80",
    iconStyle: "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20",
    tagStyle: "bg-emerald-100 text-emerald-800",
  },
  {
    number: "05",
    title: "Penyusunan Laporan Terintegrasi",
    description:
      "Memudahkan rekapitulasi data dan penyusunan laporan hasil verifikasi secara otomatis dan akuntabel.",
    tag: "Akuntabel",
    icon: FileBarChart2,
    cardStyle:
      "bg-gradient-to-br from-teal-50 via-white to-amber-50/40 border-teal-200/80",
    iconStyle: "bg-app-primary-800 text-app-secondary shadow-sm",
    tagStyle: "bg-teal-100 text-teal-800",
  },
];

export default function AboutServiceSection() {
  return (
    <section
      id="tentang-layanan"
      className="relative py-12 sm:py-16 bg-gradient-to-b from-white via-app-primary-50/40 to-white border-t border-slate-200/70 overflow-hidden"
    >
      {/* Aksen Cahaya Latar Halus */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -left-24 w-72 h-72 rounded-full bg-app-primary-200/35 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-10 -right-24 w-72 h-72 rounded-full bg-app-secondary-200/35 blur-3xl"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* BENTO BARIS 1: PROFIL LAYANAN & IDENTITAS PENGELOLA (SIMETRIS 6 : 6) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
          {/* Blok Kiri (6 Kolom): Judul, Deskripsi & Tujuan Layanan */}
          <div className="lg:col-span-6 rounded-2xl bg-white p-5 sm:p-6 border border-app-primary-200/70 shadow-sm flex flex-col justify-between space-y-5">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-app-primary text-white text-[10px] font-semibold shadow-2xs">
                <Sparkles className="w-3 h-3 text-app-secondary" />
                <span>Tentang Layanan</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
                Sistem Digitalisasi Pengajuan Hibah{" "}
                <span className="text-app-primary">Kabupaten Sumbawa</span>
              </h2>

              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                <span className="font-semibold text-slate-800">E-Hibah</span>{" "}
                merupakan portal layanan resmi Pemerintah Kabupaten Sumbawa
                untuk memfasilitasi pengajuan proposal bantuan hibah, verifikasi
                administrasi, dan pemantauan status secara daring dan terbuka.
              </p>
            </div>

            {/* Sub-blok Tujuan Layanan Berwarna */}
            <div className="rounded-xl bg-gradient-to-r from-app-secondary-50 to-amber-50/70 border border-app-secondary-200/80 p-3.5 sm:p-4 flex items-start gap-3">
              <div className="w-8.5 h-8.5 rounded-lg bg-app-secondary text-app-primary-950 flex items-center justify-center shrink-0 shadow-2xs">
                <Target className="w-4 h-4 stroke-[2.2]" />
              </div>
              <div className="space-y-0.5">
                <h3 className="text-xs font-bold text-slate-900">
                  Tujuan Utama Layanan
                </h3>
                <p className="text-[11px] text-slate-700 leading-relaxed">
                  Mewujudkan pengelolaan dana hibah daerah yang{" "}
                  <span className="font-semibold text-app-primary-900">
                    transparan, akuntabel, cepat, dan tepat sasaran
                  </span>{" "}
                  bagi lembaga keagamaan, sosial, pendidikan, dan
                  kemasyarakatan.
                </p>
              </div>
            </div>
          </div>

          {/* Blok Kanan (6 Kolom): Identitas Bagian Kesejahteraan Rakyat */}
          <div className="lg:col-span-6 relative overflow-hidden rounded-2xl bg-gradient-to-br from-app-primary-950 via-app-primary-900 to-app-primary p-5 sm:p-6 text-white shadow-md flex flex-col justify-between space-y-5">
            {/* Pola Dekoratif */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-12 w-44 h-44 rounded-full bg-app-secondary/20 blur-2xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff14_1px,transparent_1px)] [background-size:18px_18px] opacity-60"
            />

            <div className="relative space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[10px] font-semibold text-app-secondary-300">
                  <ShieldCheck className="w-3 h-3 text-app-secondary" />
                  <span>Identitas Pengelola Resmi</span>
                </span>
                <span className="text-[10px] font-bold text-app-primary-200">
                  PEMKAB SUMBAWA
                </span>
              </div>

              <div className="flex items-start gap-3 pt-1">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-app-secondary to-app-secondary-400 text-app-primary-950 flex items-center justify-center shrink-0 shadow-md">
                  <Landmark className="w-5 h-5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white leading-snug">
                    Bagian Kesejahteraan Rakyat
                  </h3>
                  <p className="text-xs font-medium text-app-secondary-200">
                    Sekretariat Daerah Kabupaten Sumbawa
                  </p>
                </div>
              </div>

              <p className="text-[11.5px] sm:text-xs text-app-primary-100 leading-relaxed">
                Bertanggung jawab menyelenggarakan fasilitasi administrasi,
                verifikasi kelengkapan berkas, peninjauan lapangan, serta
                pelaporan pertanggungjawaban penyaluran hibah daerah.
              </p>
            </div>

            {/* Footer Identitas + Aksi */}
            <div className="relative pt-3.5 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-1.5 text-[10.5px] text-app-primary-100">
                <MapPin className="w-3.5 h-3.5 text-app-secondary shrink-0" />
                <span>Jl. Garuda No. 1, Sumbawa Besar</span>
              </div>

              <Link
                href="/informasi"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-app-secondary-300 hover:text-app-secondary transition-colors"
              >
                <span>Detail Informasi</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* BENTO BARIS 2: 5 MANFAAT PENGGUNAAN APLIKASI (PENUH TANPA RUANG KOSONG) */}
        <div className="rounded-2xl bg-white p-4 sm:p-5 border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="w-2 h-5 rounded-full bg-gradient-to-b from-app-primary to-app-secondary" />
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-800">
                Manfaat Penggunaan Aplikasi E-Hibah
              </h3>
            </div>
            <p className="text-[10.5px] sm:text-[11px] text-slate-500">
              Terintegrasi untuk pemohon hibah dan tim verifikator Bagian Kesra
            </p>
          </div>

          {/* Grid 12 Kolom: 3 Kartu Atas (4+4+4) + 2 Kartu Bawah Lebar Penuh (6+6) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5">
            {BENEFITS_DATA.map((item, index) => {
              const IconComponent = item.icon;
              // 3 item pertama masing-masing 4 kolom (12), 2 item terakhir masing-masing 6 kolom (12) -> 100% penuh & simetris!
              const colSpanClass =
                index < 3 ? "md:col-span-4" : "md:col-span-6";

              return (
                <div
                  key={item.number}
                  className={`${colSpanClass} group relative overflow-hidden rounded-xl border p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${item.cardStyle}`}
                >
                  {/* Watermark Nomor Besar di Sudut Kanan Bawah */}
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -bottom-2 right-2 text-4xl font-black text-slate-900/[0.04] select-none"
                  >
                    {item.number}
                  </span>

                  <div className="relative space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <div
                        className={`w-8.5 h-8.5 rounded-lg flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${item.iconStyle}`}
                      >
                        <IconComponent className="w-4 h-4" />
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[9.5px] font-bold ${item.tagStyle}`}
                      >
                        {item.tag}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-800 group-hover:text-app-primary transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-slate-600 leading-relaxed mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
