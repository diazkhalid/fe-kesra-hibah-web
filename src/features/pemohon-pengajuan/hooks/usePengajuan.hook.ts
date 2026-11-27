import { useState, useCallback } from "react";
import {
  pemohonUpsertPengajuan,
  pemohonGetHistoryPengajuan,
  pemohonDetailHistoryPengajuan,
} from "../services/pengajuan.service"; // Sesuaikan path import jika berbeda
import {
  GrantApplicationParams,
  PemohonGrantApplicationData,
  PemohonGrantApplicationDetail,
  PemohonUpsertGrantApplicationDto,
} from "../types/pengajuan.type";
import { useToast } from "@/shared/contexts/ToastContext";
import { Pagination } from "@/shared/types/option.type";

interface HistoryApiResponse {
  success: boolean;
  message: string;
  data: PemohonGrantApplicationData[];
  pagination: Pagination;
}

interface DetailHistoryApiResponse {
  success: boolean;
  message: string;
  data: PemohonGrantApplicationDetail;
}

const DEFAULT_PARAMS: GrantApplicationParams = {
  search: "",
  status: undefined,
  fiscal_year: undefined,
  submitted_from: "",
  submitted_until: "",
  page: 1,
  rows_per_page: 10,
};

export function usePemohonPengajuan(initialParams?: GrantApplicationParams) {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [history, setHistory] = useState<PemohonGrantApplicationData[]>([]);
  const [detailHistory, setDetailHistory] =
    useState<PemohonGrantApplicationDetail | null>(null);
  const [params, setParams] = useState<GrantApplicationParams>({
    ...DEFAULT_PARAMS,
    ...initialParams,
  });
  const [pagination, setPagination] = useState<Pagination>({
    limit: initialParams?.rows_per_page ?? 10,
    rows_per_page: initialParams?.rows_per_page ?? 10,
    page: initialParams?.page ?? 1,
    total: 0,
    total_pages: 1,
  });

  const { addToast } = useToast();

  const clearError = () => setError(null);

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access-token");
  };

  const buildCleanParams = (
    rawParams: GrantApplicationParams,
  ): GrantApplicationParams => {
    const cleaned: GrantApplicationParams = {};

    if (rawParams.search?.trim()) cleaned.search = rawParams.search.trim();
    if (rawParams.status) cleaned.status = rawParams.status;
    if (rawParams.fiscal_year) cleaned.fiscal_year = rawParams.fiscal_year;
    if (rawParams.submitted_from)
      cleaned.submitted_from = rawParams.submitted_from;
    if (rawParams.submitted_until)
      cleaned.submitted_until = rawParams.submitted_until;
    if (rawParams.page) cleaned.page = rawParams.page;
    if (rawParams.rows_per_page)
      cleaned.rows_per_page = rawParams.rows_per_page;

    return cleaned;
  };

  const fetchHistory = useCallback(
    async (overrideParams?: GrantApplicationParams) => {
      const token = getToken();
      if (!token) {
        setError("Sesi login tidak ditemukan, silakan login kembali.");
        return [];
      }

      const activeParams = overrideParams ?? params;
      const cleanedParams = buildCleanParams(activeParams);

      setIsLoadingHistory(true);
      setError(null);

      try {
        const result = await pemohonGetHistoryPengajuan(token, cleanedParams);

        if (result.status !== 200 || !("data" in result)) {
          if (
            result.status >= 400 &&
            result.status <= 499 &&
            "message" in result
          ) {
            setError(String(result.message));
            return [];
          }
          setError("Gagal memuat riwayat pengajuan hibah, silakan coba lagi!");
          return [];
        }

        clearError();

        const responseBody = result.data as HistoryApiResponse;
        const listData = Array.isArray(responseBody.data)
          ? responseBody.data
          : [];

        setHistory(listData);

        if (responseBody.pagination) {
          setPagination({
            limit: responseBody.pagination.limit,
            rows_per_page: responseBody.pagination.rows_per_page,
            page: responseBody.pagination.page,
            total: responseBody.pagination.total,
            total_pages: Math.max(1, responseBody.pagination.total_pages),
          });
        }

        return listData;
      } finally {
        setIsLoadingHistory(false);
      }
    },
    [params],
  );

  const fetchDetailHistory = useCallback(async (id: string) => {
    const token = getToken();
    if (!token) {
      setError("Sesi login tidak ditemukan, silakan login kembali.");
      return null;
    }

    if (!id) {
      setError("ID pengajuan tidak valid.");
      return null;
    }

    setIsLoadingDetail(true);
    setError(null);

    try {
      const result = await pemohonDetailHistoryPengajuan(token, id);

      if (result.status !== 200 || !("data" in result)) {
        if (
          result.status >= 400 &&
          result.status <= 499 &&
          "message" in result
        ) {
          setError(String(result.message));
          setDetailHistory(null);
          return null;
        }
        setError("Gagal memuat detail pengajuan hibah, silakan coba lagi!");
        setDetailHistory(null);
        return null;
      }

      clearError();

      const responseBody = result.data as DetailHistoryApiResponse;
      const detailData = responseBody?.data ?? null;

      setDetailHistory(detailData);
      return detailData;
    } finally {
      setIsLoadingDetail(false);
    }
  }, []);

  const updateFilters = useCallback(
    (newFilters: Partial<GrantApplicationParams>) => {
      setParams((prev) => ({
        ...prev,
        ...newFilters,
        page: 1,
      }));
    },
    [],
  );

  const setPage = useCallback((page: number) => {
    setParams((prev) => ({
      ...prev,
      page: Math.max(1, page),
    }));
  }, []);

  const setRowsPerPage = useCallback((rows_per_page: number) => {
    setParams((prev) => ({
      ...prev,
      rows_per_page,
      page: 1,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setParams({
      ...DEFAULT_PARAMS,
      ...initialParams,
      page: 1,
    });
  }, [initialParams]);

  const upsertPengajuan = async (payload: PemohonUpsertGrantApplicationDto) => {
    const token = getToken();
    if (!token) {
      setError("Sesi login tidak ditemukan, silakan login kembali.");
      return { success: false, data: null };
    }

    setIsSaving(true);
    setError(null);

    try {
      const result = await pemohonUpsertPengajuan(token, payload);

      if (result.status !== 200 && result.status !== 201) {
        if (
          result.status >= 400 &&
          result.status <= 499 &&
          "message" in result
        ) {
          setError(String(result.message));
          return { success: false, data: null };
        }
        setError("Gagal menyimpan pengajuan hibah, silakan coba lagi!");
        return { success: false, data: null };
      }

      clearError();
      addToast("Pengajuan hibah berhasil disimpan!", "success");

      const responseData =
        "data" in result ? (result.data?.data ?? result.data ?? null) : null;

      return { success: true, data: responseData };
    } finally {
      setIsSaving(false);
    }
  };

  return {
    // Upsert
    isSaving,
    upsertPengajuan,

    // History, Filter & Pagination
    history,
    isLoadingHistory,
    params,
    pagination,
    fetchHistory,
    updateFilters,
    setPage,
    setRowsPerPage,
    resetFilters,

    // Detail History
    detailHistory,
    isLoadingDetail,
    fetchDetailHistory,

    // Error handling
    error,
    clearError,
  };
}
