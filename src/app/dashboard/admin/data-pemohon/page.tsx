"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Search,
  RotateCcw,
  Eye,
  Calendar,
  Mail,
  Phone,
  Building2,
  ChevronRight,
  ChevronLeft,
  FolderKanban,
} from "lucide-react";

interface ApplicantRecord {
  id: string;
  namaLengkap: string;
  nik: string;
  email: string;
  nomorHp: string;
  tanggalRegistrasi: string; // YYYY-MM-DD
  tanggalLabel: string;
  jumlahPengajuan: number;
  alamat: string;
  lembagaUtama: string;
}

const INITIAL_APPLICANTS: ApplicantRecord[] = [
  {
    id: "usr-001",
    namaLengkap: "Ahmad Fauzi",
    nik: "5204081205880003",
    email: "ahmad.fauzi@nuruliman.or.id",
    nomorHp: "081237889910",
    tanggalRegistrasi: "2026-01-15",
    tanggalLabel: "15 Jan 2026",
    jumlahPengajuan: 3,
    alamat: "Jl. Kebayan No. 14, Kelurahan Uma Sima, Kecamatan Sumbawa",
    lembagaUtama: "Yayasan Nurul Iman Sumbawa",
  },
  {
    id: "usr-002",
    namaLengkap: "H. Abdul Rahman, Lc.",
    nik: "5204010204750001",
    email: "alikhlas.sbw@gmail.com",
    nomorHp: "081339556677",
    tanggalRegistrasi: "2026-02-10",
    tanggalLabel: "10 Feb 2026",
    jumlahPengajuan: 1,
    alamat: "Jl. Garuda No. 05, Kelurahan Lempeh, Kecamatan Sumbawa",
    lembagaUtama: "Masjid Besar Al-Ikhlas Sumbawa",
  },
  {
    id: "usr-003",
    namaLengkap: "Siti Aminah, S.Sos.",
    nik: "5204084507900004",
    email: "samawapeduli@yahoo.com",
    nomorHp: "081998776655",
    tanggalRegistrasi: "2026-03-05",
    tanggalLabel: "05 Mar 2026",
    jumlahPengajuan: 2,
    alamat: "Jl. Mawar Indah No. 12, Kelurahan Bugis, Kecamatan Sumbawa",
    lembagaUtama: "Lembaga Sosial Samawa Peduli",
  },
  {
    id: "usr-004",
    namaLengkap: "Zulkifli Hasan",
    nik: "5204100809920001",
    email: "pemudamoyo@gmail.com",
    nomorHp: "085239112233",
    tanggalRegistrasi: "2025-06-20",
    tanggalLabel: "20 Jun 2025",
    jumlahPengajuan: 1,
    alamat: "Dusun Moyo Mekar, Desa Moyo, Kecamatan Moyo Hilir",
    lembagaUtama: "Kelompok Pemuda Moyo Hilir",
  },
  {
    id: "usr-005",
    namaLengkap: "Ust. Syamsuddin",
    nik: "5204051212800002",
    email: "darussalam.alas@gmail.com",
    nomorHp: "081238991122",
    tanggalRegistrasi: "2026-04-18",
    tanggalLabel: "18 Apr 2026",
    jumlahPengajuan: 2,
    alamat: "Jl. Pesantren No. 1, Desa Kalimango, Kecamatan Alas",
    lembagaUtama: "Pondok Pesantren Darussalam Alas",
  },
];

export default function AdminDataPemohonPage() {
  const [applicants] = useState<ApplicantRecord[]>(INITIAL_APPLICANTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Pagination
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Statistik Ringkas
  const stats = useMemo(() => {
    return {
      total: applicants.length,
      totalPengajuan: applicants.reduce(
        (acc, cur) => acc + cur.jumlahPengajuan,
        0,
      ),
    };
  }, [applicants]);

  // Filter Data
  const filteredData = useMemo(() => {
    return applicants.filter((item) => {
      const q = searchQuery.trim().toLowerCase();
      const matchSearch =
        !q ||
        item.namaLengkap.toLowerCase().includes(q) ||
        item.nik.toLowerCase().includes(q) ||
        item.email.toLowerCase().includes(q) ||
        item.nomorHp.toLowerCase().includes(q) ||
        item.lembagaUtama.toLowerCase().includes(q);

      const matchStart = !startDate || item.tanggalRegistrasi >= startDate;
      const matchEnd = !endDate || item.tanggalRegistrasi <= endDate;

      return matchSearch && matchStart && matchEnd;
    });
  }, [applicants, searchQuery, startDate, endDate]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  const handleResetFilter = () => {
    setSearchQuery("");
    setStartDate("");
    setEndDate("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 pb-10">
      {/* =====================================================================
          1. HEADER HALAMAN
      ====================================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500"
          >
            <Link
              href="/dashboard/admin"
              className="hover:text-app-primary transition-colors"
            >
              Dashboard
            </Link>
            <ChevronRight className="w-3 h-3 text-slate-400" />
            <span className="text-app-primary font-bold">Data Pemohon</span>
          </nav>

          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Data Akun Pemohon Terdaftar
          </h1>
          <p className="text-xs text-slate-500">
            Melihat dan memantau akun masyarakat serta pengurus lembaga yang
            terdaftar di portal E-Hibah Kabupaten Sumbawa.
          </p>
        </div>
      </div>

      {/* =====================================================================
          2. STATISTIK RINGKAS PEMOHON (2 CARD)
      ====================================================================== */}
      <section
        aria-label="Statistik Pemohon"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <div className="rounded-2xl bg-white border border-slate-200/80 p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">
              Total Pemohon Terdaftar
            </span>
            <div className="w-8.5 h-8.5 rounded-xl bg-app-primary-50 text-app-primary flex items-center justify-center">
              <Users className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <p className="mt-2.5 text-2xl font-extrabold text-slate-900">
            {stats.total}{" "}
            <span className="text-xs font-normal text-slate-500">Akun</span>
          </p>
          <p className="mt-0.5 text-[10px] text-slate-400">
            Masyarakat & pengurus lembaga
          </p>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200/80 p-4.5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500">
              Total Pengajuan Diajukan
            </span>
            <div className="w-8.5 h-8.5 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <FolderKanban className="w-4 h-4 stroke-[2.2]" />
            </div>
          </div>
          <p className="mt-2.5 text-2xl font-extrabold text-slate-900">
            {stats.totalPengajuan}{" "}
            <span className="text-xs font-normal text-slate-500">Proposal</span>
          </p>
          <p className="mt-0.5 text-[10px] text-sky-600 font-semibold">
            Akumulasi seluruh usulan hibah
          </p>
        </div>
      </section>

      {/* =====================================================================
          3. PENCARIAN & FILTER TANGGAL REGISTRASI
      ====================================================================== */}
      <section
        aria-label="Pencarian dan Filter Pemohon"
        className="rounded-2xl bg-white border border-slate-200/80 p-4 sm:p-5 shadow-2xs"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 items-end">
          {/* A. Pencarian Pemohon */}
          <div className="md:col-span-6 space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-700">
              Pencarian Pemohon
            </label>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama, NIK, email, no. HP, atau lembaga..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-9 pr-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15"
              />
            </div>
          </div>

          {/* B. Filter Tanggal Registrasi (Awal & Akhir) */}
          <div className="md:col-span-5 grid grid-cols-2 gap-2">
            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700">
                Reg. Dari
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-2.5 py-2 text-[11px] text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700">
                Reg. Sampai
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-2.5 py-2 text-[11px] text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15"
              />
            </div>
          </div>

          {/* C. Tombol Reset */}
          <div className="md:col-span-1">
            {(searchQuery || startDate || endDate) && (
              <button
                type="button"
                onClick={handleResetFilter}
                title="Reset Filter"
                className="w-full h-9 flex items-center justify-center rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================================
          4. TABEL DAFTAR PEMOHON
      ====================================================================== */}
      <section
        aria-label="Tabel Daftar Pemohon"
        className="rounded-2xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden"
      >
        {/* DESKTOP TABLE */}
        <div className="hidden xl:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/90 border-b border-slate-200/70 text-[10.5px] font-bold uppercase tracking-wider text-slate-500">
                <th className="py-3.5 px-3 w-11 text-center">No.</th>
                <th className="py-3.5 px-3">Nama Lengkap & NIK</th>
                <th className="py-3.5 px-3">Email & No. HP</th>
                <th className="py-3.5 px-3">Lembaga Utama</th>
                <th className="py-3.5 px-3 whitespace-nowrap">
                  Tgl. Registrasi
                </th>
                <th className="py-3.5 px-3 text-center whitespace-nowrap">
                  Jml. Pengajuan
                </th>
                <th className="py-3.5 px-3 text-right whitespace-nowrap">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedData.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-xs text-slate-500"
                  >
                    Tidak ada data pemohon yang sesuai dengan kriteria pencarian
                    atau filter Anda.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* 1. No */}
                    <td className="py-3.5 px-3 text-center font-semibold text-slate-500 align-top">
                      {startIndex + idx + 1}
                    </td>

                    {/* 2. Nama Lengkap & NIK */}
                    <td className="py-3.5 px-3 align-top">
                      <div className="space-y-0.5">
                        <span className="font-extrabold text-slate-900 text-[11.5px]">
                          {item.namaLengkap}
                        </span>
                        <p className="text-[10.5px] text-slate-400 font-mono">
                          NIK: {item.nik}
                        </p>
                      </div>
                    </td>

                    {/* 3. Email & No. HP */}
                    <td className="py-3.5 px-3 align-top">
                      <div className="space-y-0.5 text-[11px]">
                        <div className="flex items-center gap-1.5 text-slate-700">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[170px]">
                            {item.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-600">
                          <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                          <span>{item.nomorHp}</span>
                        </div>
                      </div>
                    </td>

                    {/* 4. Lembaga Utama */}
                    <td className="py-3.5 px-3 align-top max-w-[180px]">
                      <div className="flex items-start gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-app-secondary-600 shrink-0 mt-0.5" />
                        <span className="font-semibold text-slate-800 leading-snug line-clamp-2">
                          {item.lembagaUtama}
                        </span>
                      </div>
                    </td>

                    {/* 5. Tanggal Registrasi */}
                    <td className="py-3.5 px-3 align-top whitespace-nowrap text-slate-600">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.tanggalLabel}</span>
                      </div>
                    </td>

                    {/* 6. Jumlah Pengajuan */}
                    <td className="py-3.5 px-3 align-top text-center whitespace-nowrap font-extrabold text-app-primary">
                      <span className="inline-block px-2 py-0.5 rounded-lg bg-app-primary-50">
                        {item.jumlahPengajuan} Proposal
                      </span>
                    </td>

                    {/* 7. Aksi (Navigasi ke Halaman Detail) */}
                    <td className="py-3.5 px-3 align-top text-right whitespace-nowrap">
                      <Link
                        href={`/dashboard/admin/data-pemohon/${item.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-app-primary hover:border-app-primary text-slate-700 hover:text-white text-[11px] font-bold transition-all shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detail Profil</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE & TABLET CARDS (< xl) */}
        <div className="xl:hidden divide-y divide-slate-100">
          {paginatedData.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              Tidak ada data pemohon yang ditemukan.
            </div>
          ) : (
            paginatedData.map((item, idx) => (
              <div key={item.id} className="p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400">
                      #{startIndex + idx + 1}
                    </span>
                    <span className="text-xs font-extrabold text-slate-900">
                      {item.namaLengkap}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 space-y-0.5">
                  <p className="font-mono text-slate-400">NIK: {item.nik}</p>
                  <p className="font-semibold text-slate-800">
                    {item.lembagaUtama}
                  </p>
                  <p>
                    {item.email} • {item.nomorHp}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-400">
                    Reg: {item.tanggalLabel} ({item.jumlahPengajuan} Proposal)
                  </span>

                  <Link
                    href={`/dashboard/admin/data-pemohon/${item.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-app-primary text-slate-700 hover:text-white text-[11px] font-bold transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Detail Profil</span>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        {/* PAGINATION */}
        <div className="px-4 py-3.5 bg-slate-50/70 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
            <div className="flex items-center gap-1.5">
              <span>Tampilkan</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-bold text-slate-800 focus:border-app-primary focus:outline-none"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span>data</span>
            </div>

            <span className="text-slate-300">|</span>

            <span>
              Menampilkan{" "}
              <strong className="text-slate-800">
                {filteredData.length === 0 ? 0 : startIndex + 1}
              </strong>
              –
              <strong className="text-slate-800">
                {Math.min(startIndex + pageSize, filteredData.length)}
              </strong>{" "}
              dari{" "}
              <strong className="text-slate-800">{filteredData.length}</strong>{" "}
              pemohon
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-45 text-[11px] font-semibold text-slate-700 cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sebelumnya</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setCurrentPage(num)}
                className={`w-8 h-8 rounded-lg text-[11px] font-extrabold transition-colors cursor-pointer ${
                  num === safePage
                    ? "bg-app-primary text-white shadow-2xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {num}
              </button>
            ))}

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage >= totalPages}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-45 text-[11px] font-semibold text-slate-700 cursor-pointer disabled:cursor-not-allowed"
            >
              <span className="hidden sm:inline">Berikutnya</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
