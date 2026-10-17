/** @jsxImportSource @emotion/react */
import * as s from "./styles";

const REQUEST_MSG_MAX = 1000; // 서버 @Size(max = 1000) 과 같음

export type ReservationSummary = {
  title: string;
  when: string; // "10월 19일 (월) 10:00 – 11:00"
  meta: string; // "대면 · 60분 · 40,000원"
};

type Props = {
  summary: ReservationSummary;
  requestMsg: string;
  onChangeMsg: (v: string) => void;
  pending?: boolean;
  errorMsg?: string | null;
  onPickAgain?: () => void; // 다른 사람이 먼저 예약한 경우 등 -> 시간 다시 고르기
};

// 2단계: 무엇을 요청하는지 확인 + 아티스트에게 남길 말 (버튼은 상세 창 아래 고정 영역)
function RequestReservationView({ summary, requestMsg, onChangeMsg, pending = false, errorMsg, onPickAgain }: Props) {
  return (
    <div css={s.wrap}>
      <div css={s.summaryCard}>
        <span css={s.summaryLabel}>요청할 레슨</span>
        <strong css={s.summaryTitle}>{summary.title}</strong>
        <span css={s.summaryWhen}>{summary.when}</span>
        <span css={s.summaryMeta}>{summary.meta}</span>
      </div>

      <div css={s.field}>
        <div css={s.labelRow}>
          <label htmlFor="reservation-msg" css={s.label}>
            아티스트에게 남길 말 <span css={s.optional}>(선택)</span>
          </label>
          <span css={s.counter}>
            {requestMsg.length}/{REQUEST_MSG_MAX}
          </span>
        </div>
        <textarea
          id="reservation-msg"
          css={s.textarea}
          value={requestMsg}
          maxLength={REQUEST_MSG_MAX}
          disabled={pending}
          onChange={(e) => onChangeMsg(e.target.value)}
          placeholder="예: 악기를 처음 배워요. 기초부터 차근차근 알려주세요."
          rows={5}
        />
      </div>

      {errorMsg && (
        <div css={s.errorBox} role="alert">
          {errorMsg}
          {onPickAgain && (
            <button type="button" css={s.linkBtn} onClick={onPickAgain}>
              다른 시간 고르기
            </button>
          )}
        </div>
      )}

      <ul css={s.notes}>
        <li>요청을 보내면 아티스트가 확인한 뒤 확정해요. 확정되면 알림으로 알려드려요.</li>
        <li>확정 전에는 마이페이지 &gt; 내 예약에서 언제든 취소할 수 있어요.</li>
      </ul>
    </div>
  );
}

export default RequestReservationView;
