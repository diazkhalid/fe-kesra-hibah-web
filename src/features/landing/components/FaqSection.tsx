"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HelpCircle,
  ChevronDown,
  MessageSquareText,
  ArrowUpRight,
  Headphones,
} from "lucide-react";

interface FaqItem {
  number: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FaqItem[] = [
  {
    number: "01",
    question: "Siapa saja yang dapat mengajukan hibah?",
    answer:
      "Pengajuan hibah dapat dilakukan oleh badan, lembaga, organisasi kemasyarakatan yang berbadan hukum Indonesia, serta lembaga keagamaan, sosial, maupun pendidikan yang berdomisili resmi di wilayah Kabupaten Sumbawa sesuai ketentuan peraturan perundang-undangan.",
  },
  {
    number: "02",
    question: "Bagaimana cara membuat akun?",
    answer:
      "Klik tombol 'Daftar Pengajuan' atau 'Login' pada menu bagian atas, kemudian pilih menu pendaftaran akun baru. Isi data identitas penanggung jawab, nama lembaga, email aktif, dan kata sandi, lalu lakukan aktivasi akun untuk mulai menggunakan layanan.",
  },
  {
    number: "03",
    question: "Apa saja persyaratan pengajuan hibah?",
    answer:
      "Dokumen utama meliputi Surat Permohonan Bantuan Hibah kepada Bupati Sumbawa, Proposal Kegiatan & RAB, Akta Notaris / SK Pengesahan Lembaga, Surat Keterangan Domisili dari Desa/Lurah, fotokopi KTP pengurus inti, serta buku rekening bank aktif atas nama lembaga dalam format PDF/JPG.",
  },
  {
    number: "04",
    question: "Bagaimana cara mengirim proposal?",
    answer:
      "Setelah masuk (login) ke akun Anda, lengkapi formulir data lembaga dan rincian permohonan hibah, unggah seluruh berkas proposal dan persyaratan yang diminta, periksa kembali kelengkapan data, lalu klik tombol 'Kirim Pengajuan' untuk diteruskan ke Admin Kesra.",
  },
  {
    number: "05",
    question: "Bagaimana cara mengetahui status pengajuan?",
    answer:
      "Anda dapat memantau perkembangan pengajuan secara real-time melalui halaman Dashboard Pemohon setelah login. Setiap perubahan tahap—mulai dari Pengajuan Masuk, Sedang Diverifikasi, Perlu Perbaikan, hingga Selesai Diverifikasi—akan tercatat secara otomatis.",
  },
  {
    number: "06",
    question: "Bagaimana jika dokumen pengajuan tidak lengkap?",
    answer:
      "Apabila Admin Kesra menemukan dokumen yang belum lengkap atau kurang sesuai saat pemeriksaan, status pengajuan akan berubah menjadi 'Perlu Perbaikan' beserta catatan revisi. Pemohon dapat segera mengunggah ulang dokumen perbaikan melalui dashboard.",
  },
  {
    number: "07",
    question: "Bagaimana cara melihat hasil verifikasi?",
    answer:
      "Hasil pemeriksaan administrasi dan catatan verifikasi dari tim Bagian Kesejahteraan Rakyat dapat dilihat langsung pada menu Riwayat / Detail Pengajuan di dalam dashboard akun pemohon.",
  },
  {
    number: "08",
    question: "Siapa yang dapat dihubungi jika mengalami kendala?",
    answer:
      "Jika mengalami kendala teknis aplikasi maupun pertanyaan terkait persyaratan administrasi, silakan hubungi layanan bantuan Bagian Kesejahteraan Rakyat Sekretariat Daerah Kabupaten Sumbawa melalui menu Kontak atau datang langsung pada jam kerja.",
  },
];

export default function FaqSection() {
  // Buka item pertama secara default agar pengguna langsung melihat format jawaban
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section
      id="faq"
      className="py-12 sm:py-16 bg-slate-50/80 border-t border-slate-200/70"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* KOLOM KIRI (4 KOLOM): Header & Kartu Bantuan Lanjutan */}
          <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-app-primary-50 border border-app-primary-100 text-app-primary text-[10.5px] font-semibold">
              <HelpCircle className="w-3.5 h-3.5 text-app-secondary-600" />
              <span>Pusat Informasi & Tanya Jawab</span>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
                Pertanyaan yang Sering Diajukan
              </h2>
              <p className="text-xs sm:text-[13px] text-slate-600 leading-relaxed">
                Temukan jawaban cepat seputar pendaftaran akun, kelengkapan
                dokumen, hingga proses verifikasi pengajuan hibah daerah.
              </p>
            </div>

            {/* Box Bantuan Kontak Ringkas */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-app-primary-950 via-app-primary-900 to-app-primary p-4 sm:p-5 text-white shadow-md space-y-3.5">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-8 -bottom-8 w-28 h-28 rounded-full bg-app-secondary/20 blur-2xl"
              />

              <div className="relative flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-app-secondary text-app-primary-950 flex items-center justify-center shrink-0 shadow-xs">
                  <Headphones className="w-4.5 h-4.5 stroke-[2.2]" />
                </div>
                <div>
                  <h3 className="text-xs font-extrabold text-white">
                    Masih Butuh Bantuan?
                  </h3>
                  <p className="text-[10.5px] text-app-primary-200">
                    Layanan Konsultasi Bag. Kesra
                  </p>
                </div>
              </div>

              <p className="relative text-[11px] text-app-primary-100 leading-relaxed">
                Apabila pertanyaan Anda belum terjawab di samping, silakan
                hubungi petugas layanan kami pada hari dan jam kerja.
              </p>

              <Link
                href="/kontak"
                className="relative inline-flex items-center justify-center gap-1.5 w-full px-4 py-2 rounded-full text-xs font-bold text-app-primary-950 bg-app-secondary hover:bg-app-secondary-400 transition-colors group"
              >
                <MessageSquareText className="w-3.5 h-3.5" />
                <span>Hubungi Admin Kesra</span>
                <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-150 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          {/* KOLOM KANAN (8 KOLOM): Accordion 8 Pertanyaan */}
          <div className="lg:col-span-8 space-y-2.5">
            {FAQ_DATA.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={item.number}
                  className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? "bg-white border-app-primary-300 shadow-sm"
                      : "bg-white/90 border-slate-200/80 hover:border-app-primary-200 hover:bg-white"
                  }`}
                >
                  {/* Tombol Pertanyaan */}
                  <button
                    type="button"
                    onClick={() => toggleItem(index)}
                    aria-expanded={isOpen}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3.5 text-left cursor-pointer focus:outline-none"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex items-center justify-center w-6 h-6 rounded-lg text-[10.5px] font-extrabold shrink-0 transition-colors ${
                          isOpen
                            ? "bg-app-primary text-white"
                            : "bg-app-primary-50 text-app-primary"
                        }`}
                      >
                        {item.number}
                      </span>

                      <span
                        className={`text-xs sm:text-[13px] font-bold leading-snug transition-colors ${
                          isOpen ? "text-app-primary" : "text-slate-800"
                        }`}
                      >
                        {item.question}
                      </span>
                    </div>

                    <span
                      className={`flex items-center justify-center w-6.5 h-6.5 rounded-full shrink-0 transition-all duration-200 ${
                        isOpen
                          ? "bg-app-secondary text-app-primary-950 rotate-180"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
                    </span>
                  </button>

                  {/* Konten Jawaban (Smooth Grid Accordion Transition) */}
                  <div
                    className={`grid transition-all duration-200 ease-in-out ${
                      isOpen
                        ? "grid-rows-[1fr] opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-4 pb-4 pt-0.5 pl-[52px]">
                        <div className="pt-2.5 border-t border-slate-100 text-[11.5px] sm:text-xs text-slate-600 leading-relaxed">
                          {item.answer}
                        </div>
                      </div>
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
