import API_ENDPOINT from "@/shared/global/api_endpoints";
import { handleServiceError } from "@/shared/utils/handleServiceError.util";
import axios from "axios";
import {
  AdminGrantApplicationAdminParams,
  AdminGrantVerificationDto,
} from "../types/pengajuan.type";

export async function adminGetPengajuan(
  token: string,
  params: AdminGrantApplicationAdminParams,
) {
  try {
    const response = await axios.get(API_ENDPOINT.ADMIN.PENGAJUAN.INDEX, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return response;
  } catch (error) {
    console.log(error);
    return handleServiceError(error);
  }
}

export async function adminDetailPengajuan(token: string, id: string) {
  try {
    const response = await axios.get(API_ENDPOINT.ADMIN.PENGAJUAN.DETAIL(id), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    console.log(error);
    return handleServiceError(error);
  }
}

export async function adminVerifikasiPengajuan(
  token: string,
  id: string,
  payload: AdminGrantVerificationDto,
) {
  try {
    const response = await axios.post(
      API_ENDPOINT.ADMIN.PENGAJUAN.VERIFICATION(id),
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );
    return response;
  } catch (error) {
    console.log(error);
    return handleServiceError(error);
  }
}
