import API_ENDPOINT from "@/shared/global/api_endpoints";
import { handleServiceError } from "@/shared/utils/handleServiceError.util";
import axios from "axios";
import {
  GrantApplicationParams,
  PemohonUpsertGrantApplicationDto,
} from "../types/pengajuan.type";

export async function pemohonUpsertPengajuan(
  token: string,
  payload: PemohonUpsertGrantApplicationDto,
) {
  try {
    const formData = new FormData();

    // Append basic fields
    formData.append("fiscal_year", String(payload.fiscal_year));
    formData.append("field", payload.field);
    formData.append("activity_name", payload.activity_name);
    formData.append("background", payload.background);
    formData.append("objectives", payload.objectives);
    formData.append("requested_amount", String(payload.requested_amount));
    formData.append("activity_location", payload.activity_location);
    formData.append("activity_period", payload.activity_period);
    formData.append("expected_benefits", payload.expected_benefits);
    formData.append(
      "declaration_accepted",
      String(payload.declaration_accepted),
    );

    // Append documents
    payload.documents.forEach((document, index) => {
      formData.append(`document_type[${index}]`, document.document_type);

      if (document.file) {
        formData.append(`file[${index}]`, document.file);
      }
    });

    const response = await axios.put(
      API_ENDPOINT.PEMOHON.PENGAJUAN.UPSERT,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    return response;
  } catch (error) {
    console.log(error);
    return handleServiceError(error);
  }
}

export async function pemohonGetHistoryPengajuan(
  token: string,
  params: GrantApplicationParams,
) {
  try {
    const response = await axios.get(API_ENDPOINT.PEMOHON.PENGAJUAN.HISTORY, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    return response;
  } catch (error) {
    console.log(error);
    return handleServiceError(error);
  }
}

export async function pemohonDetailHistoryPengajuan(token: string, id: string) {
  try {
    const response = await axios.get(
      API_ENDPOINT.PEMOHON.PENGAJUAN.DETAIL(id),
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
