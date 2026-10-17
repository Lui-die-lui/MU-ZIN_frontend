/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import type { TimeSlotStatus } from "../../../../../Types/lessonTypes";

const SLOT_STATUS_META: Record<TimeSlotStatus, { label: string; bg: string; color: string }> = {
  OPEN: { label: "예약 가능", bg: "#ecfdf3", color: "#047857" },
  PENDING: { label: "요청 대기", bg: "#fff7ed", color: "#c2410c" },
  BOOKED: { label: "예약 확정", bg: "#eff6ff", color: "#1d4ed8" },
  CLOSED: { label: "닫힘", bg: "#f3f4f6", color: "#6b7280" },
};

const badge = (bg: string, color: string) => css`
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 9px;
  border-radius: 999px;
  background: ${bg};
  color: ${color};
  font-size: 12px;
  font-weight: 700;
  white-space: nowrap;
`;

function SlotStatusBadge({ status, count }: { status: TimeSlotStatus; count?: number }) {
  const meta = SLOT_STATUS_META[status];
  return (
    <span css={badge(meta.bg, meta.color)}>
      {meta.label}
      {count !== undefined && ` ${count}`}
    </span>
  );
}

export default SlotStatusBadge;
