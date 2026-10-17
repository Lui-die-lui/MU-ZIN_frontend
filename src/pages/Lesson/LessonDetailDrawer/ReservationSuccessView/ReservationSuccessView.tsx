/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import type { ReservationSummary } from "../RequestReservationView/RequestReservationView";

type Props = {
  summary: ReservationSummary;
};

// 3단계: 요청 완료 - 무엇을 보냈고 다음에 무슨 일이 있는지 (버튼은 상세 창 아래 고정 영역)
function ReservationSuccessView({ summary }: Props) {
  return (
    <div css={s.wrap} role="status">
      <div css={s.check} aria-hidden="true">
        ✓
      </div>
      <h3 css={s.title}>예약 요청을 보냈어요</h3>
      <p css={s.desc}>아티스트가 확인하면 알림으로 알려드려요.</p>

      <div css={s.summary}>
        <strong>{summary.title}</strong>
        <span>{summary.when}</span>
        <span css={s.meta}>{summary.meta}</span>
      </div>

      <p css={s.note}>확정 전에는 마이페이지 &gt; 내 예약에서 요청을 확인하거나 취소할 수 있어요.</p>
    </div>
  );
}

export default ReservationSuccessView;
