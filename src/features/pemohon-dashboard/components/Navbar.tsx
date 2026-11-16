"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Landmark,
  Bell,
  ChevronDown,
  UserCircle2,
  LogOut,
  CheckCircle2,
  Clock,
  FileText,
  Loader2,
  ExternalLink,
} from "lucide-react";

interface NotificationPreview {
  id: string;
  title: string;
  description: string;
  time: string;
  isUnread: boolean;
  type: "success" | "warning" | "info";
}

interface PemohonNavbarProps {
  userName?: string;
  organizationName?: string;
  email?: string;
  avatarUrl?: string | null;
  unreadNotifications?: number;
}

const SAMPLE_NOTIFICATIONS: NotificationPreview[] = [
  {
    id: "1",
    title: "Berkas Proposal Diterima",
    description:
      "Proposal Bantuan Sarana Ibadah telah masuk antrean verifikasi.",
    time: "15 menit lalu",
    isUnread: true,
    type: "info",
  },
  {
    id: "2",
    title: "Verifikasi Administrasi Selesai",
    description:
      "Dokumen legalitas lembaga dinyatakan lengkap oleh Admin Kesra.",
    time: "2 jam lalu",
    isUnread: true,
    type: "success",
  },
  {
    id: "3",
    title: "Pengingat Kelengkapan RAB",
    description: "Pastikan rincian anggaran telah ditandatangani pengurus.",
    time: "1 hari lalu",
    isUnread: false,
    type: "warning",
  },
];

export default function PemohonNavbar({
  userName = "Ahmad Fauzi",
  organizationName = "Yayasan Nurul Iman Sumbawa",
  email = "ahmad.fauzi@nuruliman.or.id",
  avatarUrl = null,
  unreadNotifications = 2,
}: PemohonNavbarProps) {
  const router = useRouter();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  // Tutup dropdown saat klik di luar area menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setIsNotifOpen(false);
      }
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setIsAccountOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      // Hubungkan dengan endpoint logout / signOut() Anda
      await new Promise((resolve) => setTimeout(resolve, 600));
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const userInitials = userName
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-end gap-4">
        {/* KANAN: Ikon Notifikasi, Foto Profil, Nama Pengguna & Dropdown Akun */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 1. DROPDOWN NOTIFIKASI */}
          <div ref={notifRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setIsNotifOpen((prev) => !prev);
                setIsAccountOpen(false);
              }}
              aria-label="Notifikasi"
              aria-expanded={isNotifOpen}
              className={`relative flex items-center justify-center w-9.5 h-9.5 rounded-xl border transition-all duration-150 cursor-pointer ${
                isNotifOpen
                  ? "bg-app-primary-50 border-app-primary-200 text-app-primary"
                  : "bg-slate-50/80 hover:bg-slate-100 border-slate-200/80 text-slate-600 hover:text-app-primary"
              }`}
            >
              <Bell className="w-4 h-4" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[9.5px] font-extrabold ring-2 ring-white">
                  {unreadNotifications}
                </span>
              )}
            </button>

            {/* Popover Notifikasi */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-88 rounded-2xl bg-white shadow-xl shadow-slate-900/10 border border-slate-200/80 overflow-hidden z-50">
                <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-800">
                      Notifikasi
                    </span>
                    {unreadNotifications > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-app-primary-100 text-app-primary text-[9.5px] font-bold">
                        {unreadNotifications} Baru
                      </span>
                    )}
                  </div>
                  <Link
                    href="/dashboard/pemohon/notifikasi"
                    onClick={() => setIsNotifOpen(false)}
                    className="text-[10.5px] font-semibold text-app-primary hover:underline underline-offset-4"
                  >
                    Lihat Semua
                  </Link>
                </div>

                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  {SAMPLE_NOTIFICATIONS.map((notif) => (
                    <Link
                      key={notif.id}
                      href="/dashboard/pemohon/notifikasi"
                      onClick={() => setIsNotifOpen(false)}
                      className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors ${
                        notif.isUnread ? "bg-app-primary-50/30" : ""
                      }`}
                    >
                      <div
                        className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          notif.type === "success"
                            ? "bg-emerald-50 text-emerald-600"
                            : notif.type === "warning"
                              ? "bg-app-secondary-50 text-app-secondary-600"
                              : "bg-sky-50 text-sky-600"
                        }`}
                      >
                        {notif.type === "success" ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : notif.type === "warning" ? (
                          <Clock className="w-3.5 h-3.5" />
                        ) : (
                          <FileText className="w-3.5 h-3.5" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1 space-y-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[11.5px] font-bold text-slate-800 truncate">
                            {notif.title}
                          </p>
                          {notif.isUnread && (
                            <span className="w-1.5 h-1.5 rounded-full bg-app-primary shrink-0" />
                          )}
                        </div>
                        <p className="text-[10.5px] text-slate-500 line-clamp-2 leading-snug">
                          {notif.description}
                        </p>
                        <p className="text-[9.5px] font-medium text-slate-400 pt-0.5">
                          {notif.time}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="p-2.5 bg-slate-50/80 border-t border-slate-100">
                  <Link
                    href="/dashboard/pemohon/notifikasi"
                    onClick={() => setIsNotifOpen(false)}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-[11px] font-bold text-app-primary hover:bg-app-primary-50 transition-colors"
                  >
                    <span>Buka Pusat Notifikasi</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Pemisah Vertikal */}
          <div className="h-6 w-px bg-slate-200/80" />

          {/* 2. FOTO PROFIL, NAMA PENGGUNA & DROPDOWN AKUN */}
          <div ref={accountRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setIsAccountOpen((prev) => !prev);
                setIsNotifOpen(false);
              }}
              aria-expanded={isAccountOpen}
              aria-label="Menu Akun Pengguna"
              className={`flex items-center gap-2.5 rounded-full pl-1.5 pr-3 py-1 border transition-all duration-150 cursor-pointer ${
                isAccountOpen
                  ? "bg-app-primary-50/70 border-app-primary-200"
                  : "bg-slate-50/70 hover:bg-slate-100/80 border-slate-200/80"
              }`}
            >
              {/* Foto Profil / Avatar */}
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-app-primary to-app-primary-700 text-white flex items-center justify-center shrink-0 ring-2 ring-white shadow-2xs">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={userName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-[11px] font-extrabold text-app-secondary-200">
                    {userInitials}
                  </span>
                )}
              </div>

              {/* Nama Pengguna & Peran */}
              <div className="hidden sm:flex flex-col text-left max-w-[150px]">
                <span className="text-xs font-bold text-slate-800 truncate leading-tight">
                  {userName}
                </span>
                <span className="text-[10px] font-medium text-slate-500 truncate leading-tight mt-0.5">
                  Pemohon Hibah
                </span>
              </div>

              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  isAccountOpen ? "rotate-180 text-app-primary" : ""
                }`}
              />
            </button>

            {/* Menu Dropdown Akun */}
            {isAccountOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white shadow-xl shadow-slate-900/10 border border-slate-200/80 overflow-hidden z-50">
                {/* Info Akun di Atas Dropdown */}
                <div className="px-4 py-3.5 bg-gradient-to-br from-app-primary-950 via-app-primary-900 to-app-primary text-white">
                  <p className="text-xs font-extrabold text-white truncate">
                    {userName}
                  </p>
                  <p className="text-[10.5px] font-medium text-app-secondary-300 truncate mt-0.5">
                    {organizationName}
                  </p>
                  <p className="text-[10px] text-app-primary-200 truncate mt-1">
                    {email}
                  </p>
                </div>

                {/* Daftar Aksi Akun */}
                <div className="p-1.5 space-y-0.5">
                  <Link
                    href="/dashboard/pemohon/profil"
                    onClick={() => setIsAccountOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-app-primary-50 hover:text-app-primary transition-colors"
                  >
                    <UserCircle2 className="w-4 h-4 text-app-primary" />
                    <span>Profil Saya</span>
                  </Link>
                </div>

                {/* Tombol Logout */}
                <div className="p-1.5 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-60 transition-colors cursor-pointer"
                  >
                    {isLoggingOut ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <LogOut className="w-4 h-4" />
                    )}
                    <span>{isLoggingOut ? "Keluar..." : "Logout"}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
