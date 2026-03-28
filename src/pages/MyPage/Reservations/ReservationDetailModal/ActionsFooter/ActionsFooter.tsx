/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import type { ReservationStatus } from "../../../../../Types/reservationType";
import type { ViewerMode } from "../../../../../Types/myPageTypes";

type Props = {
  viewerMode: ViewerMode;
  status: ReservationStatus;

  // 취소 가능 여부(프론트 계산 or 서버 제공)
  canLessonCancel: boolean;
  cancelBlockedReason?: string;

  // 완료 관련
  canMarkCompleted?: boolean;
  completionSource?: "ARTIST" | "SYSTEM" | null;
  completedDt?: string | null;
  myCompletionConfirmed?: boolean;

  // 공통
  busy: boolean;
  onClose: () => void;

  // 액션
  onAccept?: () => void; // 아티스트 요청 수락
  onReject?: () => void; // 아티스트 요청 거절

  onRequestCancel?: () => void;
  onLessonCancel?: () => void; // 양쪽 확정 후 레슨 취소
  onCompleteLesson?: () => void;
};
function ActionsFooter({
  viewerMode,
  status,
  canLessonCancel,
  cancelBlockedReason,
  canMarkCompleted,
  completionSource,
  completedDt,
  myCompletionConfirmed,
  busy,
  onClose,
  onAccept,
  onReject,
  onLessonCancel,
  onCompleteLesson,
}: Props) {
  const isRequested = status === "REQUESTED";
  const isConfirmed = status === "CONFIRMED";
  const isCompletionPending = status === "COMPLETION_PENDING";
  const isCompleted = status === "COMPLETED";
  return (
    <div css={s.footer}>
      <button type="button" css={s.ghost} onClick={onClose} disabled={busy}>
        닫기
      </button>
      <div css={s.right}>
        {/* 1) 아티스트: 요청 상태 -> 수락/거절 */}
        {viewerMode === "ARTIST" && isRequested && (
          <>
            <button
              type="button"
              css={s.danger}
              onClick={onReject}
              disabled={busy || !onReject}
            >
              거절
            </button>
            <button
              type="button"
              css={s.primary}
              onClick={onAccept}
              disabled={busy || !onAccept}
            >
              수락
            </button>
          </>
        )}

        {/* 2) 유저: 요청 상태 -> 요청 취소 */}
        {viewerMode === "USER" && isRequested && (
          <button
            type="button"
            css={s.danger}
            onClick={onLessonCancel}
            disabled={busy || !onLessonCancel}
          >
            요청 취소
          </button>
        )}

        {/* 3) 확정 상태(양쪽): 레슨 취소 */}
        {isConfirmed && (
          <button
            type="button"
            css={s.danger}
            onClick={onLessonCancel}
            disabled={busy || !onLessonCancel || !canLessonCancel}
            title={
              !canLessonCancel
                ? (cancelBlockedReason ?? "취소 불가")
                : undefined
            }
          >
            레슨 취소
          </button>
        )}
        {/* 4) 완료 대기 상태: 아티스트 수동 완료 */}
        {viewerMode === "ARTIST" && isCompletionPending && canMarkCompleted && (
          <button
            type="button"
            css={s.primary}
            onClick={onCompleteLesson}
            disabled={busy || !onCompleteLesson}
          >
            수업 완료 확인
          </button>
        )}
      </div>
    </div>
  );
}

export default ActionsFooter;
