"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Menu,
  X,
  LogIn,
  LogOut,
  ArrowUpRight,
  ChevronRight,
  ChevronDown,
  Landmark,
  LayoutDashboard,
  UserCircle2,
  Loader2,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthUser } from "../contexts/SessionContext";
import APP_CONFIG from "@/shared/global/app_config"; // Sesuaikan path import APP_CONFIG Anda

interface NavItem {
  label: string;
  href: string;
  sectionId: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Beranda", href: "#hero", sectionId: "hero" },
  {
    label: "Informasi Pengajuan",
    href: "#tentang-layanan",
    sectionId: "tentang-layanan",
  },
  { label: "Persyaratan", href: "#persyaratan", sectionId: "persyaratan" },
  {
    label: "Alur Pengajuan",
    href: "#alur-pengajuan",
    sectionId: "alur-pengajuan",
  },
  { label: "Kontak", href: "#kontak", sectionId: "kontak" },
  { label: "FAQ", href: "#faq", sectionId: "faq" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("hero");

  const accountRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const { user, isAuthenticated, isLoading, setToggleUpdateAuth } =
    useAuthUser();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8);

      // Deteksi section aktif berdasarkan posisi scroll
      const scrollPosition = window.scrollY + 120;
      for (let i = NAV_ITEMS.length - 1; i >= 0; i--) {
        const section = document.getElementById(NAV_ITEMS[i].sectionId);
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(NAV_ITEMS[i].sectionId);
          break;
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Tutup dropdown akun saat klik di luar area menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
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

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    const targetElement = document.getElementById(sectionId);
    if (targetElement) {
      e.preventDefault();
      const navbarOffset = 72;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - navbarOffset;

      window.scrollTo({
        top: sectionId === "hero" ? 0 : offsetPosition,
        behavior: "smooth",
      });

      setActiveSection(sectionId);
      setIsMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      localStorage.removeItem("access-token");
      setToggleUpdateAuth((prev) => !prev);
      setIsAccountOpen(false);
      setIsMobileMenuOpen(false);
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const hideNavbar =
    pathname.startsWith("/dashboard") ||
    ["login", "register", "403", "verify", "lupa-password"].some((route) =>
      pathname.includes(route),
    );

  if (hideNavbar) return null;

  const displayName = user?.full_name || "Pemohon";
  const displayEmail = user?.email || "";
  const rawPhotoUrl = user?.profile?.profile_photo_url || null;
  const displayAvatar = rawPhotoUrl
    ? rawPhotoUrl.startsWith("http")
      ? rawPhotoUrl
      : `${APP_CONFIG.STORAGE_URL}${rawPhotoUrl.startsWith("/") ? "" : "/"}${rawPhotoUrl}`
    : null;

  const userInitials = displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs"
          : "bg-white border-b border-slate-100"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* KIRI: Brand Identity (Scroll ke atas / #hero) */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, "hero")}
            className="flex items-center gap-2.5 group shrink-0"
          >
            <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-app-primary text-white shadow-xs transition-transform duration-200 group-hover:scale-105">
              <Landmark className="w-4 h-4 text-app-secondary" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-app-secondary ring-2 ring-white" />
            </div>

            <div className="flex flex-col border-l border-slate-200 pl-2.5">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-app-primary leading-none">
                  E-Hibah
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-app-secondary" />
              </div>
              <span className="text-[10px] font-medium text-slate-500 tracking-wide mt-0.5 leading-none">
                Kabupaten Sumbawa
              </span>
            </div>
          </a>

          {/* TENGAH: Menu Navigasi Desktop (Anchor Links ke Section) */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = activeSection === item.sectionId;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.sectionId)}
                  className={`relative px-3 py-1.5 rounded-full text-xs transition-all duration-150 ${
                    active
                      ? "text-app-primary font-semibold bg-app-primary-50/80"
                      : "text-slate-600 font-medium hover:text-app-primary hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* KANAN: Profil User (jika sudah login) atau Tombol Login/Register */}
          <div className="hidden lg:flex items-center gap-1.5 shrink-0">
            {isLoading ? (
              <div className="h-9 w-36 rounded-full bg-slate-100 animate-pulse" />
            ) : isAuthenticated && user ? (
              <div ref={accountRef} className="relative">
                <button
                  type="button"
                  onClick={() => setIsAccountOpen((prev) => !prev)}
                  aria-expanded={isAccountOpen}
                  aria-label="Menu Akun Pengguna"
                  className={`flex items-center gap-2.5 rounded-full pl-1.5 pr-3 py-1 border transition-all duration-150 cursor-pointer ${
                    isAccountOpen
                      ? "bg-app-primary-50/80 border-app-primary-200"
                      : "bg-slate-50/80 hover:bg-slate-100/80 border-slate-200/80"
                  }`}
                >
                  {/* Avatar / Foto Profil */}
                  <div className="relative w-7 h-7 rounded-full overflow-hidden bg-gradient-to-br from-app-primary to-app-primary-700 text-white flex items-center justify-center shrink-0 ring-2 ring-white shadow-2xs">
                    {displayAvatar ? (
                      <Image
                        src={displayAvatar}
                        alt={displayName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-[10px] font-extrabold text-app-secondary-200">
                        {userInitials}
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-bold text-slate-800 max-w-[130px] truncate">
                    {displayName}
                  </span>

                  <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${
                      isAccountOpen ? "rotate-180 text-app-primary" : ""
                    }`}
                  />
                </button>

                {/* Dropdown Profil User */}
                {isAccountOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white shadow-xl shadow-slate-900/10 border border-slate-200/80 overflow-hidden z-50">
                    <div className="px-4 py-3 bg-gradient-to-br from-app-primary-950 via-app-primary-900 to-app-primary text-white">
                      <p className="text-xs font-extrabold text-white truncate">
                        {displayName}
                      </p>
                      <p className="text-[10px] text-app-primary-200 truncate mt-0.5">
                        {displayEmail}
                      </p>
                    </div>

                    <div className="p-1.5 space-y-0.5">
                      <Link
                        href="/dashboard/pemohon"
                        onClick={() => setIsAccountOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-app-primary-50 hover:text-app-primary transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-app-primary" />
                        <span>Dashboard</span>
                      </Link>

                      <Link
                        href="/dashboard/pemohon/profil"
                        onClick={() => setIsAccountOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-app-primary-50 hover:text-app-primary transition-colors"
                      >
                        <UserCircle2 className="w-4 h-4 text-app-primary" />
                        <span>Profil Saya</span>
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
            ) : (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-app-primary hover:bg-app-primary-50 transition-colors duration-150"
                >
                  <LogIn className="w-3.5 h-3.5 text-app-primary-600" />
                  <span>Login</span>
                </Link>

                <Link
                  href="/register"
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold text-white bg-app-primary hover:bg-app-primary-800 shadow-xs transition-all duration-150 group"
                >
                  <span>Daftar Pengajuan</span>
                  <span className="flex items-center justify-center w-4.5 h-4.5 rounded-full bg-app-secondary text-app-primary-950 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                  </span>
                </Link>
              </>
            )}
          </div>

          {/* TOMBOL MENU MOBILE */}
          <div className="flex items-center lg:hidden">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
              aria-expanded={isMobileMenuOpen}
              className="p-2 rounded-xl text-slate-600 hover:text-app-primary hover:bg-slate-100 transition-colors"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* DRAWER MOBILE */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-100 bg-white/98 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-4 pt-2.5 pb-5 space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = activeSection === item.sectionId;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.sectionId)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-colors ${
                    active
                      ? "bg-app-primary-50 text-app-primary font-semibold"
                      : "text-slate-600 font-medium hover:bg-slate-50 hover:text-app-primary"
                  }`}
                >
                  <span>{item.label}</span>
                  <ChevronRight
                    className={`w-3.5 h-3.5 ${
                      active ? "text-app-secondary-600" : "text-slate-300"
                    }`}
                  />
                </a>
              );
            })}

            {isAuthenticated && user ? (
              <div className="pt-3 mt-2.5 border-t border-slate-100 space-y-2">
                {/* Kartu Profil Ringkas di Mobile */}
                <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden bg-gradient-to-br from-app-primary to-app-primary-700 text-white flex items-center justify-center shrink-0">
                    {displayAvatar ? (
                      <Image
                        src={displayAvatar}
                        alt={displayName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-xs font-extrabold text-app-secondary-200">
                        {userInitials}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-extrabold text-slate-900 truncate">
                      {displayName}
                    </p>
                    <p className="text-[10.5px] text-slate-500 truncate">
                      {displayEmail}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/dashboard/pemohon"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-app-primary hover:bg-app-primary-800 transition-colors"
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 text-app-secondary" />
                    <span>Dashboard</span>
                  </Link>

                  <Link
                    href="/dashboard/pemohon/profil"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-app-primary border border-app-primary-200 hover:bg-app-primary-50 transition-colors"
                  >
                    <UserCircle2 className="w-3.5 h-3.5" />
                    <span>Profil Saya</span>
                  </Link>
                </div>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className="w-full flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 disabled:opacity-60 transition-colors cursor-pointer"
                >
                  {isLoggingOut ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <LogOut className="w-3.5 h-3.5" />
                  )}
                  <span>{isLoggingOut ? "Keluar..." : "Logout"}</span>
                </button>
              </div>
            ) : (
              <div className="pt-3 mt-2.5 border-t border-slate-100 grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-app-primary border border-app-primary-200 hover:bg-app-primary-50 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </Link>

                <Link
                  href="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-app-primary hover:bg-app-primary-800 transition-colors"
                >
                  <span>Daftar Pengajuan</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-app-secondary" />
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
