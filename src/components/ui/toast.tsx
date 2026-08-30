"use client";

import {
  createContext,
  use,
  useCallback,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { CheckCircleIcon, XCircleIcon } from "@/components/ui/icons";

interface ToastEntry {
  id: number;
  message: string;
  tone: "default" | "error";
}

interface ToastContextValue {
  toast: (message: string, tone?: ToastEntry["tone"]) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast(): ToastContextValue {
  const value = use(ToastContext);
  if (!value) throw new Error("useToast must be used within <ToastProvider>");
  return value;
}

const TOAST_DURATION_MS = 4500;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, tone: ToastEntry["tone"] = "default") => {
      const id = nextId.current++;
      setToasts((current) => [...current, { id, message, tone }]);
      setTimeout(() => dismiss(id), TOAST_DURATION_MS);
    },
    [dismiss],
  );

  return (
    <ToastContext value={{ toast }}>
      {children}
      {toasts.length > 0 ? (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 flex w-full max-w-md -translate-x-1/2 flex-col gap-2 px-4">
          {toasts.map((entry) => (
            <div
              key={entry.id}
              role="status"
              className="pointer-events-auto flex items-center gap-3 rounded-card bg-ink px-4 py-3 text-[14px] font-medium text-white shadow-letter"
            >
              {entry.tone === "error" ? (
                <XCircleIcon size={18} className="shrink-0 text-danger" />
              ) : (
                <CheckCircleIcon size={18} className="shrink-0 text-sage" />
              )}
              <span className="flex-1">{entry.message}</span>
              <button
                type="button"
                onClick={() => dismiss(entry.id)}
                className="cursor-pointer text-[13px] uppercase tracking-[1.5px] text-white/60 transition-colors hover:text-white"
              >
                Dismiss
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </ToastContext>
  );
}
