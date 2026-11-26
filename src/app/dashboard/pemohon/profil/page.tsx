"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  User,
  Building2,
  LockKeyhole,
  Camera,
  CheckCircle2,
  Save,
  ChevronRight,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  BadgeCheck,
  Info,
} from "lucide-react";
import { useAuthUser } from "@/shared/contexts/SessionContext";
import { usePemohonProfile } from "@/features/pemohon-profile/hooks/useProfile.hook";
import { usePemohonOrganization } from "@/features/pemohon-profile/hooks/useOrganization.hook";
import APP_CONFIG from "@/shared/global/app_config"; // Sesuaikan path import APP_CONFIG Anda

type ProfileTab = "pribadi" | "organisasi" | "keamanan";

export default function ProfilPemohonPage() {
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  const { user } = useAuthUser();
  const {
    profile,
    isLoading: isLoadingProfile,
    isUpdating: isUpdatingProfile,
    isUpdatingPhoto,
    error: profileError,
    clearError: clearProfileError,
    fetchProfile,
    updateProfile,
    updateProfilePhoto,
  } = usePemohonProfile();

  const {
    organization,
    isLoading: isLoadingOrg,
    isSaving: isSavingOrg,
    error: orgError,
    clearError: clearOrgError,
    fetchOrganization,
    upsertOrganization,
  } = usePemohonOrganization();

  const [activeTab, setActiveTab] = useState<ProfileTab>("pribadi");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [toastBanner, setToastBanner] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  // 1. State Data Pribadi Pemohon
  const [personalData, setPersonalData] = useState({
    namaLengkap: "",
    nik: "",
    tempatLahir: "",
    tanggalLahir: "",
    jenisKelamin: "L" as "L" | "P",
    nomorHp: "",
    email: "",
    alamatLengkap: "",
  });

  // 2. State Profil Organisasi / Lembaga
  const [orgData, setOrgData] = useState({
    namaOrganisasi: "",
    jenisOrganisasi: "Yayasan / Lembaga Keagamaan",
    nomorAktaPendirian: "",
    tanggalPendirian: "",
    nomorSkOrganisasi: "",
    alamatOrganisasi: "",
    namaKetua: "",
    nomorHpKetua: "",
    namaSekretaris: "",
    namaBendahara: "",
  });

  // 3. State Keamanan / Ubah Password
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPass, setShowPass] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Fetch data awal saat halaman dimuat
  useEffect(() => {
    fetchProfile();
    fetchOrganization();
  }, [fetchProfile, fetchOrganization]);

  // Sinkronkan data dari profile & session user ke form data pribadi
  useEffect(() => {
    setPersonalData((prev) => ({
      ...prev,
      namaLengkap: profile?.full_name || user?.full_name || prev.namaLengkap,
      nik: profile?.nik || prev.nik,
      tempatLahir: profile?.birth_place || prev.tempatLahir,
      tanggalLahir: profile?.birth_date
        ? profile.birth_date.split("T")[0]
        : prev.tanggalLahir,
      jenisKelamin:
        profile?.gender === "P" || profile?.gender === "Perempuan" ? "P" : "L",
      nomorHp: user?.phone || prev.nomorHp,
      email: user?.email || prev.email,
      alamatLengkap: profile?.address || prev.alamatLengkap,
    }));
  }, [profile, user]);

  // Sinkronkan data dari organization ke form profil lembaga
  useEffect(() => {
    if (!organization) return;

    setOrgData({
      namaOrganisasi: organization.name || "",
      jenisOrganisasi:
        organization.organization_type || "Yayasan / Lembaga Keagamaan",
      nomorAktaPendirian: organization.deed_number || "",
      tanggalPendirian: organization.established_on
        ? organization.established_on.split("T")[0]
        : "",
      nomorSkOrganisasi: organization.registration_number || "",
      alamatOrganisasi: organization.address || "",
      namaKetua: organization.chair_name || "",
      nomorHpKetua: organization.chair_phone || "",
      namaSekretaris: organization.secretary_name || "",
      namaBendahara: organization.treasurer_name || "",
    });
  }, [organization]);

  // Bersihkan object URL saat unmount / preview berubah
  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const showToast = (type: "success" | "error", message: string) => {
    setToastBanner({ type, message });
    setTimeout(() => setToastBanner(null), 4000);
  };

  // Handler Ganti Foto Profil
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    clearProfileError();

    if (file.size > 2 * 1024 * 1024) {
      showToast("error", "Ukuran foto profil maksimal 2 MB (JPG/PNG/WEBP).");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);

    const isSuccess = await updateProfilePhoto({ image: file });
    if (isSuccess) {
      setAvatarPreview(null);
      showToast("success", "Foto profil berhasil diperbarui.");
    } else {
      setAvatarPreview(null);
    }

    e.target.value = "";
  };

  // Handler Simpan Data Pribadi
  const handleSavePersonal = async (e: React.FormEvent) => {
    e.preventDefault();
    clearProfileError();

    if (!personalData.namaLengkap.trim() || personalData.nik.length !== 16) {
      showToast(
        "error",
        "Pastikan Nama Lengkap terisi dan NIK terdiri dari 16 digit.",
      );
      return;
    }

    if (
      !personalData.tempatLahir.trim() ||
      !personalData.tanggalLahir ||
      !personalData.alamatLengkap.trim()
    ) {
      showToast(
        "error",
        "Tempat lahir, tanggal lahir, dan alamat lengkap wajib diisi.",
      );
      return;
    }

    const isSuccess = await updateProfile({
      nik: personalData.nik,
      full_name: personalData.namaLengkap.trim(),
      birth_place: personalData.tempatLahir.trim(),
      birth_date: personalData.tanggalLahir,
      gender: personalData.jenisKelamin,
      address: personalData.alamatLengkap.trim(),
    });

    if (isSuccess) {
      showToast("success", "Perubahan data pribadi pemohon berhasil disimpan.");
    }
  };

  // Handler Simpan Profil Organisasi
  const handleSaveOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    clearOrgError();

    if (!orgData.namaOrganisasi.trim() || !orgData.nomorAktaPendirian.trim()) {
      showToast(
        "error",
        "Nama Organisasi dan Nomor Akta Pendirian wajib diisi.",
      );
      return;
    }

    const isSuccess = await upsertOrganization({
      name: orgData.namaOrganisasi.trim(),
      organization_type: orgData.jenisOrganisasi,
      deed_number: orgData.nomorAktaPendirian.trim(),
      established_on: orgData.tanggalPendirian,
      registration_number: orgData.nomorSkOrganisasi.trim(),
      address: orgData.alamatOrganisasi.trim(),
      chair_name: orgData.namaKetua.trim(),
      chair_phone: orgData.nomorHpKetua.trim(),
      secretary_name: orgData.namaSekretaris.trim(),
      treasurer_name: orgData.namaBendahara.trim(),
    });

    if (isSuccess) {
      showToast(
        "success",
        "Data profil organisasi/lembaga berhasil diperbarui.",
      );
    }
  };

  // Handler Ubah Password
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordForm.currentPassword) {
      showToast("error", "Masukkan kata sandi saat ini terlebih dahulu.");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      showToast("error", "Kata sandi baru minimal terdiri dari 8 karakter.");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast("error", "Konfirmasi kata sandi baru tidak cocok.");
      return;
    }

    setIsSavingPassword(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 800));
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      showToast("success", "Kata sandi akun Anda berhasil diperbarui.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const displayName =
    personalData.namaLengkap ||
    profile?.full_name ||
    user?.full_name ||
    (isLoadingProfile ? "Memuat..." : "Pemohon");

  const rawPhotoUrl =
    profile?.profile_photo_url || user?.profile?.profile_photo_url || null;

  const resolvedPhotoUrl = rawPhotoUrl
    ? rawPhotoUrl.startsWith("http")
      ? rawPhotoUrl
      : `${APP_CONFIG.STORAGE_URL}${rawPhotoUrl.startsWith("/") ? "" : "/"}${rawPhotoUrl}`
    : null;

  const displayAvatar = avatarPreview || resolvedPhotoUrl;

  const displayOrgName =
    orgData.namaOrganisasi ||
    organization?.name ||
    profile?.organization ||
    "Belum melengkapi data lembaga";

  const userInitials = displayName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const activeError =
    (activeTab === "pribadi" && profileError) ||
    (activeTab === "organisasi" && orgError) ||
    null;

  // Indikator kekuatan password
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { label: "", color: "bg-slate-200", width: "0%" };
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd) || /[^A-Za-z0-9]/.test(pwd)) score++;

    if (score === 1)
      return { label: "Lemah", color: "bg-red-500", width: "33%" };
    if (score === 2)
      return { label: "Sedang", color: "bg-amber-500", width: "66%" };
    return { label: "Kuat", color: "bg-emerald-500", width: "100%" };
  };

  const pwdStrength = getPasswordStrength(passwordForm.newPassword);

  return (
    <div className="space-y-6 pb-10">
      {/* =====================================================================
          1. HEADER & BREADCRUMB
      ====================================================================== */}
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
          <span className="text-app-primary font-bold">Profil Saya</span>
        </nav>

        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Profil Saya
        </h1>
        <p className="text-xs text-slate-500">
          Kelola informasi akun pemohon, legalitas organisasi/lembaga, dan
          keamanan kata sandi Anda.
        </p>
      </div>

      {/* Notifikasi Toast / Error API */}
      {(toastBanner || activeError) && (
        <div
          role={
            toastBanner?.type === "error" || activeError ? "alert" : "status"
          }
          className={`flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-xs font-semibold shadow-2xs ${
            toastBanner?.type === "success" && !activeError
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {toastBanner?.type === "success" && !activeError ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{activeError || toastBanner?.message}</span>
        </div>
      )}

      {/* =====================================================================
          2. GRID UTAMA (KARTU PROFIL KIRI + PANEL PENGATURAN KANAN)
      ====================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* KOLOM KIRI (4 KOLOM): KARTU IDENTITAS RINGKAS */}
        <aside className="lg:col-span-4 space-y-5">
          <div className="rounded-3xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden">
            {/* Banner Header Kartu */}
            <div className="h-24 bg-gradient-to-br from-app-primary-950 via-app-primary-900 to-app-primary relative">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(#ffffff18_1px,transparent_1px)] [background-size:16px_16px] opacity-60"
              />
            </div>

            <div className="px-5 pb-6 -mt-11 relative">
              {/* Avatar + Tombol Upload Foto */}
              <div className="flex items-end justify-between">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-gradient-to-br from-app-primary to-app-primary-800 text-white flex items-center justify-center ring-4 ring-white shadow-md">
                  {displayAvatar ? (
                    <Image
                      src={displayAvatar}
                      alt={displayName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span className="text-xl font-extrabold text-app-secondary-200">
                      {userInitials}
                    </span>
                  )}

                  {isUpdatingPhoto && (
                    <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                    </div>
                  )}
                </div>

                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleAvatarChange}
                  disabled={isUpdatingPhoto}
                  className="hidden"
                />

                <button
                  type="button"
                  disabled={isUpdatingPhoto}
                  onClick={() => avatarInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-app-primary-50 disabled:opacity-60 text-slate-700 hover:text-app-primary text-[11px] font-bold shadow-2xs transition-colors cursor-pointer"
                >
                  {isUpdatingPhoto ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-app-primary" />
                  ) : (
                    <Camera className="w-3.5 h-3.5 text-app-primary" />
                  )}
                  <span>
                    {isUpdatingPhoto ? "Mengunggah..." : "Ganti Foto"}
                  </span>
                </button>
              </div>

              {/* Nama & Organisasi */}
              <div className="mt-3.5 space-y-1">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-base font-extrabold text-slate-900 truncate">
                    {displayName}
                  </h2>
                  <BadgeCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>
                <p className="text-xs font-semibold text-app-primary">
                  {displayOrgName}
                </p>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-bold">
                  Akun Pemohon Aktif
                </span>
              </div>

              {/* Info Kontak Singkat */}
              <div className="mt-5 pt-4 border-t border-slate-100 space-y-2.5 text-xs">
                <div className="flex items-center gap-2.5 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{personalData.email || "-"}</span>
                </div>
                <div className="flex items-center gap-2.5 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{personalData.nomorHp || "-"}</span>
                </div>
                <div className="flex items-start gap-2.5 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-[11px] leading-relaxed">
                    {orgData.alamatOrganisasi ||
                      personalData.alamatLengkap ||
                      "Alamat belum dilengkapi"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Info Sinkronisasi Formulir */}
          <div className="rounded-2xl bg-app-primary-50/70 border border-app-primary-200/80 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-extrabold text-app-primary-950">
              <Info className="w-4 h-4 text-app-primary shrink-0" />
              <span>Sinkronisasi Pengajuan</span>
            </div>
            <p className="text-[11px] text-slate-700 leading-relaxed">
              Data identitas pemohon dan profil organisasi yang Anda simpan di
              halaman ini akan otomatis digunakan sebagai isian awal saat
              membuat{" "}
              <Link
                href="/dashboard/pemohon/buat-pengajuan"
                className="font-bold text-app-primary hover:underline underline-offset-4"
              >
                Pengajuan Hibah Baru
              </Link>
              .
            </p>
          </div>
        </aside>

        {/* KOLOM KANAN (8 KOLOM): TABS & FORM PENGATURAN */}
        <div className="lg:col-span-8 space-y-5">
          {/* Navigasi Tab */}
          <div className="rounded-2xl bg-white border border-slate-200/80 p-1.5 shadow-2xs grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => setActiveTab("pribadi")}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "pribadi"
                  ? "bg-app-primary text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <User className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Data Pribadi</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("organisasi")}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === "organisasi"
                  ? "bg-app-primary text-white shadow-xs"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Building2 className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">Profil Lembaga</span>
            </button>
          </div>

          {/* =================================================================
              TAB 1: DATA PRIBADI PEMOHON
          ================================================================== */}
          {activeTab === "pribadi" && (
            <form
              onSubmit={handleSavePersonal}
              className="rounded-2xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden"
            >
              <div className="px-5 py-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">
                    Identitas Pribadi Pemohon
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Pastikan data diri sesuai dengan Kartu Tanda Penduduk (KTP)
                    yang masih berlaku.
                  </p>
                </div>
                {isLoadingProfile && (
                  <Loader2 className="w-4 h-4 animate-spin text-app-primary shrink-0" />
                )}
              </div>

              <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isLoadingProfile || isUpdatingProfile}
                    value={personalData.namaLengkap}
                    onChange={(e) =>
                      setPersonalData({
                        ...personalData,
                        namaLengkap: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15 disabled:opacity-60"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-slate-700">
                      NIK <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] text-slate-400">
                      {personalData.nik.length}/16 digit
                    </span>
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    disabled={isLoadingProfile || isUpdatingProfile}
                    value={personalData.nik}
                    onChange={(e) =>
                      setPersonalData({
                        ...personalData,
                        nik: e.target.value.replace(/\D/g, "").slice(0, 16),
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15 disabled:opacity-60"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Tempat Lahir <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isLoadingProfile || isUpdatingProfile}
                    value={personalData.tempatLahir}
                    onChange={(e) =>
                      setPersonalData({
                        ...personalData,
                        tempatLahir: e.target.value,
                      })
                    }
                    placeholder="Contoh: Sumbawa Besar"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15 disabled:opacity-60"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Tanggal Lahir <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      disabled={isLoadingProfile || isUpdatingProfile}
                      value={personalData.tanggalLahir}
                      onChange={(e) =>
                        setPersonalData({
                          ...personalData,
                          tanggalLahir: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15 disabled:opacity-60"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Jenis Kelamin <span className="text-red-500">*</span>
                    </label>
                    <select
                      disabled={isLoadingProfile || isUpdatingProfile}
                      value={personalData.jenisKelamin}
                      onChange={(e) =>
                        setPersonalData({
                          ...personalData,
                          jenisKelamin: e.target.value as "L" | "P",
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15 disabled:opacity-60"
                    >
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Nomor HP / WhatsApp
                  </label>
                  <input
                    type="tel"
                    disabled
                    value={personalData.nomorHp}
                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-xs text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    disabled
                    value={personalData.email}
                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-xs text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Alamat Lengkap <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    disabled={isLoadingProfile || isUpdatingProfile}
                    value={personalData.alamatLengkap}
                    onChange={(e) =>
                      setPersonalData({
                        ...personalData,
                        alamatLengkap: e.target.value,
                      })
                    }
                    placeholder="Masukkan alamat domisili sesuai KTP"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15 disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoadingProfile || isUpdatingProfile}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-app-primary hover:bg-app-primary-800 disabled:opacity-60 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  {isUpdatingProfile ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-app-secondary" />
                  ) : (
                    <Save className="w-3.5 h-3.5 text-app-secondary" />
                  )}
                  <span>Simpan Data Pribadi</span>
                </button>
              </div>
            </form>
          )}

          {/* =================================================================
              TAB 2: PROFIL ORGANISASI / LEMBAGA
          ================================================================== */}
          {activeTab === "organisasi" && (
            <form
              onSubmit={handleSaveOrganization}
              className="rounded-2xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden"
            >
              <div className="px-5 py-4 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-extrabold text-slate-900">
                    Identitas Organisasi / Lembaga
                  </h2>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Perbarui data legalitas akta pendirian, SK kepengurusan, dan
                    susunan pengurus organisasi.
                  </p>
                </div>
                {isLoadingOrg && (
                  <Loader2 className="w-4 h-4 animate-spin text-app-primary shrink-0" />
                )}
              </div>

              <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Nama Organisasi / Lembaga{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isLoadingOrg || isSavingOrg}
                    value={orgData.namaOrganisasi}
                    onChange={(e) =>
                      setOrgData({ ...orgData, namaOrganisasi: e.target.value })
                    }
                    placeholder="Contoh: Yayasan Nurul Iman Sumbawa"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15 disabled:opacity-60"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Jenis Organisasi <span className="text-red-500">*</span>
                  </label>
                  <select
                    disabled={isLoadingOrg || isSavingOrg}
                    value={orgData.jenisOrganisasi}
                    onChange={(e) =>
                      setOrgData({
                        ...orgData,
                        jenisOrganisasi: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15 disabled:opacity-60"
                  >
                    <option value="Yayasan / Lembaga Keagamaan">
                      Yayasan / Lembaga Keagamaan
                    </option>
                    <option value="Organisasi Kemasyarakatan (Ormas)">
                      Organisasi Kemasyarakatan (Ormas)
                    </option>
                    <option value="Lembaga Pendidikan Non-Formal / TPQ / Ponpes">
                      Lembaga Pendidikan Non-Formal / TPQ / Ponpes
                    </option>
                    <option value="Lembaga Sosial & Kemanusiaan">
                      Lembaga Sosial & Kemanusiaan
                    </option>
                    <option value="Kelompok Masyarakat / Karang Taruna">
                      Kelompok Masyarakat / Karang Taruna
                    </option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Nomor Akta Pendirian <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isLoadingOrg || isSavingOrg}
                    value={orgData.nomorAktaPendirian}
                    onChange={(e) =>
                      setOrgData({
                        ...orgData,
                        nomorAktaPendirian: e.target.value,
                      })
                    }
                    placeholder="Nomor Akta Notaris / Kemenkumham"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15 disabled:opacity-60"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Tanggal Pendirian <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      required
                      disabled={isLoadingOrg || isSavingOrg}
                      value={orgData.tanggalPendirian}
                      onChange={(e) =>
                        setOrgData({
                          ...orgData,
                          tanggalPendirian: e.target.value,
                        })
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15 disabled:opacity-60"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">
                      Nomor SK Organisasi{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      disabled={isLoadingOrg || isSavingOrg}
                      value={orgData.nomorSkOrganisasi}
                      onChange={(e) =>
                        setOrgData({
                          ...orgData,
                          nomorSkOrganisasi: e.target.value,
                        })
                      }
                      placeholder="Nomor SK Kepengurusan"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15 disabled:opacity-60"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Alamat Organisasi / Sekretariat{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    required
                    disabled={isLoadingOrg || isSavingOrg}
                    value={orgData.alamatOrganisasi}
                    onChange={(e) =>
                      setOrgData({
                        ...orgData,
                        alamatOrganisasi: e.target.value,
                      })
                    }
                    placeholder="Alamat lengkap sekretariat lembaga"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15 disabled:opacity-60"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Nama Ketua / Pimpinan{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isLoadingOrg || isSavingOrg}
                    value={orgData.namaKetua}
                    onChange={(e) =>
                      setOrgData({ ...orgData, namaKetua: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15 disabled:opacity-60"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Nomor HP Ketua <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    disabled={isLoadingOrg || isSavingOrg}
                    value={orgData.nomorHpKetua}
                    onChange={(e) =>
                      setOrgData({
                        ...orgData,
                        nomorHpKetua: e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 15),
                      })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15 disabled:opacity-60"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Nama Sekretaris <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isLoadingOrg || isSavingOrg}
                    value={orgData.namaSekretaris}
                    onChange={(e) =>
                      setOrgData({ ...orgData, namaSekretaris: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15 disabled:opacity-60"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Nama Bendahara <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={isLoadingOrg || isSavingOrg}
                    value={orgData.namaBendahara}
                    onChange={(e) =>
                      setOrgData({ ...orgData, namaBendahara: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 px-3.5 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15 disabled:opacity-60"
                  />
                </div>
              </div>

              <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoadingOrg || isSavingOrg}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-app-primary hover:bg-app-primary-800 disabled:opacity-60 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  {isSavingOrg ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-app-secondary" />
                  ) : (
                    <Save className="w-3.5 h-3.5 text-app-secondary" />
                  )}
                  <span>Simpan Profil Lembaga</span>
                </button>
              </div>
            </form>
          )}

          {/* =================================================================
              TAB 3: KEAMANAN & UBAH KATA SANDI
          ================================================================== */}
          {activeTab === "keamanan" && (
            <form
              onSubmit={handleUpdatePassword}
              className="rounded-2xl bg-white border border-slate-200/80 shadow-2xs overflow-hidden"
            >
              <div className="px-5 py-4 bg-slate-50/80 border-b border-slate-100">
                <h2 className="text-sm font-extrabold text-slate-900">
                  Keamanan Akun & Kata Sandi
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Gunakan kombinasi huruf besar, huruf kecil, dan angka minimal
                  8 karakter untuk menjaga keamanan akun.
                </p>
              </div>

              <div className="p-5 sm:p-6 space-y-4 max-w-lg">
                {/* Kata Sandi Saat Ini */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Kata Sandi Saat Ini <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPass.current ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          currentPassword: e.target.value,
                        })
                      }
                      placeholder="Masukkan kata sandi saat ini"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-3.5 pr-10 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPass({ ...showPass, current: !showPass.current })
                      }
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPass.current ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Kata Sandi Baru */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Kata Sandi Baru <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPass.new ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder="Minimal 8 karakter"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-3.5 pr-10 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPass({ ...showPass, new: !showPass.new })
                      }
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPass.new ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Meter Kekuatan Kata Sandi */}
                  {passwordForm.newPassword && (
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-slate-400">
                          Kekuatan Kata Sandi
                        </span>
                        <span className="font-bold text-slate-700">
                          {pwdStrength.label}
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${pwdStrength.color}`}
                          style={{ width: pwdStrength.width }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Konfirmasi Kata Sandi Baru */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Konfirmasi Kata Sandi Baru{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPass.confirm ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({
                          ...passwordForm,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="Ulangi kata sandi baru"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-3.5 pr-10 py-2.5 text-xs text-slate-900 focus:bg-white focus:border-app-primary focus:outline-none focus:ring-3 focus:ring-app-primary/15"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowPass({ ...showPass, confirm: !showPass.confirm })
                      }
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      {showPass.confirm ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-app-primary shrink-0" />
                  <span>Enkripsi sesi akun aktif</span>
                </div>

                <button
                  type="submit"
                  disabled={isSavingPassword}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-app-primary hover:bg-app-primary-800 disabled:opacity-60 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
                >
                  {isSavingPassword ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-app-secondary" />
                  ) : (
                    <LockKeyhole className="w-3.5 h-3.5 text-app-secondary" />
                  )}
                  <span>Perbarui Kata Sandi</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
