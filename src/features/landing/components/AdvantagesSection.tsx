"use client";

import React from "react";
import { Globe, Activity, FolderLock, Layers, Award } from "lucide-react";

interface AdvantageItem {
  number: string;
  title: string;
  description: string;
  icon: React.ElementType;
  cardBg: string;
  borderColor: string;
  iconBg: string;
  iconColor: string;
  accentBar: string;
}

const ADVANTAGES_DATA: AdvantageItem[] = [
  {
    number: "01",
    title: "Pengajuan Online",
    description:
      "Pengajuan proposal dapat dilakukan tanpa harus datang untuk menyerahkan dokumen secara langsung.",
    icon: Globe,
    cardBg: "bg-gradient-to-b from-app-primary-50/70 to-white",
    borderColor: "border-app-primary-200/80 hover:border-app-primary-400",
    iconBg: "bg-app-primary text-white shadow-sm shadow-app-primary/20",
    iconColor: "text-white",
    accentBar: "from-app-primary to-app-primary-400",
  },
  {
    number: "02",
    title: "Transparansi Status",
    description: "Pemohon dapat memantau perkembangan pengajuan.",
    icon: Activity,
    cardBg: "bg-gradient-to-b from-app-secondary-50/80 to-white",
    borderColor: "border-app-secondary-200/80 hover:border-app-secondary-400",
    iconBg:
      "bg-app-secondary text-app-primary-950 shadow-sm shadow-app-secondary/25",
    iconColor: "text-app-primary-950",
    accentBar: "from-app-secondary to-amber-300",
  },
  {
    number: "03",
    title: "Dokumen Digital",
    description: "Dokumen pengajuan tersimpan secara digital.",
    icon: FolderLock,
    cardBg: "bg-gradient-to-b from-sky-50/80 to-white",
    borderColor: "border-sky-200/80 hover:border-sky-400",
    iconBg: "bg-sky-600 text-white shadow-sm shadow-sky-600/20",
    iconColor: "text-white",
    accentBar: "from-sky-600 to-sky-400",
  },
  {
    number: "04",
    title: "Proses Terstruktur",
    description: "Pengajuan dan hasil verifikasi tercatat dalam satu sistem.",
    icon: Layers,
    cardBg: "bg-gradient-to-b from-emerald-50/80 to-white",
    borderColor: "border-emerald-200/80 hover:border-emerald-400",
    iconBg: "bg-emerald-600 text-white shadow-sm shadow-emerald-600/20",
    iconColor: "text-white",
    accentBar: "from-emerald-600 to-emerald-400",
  },
];

export default function AdvantagesSection() {
  return (
    <section
      id="keunggulan-layanan"
      className="relative py-12 sm:py-16 bg-white border-t border-slate-200/70 overflow-hidden"
    >
      {/* Aksen Cahaya Latar Halus */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-1/4 w-72 h-72 rounded-full bg-app-primary-100/40 blur-3xl -z-10"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-1/4 w-72 h-72 rounded-full bg-app-secondary-100/40 blur-3xl -z-10"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* HEADER SECTION (SIMETRIS TENGAH) */}
        <div className="max-w-xl mx-auto text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-app-primary-50 border border-app-primary-100 text-app-primary text-[10.5px] font-semibold">
            <Award className="w-3.5 h-3.5 text-app-secondary-600" />
            <span>Nilai Tambah Sistem Digital</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Keunggulan Layanan
          </h2>

          <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
            Kemudahan, keterbukaan informasi, dan ketertiban administrasi dalam
            satu portal layanan pengajuan hibah Kabupaten Sumbawa.
          </p>
        </div>

        {/* GRID 4 CARD SIMETRIS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {ADVANTAGES_DATA.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.number}
                className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg flex flex-col justify-between ${item.cardBg} ${item.borderColor}`}
              >
                {/* Garis Aksen Atas */}
                <div
                  className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.accentBar}`}
                />

                {/* Watermark Nomor */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-3 right-2.5 text-5xl font-black text-slate-900/[0.04] select-none"
                >
                  {item.number}
                </span>

                <div className="relative space-y-3.5">
                  {/* Baris Atas Card: Icon & Nomor Pill */}
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105 ${item.iconBg}`}
                    >
                      <IconComponent
                        className={`w-4.5 h-4.5 ${item.iconColor}`}
                      />
                    </div>

                    <span className="text-[10.5px] font-extrabold text-slate-400 group-hover:text-slate-700 transition-colors">
                      #{item.number}
                    </span>
                  </div>

                  {/* Judul & Deskripsi */}
                  <div className="space-y-1.5">
                    <h3 className="text-xs sm:text-[13.5px] font-extrabold text-slate-900 group-hover:text-app-primary transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
