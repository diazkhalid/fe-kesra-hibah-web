import APP_CONFIG from "./app_config";

const baseUrl = APP_CONFIG.API_BASE_URL;
const API_ENDPOINT = {
  AUTH: {
    REGISTER: `${baseUrl}/auth/register`,
    LOGIN: `${baseUrl}/auth/login`,
    VERIFY_EMAIL: `${baseUrl}/auth/verify-email`,
    ME: `${baseUrl}/auth/me`,
  },
  OPTION: {
    DOCUMENT: {
      INDEX: `${baseUrl}/option/document-types`,
    },
  },
  PEMOHON: {
    PROFILE: {
      GET_BY_AUTH: `${baseUrl}/pemohon/profile`,
      UPDATE: `${baseUrl}/pemohon/profile`,
      PROFILE_PHOTO: `${baseUrl}/pemohon/profile/photo`,
    },
    ORGANIZATION: {
      GET_BY_AUTH: `${baseUrl}/pemohon/organization`,
      UPSERT: `${baseUrl}/pemohon/organization`,
    },
    PENGAJUAN: {
      UPSERT: `${baseUrl}/pemohon/submissions`,
      DETAIL: (id: string) => `${baseUrl}/pemohon/submissions/${id}`,
      HISTORY: `${baseUrl}/pemohon/submissions`,
    },
  },
  ADMIN: {
    PENGAJUAN: {
      INDEX: `${baseUrl}/admin/submissions`,
      DETAIL: (id: string) => `${baseUrl}/admin/submissions/${id}`,
      VERIFICATION: (id: string) =>
        `${baseUrl}/admin/submissions/${id}/verification`,
    },
  },
};

export default API_ENDPOINT;
