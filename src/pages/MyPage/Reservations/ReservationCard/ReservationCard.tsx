/** @jsxImportSource @emotion/react */
import type { ReactNode } from "react";
import type { TimeSlotResp } from "../../../../Types/lessonTypes";
import type { ReservationStatus } from "../../../../Types/reservationType";
import StatusBadge from "./StatusBadge/StatusBadge";
import { formatMonthDay, formatPrice, formatTime } from "../../../../utils/reservationFormat";
import * as s from "./styles";

// 예약 카드 (내 예약 / 요청 관리 공용)
// 예전: "시작 : 2026-10-20T10:00:00" 원본 문자열, 내 예약에서도 "요청자: (내 이름)"이 보였음
export type ReservationCardItem = {
  reservationId: number;
  status: ReservationStatus;
  priceAtBooking: number;
  timeSlot: TimeSlotResp;
  lessonTitle?: string;
  lessonId?: number;
  hasMessage?: boolean;
};

type Props = {
  item: ReservationCardItem;
  counterpartLabel: string; // "아티스트" / "수강생"
  counterpartName?: string | null;
  onClick: () => void;
  actions?: ReactNode; // 카드에서 바로 하는 동작 (예: 요청 수락/거절)
  now: number; // 지난 레슨 흐리게 표시할 기준 시각
};

function ReservationCard({ item, counterpartLabel, counterpartName, onClick, actions, now }: Props) {
  const start = item.timeSlot.startDt;
  const past = new Date(start).getTime() < now;

  return (
    <article
      css={s.card(past)}
      tabIndex={0}
      aria-label={`${item.lessonTitle ?? "레슨"} 예약 상세 보기`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <div css={s.dateBox}>
        <span css={s.dateDay}>{formatMonthDay(start)}</span>
        <span css={s.dateTime}>
          {formatTime(start)}
          {item.timeSlot.endDt && ` – ${formatTime(item.timeSlot.endDt)}`}
        </span>
      </div>

      <div css={s.info}>
        <strong css={s.title}>{item.lessonTitle ?? `레슨 #${item.lessonId}`}</strong>
        <div css={s.meta}>
          {counterpartName && (
            <span>
              {counterpartLabel} {counterpartName}
            </span>
          )}
          <span>{formatPrice(item.priceAtBooking)}</span>
          {item.hasMessage && <span css={s.msgTag}>요청 메시지 있음</span>}
        </div>
      </div>

      <div css={s.side}>
        <StatusBadge status={item.status} />
        {actions && (
          <div css={s.actions} onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
            {actions}
          </div>
        )}
      </div>
    </article>
  );
}

export default ReservationCard;
