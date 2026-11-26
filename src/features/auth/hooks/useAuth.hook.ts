import { useState } from "react";
import { login, register } from "../services/auth.service"; // Sesuaikan path import jika berbeda
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

  return {
    isLoading,
    error,
    clearError,
    login: handleLogin,
    register: handleRegister,
  };
}
