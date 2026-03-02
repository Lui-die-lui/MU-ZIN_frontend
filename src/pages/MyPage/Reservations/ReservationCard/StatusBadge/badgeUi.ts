import type { ReservationStatus } from "../../../../../Types/reservationType";

export type StatusTone = "neutral" | "info" | "success" | "warning" | "danger";

export const RESERVATION_STATUS_META: Record<
  ReservationStatus,
  { label: string; tone: StatusTone }
> = {
  REQUESTED: { label: "요청", tone: "info" },
  CONFIRMED: { label: "확정", tone: "success" },
  CANCELED: { label: "취소", tone: "neutral" },
  REJECTED: { label: "거절", tone: "danger" },
  COMPLETED: { label: "완료", tone: "success" },
};
