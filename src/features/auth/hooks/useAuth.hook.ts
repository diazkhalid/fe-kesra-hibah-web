import { useState } from "react";
import { login, register, verifyEmail } from "../services/auth.service"; // Sesuaikan path import jika berbeda
import { UserLoginDto } from "../types/login.type";
import { UserRegisterDto } from "../types/register.type";
import { useToast } from "@/shared/contexts/ToastContext";
import { useRouter } from "next/navigation";

export function useAuth() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();
  const router = useRouter();

  const clearError = () => setError(null);

  const handleLogin = async (payload: UserLoginDto) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await login(payload);

      if (result.status !== 200) {
        if (
          result.status >= 400 &&
          result.status <= 499 &&
          "message" in result
        ) {
          setError(String(result.message));
          return;
        }
        setError("Gagal login, silahkan coba lagi!");
        return;
      }

      clearError();
      router.push("/dashboard/pemohon");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (payload: UserRegisterDto) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await register(payload);

      if (result.status !== 201) {
        if (
          result.status >= 400 &&
          result.status <= 499 &&
          "message" in result
        ) {
          setError(String(result.message));
          return;
        }
        setError("Gagal mendaftarkan akun, silahkan coba lagi!");
        return;
      }

      clearError();
      addToast("Berhasil mendaftar!", "success");
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async (token: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await verifyEmail(token);

      if (result.status !== 200) {
        const msg =
          result.status >= 400 && result.status <= 499 && "message" in result
            ? String(result.message)
            : "Tautan verifikasi tidak valid atau sudah kedaluwarsa.";
        setError(msg);
        return { success: false, message: msg };
      }

      clearError();
      const successMsg =
        "data" in result && result.data?.message
          ? String(result.data.message)
          : "Alamat email Anda telah terkonfirmasi. Anda kini dapat masuk dan mulai mengajukan proposal.";
      addToast("Email berhasil diverifikasi!", "success");
      return { success: true, message: successMsg };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    clearError,
    login: handleLogin,
    register: handleRegister,
    verifyEmail: handleVerifyEmail,
  };
}
