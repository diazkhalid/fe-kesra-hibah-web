"use client";
import { useAuthUser } from "@/shared/contexts/SessionContext";
import { useToast } from "@/shared/contexts/ToastContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuthUser();
  const { addToast } = useToast();

  useEffect(() => {
    const checkLogin = () => {
      if (isLoading) return;

      if (!user && !isLoading) {
        addToast("Sesi habis, silahkan login kembali!", "warning", 3000);
        router.push("/login");
      }
    };
    checkLogin();
  }, [user, isLoading, router]);

  return <div>{children}</div>;
}
