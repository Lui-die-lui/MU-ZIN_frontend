/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import type { ReservationStatus } from "../../../../../Types/reservationType";
import { RESERVATION_STATUS_META } from "./BadgeUi";

type Props = {
  status: ReservationStatus;
};

function StatusBadge({ status }: Props) {
  const meta = RESERVATION_STATUS_META[status];
  return <span css={s.badge(meta.tone)}>{meta.label}</span>;
}

export default StatusBadge;
