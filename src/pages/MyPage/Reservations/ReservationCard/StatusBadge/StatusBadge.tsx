/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import type { ReservationStatus } from "../../../../../Types/reservationType";
import { RESERVATION_STATUS_META } from "./badgeUi";

type Props = {
  status: ReservationStatus;
  onClick?: () => void;
  disabled?: boolean;
};

function StatusBadge({ status, onClick, disabled }: Props) {
  const meta = RESERVATION_STATUS_META[status];

  // 추가된 뱃지 테스트용
  if (!meta) {
    console.error("Unknown reservation status:", status);
    return (
      <button
        type="button"
        // css={s.statusBtn("gray")}
        onClick={onClick}
        disabled={disabled}
      >
        알 수 없음
      </button>
    );
  }

  return (
    <button
      type="button"
      css={s.statusBtn(meta.tone)}
      onClick={onClick}
      disabled={disabled}
    >
      {meta.label}
    </button>
  );
}

export default StatusBadge;
