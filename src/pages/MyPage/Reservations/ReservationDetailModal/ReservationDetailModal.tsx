/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import { useState } from "react";
import type { ReservationResp } from "../../../../Types/reservationType";
import {
  useCancelByArtistReservation,
  useCompleteReservationByArtist,
  useConfirmReservation,
  useRejectReservation,
} from "../../../../hooks/reservation/useArtistReservations";
import { useCancelMyReservation } from "../../../../hooks/reservation/useMyReservation";
import { calcCanCancel } from "../../../../utils/reservationUtils";
import CommonModal from "../../../../components/common/CommonModal/CommonModal";
import type { ViewerMode } from "../../../../Types/myPageTypes";
import StatusBadge from "../ReservationCard/StatusBadge/StatusBadge";
import { deadlineBefore, formatDateTime, formatPrice, formatSlotRange } from "../../../../utils/reservationFormat";
import { toast } from "../../../../stores/useToastStore";
import { useNavigate } from "react-router-dom";
import { useMyReviews, useWritableReviews } from "../../../../hooks/review/useReviews";
import { getChatRoomIdByReservationReq } from "../../../../apis/chat/chatApi";
import { getErrorMessage } from "../../../../utils/errorUtils";

type Props = {
  open: boolean;
  onClose: () => void;
  reservation: ReservationResp | null; // 상세 (불러오는 중이면 null)
  viewerMode: ViewerMode;
  cancelLimitHours?: number; // 서버와 같은 24시간
  now: number; // 시작 여부 판단 기준 시각 (목록 화면에서 전달)
};

type Step = null | "reject" | "cancelRequest" | "cancel";

const REASON_MAX = 200;

// 예약 상세 (내 예약 / 요청 관리 공용)
// 예전: 상태가 REQUESTED 같은 영문 그대로, 시간은 원본 문자열, 확인 없이 바로 거절·취소
//       + 수강생의 "요청 취소" 버튼이 확정 예약용 취소 함수에 연결돼 있어 실제로는 아무 일도 일어나지 않았음
function ReservationDetailModal({ open, onClose, reservation, viewerMode, cancelLimitHours = 24, now }: Props) {
  const confirmMut = useConfirmReservation();
  const rejectMut = useRejectReservation();
  const cancelArtistMut = useCancelByArtistReservation();
  const cancelMyMut = useCancelMyReservation();
  const completeMut = useCompleteReservationByArtist();
  const navigate = useNavigate();

  // 수강생의 완료 레슨: 리뷰를 쓸 수 있는지 / 이미 썼는지
  const reviewCheck = open && viewerMode !== "ARTIST" && reservation?.status === "COMPLETED";
  const writableQ = useWritableReviews(reviewCheck);
  const myReviewsQ = useMyReviews(reviewCheck);

  const [step, setStep] = useState<Step>(null);
  const [reason, setReason] = useState("");
  const [reopenSlot, setReopenSlot] = useState(true);

  const busy =
    confirmMut.isPending || rejectMut.isPending || cancelArtistMut.isPending || cancelMyMut.isPending || completeMut.isPending;

  const close = () => {
    if (busy) return;
    setStep(null);
    setReason("");
    setReopenSlot(true);
    onClose();
  };

  if (!open) return null;

  if (!reservation) {
    return (
      <CommonModal open={open} title="예약 상세" onClose={close} width={520}>
        <div css={s.loading}>예약 정보를 불러오는 중...</div>
      </CommonModal>
    );
  }

  const r = reservation;
  const isArtist = viewerMode === "ARTIST";
  const start = r.timeSlot?.startDt;
  const started = !!start && new Date(start).getTime() <= now;
  const canCancelConfirmed = r.status === "CONFIRMED" && !!start && calcCanCancel(start, cancelLimitHours);
  const deadline = start ? formatDateTime(deadlineBefore(start, cancelLimitHours)) : "-";

  // 성공하면 안내 후 닫기, 실패 메시지는 전역 토스트 (목록은 훅에서 다시 불러옴)
  const run = async (action: () => Promise<unknown>, done: string) => {
    try {
      await action();
      toast.success(done);
      setStep(null);
      onClose();
    } catch {
      setStep(null);
    }
  };

  // ---------- 상태별 안내 ----------
  const guide = (() => {
    switch (r.status) {
      case "REQUESTED":
        if (started) return { tone: "muted", text: "레슨 시작 시간이 지나 곧 만료돼요." };
        return isArtist
          ? { tone: "info", text: "수락하면 예약이 확정되고, 거절하면 이 시간은 다시 예약을 받을 수 있게 열려요." }
          : { tone: "info", text: "아티스트가 확인하고 있어요. 확정 전에는 언제든 요청을 취소할 수 있어요." };
      case "CONFIRMED":
        return canCancelConfirmed
          ? { tone: "info", text: `예약이 확정됐어요. ${deadline}까지 취소할 수 있어요.` }
          : {
              tone: "warn",
              text: isArtist
                ? "레슨 24시간 전이 지나 취소할 수 없어요. 일정 변경이 필요하면 수강생과 직접 조율해주세요."
                : "레슨 24시간 전이 지나 취소할 수 없어요. 일정 변경이 필요하면 아티스트에게 문의해주세요.",
            };
      case "COMPLETION_PENDING":
        return isArtist
          ? { tone: "info", text: "레슨이 끝났어요. 수업을 마쳤다면 '수업 완료 확인'을 눌러주세요. 일정 시간이 지나면 자동으로 완료돼요." }
          : { tone: "info", text: "레슨이 끝났어요. 아티스트가 완료를 확인하면 '완료'로 바뀌어요." };
      case "COMPLETED":
        return { tone: "muted", text: r.completionSource === "SYSTEM" ? "시간이 지나 자동으로 완료 처리됐어요." : "수업이 완료됐어요." };
      case "CANCELED":
        return { tone: "muted", text: "취소된 예약이에요." };
      case "REJECTED":
        return { tone: "muted", text: isArtist ? "거절한 요청이에요." : "아티스트가 요청을 거절했어요. 다른 시간으로 다시 요청해보세요." };
      case "EXPIRED":
        return { tone: "muted", text: "레슨 시간까지 수락되지 않아 만료된 요청이에요." };
      default:
        return null;
    }
  })();

  // ---------- 확인 단계 (되돌릴 수 없는 동작) ----------
  const confirmPanel =
    step === "reject" ? (
      <div css={s.confirmBox}>
        <strong>이 요청을 거절할까요?</strong>
        <span>수강생에게 거절 알림이 가고, 이 시간은 다시 예약을 받을 수 있게 열려요.</span>
      </div>
    ) : step === "cancelRequest" ? (
      <div css={s.confirmBox}>
        <strong>예약 요청을 취소할까요?</strong>
        <span>아티스트에게 취소 알림이 가요. 같은 시간에 다시 요청하려면 처음부터 다시 신청해야 해요.</span>
      </div>
    ) : step === "cancel" ? (
      <div css={s.confirmBox}>
        <strong>확정된 레슨을 취소할까요?</strong>
        <span>
          {isArtist ? "수강생에게 취소 알림이 가요." : "아티스트에게 취소 알림이 가요."} 취소한 뒤에는 되돌릴 수 없어요.
        </span>
        {isArtist && (
          <>
            <label css={s.reasonLabel} htmlFor="cancel-reason">
              취소 사유 <span>(선택 · 수강생 알림에 함께 전달돼요)</span>
            </label>
            <textarea
              id="cancel-reason"
              css={s.reasonInput}
              rows={3}
              maxLength={REASON_MAX}
              value={reason}
              placeholder="예: 개인 사정으로 해당 시간에 수업이 어려워졌어요."
              onChange={(e) => setReason(e.target.value)}
            />
            <label css={s.checkRow}>
              <input type="checkbox" checked={reopenSlot} onChange={(e) => setReopenSlot(e.target.checked)} />이 시간을 다시
              예약 가능하게 열기
            </label>
          </>
        )}
      </div>
    ) : null;

  // ---------- 아래 버튼 ----------
  let actions: React.ReactNode = null;
  if (step) {
    const confirmLabel = step === "reject" ? "거절하기" : step === "cancelRequest" ? "요청 취소하기" : "레슨 취소하기";
    const onConfirm = () => {
      if (step === "reject") return run(() => rejectMut.mutateAsync(r.reservationId), "요청을 거절했어요.");
      if (step === "cancelRequest") return run(() => cancelMyMut.mutateAsync(r.reservationId), "예약 요청을 취소했어요.");
      return run(
        () =>
          isArtist
            ? cancelArtistMut.mutateAsync({
                reservationId: r.reservationId,
                body: { reason: reason.trim() || "아티스트 사정으로 취소", reopenSlot },
              })
            : cancelMyMut.mutateAsync(r.reservationId),
        "예약을 취소했어요.",
      );
    };
    actions = (
      <>
        <button type="button" css={s.btn("ghost")} onClick={() => setStep(null)} disabled={busy}>
          돌아가기
        </button>
        <button type="button" css={s.btn("danger")} onClick={onConfirm} disabled={busy}>
          {busy ? "처리 중..." : confirmLabel}
        </button>
      </>
    );
  } else if (r.status === "REQUESTED" && !started) {
    actions = isArtist ? (
      <>
        <button type="button" css={s.btn("danger")} onClick={() => setStep("reject")} disabled={busy}>
          거절
        </button>
        <button
          type="button"
          css={s.btn("primary")}
          disabled={busy}
          onClick={() => run(() => confirmMut.mutateAsync(r.reservationId), "예약을 확정했어요. 수강생에게 알림이 가요.")}
        >
          {confirmMut.isPending ? "처리 중..." : "수락하기"}
        </button>
      </>
    ) : (
      <button type="button" css={s.btn("danger")} onClick={() => setStep("cancelRequest")} disabled={busy}>
        요청 취소
      </button>
    );
  } else if (r.status === "CONFIRMED" && canCancelConfirmed) {
    actions = (
      <button type="button" css={s.btn("danger")} onClick={() => setStep("cancel")} disabled={busy}>
        레슨 취소
      </button>
    );
  } else if (!isArtist && r.status === "COMPLETED") {
    const writable = writableQ.data?.some((w) => w.reservationId === r.reservationId);
    const reviewed = myReviewsQ.data?.some((v) => v.reservationId === r.reservationId);
    const goReviews = (query: string) => {
      close();
      navigate(`/mypage/reviews?${query}`);
    };
    if (writable) {
      actions = (
        <button type="button" css={s.btn("primary")} onClick={() => goReviews(`tab=writable&write=${r.reservationId}`)}>
          리뷰 쓰기
        </button>
      );
    } else if (reviewed) {
      actions = (
        <button type="button" css={s.btn("ghost")} onClick={() => goReviews("tab=written")}>
          내 리뷰 보기
        </button>
      );
    } else if (writableQ.isSuccess && myReviewsQ.isSuccess) {
      actions = <span css={s.reviewClosed}>리뷰 작성 기간(완료 후 14일)이 지났어요.</span>;
    }
  } else if (isArtist && r.status === "COMPLETION_PENDING" && r.canMarkCompleted) {
    actions = (
      <button
        type="button"
        css={s.btn("primary")}
        disabled={busy}
        onClick={() => run(() => completeMut.mutateAsync(r.reservationId), "수업 완료로 처리했어요.")}
      >
        {completeMut.isPending ? "처리 중..." : "수업 완료 확인"}
      </button>
    );
  }

  // 수락된 예약(확정·완료 확인 중·완료)은 상대와 채팅으로 이동 (방은 수락할 때 생김)
  const chatEligible = r.status === "CONFIRMED" || r.status === "COMPLETION_PENDING" || r.status === "COMPLETED";
  const openChat = async () => {
    try {
      const roomId = await getChatRoomIdByReservationReq(r.reservationId);
      close();
      navigate(`/mypage/chats/${roomId}`);
    } catch (e) {
      toast.error(getErrorMessage(e, "채팅방을 열지 못했어요."));
    }
  };

  const footer = (
    <div css={s.footer}>
      {!step && (
        <button type="button" css={s.btn("ghost")} onClick={close} disabled={busy}>
          닫기
        </button>
      )}
      {!step && chatEligible && (
        <button type="button" css={s.btn("ghost")} onClick={openChat} disabled={busy}>
          채팅하기
        </button>
      )}
      {actions && <div css={s.footerRight}>{actions}</div>}
    </div>
  );

  return (
    <CommonModal open={open} title="예약 상세" onClose={close} footer={footer} width={520}>
      <div css={s.body}>
        <div css={s.head}>
          <StatusBadge status={r.status} />
          <h3 css={s.lessonTitle}>{r.lessonTitle}</h3>
          <p css={s.when}>{formatSlotRange(r.timeSlot?.startDt, r.timeSlot?.endDt)}</p>
        </div>

        {guide && <p css={s.guide(guide.tone as "info" | "warn" | "muted")}>{guide.text}</p>}

        <dl css={s.rows}>
          <div>
            <dt>{isArtist ? "수강생" : "아티스트"}</dt>
            <dd>{isArtist ? r.requesterUsername : r.artistDisplayName}</dd>
          </div>
          <div>
            <dt>가격</dt>
            <dd>{formatPrice(r.priceAtBooking)}</dd>
          </div>
          <div>
            <dt>요청한 날</dt>
            <dd>{formatDateTime(r.requestedDt)}</dd>
          </div>
          {r.confirmedDt && (
            <div>
              <dt>확정한 날</dt>
              <dd>{formatDateTime(r.confirmedDt)}</dd>
            </div>
          )}
          {r.canceledDt && (
            <div>
              <dt>취소한 날</dt>
              <dd>{formatDateTime(r.canceledDt)}</dd>
            </div>
          )}
          {r.completedDt && (
            <div>
              <dt>완료한 날</dt>
              <dd>{formatDateTime(r.completedDt)}</dd>
            </div>
          )}
        </dl>

        <div>
          <div css={s.blockTitle}>요청 메시지</div>
          {r.requestedMsg ? <p css={s.message}>{r.requestedMsg}</p> : <p css={s.emptyText}>남긴 메시지가 없어요.</p>}
        </div>

        {confirmPanel}
      </div>
    </CommonModal>
  );
}

export default ReservationDetailModal;
