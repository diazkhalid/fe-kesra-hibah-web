"use client";

import React from "react";
import {
  Landmark,
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  Navigation,
  Building2,
} from "lucide-react";

export default function ContactSection() {
  return (
    <section
      id="kontak"
      className="py-12 sm:py-16 bg-white border-t border-slate-200/70"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* HEADER SECTION */}
        <div className="max-w-2xl mx-auto text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-app-primary-50 border border-app-primary-100 text-app-primary text-[10.5px] font-semibold">
            <Building2 className="w-3.5 h-3.5 text-app-secondary-600" />
            <span>Instansi Pengelola Layanan</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Kontak dan Informasi Layanan
          </h2>

          <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
            Informasi resmi alamat kantor, saluran komunikasi, dan jam
            operasional layanan konsultasi bantuan hibah Kabupaten Sumbawa.
          </p>
        </div>

        {/* KONTEN UTAMA: 2 KOLOM SEIMBANG (6 : 6) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          {/* KOLOM KIRI (6 KOLOM): Identitas Instansi & Detail Kontak */}
          <div className="lg:col-span-6 rounded-2xl bg-gradient-to-br from-app-primary-950 via-app-primary-900 to-app-primary p-5 sm:p-6 text-white shadow-md flex flex-col justify-between space-y-5 relative overflow-hidden">
            {/* Dekorasi Latar */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-12 -top-12 w-44 h-44 rounded-full bg-app-secondary/20 blur-2xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff12_1px,transparent_1px)] [background-size:18px_18px] opacity-60"
            />

            {/* Header Nama Instansi */}
            <div className="relative flex items-start gap-3.5 pb-4 border-b border-white/15">
              <div className="w-11 h-11 rounded-xl bg-app-secondary text-app-primary-950 flex items-center justify-center shrink-0 shadow-sm">
                <Landmark className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div>
                <span className="inline-block text-[9.5px] font-bold uppercase tracking-wider text-app-secondary-300">
                  Pemerintah Kabupaten Sumbawa
                </span>
                <h3 className="text-sm sm:text-base font-extrabold text-white leading-snug mt-0.5">
                  Bagian Kesejahteraan Rakyat
                </h3>
                <p className="text-xs font-medium text-app-primary-100">
                  Sekretariat Daerah Kabupaten Sumbawa
                </p>
              </div>
            </div>

            {/* Daftar Rincian Kontak & Jam Pelayanan */}
            <div className="relative space-y-3.5">
              {/* Alamat Kantor */}
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/15 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-app-secondary" />
                </div>
                <div>
                  <p className="text-[10.5px] font-semibold text-app-primary-200">
                    Alamat Kantor
                  </p>
                  <p className="text-xs font-medium text-white leading-relaxed">
                    Jl. Garuda No. 1, Kelurahan Lempeh, Kecamatan Sumbawa,
                    Kabupaten Sumbawa, Nusa Tenggara Barat 84312
                  </p>
                </div>
              </div>

              {/* Nomor Telepon & Email (2 Kolom Ringkas) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
                <div className="flex items-start gap-2.5 rounded-xl bg-white/10 border border-white/10 p-3">
                  <Phone className="w-4 h-4 text-app-secondary shrink-0 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-semibold text-app-primary-200">
                      Nomor Telepon
                    </p>
                    <a
                      href="tel:+6237121001"
                      className="text-xs font-bold text-white hover:text-app-secondary-300 transition-colors"
                    >
                      (0371) 21001
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 rounded-xl bg-white/10 border border-white/10 p-3">
                  <Mail className="w-4 h-4 text-sky-300 shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold text-app-primary-200">
                      Email Resmi
                    </p>
                    <a
                      href="mailto:kesra@sumbawakab.go.id"
                      className="block truncate text-xs font-bold text-white hover:text-app-secondary-300 transition-colors"
                    >
                      kesra@sumbawakab.go.id
                    </a>
                  </div>
                </div>
              </div>

              {/* Jam Pelayanan */}
              <div className="flex items-start gap-3 rounded-xl bg-white/10 border border-white/15 p-3.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-400/20 text-emerald-300 flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="w-full space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold text-white">
                      Jam Pelayanan Konsultasi
                    </p>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-200 text-[9px] font-bold">
                      Hari Kerja
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[10.5px] text-app-primary-100">
                    <p>
                      <span className="text-white font-semibold">
                        Senin – Kamis:
                      </span>{" "}
                      08.00 – 16.00 WITA
                    </p>
                    <p>
                      <span className="text-white font-semibold">Jumat:</span>{" "}
                      08.00 – 16.30 WITA
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KOLOM KANAN (6 KOLOM): Peta Lokasi Kantor Bupati / Setda Sumbawa */}
          <div className="lg:col-span-6 rounded-2xl bg-slate-50 border border-slate-200/80 overflow-hidden shadow-xs flex flex-col justify-between">
            {/* Bar Atas Peta */}
            <div className="px-4 py-3 bg-white border-b border-slate-200/70 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-app-primary animate-pulse" />
                <span className="text-xs font-bold text-slate-800">
                  Peta Lokasi Kantor Sekretariat Daerah
                </span>
              </div>

              <a
                href="https://maps.google.com/?q=Kantor+Bupati+Sumbawa+Jl.+Garuda+No.+1"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-app-primary-50 hover:bg-app-primary text-app-primary hover:text-white text-[10px] font-bold transition-colors"
              >
                <Navigation className="w-3 h-3" />
                <span>Petunjuk Arah</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            {/* Iframe Google Maps */}
            <div className="relative w-full h-64 sm:h-72 lg:h-full min-h-[260px] bg-slate-200">
              <iframe
                title="Peta Lokasi Bagian Kesejahteraan Rakyat Sekretariat Daerah Kabupaten Sumbawa"
                src="https://www.google.com/maps?q=Kantor+Bupati+Sumbawa,+Jl.+Garuda+No.1,+Sumbawa+Besar&output=embed"
                className="absolute inset-0 w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
