import axios from "axios";
import { handleServiceError } from "../utils/handleServiceError.util";
import API_ENDPOINT from "../global/api_endpoints";

export async function getDocumentOption(token: string) {
  try {
    const response = await axios.get(API_ENDPOINT.OPTION.DOCUMENT.INDEX, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response;
  } catch (error) {
    console.log(error);
    return handleServiceError(error);
  }
}
