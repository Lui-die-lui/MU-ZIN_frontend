/** @jsxImportSource @emotion/react */
import type { TimeSlotResp } from "../../../../Types/lessonTypes";
import type { ReservationStatus } from "../../../../Types/reservationType";
import * as s from "./styles";

// 예약 관리 리스트 카드(유저 / 아티스트 공통 컴포넌트)
type BaseCard = {
  reservationId: number;
  status: ReservationStatus;
  priceAtBooking: number;
  timeSlot: TimeSlotResp;
  lessonTitle?: string; // user 응답 시 없을 가능성 때문에
  lessonId?: number;
};

type Props = {
  // 공통 데이터 + 화면별로 추가 데이터
  item: BaseCard & {
    requesterUsername?: string; // artist list 에서만 필요
    hasMessage?: boolean;
  };
  onClick?: () => void;
  // 카드 오른쪽에 버튼 or 배지를 컴포넌트로 통째로 꽂을 수 있게 처리
  rightActions?: React.ReactNode; // 버튼 영역(수락/거절/취소)
};

function ReservationCard({ item, onClick, rightActions }: Props) {
  return (
    <div
      css={s.card}
      //   onClick이 있을 때만 role="button", tabIndex=0
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
    >
      {/* 카드 상단 구조 */}
      <div css={s.cardTop}>
        <div css={s.titleRow}>
          <strong css={s.title}>
            {item.lessonTitle ?? `레슨 #${item.lessonId}`}
          </strong>
          {/* rightActions 있을 때만 표시 */}
          {rightActions && (
            <div
              css={s.rightActions}
              // 부모 카드 클릭으로 전파되지 않게 막음
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
            >
              {rightActions}
            </div>
          )}
        </div>

        <div css={s.metaRow}>
          <span>시작 : {item.timeSlot.startDt}</span>
          {item.requesterUsername && (
            <>
              <span>|</span>
              <span>요청자 : {item.requesterUsername}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReservationCard;
