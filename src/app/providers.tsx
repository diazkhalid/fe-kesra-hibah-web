"use client";
import { ConfirmProvider } from "@/shared/contexts/ConfirmDialogContext";
import { AuthUserProvider } from "@/shared/contexts/SessionContext";
import { ToastProvider } from "@/shared/contexts/ToastContext";
import React, { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ToastProvider>
      <AuthUserProvider>
        <ConfirmProvider>{children}</ConfirmProvider>
      </AuthUserProvider>
    </ToastProvider>
  );
}
