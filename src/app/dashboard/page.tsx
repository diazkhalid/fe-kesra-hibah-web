"use client";
import { useAuthUser } from "@/shared/contexts/SessionContext";
import { useToast } from "@/shared/contexts/ToastContext";
import { getUserDashboardPath } from "@/shared/utils/getUserDashboardPath.util";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuthUser();

  useEffect(() => {
    const checkAccountType = () => {
      console.log(user);
      if (isLoading) return;

      if (!user) {
        return;
      }

      router.push(getUserDashboardPath(user.role));
    };
    checkAccountType();
  }, [user]);

  return null;
}
