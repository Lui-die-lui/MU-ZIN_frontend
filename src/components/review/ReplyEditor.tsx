/** @jsxImportSource @emotion/react */
import { useState } from "react";
import * as s from "./styles";
import type { ReviewResp } from "../../Types/reviewTypes";
import { REVIEW_CONTENT_MAX } from "../../Types/reviewTypes";
import { useCreateReviewReply, useDeleteReviewReply, useUpdateReviewReply } from "../../hooks/review/useReviews";
import { getErrorMessage } from "../../utils/errorUtils";
import { toast } from "../../stores/useToastStore";
import { formatReviewDate } from "../../utils/reviewFormat";

// 받은 리뷰 관리: 리뷰마다 아티스트 답글 (리뷰당 1개, 수정·삭제 가능)
function ReplyEditor({ review }: { review: ReviewResp }) {
  const createM = useCreateReviewReply();
  const updateM = useUpdateReviewReply();
  const deleteM = useDeleteReviewReply();
  const reply = review.reply;

  const [editing, setEditing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const busy = createM.isPending || updateM.isPending || deleteM.isPending;

  const open = () => {
    setText(reply?.content ?? "");
    setError(null);
    setEditing(true);
  };

  const save = async () => {
    if (!text.trim()) {
      setError("답글 내용을 입력해주세요.");
      return;
    }
    try {
      if (reply) {
        await updateM.mutateAsync({ reviewReplyId: reply.reviewReplyId, body: { content: text.trim() } });
        toast.success("답글을 수정했어요.");
      } else {
        await createM.mutateAsync({ reviewId: review.reviewId, content: text.trim() });
        toast.success("답글을 남겼어요. 수강생에게 알림이 가요.");
      }
      setEditing(false);
    } catch (e) {
      setError(getErrorMessage(e, "답글을 저장하지 못했어요."));
    }
  };

  const remove = async () => {
    if (!reply) return;
    try {
      await deleteM.mutateAsync(reply.reviewReplyId);
      toast.success("답글을 삭제했어요.");
      setConfirmDelete(false);
    } catch (e) {
      toast.error(getErrorMessage(e, "답글을 삭제하지 못했어요."));
    }
  };

  if (editing) {
    return (
      <div css={s.replyEditor}>
        <label css={s.formLabel} htmlFor={`reply-${review.reviewId}`}>
          {reply ? "답글 수정" : "답글 쓰기"}
        </label>
        <textarea
          id={`reply-${review.reviewId}`}
          css={s.textarea}
          rows={3}
          maxLength={REVIEW_CONTENT_MAX}
          placeholder={`${review.reviewerName}님께 감사 인사나 다음 수업 안내를 남겨보세요.`}
          value={text}
          autoFocus
          onChange={(e) => {
            setText(e.target.value);
            setError(null);
          }}
        />
        <div css={s.replyEditorBar}>
          <span css={s.counter}>
            {text.length}/{REVIEW_CONTENT_MAX}
          </span>
          <button type="button" css={s.btn("ghost", true)} onClick={() => setEditing(false)} disabled={busy}>
            취소
          </button>
          <button type="button" css={s.btn("primary", true)} onClick={save} disabled={busy}>
            {busy ? "저장 중..." : reply ? "수정하기" : "답글 남기기"}
          </button>
        </div>
        {error && (
          <p css={s.errorText} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }

  if (!reply) {
    return (
      <div css={s.replyEmpty}>
        <span>아직 답글을 달지 않았어요.</span>
        <button type="button" css={s.btn("primary", true)} onClick={open}>
          답글 쓰기
        </button>
      </div>
    );
  }

  return (
    <div css={s.reply}>
      <div css={s.replyHead}>
        <span css={s.replyBadge}>내 답글</span>
        <span>{formatReviewDate(reply.createDt)}</span>
        <div css={s.replyActions}>
          {confirmDelete ? (
            <>
              <span css={s.muted}>삭제할까요?</span>
              <button type="button" css={s.textButton} onClick={() => setConfirmDelete(false)} disabled={busy}>
                아니요
              </button>
              <button type="button" css={s.textButtonDanger} onClick={remove} disabled={busy}>
                삭제
              </button>
            </>
          ) : (
            <>
              <button type="button" css={s.textButton} onClick={open}>
                수정
              </button>
              <button type="button" css={s.textButtonDanger} onClick={() => setConfirmDelete(true)}>
                삭제
              </button>
            </>
          )}
        </div>
      </div>
      <p css={s.replyContent}>{reply.content}</p>
    </div>
  );
}

export default ReplyEditor;
