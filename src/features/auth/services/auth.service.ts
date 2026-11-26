import API_ENDPOINT from "@/shared/global/api_endpoints";
import { handleServiceError } from "@/shared/utils/handleServiceError.util";
import axios from "axios";
import { UserRegisterDto } from "../types/register.type";
import { UserLoginDto } from "../types/login.type";

export async function register(payload: UserRegisterDto) {
  try {
    const response = await axios.post(API_ENDPOINT.AUTH.REGISTER, payload);
    return response;
  } catch (error) {
    console.log(error);
    return handleServiceError(error);
  }
}

export async function login(payload: UserLoginDto) {
  try {
    const response = await axios.post(API_ENDPOINT.AUTH.LOGIN, payload);
    return response;
  } catch (error) {
    console.log(error);
    return handleServiceError(error);
  }
}

export async function me(token: string) {
  try {
    const response = await axios.get(API_ENDPOINT.AUTH.ME, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return {
      success: true,
      status: response.status,
      message: response.statusText,
      data: response.data,
    };
  } catch (error) {
    console.log(error);
    return handleServiceError(error);
  }
}
