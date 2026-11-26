import API_ENDPOINT from "@/shared/global/api_endpoints";
import { handleServiceError } from "@/shared/utils/handleServiceError.util";
import axios from "axios";
import { PemohonUpsertOrganizationDto } from "../types/organization.type";

export async function pemohonGetOrganization(token: string) {
  try {
    const response = await axios.get(
      API_ENDPOINT.PEMOHON.ORGANIZATION.GET_BY_AUTH,
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

export async function pemohonUpsertOrganization(
  token: string,
  payload: PemohonUpsertOrganizationDto,
) {
  try {
    const response = await axios.put(
      API_ENDPOINT.PEMOHON.ORGANIZATION.UPSERT,
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
