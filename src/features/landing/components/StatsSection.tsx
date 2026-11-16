"use client";

import React from "react";
import {
  FolderKanban,
  Inbox,
  FileSearch,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

interface StatItem {
  id: string;
  label: string;
  value: string;
  description: string;
  badgeText: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  badgeBg: string;
  badgeColor: string;
  accentBorder: string;
}

const STATS_DATA: StatItem[] = [
  {
    id: "total",
    label: "Total Pengajuan",
    value: "428",
    description: "Proposal terdaftar tahun anggaran",
    badgeText: "+18% Tahun Ini",
    icon: FolderKanban,
    iconBg: "bg-app-primary-50",
    iconColor: "text-app-primary",
    badgeBg: "bg-app-primary-50",
    badgeColor: "text-app-primary",
    accentBorder: "hover:border-app-primary-300",
  },
  {
    id: "masuk",
    label: "Pengajuan Masuk",
    value: "64",
    description: "Menunggu pemeriksaan awal berkas",
    badgeText: "Terbaru",
    icon: Inbox,
    iconBg: "bg-sky-50",
    iconColor: "text-sky-600",
    badgeBg: "bg-sky-50",
    badgeColor: "text-sky-700",
    accentBorder: "hover:border-sky-300",
  },
  {
    id: "verifikasi",
    label: "Sedang Diverifikasi",
    value: "52",
    description: "Dalam peninjauan tim Bag. Kesra",
    badgeText: "Proses Aktif",
    icon: FileSearch,
    iconBg: "bg-app-secondary-50",
    iconColor: "text-app-secondary-600",
    badgeBg: "bg-app-secondary-50",
    badgeColor: "text-app-secondary-700",
    accentBorder: "hover:border-app-secondary-300",
  },
  {
    id: "selesai",
    label: "Selesai Diverifikasi",
    value: "312",
    description: "Berkas lengkap & telah ditetapkan",
    badgeText: "72.9% Selesai",
    icon: CheckCircle2,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    badgeBg: "bg-emerald-50",
    badgeColor: "text-emerald-700",
    accentBorder: "hover:border-emerald-300",
  },
];

export default function StatsSection() {
  return (
    <section
      aria-label="Statistik Layanan Pengajuan Hibah"
      className="relative z-10 -mt-8 sm:-mt-10 pb-12"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Ringkas di Atas Grid (Opsional, menjaga transparansi data) */}
        <div className="rounded-2xl bg-white p-4 sm:p-6 shadow-xl shadow-slate-900/5 border border-slate-200/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-5 border-b border-slate-100">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight">
                Statistik Layanan Pengajuan Hibah
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Ringkasan transparansi aktivitas pengelolaan proposal Bagian
                Kesejahteraan Rakyat
              </p>
            </div>

            <div className="inline-flex items-center gap-1.5 self-start sm:self-auto px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-[10px] font-medium text-slate-600">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Data Terkini • TA 2026</span>
            </div>
          </div>

          {/* Grid 4 Kartu Statistik */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {STATS_DATA.map((stat) => {
              const IconComponent = stat.icon;
              return (
                <div
                  key={stat.id}
                  className={`group relative rounded-xl bg-slate-50/60 hover:bg-white p-4 border border-slate-200/70 ${stat.accentBorder} transition-all duration-200 hover:shadow-md`}
                >
                  {/* Baris Atas: Icon & Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div
                      className={`w-9 h-9 rounded-lg ${stat.iconBg} ${stat.iconColor} flex items-center justify-center transition-transform duration-200 group-hover:scale-105`}
                    >
                      <IconComponent className="w-4.5 h-4.5" />
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9.5px] font-semibold ${stat.badgeBg} ${stat.badgeColor}`}
                    >
                      {stat.id === "total" && (
                        <TrendingUp className="w-2.5 h-2.5" />
                      )}
                      {stat.badgeText}
                    </span>
                  </div>

                  {/* Angka Utama & Label */}
                  <div>
                    <p className="text-2xl sm:text-[26px] font-extrabold text-slate-900 tracking-tight leading-none">
                      {stat.value}
                    </p>
                    <h3 className="text-xs font-bold text-slate-700 mt-1.5">
                      {stat.label}
                    </h3>
                    <p className="text-[10.5px] text-slate-500 mt-0.5 leading-snug">
                      {stat.description}
                    </p>
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
