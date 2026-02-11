/** @jsxImportSource @emotion/react */
import * as s from "./styles";

type Props = {
  onOk: () => void;
};

function ReservationSuccessView({ onOk }: Props) {
  return (
    <div css={s.section}>
      <div css={s.successBox}>
        <div css={s.successTitle}>요청이 완료 되었습니다.</div>
        <div css={s.successDesc}>
          아티스트 확인 후 알림 및 메시지를 확인 가능합니다.
        </div>

        <button type="button" css={s.okBtn} onClick={onOk}>
          확인
        </button>
      </div>
    </div>
  );
}

export default ReservationSuccessView;
