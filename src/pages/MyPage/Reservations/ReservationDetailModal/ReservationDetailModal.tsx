/** @jsxImportSource @emotion/react */
import * as s from "./styles";

import { useQueryClient } from "@tanstack/react-query";
import type { ArtistStatus } from "../../../../Types/auth";
import type {
  ArtistCancelReq,
  ArtistReservationDetailResp,
} from "../../../../Types/reservationType";
import {
  useCancelByArtistReservation,
  useConfirmReservation,
  useRejectReservation,
} from "../../../../hooks/reservation/useArtistReservations";
import { useCancelMyReservation } from "../../../../hooks/reservation/useMyReservation";
import { useMemo } from "react";
import { calcCanCancel } from "../../../../utils/reservationUtils";
import { reservationKeys } from "../../../../hooks/reservation/reservationKeys";
import ActionsFooter from "./ActionsFooter/ActionsFooter";
import CommonModal from "../../../../components/common/CommonModal/CommonModal";
import { pickYmdFromLocalDateTime } from "../../../../utils/searchForTimeUtils";
import type { ViewerMode } from "../../../../Types/myPageTypes";
import { formatKRW } from "../../../../utils/myPageUtils";

type Props = {
  open: boolean;
  onClose: () => void;

  // 상세 DTO (백엔드에서 내려오는 타입)
  reservation: ArtistReservationDetailResp | null;

  // 보는 사람의 상태
  viewerMode: ViewerMode;

  // 취소 제한 시간
  cancelLimitHours?: number;

  // 아티스트 취소 body
  artistCancelBody?: ArtistCancelReq;
};
function ReservationDetailModal({
  open,
  onClose,
  reservation,
  viewerMode,
  cancelLimitHours = 24,
  artistCancelBody = { reason: "아티스트 사정으로 취소", reopenSlot: true },
}: Props) {
  const qc = useQueryClient();

  const confirmMut = useConfirmReservation();
  const rejectMut = useRejectReservation();
  const cancelArtistMut = useCancelByArtistReservation();
  const cancelMyReservationMut = useCancelMyReservation();

  const busy =
    confirmMut.isPending ||
    rejectMut.isPending ||
    cancelArtistMut.isPending ||
    cancelMyReservationMut.isPending;

  const startDt = reservation?.timeSlot?.startDt;

  const canLessonCancel = useMemo(() => {
    if (!reservation) return false;
    if (reservation.status !== "CONFIRMED") return false;
    if (!startDt) return false;
    return calcCanCancel(startDt, cancelLimitHours);
  }, [reservation, startDt, cancelLimitHours]);

  // useMemo보다 먼저 실행되면 안됨
  if (!open) return null;

  const cancelBlockedReason = `레슨 시작 ${cancelLimitHours}시간 전부터는 취소할 수 없어요.`;

  if (!reservation) {
    return (
      <CommonModal open={open} title="예약 상세" onClose={onClose} width={520}>
        <div css={s.body}>불러오는 중...</div>
      </CommonModal>
    );
  }

  // helper const
  const onAccept = async () => {
    await confirmMut.mutateAsync(reservation.reservationId);
    await qc.invalidateQueries({ queryKey: reservationKeys.artist() });
    await qc.invalidateQueries({
      queryKey: reservationKeys.artistDetail(reservation.reservationId),
    });
    onClose();
  };

  const onReject = async () => {
    await rejectMut.mutateAsync(reservation.reservationId);
    await qc.invalidateQueries({ queryKey: reservationKeys.artist() });
    await qc.invalidateQueries({
      queryKey: reservationKeys.artistDetail(reservation.reservationId),
    });
    onClose();
  };

  const onRequestCancel = async () => {
    await cancelMyReservationMut.mutateAsync(reservation.reservationId);
    await qc.invalidateQueries({ queryKey: reservationKeys.me() });
    onClose();
  };

  const onLessonCancel = async () => {
    if (!canLessonCancel) return;
    if (viewerMode === "ARTIST") {
      await cancelArtistMut.mutateAsync({
        reservationId: reservation.reservationId,
        body: artistCancelBody,
      });
      await qc.invalidateQueries({ queryKey: reservationKeys.artist() });
      await qc.invalidateQueries({
        queryKey: reservationKeys.artistDetail(reservation.reservationId),
      });
    } else {
      // 훅이 숫자를 받는 형태면
      await cancelMyReservationMut.mutateAsync(reservation.reservationId);
      await qc.invalidateQueries({ queryKey: reservationKeys.me() });
    }
    onClose();
  };

  const footer = (
    <ActionsFooter
      viewerMode={viewerMode}
      status={reservation.status}
      canLessonCancel={canLessonCancel}
      cancelBlockedReason={cancelBlockedReason}
      busy={busy}
      onClose={onClose}
      onAccept={onAccept}
      onReject={onReject}
      onRequestCancel={onRequestCancel}
      onLessonCancel={onLessonCancel}
    />
  );

  return (
    <CommonModal
      open={open}
      title="예약 상세"
      onClose={onClose}
      footer={footer}
      width={520}
    >
      <div css={s.body}>
        <Row label="레슨" value={reservation.lessonTitle} />
        <Row
          label={viewerMode === "USER" ? "아티스트" : "요청자"}
          value={
            viewerMode === "USER"
              ? reservation.artistDisplayName
              : reservation.requesterUsername
          }
        />
        {/* 일반 유저 탭에서는 요청자가 아닌 아티스트 명을 보여줘야함 */}
        <Row label="상태" value={reservation.status} />
        <Row label="가격" value={formatKRW(reservation.priceAtBooking)} />
        <Row
          label="요청일"
          value={pickYmdFromLocalDateTime(reservation.requestedDt)}
        />
        {reservation.confirmedDt && (
          <Row
            label="확정일"
            value={pickYmdFromLocalDateTime(reservation.confirmedDt)}
          />
        )}
        {reservation.canceledDt && (
          <Row
            label="취소일"
            value={pickYmdFromLocalDateTime(reservation.canceledDt)}
          />
        )}

        <div css={s.block}>
          <div css={s.blockTitle}>레슨 일정</div>
          <div css={s.blockText}>
            시작:{" "}
            {reservation.timeSlot?.startDt ? reservation.timeSlot.startDt : "-"}
            <br />
            종료:{" "}
            {reservation.timeSlot?.endDt ? reservation.timeSlot.endDt : "-"}
          </div>
        </div>

        {/* 요청사항 안보임 */}
        {reservation.requestedMsg && (
          <div css={s.block}>
            <div css={s.blockTitle}>요청사항</div>
            <div css={s.blockText}>{reservation.requestedMsg}</div>
          </div>
        )}

        {reservation.status === "CONFIRMED" && !canLessonCancel && (
          <p css={s.hint}>{cancelBlockedReason}</p>
        )}
      </div>
    </CommonModal>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div css={s.row}>
      <span css={s.rowLabel}>{label}</span>
      <span css={s.rowValue}>{value}</span>
    </div>
  );
}

export default ReservationDetailModal;
