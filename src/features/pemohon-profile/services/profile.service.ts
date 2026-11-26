import API_ENDPOINT from "@/shared/global/api_endpoints";
import { handleServiceError } from "@/shared/utils/handleServiceError.util";
import axios from "axios";
import {
  PemohonUpdateProfileDto,
  PemohonUpdateProfilePhotoDto,
} from "../types/profile.type";

export async function pemohonGetProfile(token: string) {
  try {
    const response = await axios.get(API_ENDPOINT.PEMOHON.PROFILE.GET_BY_AUTH, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    console.log(error);
    return handleServiceError(error);
  }
}

export async function pemohonUpdateProfile(
  token: string,
  payload: PemohonUpdateProfileDto,
) {
  try {
    const response = await axios.put(
      API_ENDPOINT.PEMOHON.PROFILE.UPDATE,
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

export async function pemohonUpdateProfilePhoto(
  token: string,
  payload: PemohonUpdateProfilePhotoDto,
) {
  try {
    const formData = new FormData();
    formData.append("image", payload.image);
    const response = await axios.post(
      API_ENDPOINT.PEMOHON.PROFILE.PROFILE_PHOTO,
      formData,
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
