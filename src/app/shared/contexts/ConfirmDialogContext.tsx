"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, CheckCircle2 } from "lucide-react";

interface ConfirmExtraOptions {
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "primary";
}

type ConfirmFunction = (
  message: ReactNode,
  title?: string,
  extraOptions?: ConfirmExtraOptions,
) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmFunction | undefined>(undefined);

interface ConfirmState {
  message: ReactNode;
  title: string;
  confirmText: string;
  cancelText: string;
  variant: "danger" | "primary";
}

interface ConfirmProviderProps {
  children: ReactNode;
}

export const ConfirmProvider = ({ children }: ConfirmProviderProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [options, setOptions] = useState<ConfirmState>({
    message: "",
    title: "Konfirmasi",
    confirmText: "Ya, Lanjutkan",
    cancelText: "Batal",
    variant: "danger",
  });
  const [resolvePromise, setResolvePromise] = useState<
    ((value: boolean) => void) | null
  >(null);

  const confirm = useCallback(
    (
      message: ReactNode,
      title: string = "Konfirmasi",
      extraOptions?: ConfirmExtraOptions,
    ) => {
      setIsOpen(true);
      const variant = extraOptions?.variant ?? "danger";
      setOptions({
        message,
        title,
        confirmText:
          extraOptions?.confirmText ??
          (variant === "danger" ? "Ya, Hapus Program" : "Ya, Lanjutkan"),
        cancelText: extraOptions?.cancelText ?? "Batal",
        variant,
      });
      return new Promise<boolean>((resolve) => {
        setResolvePromise(() => resolve);
      });
    },
    [],
  );

  const handleConfirm = () => {
    setIsOpen(false);
    resolvePromise?.(true);
  };

  const handleCancel = () => {
    setIsOpen(false);
    resolvePromise?.(false);
  };

  const isDanger = options.variant === "danger";

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      <AnimatePresence>
        {isOpen && (
          <div
            onClick={handleCancel}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-app-primary-950/75 backdrop-blur-xs"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border border-app-primary-100 rounded-3xl max-w-md w-full shadow-2xl overflow-hidden"
            >
              <div
                className={`h-1.5 bg-gradient-to-r ${
                  isDanger
                    ? "from-rose-500 to-amber-400"
                    : "from-app-primary-900 via-app-primary-500 to-yellow-400"
                }`}
              />
              <div className="p-6 space-y-4">
                <div
                  className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${
                    isDanger
                      ? "bg-rose-50 border-rose-200 text-rose-600"
                      : "bg-amber-50 border-amber-200 text-amber-600"
                  }`}
                >
                  <AlertTriangle className="w-5 h-5" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-[16px] font-extrabold text-app-primary-900">
                    {options.title}
                  </h3>
                  <p className="text-[12px] text-slate-600 leading-relaxed">
                    {options.message}
                  </p>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-app-primary-50 text-app-primary-900 border border-app-primary-200 font-bold text-[11.5px] cursor-pointer"
                  >
                    {options.cancelText}
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirm}
                    className={`px-4 py-2 rounded-xl font-extrabold text-[11.5px] inline-flex items-center gap-1.5 cursor-pointer ${
                      isDanger
                        ? "bg-rose-600 hover:bg-rose-700 text-white"
                        : "bg-app-primary-900 hover:bg-app-primary-800 text-yellow-400"
                    }`}
                  >
                    {isDanger ? (
                      <Trash2 className="w-3.5 h-3.5" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    <span>{options.confirmText}</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ConfirmContext.Provider>
  );
};

export const useConfirm = (): ConfirmFunction => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm harus digunakan dalam <ConfirmProvider>");
  }
  return context;
};
