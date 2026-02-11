/** @jsxImportSource @emotion/react */
import * as s from "./styles";

type Props = {
  selectedSlotText: string;

  requestMsg: string;
  onChangeMsg: (v: string) => void;

  onBack: () => void;
  onSubmit: () => void;

  pending?: boolean;
  errorMsg?: string | null;
};

function RequestReservationView({
  selectedSlotText,
  requestMsg,
  onChangeMsg,
  onBack,
  onSubmit,
  pending = false,
  errorMsg,
}: Props) {
  return (
    <div css={s.section}>
      <div css={s.requestBox}>
        {selectedSlotText && <div css={s.requestSub}>{selectedSlotText}</div>}

        <textarea
          css={s.section}
          value={requestMsg}
          onChange={(e) => onChangeMsg(e.target.value)}
          placeholder="요청 메시지(선택) ex) 처음부터 차근차근 배우고 싶어요."
          rows={5}
        />

        {errorMsg && <div css={s.errorText}>{errorMsg}</div>}

        <div css={s.requestBtnRow}>
          <button
            type="button"
            css={s.backBtn}
            onClick={onBack}
            disabled={pending}
          >
            뒤로가기
          </button>
          <button
            type="button"
            css={s.submitBtn}
            onClick={onSubmit}
            disabled={pending}
          >
            {pending ? "요청 중..." : "예약 요청"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RequestReservationView;
