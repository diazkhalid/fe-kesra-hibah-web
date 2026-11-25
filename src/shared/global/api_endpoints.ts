import APP_CONFIG from "./app_config";

const baseUrl = APP_CONFIG.API_BASE_URL;
const API_ENDPOINT = {
  AUTH: {
    REGISTER: `${baseUrl}/auth/register`,
    LOGIN: `${baseUrl}/auth/login`,
    VERIFY_EMAIL: `${baseUrl}/auth/verify-email`,
    ME: `${baseUrl}/auth/me`,
  },
};

export default API_ENDPOINT;
