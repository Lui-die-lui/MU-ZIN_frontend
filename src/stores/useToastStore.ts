import { create } from "zustand";

export type ToastSeverity = "success" | "error" | "info" | "warning";

type ToastItem = {
  id: number;
  message: string;
  severity: ToastSeverity;
};

type ToastStore = {
  current: ToastItem | null;
  show: (message: string, severity?: ToastSeverity) => void;
  close: () => void;
};

let seq = 0;

// 전역 알림(스낵바). 컴포넌트 밖(queryClient, axios 인터셉터)에서도 toast.error(...) 로 호출 가능
export const useToastStore = create<ToastStore>((set) => ({
  current: null,
  show: (message, severity = "info") =>
    set({ current: { id: ++seq, message, severity } }),
  close: () => set({ current: null }),
}));

export const toast = {
  success: (message: string) => useToastStore.getState().show(message, "success"),
  error: (message: string) => useToastStore.getState().show(message, "error"),
  info: (message: string) => useToastStore.getState().show(message, "info"),
  warning: (message: string) => useToastStore.getState().show(message, "warning"),
};
