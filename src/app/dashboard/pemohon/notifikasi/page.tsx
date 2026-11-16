"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  Trash2,
  CheckCircle2,
  XCircle,
  Hourglass,
  Megaphone,
  Search,
  ChevronRight,
  ArrowUpRight,
  Circle,
  BellOff,
  FileText,
  X,
} from "lucide-react";

type NotificationCategory = "terverifikasi" | "menunggu" | "ditolak" | "sistem";

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  submissionId?: string;
  submissionNumber?: string;
  timestamp: string;
  dateGroup: "Hari Ini" | "Kemarin" | "Minggu Ini" | "Sebelumnya";
  isUnread: boolean;
}

const CATEGORY_META: Record<
  NotificationCategory,
  {
    label: string;
    icon: React.ElementType;
    iconBgClass: string;
    badgeClass: string;
  }
> = {
  terverifikasi: {
    label: "Terverifikasi",
    icon: CheckCircle2,
    iconBgClass: "bg-emerald-50 text-emerald-600 border-emerald-200/80",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  menunggu: {
    label: "Menunggu",
    icon: Hourglass,
    iconBgClass: "bg-sky-50 text-sky-600 border-sky-200/80",
    badgeClass: "bg-sky-50 text-sky-700 border-sky-200",
  },
  ditolak: {
    label: "Ditolak",
    icon: XCircle,
    iconBgClass: "bg-red-50 text-red-600 border-red-200/80",
    badgeClass: "bg-red-50 text-red-700 border-red-200",
  },
  sistem: {
    label: "Info Layanan",
    icon: Megaphone,
    iconBgClass: "bg-amber-50 text-amber-600 border-amber-200/80",
    badgeClass: "bg-amber-50 text-amber-800 border-amber-200",
  },
};

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-01",
    title: "Pengajuan Hibah Berhasil Dikirim",
    message:
      "Permohonan bantuan hibah untuk kegiatan Bantuan Pendidikan & Rehabilitasi Ruang Belajar TPQ Al-Hikmah telah masuk ke sistem dan berstatus Menunggu verifikasi Admin Kesra.",
    category: "menunggu",
    submissionId: "hb-2026-001",
    submissionNumber: "HIB-2026-001",
    timestamp: "16 Nov 2026 • 10:15 WITA",
    dateGroup: "Hari Ini",
    isUnread: true,
  },
  {
    id: "notif-02",
    title: "Hasil Verifikasi Administrasi: Terverifikasi",
    message:
      "Selamat! Seluruh dokumen dan data pengajuan untuk Pengadaan Perlengkapan Seni Islami dan Pembinaan Remaja Masjid dinyatakan lengkap dan berstatus Terverifikasi.",
    category: "terverifikasi",
    submissionId: "hb-2026-004",
    submissionNumber: "HIB-2026-004",
    timestamp: "16 Nov 2026 • 08:30 WITA",
    dateGroup: "Hari Ini",
    isUnread: true,
  },
  {
    id: "notif-03",
    title: "Jadwal Batas Akhir Pengajuan Hibah TA 2027",
    message:
      "Bagian Kesejahteraan Rakyat Setda Kabupaten Sumbawa menginformasikan bahwa pengunggahan proposal hibah Tahun Anggaran 2027 ditutup pada 30 November 2026 pukul 16:00 WITA.",
    category: "sistem",
    timestamp: "15 Nov 2026 • 14:20 WITA",
    dateGroup: "Kemarin",
    isUnread: true,
  },
  {
    id: "notif-04",
    title: "Berkas Pengajuan Diterima Sistem",
    message:
      "Pengajuan Bantuan Sarana Ibadah dan Pengadaan Sistem Tata Suara Masjid berhasil diregistrasi dengan nomor HIB-2026-002 dan sedang menunggu pemeriksaan.",
    category: "menunggu",
    submissionId: "hb-2026-002",
    submissionNumber: "HIB-2026-002",
    timestamp: "08 Nov 2026 • 11:05 WITA",
    dateGroup: "Minggu Ini",
    isUnread: false,
  },
  {
    id: "notif-05",
    title: "Status Pengajuan: Ditolak",
    message:
      "Permohonan bantuan hibah HIB-2025-009 dinyatakan Ditolak karena masa terdaftar organisasi belum memenuhi ketentuan minimal 3 tahun berturut-turut.",
    category: "ditolak",
    submissionId: "hb-2025-009",
    submissionNumber: "HIB-2025-009",
    timestamp: "11 Jul 2025 • 15:40 WITA",
    dateGroup: "Sebelumnya",
    isUnread: false,
  },
];

type FilterTab = "all" | "unread" | "verifikasi" | "sistem";

export default function NotifikasiPemohonPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS,
  );
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const unreadCount = useMemo(
    () => notifications.filter((n) => n.isUnread).length,
    [notifications],
  );

  const readCount = useMemo(
    () => notifications.filter((n) => !n.isUnread).length,
    [notifications],
  );

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.message.toLowerCase().includes(q) ||
        (item.submissionNumber &&
          item.submissionNumber.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (activeTab === "unread") return item.isUnread;
      if (activeTab === "verifikasi")
        return (
          item.category === "terverifikasi" ||
          item.category === "menunggu" ||
          item.category === "ditolak"
        );
      if (activeTab === "sistem") return item.category === "sistem";
      return true;
    });
  }, [notifications, activeTab, searchQuery]);

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isUnread: !item.isUnread } : item,
      ),
    );
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isUnread: false } : item,
      ),
    );
  };

  const handleMarkAllRead = () => {
    if (unreadCount === 0) return;
    setNotifications((prev) =>
      prev.map((item) => ({ ...item, isUnread: false })),
    );
    showToast("Semua notifikasi telah ditandai sudah dibaca.");
  };

  const handleDeleteOne = (id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
    showToast("Notifikasi dihapus.");
  };

  const handleClearRead = () => {
    if (readCount === 0) return;
    setNotifications((prev) => prev.filter((item) => item.isUnread));
    showToast("Seluruh notifikasi yang sudah dibaca berhasil dibersihkan.");
  };

  return (
    <div className="space-y-6 pb-10">
      {/* =====================================================================
          1. HEADER HALAMAN
      ====================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500"
          >
            <Link
              href="/dashboard/pemohon"
              className="hover:text-app-primary transition-colors"
            >
              Dashboard
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-app-primary font-bold">Notifikasi</span>
          </nav>

          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Notifikasi
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-app-primary text-white text-[11px] font-extrabold">
                {unreadCount} Baru
              </span>
            )}
          </div>

          <p className="text-xs text-slate-500">
            Pembaruan status verifikasi berkas dan informasi resmi dari Bagian
            Kesejahteraan Rakyat Kab. Sumbawa.
          </p>
        </div>

        {/* Tombol Aksi Massal */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-app-primary-50 hover:border-app-primary-200 text-slate-700 hover:text-app-primary disabled:opacity-45 text-xs font-bold transition-colors cursor-pointer disabled:cursor-not-allowed"
          >
            <CheckCheck className="w-3.5 h-3.5 text-app-primary" />
            <span>Tandai Semua Dibaca</span>
          </button>

          {readCount > 0 && (
            <button
              type="button"
              onClick={handleClearRead}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-red-50 hover:border-red-200 text-slate-600 hover:text-red-600 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Hapus yang Dibaca</span>
            </button>
          )}
        </div>
      </div>

      {/* Notifikasi Toast */}
      {toastMessage && (
        <div className="flex items-center justify-between gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-xs font-semibold text-emerald-800">
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
          2. FILTER TABS & PENCARIAN
      ====================================================================== */}
      <div className="rounded-2xl bg-white border border-slate-200/80 p-3.5 sm:p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Tab Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer ${
              activeTab === "all"
                ? "bg-app-primary text-white shadow-2xs"
                : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            Semua ({notifications.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("unread")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer ${
              activeTab === "unread"
                ? "bg-app-primary text-white shadow-2xs"
                : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            Belum Dibaca ({unreadCount})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("verifikasi")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer ${
              activeTab === "verifikasi"
                ? "bg-app-primary text-white shadow-2xs"
                : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            Status Pengajuan
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("sistem")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors shrink-0 cursor-pointer ${
              activeTab === "sistem"
                ? "bg-app-primary text-white shadow-2xs"
                : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70"
            }`}
          >
            Info Layanan
          </button>
        </div>

        {/* Kolom Pencarian */}
        <div className="relative w-full md:w-72">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="w-3.5 h-3.5" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari notifikasi atau no. pengajuan..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15"
          />
        </div>
      </div>

      {/* =====================================================================
          3. DAFTAR NOTIFIKASI
      ====================================================================== */}
      {filteredNotifications.length === 0 ? (
        <section className="rounded-3xl bg-white border border-slate-200/80 p-10 sm:p-14 text-center shadow-2xs">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-3.5">
            <BellOff className="w-7 h-7 stroke-[1.8]" />
          </div>
          <h2 className="text-sm sm:text-base font-extrabold text-slate-900">
            Tidak Ada Notifikasi
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 leading-relaxed">
            {searchQuery || activeTab !== "all"
              ? "Tidak ditemukan notifikasi yang sesuai dengan filter atau kata kunci pencarian Anda."
              : "Belum ada pemberitahuan baru untuk akun Anda saat ini."}
          </p>
          {(searchQuery || activeTab !== "all") && (
            <button
              type="button"
              onClick={() => {
                setActiveTab("all");
                setSearchQuery("");
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-app-primary-50 text-app-primary text-xs font-bold hover:bg-app-primary hover:text-white transition-colors cursor-pointer"
            >
              Tampilkan Semua Notifikasi
            </button>
          )}
        </section>
      ) : (
        <section aria-label="Daftar Notifikasi" className="space-y-3">
          {filteredNotifications.map((item) => {
            const meta = CATEGORY_META[item.category];
            const IconComponent = meta.icon;

            return (
              <article
                key={item.id}
                className={`group relative rounded-2xl border p-4 sm:p-5 transition-all duration-150 ${
                  item.isUnread
                    ? "bg-gradient-to-r from-app-primary-50/45 via-white to-white border-app-primary-200/90 shadow-xs"
                    : "bg-white border-slate-200/80 hover:border-slate-300"
                }`}
              >
                {/* Indikator Garis Samping Kiri untuk Belum Dibaca */}
                {item.isUnread && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-4 bottom-4 w-1 rounded-r-full bg-app-primary"
                  />
                )}

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Kiri: Ikon + Isi Notifikasi */}
                  <div className="flex items-start gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 mt-0.5 ${meta.iconBgClass}`}
                    >
                      <IconComponent className="w-4.5 h-4.5 stroke-[2.2]" />
                    </div>

                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full border text-[9.5px] font-bold ${meta.badgeClass}`}
                        >
                          {meta.label}
                        </span>

                        {item.submissionNumber && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-extrabold">
                            <FileText className="w-2.5 h-2.5 text-app-primary" />
                            {item.submissionNumber}
                          </span>
                        )}

                        <span className="text-[10.5px] text-slate-400">
                          {item.timestamp}
                        </span>

                        {item.isUnread && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-app-primary">
                            <Circle className="w-2 h-2 fill-app-primary text-app-primary" />
                            Baru
                          </span>
                        )}
                      </div>

                      <h2 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
                        {item.title}
                      </h2>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.message}
                      </p>

                      {/* Tautan Aksi ke Detail Pengajuan */}
                      {item.submissionId && (
                        <div className="pt-1">
                          <Link
                            href={`/dashboard/pemohon/riwayat-pengajuan/${item.submissionId}`}
                            onClick={() => handleMarkAsRead(item.id)}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-app-primary hover:text-app-primary-800 underline underline-offset-4 transition-colors"
                          >
                            <span>Lihat Detail Pengajuan</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Kanan: Tombol Tandai Dibaca & Hapus */}
                  <div className="flex items-center gap-1.5 self-end sm:self-start shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggleRead(item.id)}
                      title={
                        item.isUnread
                          ? "Tandai Sudah Dibaca"
                          : "Tandai Belum Dibaca"
                      }
                      className={`px-2.5 py-1.5 rounded-xl border text-[10.5px] font-bold transition-colors cursor-pointer ${
                        item.isUnread
                          ? "border-app-primary-200 bg-app-primary-50/70 hover:bg-app-primary text-app-primary hover:text-white"
                          : "border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.isUnread ? "Tandai Dibaca" : "Belum Dibaca"}
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteOne(item.id)}
                      aria-label="Hapus Notifikasi"
                      title="Hapus Notifikasi"
                      className="p-1.5 rounded-xl border border-slate-200 bg-white hover:bg-red-50 hover:border-red-200 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </div>
  );
}
