import type { ReservationStatus } from "../../../../../Types/reservationType";

export type StatusTone = "neutral" | "info" | "progress" | "success" | "warning" | "danger" | "confirmed";

export const RESERVATION_STATUS_META: Record<
  ReservationStatus,
  { label: string; tone: StatusTone }
> = {
  REQUESTED: { label: "확인 대기", tone: "info" },
  CONFIRMED: { label: "확정", tone: "confirmed" },
  COMPLETION_PENDING: { label: "완료 확인 중", tone: "progress" },
  CANCELED: { label: "취소", tone: "neutral" },
  REJECTED: { label: "거절됨", tone: "danger" },
  COMPLETED: { label: "완료", tone: "success" },
  EXPIRED: { label: "만료", tone: "neutral" },
};
