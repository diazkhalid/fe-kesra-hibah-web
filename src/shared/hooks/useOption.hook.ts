import { useState, useCallback } from "react";
import { getDocumentOption } from "../services/option.service"; // Sesuaikan path import jika berbeda
import { GrantDocumentOptionType } from "../types/option.type"; // Sesuaikan path import jika berbeda

export function useOptions() {
  const [documentOptions, setDocumentOptions] = useState<
    GrantDocumentOptionType[]
  >([]);
  const [isLoadingDocuments, setIsLoadingDocuments] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access-token");
  };

  const fetchDocumentOptions = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setError("Sesi login tidak ditemukan, silakan login kembali.");
      return [];
    }

    setIsLoadingDocuments(true);
    setError(null);

    try {
      const result = await getDocumentOption(token);

      if (result.status !== 200) {
        if (
          result.status >= 400 &&
          result.status <= 499 &&
          "message" in result
        ) {
          setError(String(result.message));
          return [];
        }
        setError("Gagal memuat daftar persyaratan dokumen, silakan coba lagi!");
        return [];
      }

      clearError();
      const rawData =
        "data" in result ? (result.data?.data ?? result.data ?? []) : [];
      const options: GrantDocumentOptionType[] = Array.isArray(rawData)
        ? rawData
        : [];

      setDocumentOptions(options);
      return options;
    } finally {
      setIsLoadingDocuments(false);
    }
  }, []);

  return {
    documentOptions,
    isLoadingDocuments,
    error,
    clearError,
    fetchDocumentOptions,
  };
}
