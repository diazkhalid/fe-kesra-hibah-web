import { useState, useCallback } from "react";
import {
  adminGetPengajuan,
  adminDetailPengajuan,
  adminVerifikasiPengajuan,
} from "../services/pengajuan.service"; // Sesuaikan path import jika berbeda
import {
  AdminGrantApplicationAdminParams,
  AdminGrantApplicationData,
  AdminGrantApplicationDetail,
  AdminGrantVerificationDto,
} from "../types/pengajuan.type";
import { Pagination } from "@/shared/types/option.type";
import { useToast } from "@/shared/contexts/ToastContext";

interface AdminIndexApiResponse {
  success: boolean;
  message: string;
  data: AdminGrantApplicationData[];
  pagination: Pagination;
}

interface AdminDetailApiResponse {
  success: boolean;
  message: string;
  data: AdminGrantApplicationDetail;
}

const DEFAULT_PARAMS: AdminGrantApplicationAdminParams = {
  submission_number: "",
  applicant_name: "",
  organization_name: "",
  status: undefined,
  fiscal_year: undefined,
  submitted_from: "",
  submitted_until: "",
  page: 1,
  rows_per_page: 10,
};

export function useAdminPengajuan(
  initialParams?: AdminGrantApplicationAdminParams,
) {
  const [isLoadingList, setIsLoadingList] = useState<boolean>(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [pengajuanList, setPengajuanList] = useState<
    AdminGrantApplicationData[]
  >([]);
  const [detailPengajuan, setDetailPengajuan] =
    useState<AdminGrantApplicationDetail | null>(null);

  const [params, setParams] = useState<AdminGrantApplicationAdminParams>({
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

  // Bersihkan parameter kosong sebelum dikirim ke endpoint index
  const buildCleanParams = (
    rawParams: AdminGrantApplicationAdminParams,
  ): AdminGrantApplicationAdminParams => {
    const cleaned: AdminGrantApplicationAdminParams = {};

    if (rawParams.submission_number?.trim()) {
      cleaned.submission_number = rawParams.submission_number.trim();
    }
    if (rawParams.applicant_name?.trim()) {
      cleaned.applicant_name = rawParams.applicant_name.trim();
    }
    if (rawParams.organization_name?.trim()) {
      cleaned.organization_name = rawParams.organization_name.trim();
    }
    if (rawParams.status) cleaned.status = rawParams.status;
    if (rawParams.fiscal_year) cleaned.fiscal_year = rawParams.fiscal_year;
    if (rawParams.submitted_from) {
      cleaned.submitted_from = rawParams.submitted_from;
    }
    if (rawParams.submitted_until) {
      cleaned.submitted_until = rawParams.submitted_until;
    }
    if (rawParams.page) cleaned.page = rawParams.page;
    if (rawParams.rows_per_page) {
      cleaned.rows_per_page = rawParams.rows_per_page;
    }

    return cleaned;
  };

  // 1. INDEX: Ambil daftar pengajuan hibah + pagination
  const fetchPengajuanList = useCallback(
    async (overrideParams?: AdminGrantApplicationAdminParams) => {
      const token = getToken();
      if (!token) {
        setError("Sesi login tidak ditemukan, silakan login kembali.");
        return [];
      }

      const activeParams = overrideParams ?? params;
      const cleanedParams = buildCleanParams(activeParams);

      setIsLoadingList(true);
      setError(null);

      try {
        const result = await adminGetPengajuan(token, cleanedParams);

        if (result.status !== 200 || !("data" in result)) {
          if (
            result.status >= 400 &&
            result.status <= 499 &&
            "message" in result
          ) {
            setError(String(result.message));
            return [];
          }
          setError("Gagal memuat daftar pengajuan hibah, silakan coba lagi!");
          return [];
        }

        clearError();

        const responseBody = result.data as AdminIndexApiResponse;
        const listData = Array.isArray(responseBody.data)
          ? responseBody.data
          : [];

        setPengajuanList(listData);

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
        setIsLoadingList(false);
      }
    },
    [params],
  );

  // 2. DETAIL: Ambil detail pengajuan berdasarkan ID
  const fetchDetailPengajuan = useCallback(async (id: string) => {
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
      const result = await adminDetailPengajuan(token, id);

      if (result.status !== 200 || !("data" in result)) {
        if (
          result.status >= 400 &&
          result.status <= 499 &&
          "message" in result
        ) {
          setError(String(result.message));
          setDetailPengajuan(null);
          return null;
        }
        setError("Gagal memuat detail pengajuan hibah, silakan coba lagi!");
        setDetailPengajuan(null);
        return null;
      }

      clearError();

      const responseBody = result.data as AdminDetailApiResponse;
      const detailData = responseBody?.data ?? null;

      setDetailPengajuan(detailData);
      return detailData;
    } finally {
      setIsLoadingDetail(false);
    }
  }, []);

  // 3. VERIFIKASI: Kirim keputusan verifikasi (terverifikasi / ditolak)
  const verifikasiPengajuan = async (
    id: string,
    payload: AdminGrantVerificationDto,
  ) => {
    const token = getToken();
    if (!token) {
      setError("Sesi login tidak ditemukan, silakan login kembali.");
      return { success: false, data: null };
    }

    setIsVerifying(true);
    setError(null);

    try {
      const result = await adminVerifikasiPengajuan(token, id, payload);

      if (result.status !== 200 && result.status !== 201) {
        if (
          result.status >= 400 &&
          result.status <= 499 &&
          "message" in result
        ) {
          setError(String(result.message));
          return { success: false, data: null };
        }
        setError("Gagal memproses verifikasi pengajuan, silakan coba lagi!");
        return { success: false, data: null };
      }

      clearError();
      const toastMsg =
        payload.decision === "terverifikasi"
          ? "Pengajuan berhasil diverifikasi!"
          : "Pengajuan telah ditolak.";
      addToast(toastMsg, "success");

      // Refresh data detail jika sedang membuka halaman detail pengajuan terkait
      if (detailPengajuan?.id === id) {
        await fetchDetailPengajuan(id);
      }

      const responseData =
        "data" in result ? (result.data?.data ?? result.data ?? null) : null;

      return { success: true, data: responseData };
    } finally {
      setIsVerifying(false);
    }
  };

  // Helper Filter & Pagination
  const updateFilters = useCallback(
    (newFilters: Partial<AdminGrantApplicationAdminParams>) => {
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

  return {
    // Index, Filter & Pagination
    pengajuanList,
    isLoadingList,
    params,
    pagination,
    fetchPengajuanList,
    updateFilters,
    setPage,
    setRowsPerPage,
    resetFilters,

    // Detail
    detailPengajuan,
    isLoadingDetail,
    fetchDetailPengajuan,

    // Verifikasi
    isVerifying,
    verifikasiPengajuan,

    // Error handling
    error,
    clearError,
  };
}
