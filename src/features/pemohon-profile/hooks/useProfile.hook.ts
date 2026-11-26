import { useState, useCallback } from "react";
import {
  pemohonGetProfile,
  pemohonUpdateProfile,
  pemohonUpdateProfilePhoto,
} from "../services/profile.service"; // Sesuaikan path import jika berbeda
import {
  PemohonProfileData,
  PemohonUpdateProfileDto,
  PemohonUpdateProfilePhotoDto,
} from "../types/profile.type";
import { useToast } from "@/shared/contexts/ToastContext";
import { useAuthUser } from "@/shared/contexts/SessionContext";

export function usePemohonProfile() {
  const [profile, setProfile] = useState<PemohonProfileData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isUpdatingPhoto, setIsUpdatingPhoto] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { addToast } = useToast();
  const { setToggleUpdateAuth } = useAuthUser();

  const clearError = () => setError(null);

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access-token");
  };

  const fetchProfile = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setError("Sesi login tidak ditemukan, silakan login kembali.");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await pemohonGetProfile(token);

      if (result.status !== 200) {
        if (
          result.status >= 400 &&
          result.status <= 499 &&
          "message" in result
        ) {
          setError(String(result.message));
          return null;
        }
        setError("Gagal memuat data profil, silakan coba lagi!");
        return null;
      }

      clearError();
      const profileData: PemohonProfileData =
        "data" in result ? (result.data?.data ?? result.data) : null;
      setProfile(profileData);
      return profileData;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = async (payload: PemohonUpdateProfileDto) => {
    const token = getToken();
    if (!token) {
      setError("Sesi login tidak ditemukan, silakan login kembali.");
      return false;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const result = await pemohonUpdateProfile(token, payload);

      if (result.status !== 200 && result.status !== 201) {
        if (
          result.status >= 400 &&
          result.status <= 499 &&
          "message" in result
        ) {
          setError(String(result.message));
          return false;
        }
        setError("Gagal memperbarui profil, silakan coba lagi!");
        return false;
      }

      clearError();
      addToast("Profil berhasil diperbarui!", "success");

      // Refresh data profil lokal & sesi navbar
      await fetchProfile();
      setToggleUpdateAuth((prev) => !prev);
      return true;
    } finally {
      setIsUpdating(false);
    }
  };

  const updateProfilePhoto = async (payload: PemohonUpdateProfilePhotoDto) => {
    const token = getToken();
    if (!token) {
      setError("Sesi login tidak ditemukan, silakan login kembali.");
      return false;
    }

    setIsUpdatingPhoto(true);
    setError(null);

    try {
      const result = await pemohonUpdateProfilePhoto(token, payload);

      if (result.status !== 200 && result.status !== 201) {
        if (
          result.status >= 400 &&
          result.status <= 499 &&
          "message" in result
        ) {
          setError(String(result.message));
          return false;
        }
        setError("Gagal memperbarui foto profil, silakan coba lagi!");
        return false;
      }

      clearError();
      addToast("Foto profil berhasil diperbarui!", "success");

      // Refresh data profil lokal & foto di navbar
      await fetchProfile();
      setToggleUpdateAuth((prev) => !prev);
      return true;
    } finally {
      setIsUpdatingPhoto(false);
    }
  };

  return {
    profile,
    isLoading,
    isUpdating,
    isUpdatingPhoto,
    error,
    clearError,
    fetchProfile,
    updateProfile,
    updateProfilePhoto,
  };
}
