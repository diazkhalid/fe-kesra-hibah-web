import { useState, useCallback } from "react";
import {
  pemohonGetOrganization,
  pemohonUpsertOrganization,
} from "../services/organization.service"; // Sesuaikan path import jika berbeda
import {
  PemohonOrganizationData,
  PemohonUpsertOrganizationDto,
} from "../types/organization.type";
import { useToast } from "@/shared/contexts/ToastContext";

export function usePemohonOrganization() {
  const [organization, setOrganization] =
    useState<PemohonOrganizationData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { addToast } = useToast();

  const clearError = () => setError(null);

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access-token");
  };

  const fetchOrganization = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setError("Sesi login tidak ditemukan, silakan login kembali.");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await pemohonGetOrganization(token);

      if (result.status !== 200) {
        // Jika 404 (pemohon belum mengisi data lembaga), jangan dianggap error fatal
        if (result.status === 404) {
          setOrganization(null);
          return null;
        }

        if (
          result.status >= 400 &&
          result.status <= 499 &&
          "message" in result
        ) {
          setError(String(result.message));
          return null;
        }

        setError("Gagal memuat data lembaga, silakan coba lagi!");
        return null;
      }

      clearError();
      const orgData: PemohonOrganizationData | null =
        "data" in result ? (result.data?.data ?? result.data ?? null) : null;
      setOrganization(orgData);
      return orgData;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const upsertOrganization = async (payload: PemohonUpsertOrganizationDto) => {
    const token = getToken();
    if (!token) {
      setError("Sesi login tidak ditemukan, silakan login kembali.");
      return false;
    }

    setIsSaving(true);
    setError(null);

    try {
      const result = await pemohonUpsertOrganization(token, payload);

      if (result.status !== 200 && result.status !== 201) {
        if (
          result.status >= 400 &&
          result.status <= 499 &&
          "message" in result
        ) {
          setError(String(result.message));
          return false;
        }
        setError("Gagal menyimpan data lembaga, silakan coba lagi!");
        return false;
      }

      clearError();
      addToast("Data lembaga berhasil disimpan!", "success");

      // Perbarui state organization setelah upsert berhasil
      const savedData: PemohonOrganizationData | null =
        "data" in result ? (result.data?.data ?? result.data ?? null) : null;

      if (savedData && typeof savedData === "object" && "id" in savedData) {
        setOrganization(savedData);
      } else {
        await fetchOrganization();
      }

      return true;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    organization,
    isLoading,
    isSaving,
    error,
    clearError,
    fetchOrganization,
    upsertOrganization,
  };
}
