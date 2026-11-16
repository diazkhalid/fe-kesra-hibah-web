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
  Settings,
  LogOut,
  FilePlus2,
  UserCheck,
  Clock,
  Loader2,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

interface AdminNotificationPreview {
  id: string;
  title: string;
  description: string;
  time: string;
  href: string;
  isUnread: boolean;
  type: "submission" | "user" | "reminder";
}

interface AdminNavbarProps {
  adminName?: string;
  adminRole?: string;
  adminEmail?: string;
  avatarUrl?: string | null;
  unreadNotifications?: number;
}

const ADMIN_SAMPLE_NOTIFICATIONS: AdminNotificationPreview[] = [
  {
    id: "adm-1",
    title: "Pengajuan Baru Masuk (HIB-2026-001)",
    description:
      "Yayasan Nurul Iman Sumbawa mengajukan permohonan hibah Rp 50.000.000.",
    time: "10 menit lalu",
    href: "/dashboard/admin/data-pengajuan",
    isUnread: true,
    type: "submission",
  },
  {
    id: "adm-2",
    title: "Pengajuan Baru Masuk (HIB-2026-002)",
    description:
      "Masjid Besar Al-Ikhlas Sumbawa mengunggah berkas proposal bantuan sarana.",
    time: "1 jam lalu",
    href: "/dashboard/admin/data-pengajuan",
    isUnread: true,
    type: "submission",
  },
  {
    id: "adm-3",
    title: "Pendaftaran Akun Pemohon Baru",
    description:
      "Lembaga Sosial Samawa Peduli telah melengkapi profil lembaga.",
    time: "3 jam lalu",
    href: "/dashboard/admin/data-pemohon",
    isUnread: false,
    type: "user",
  },
];

export default function AdminNavbar({
  adminName = "H. Muhammad Zainuddin, S.Sos.",
  adminRole = "Verifikator Bagian Kesra",
  adminEmail = "admin.kesra@sumbawakab.go.id",
  avatarUrl = null,
  unreadNotifications = 2,
}: AdminNavbarProps) {
  const router = useRouter();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

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

  const adminInitials = adminName
    .replace(/[^a-zA-Z\s]/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 h-16 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-end gap-4">
        {/* KANAN: Notifikasi, Profil Admin & Logout */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 1. IKON & DROPDOWN NOTIFIKASI */}
          <div ref={notifRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setIsNotifOpen((prev) => !prev);
                setIsAccountOpen(false);
              }}
              aria-label="Notifikasi Admin"
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

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-88 rounded-2xl bg-white shadow-xl shadow-slate-900/10 border border-slate-200/80 overflow-hidden z-50">
                <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-slate-800">
                      Notifikasi Verifikator
                    </span>
                    {unreadNotifications > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-app-primary-100 text-app-primary text-[9.5px] font-bold">
                        {unreadNotifications} Baru
                      </span>
                    )}
                  </div>
                  <Link
                    href="/dashboard/admin/data-pengajuan"
                    onClick={() => setIsNotifOpen(false)}
                    className="text-[10.5px] font-semibold text-app-primary hover:underline underline-offset-4"
                  >
                    Cek Antrean
                  </Link>
                </div>

                <div className="divide-y divide-slate-100 max-h-72 overflow-y-auto">
                  {ADMIN_SAMPLE_NOTIFICATIONS.map((notif) => (
                    <Link
                      key={notif.id}
                      href={notif.href}
                      onClick={() => setIsNotifOpen(false)}
                      className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors ${
                        notif.isUnread ? "bg-app-primary-50/30" : ""
                      }`}
                    >
                      <div
                        className={`mt-0.5 w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                          notif.type === "submission"
                            ? "bg-sky-50 text-sky-600"
                            : notif.type === "user"
                              ? "bg-emerald-50 text-emerald-600"
                              : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {notif.type === "submission" ? (
                          <FilePlus2 className="w-3.5 h-3.5" />
                        ) : notif.type === "user" ? (
                          <UserCheck className="w-3.5 h-3.5" />
                        ) : (
                          <Clock className="w-3.5 h-3.5" />
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
                    href="/dashboard/admin/data-pengajuan"
                    onClick={() => setIsNotifOpen(false)}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 rounded-xl text-[11px] font-bold text-app-primary hover:bg-app-primary-50 transition-colors"
                  >
                    <span>Lihat Semua Data Pengajuan</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="h-6 w-px bg-slate-200/80" />

          {/* 2. PROFIL ADMIN & DROPDOWN AKUN */}
          <div ref={accountRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setIsAccountOpen((prev) => !prev);
                setIsNotifOpen(false);
              }}
              aria-expanded={isAccountOpen}
              aria-label="Profil Admin"
              className={`flex items-center gap-2.5 rounded-full pl-1.5 pr-3 py-1 border transition-all duration-150 cursor-pointer ${
                isAccountOpen
                  ? "bg-app-primary-50/70 border-app-primary-200"
                  : "bg-slate-50/70 hover:bg-slate-100/80 border-slate-200/80"
              }`}
            >
              {/* Foto / Inisial Admin */}
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-app-primary-900 to-app-primary text-white flex items-center justify-center shrink-0 ring-2 ring-white shadow-2xs">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={adminName}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-[11px] font-extrabold text-app-secondary">
                    {adminInitials}
                  </span>
                )}
              </div>

              {/* Nama & Jabatan Admin */}
              <div className="hidden sm:flex flex-col text-left max-w-[170px]">
                <span className="text-xs font-bold text-slate-800 truncate leading-tight">
                  {adminName}
                </span>
                <span className="text-[10px] font-semibold text-app-primary truncate leading-tight mt-0.5">
                  {adminRole}
                </span>
              </div>

              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                  isAccountOpen ? "rotate-180 text-app-primary" : ""
                }`}
              />
            </button>

            {/* Menu Dropdown Profil & Logout */}
            {isAccountOpen && (
              <div className="absolute right-0 mt-2 w-68 rounded-2xl bg-white shadow-xl shadow-slate-900/10 border border-slate-200/80 overflow-hidden z-50">
                <div className="px-4 py-3.5 bg-gradient-to-br from-app-primary-950 via-app-primary-900 to-app-primary text-white">
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-[9.5px] font-bold text-app-secondary-300 mb-1.5">
                    <ShieldCheck className="w-3 h-3 text-app-secondary" />
                    <span>Administrator Sistem</span>
                  </div>
                  <p className="text-xs font-extrabold text-white truncate">
                    {adminName}
                  </p>
                  <p className="text-[10.5px] font-medium text-app-primary-200 truncate mt-0.5">
                    {adminRole}
                  </p>
                  <p className="text-[10px] text-app-primary-300 truncate mt-0.5">
                    {adminEmail}
                  </p>
                </div>

                <div className="p-1.5 space-y-0.5">
                  <Link
                    href="/dashboard/admin/pengaturan?tab=profil"
                    onClick={() => setIsAccountOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-app-primary-50 hover:text-app-primary transition-colors"
                  >
                    <UserCircle2 className="w-4 h-4 text-app-primary" />
                    <span>Profil Admin</span>
                  </Link>

                  <Link
                    href="/dashboard/admin/pengaturan"
                    onClick={() => setIsAccountOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-app-primary-50 hover:text-app-primary transition-colors"
                  >
                    <Settings className="w-4 h-4 text-slate-500" />
                    <span>Pengaturan Sistem</span>
                  </Link>
                </div>

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
