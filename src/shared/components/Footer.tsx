"use client";

import React from "react";
import Link from "next/link";
import {
  Landmark,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowUp,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { usePathname } from "next/navigation";

interface FooterNavItem {
  label: string;
  href: string;
  sectionId: string;
}

const FOOTER_NAV_ITEMS: FooterNavItem[] = [
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
  { label: "Pertanyaan Umum (FAQ)", href: "#faq", sectionId: "faq" },
  { label: "Kontak Layanan", href: "#kontak", sectionId: "kontak" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  const handleSmoothScroll = (
    e: React.MouseEvent<HTMLAnchorElement>,
    sectionId: string,
  ) => {
    const target = document.getElementById(sectionId);
    if (target) {
      e.preventDefault();
      const navbarOffset = 72;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - navbarOffset;

      window.scrollTo({
        top: sectionId === "hero" ? 0 : offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const hideNavbar =
    pathname.startsWith("/dashboard") ||
    ["login", "register", "403", "verify", "lupa-password"].some((route) =>
      pathname.includes(route),
    );

  if (hideNavbar) return null;

  return (
    <footer className="relative bg-app-primary-950 text-white border-t border-app-primary-900 overflow-hidden">
      {/* Garis Aksen Gradien di Bagian Atas Footer */}
      <div className="h-1 w-full bg-gradient-to-r from-app-primary-700 via-app-secondary to-app-primary-700" />

      {/* Dekorasi Glow Halus */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 right-10 w-72 h-72 rounded-full bg-app-primary-800/40 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-24 left-10 w-64 h-64 rounded-full bg-app-secondary/10 blur-3xl"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
        {/* GRID UTAMA FOOTER (12 KOLOM) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8 pb-10 border-b border-white/10">
          {/* KOLOM 1 (5 KOLOM): Logo, Nama Aplikasi, Deskripsi & Identitas Pemkab */}
          <div className="lg:col-span-5 space-y-4">
            {/* Brand Identity */}
            <a
              href="#hero"
              onClick={(e) => handleSmoothScroll(e, "hero")}
              className="inline-flex items-center gap-3 group"
            >
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-app-primary border border-white/15 text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
                <Landmark className="w-5 h-5 text-app-secondary" />
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-app-secondary ring-2 ring-app-primary-950" />
              </div>

              <div className="flex flex-col border-l border-white/15 pl-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-base font-extrabold tracking-tight text-white leading-none">
                    E-Hibah
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-app-secondary" />
                </div>
                <span className="text-[10.5px] font-medium text-app-secondary-300 tracking-wide mt-1 leading-none">
                  Pemerintah Kabupaten Sumbawa
                </span>
              </div>
            </a>

            {/* Deskripsi Singkat */}
            <p className="text-xs text-app-primary-200 leading-relaxed max-w-md">
              Portal layanan digital pengajuan, verifikasi administrasi, dan
              pemantauan status bantuan hibah daerah secara transparan dan
              akuntabel di lingkungan Pemerintah Kabupaten Sumbawa.
            </p>

            {/* Badge Identitas Instansi Pengelola */}
            <div className="inline-flex items-center gap-2.5 rounded-xl bg-white/5 border border-white/10 px-3.5 py-2.5">
              <ShieldCheck className="w-4 h-4 text-app-secondary shrink-0" />
              <div>
                <p className="text-[11px] font-bold text-white leading-tight">
                  Bagian Kesejahteraan Rakyat
                </p>
                <p className="text-[10px] text-app-primary-300">
                  Sekretariat Daerah Kabupaten Sumbawa
                </p>
              </div>
            </div>
          </div>

          {/* KOLOM 2 (3 KOLOM): Navigasi Website */}
          <div className="lg:col-span-3 space-y-3.5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-app-secondary-300">
              Navigasi Website
            </h3>

            <ul className="space-y-2">
              {FOOTER_NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={(e) => handleSmoothScroll(e, item.sectionId)}
                    className="group inline-flex items-center gap-1.5 text-xs text-app-primary-200 hover:text-white transition-colors"
                  >
                    <ChevronRight className="w-3 h-3 text-app-secondary transition-transform duration-150 group-hover:translate-x-0.5" />
                    <span>{item.label}</span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Akses Cepat Akun */}
            <div className="pt-2 flex items-center gap-3 text-[11px] font-semibold">
              <Link
                href="/login"
                className="text-app-secondary-300 hover:text-app-secondary underline underline-offset-4 transition-colors"
              >
                Login Pemohon
              </Link>
              <span className="text-white/20">•</span>
              <Link
                href="/daftar-pengajuan"
                className="text-white hover:text-app-secondary-300 underline underline-offset-4 transition-colors"
              >
                Daftar Pengajuan
              </Link>
            </div>
          </div>

          {/* KOLOM 3 (4 KOLOM): Informasi Kontak */}
          <div className="lg:col-span-4 space-y-3.5">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-app-secondary-300">
              Informasi Kontak
            </h3>

            <ul className="space-y-2.5 text-xs text-app-primary-200">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-app-secondary shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Jl. Garuda No. 1, Kelurahan Lempeh, Kecamatan Sumbawa,
                  Kabupaten Sumbawa, NTB 84312
                </span>
              </li>

              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-app-secondary shrink-0" />
                <a
                  href="tel:+6237121001"
                  className="hover:text-white transition-colors"
                >
                  (0371) 21001
                </a>
              </li>

              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-app-secondary shrink-0" />
                <a
                  href="mailto:kesra@sumbawakab.go.id"
                  className="hover:text-white transition-colors"
                >
                  kesra@sumbawakab.go.id
                </a>
              </li>

              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Senin – Kamis: 08.00 – 16.00 WITA
                  <br />
                  Jumat: 08.00 – 16.30 WITA
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* BARIS BAWAH: COPYRIGHT, IDENTITAS PEMKAB & TOMBOL KEMBALI KE ATAS */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-app-primary-300">
          <div className="text-center sm:text-left space-y-0.5">
            <p className="font-medium text-app-primary-100">
              &copy; {currentYear} E-Hibah Kabupaten Sumbawa. Hak Cipta
              Dilindungi Undang-Undang.
            </p>
            <p className="text-[10.5px] text-app-primary-300">
              Pemerintah Kabupaten Sumbawa — Bagian Kesejahteraan Rakyat
              Sekretariat Daerah
            </p>
          </div>

          <a
            href="#hero"
            onClick={(e) => handleSmoothScroll(e, "hero")}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-app-secondary text-white hover:text-app-primary-950 border border-white/15 hover:border-app-secondary text-[11px] font-semibold transition-all duration-200 group shrink-0"
          >
            <span>Kembali ke Atas</span>
            <ArrowUp className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
