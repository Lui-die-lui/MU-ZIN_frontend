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
