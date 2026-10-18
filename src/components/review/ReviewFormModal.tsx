/** @jsxImportSource @emotion/react */
import { useState } from "react";
import * as s from "./styles";
import CommonModal from "../common/CommonModal/CommonModal";
import { StarInput } from "./StarRating";
import { useCreateReview, useReviewKeywords, useUpdateReview } from "../../hooks/review/useReviews";
import { REVIEW_CONTENT_MAX, REVIEW_MAX_KEYWORDS, type ReviewResp } from "../../Types/reviewTypes";
import { getErrorMessage } from "../../utils/errorUtils";
import { toast } from "../../stores/useToastStore";

export type ReviewTarget = {
  reservationId: number;
  lessonTitle: string;
  artistName: string;
  when: string; // "10월 16일 (금) 레슨"
};

type Props = {
  open: boolean;
  onClose: () => void;
  target: ReviewTarget | null;
  editing?: ReviewResp | null; // 있으면 수정
};

// 리뷰 쓰기/수정: 별점(필수) · 태그(최대 3개) · 내용(선택, 500자)
// 열 때마다 key 로 새로 만들어 이전 입력이 남지 않음 (부모에서 key 지정)
function ReviewFormModal({ open, onClose, target, editing }: Props) {
  const keywordsQ = useReviewKeywords();
  const createM = useCreateReview();
  const updateM = useUpdateReview();

  const [rating, setRating] = useState(editing?.rating ?? 0);
  const [keywordIds, setKeywordIds] = useState<number[]>(editing?.keywords.map((k) => k.reviewKeywordId) ?? []);
  const [content, setContent] = useState(editing?.content ?? "");
  const [error, setError] = useState<string | null>(null);

  const busy = createM.isPending || updateM.isPending;
  if (!open || !target) return null;

  const toggleKeyword = (id: number) => {
    setError(null);
    setKeywordIds((prev) => {
      if (prev.includes(id)) return prev.filter((k) => k !== id);
      if (prev.length >= REVIEW_MAX_KEYWORDS) {
        setError(`태그는 최대 ${REVIEW_MAX_KEYWORDS}개까지 고를 수 있어요.`);
        return prev;
      }
      return [...prev, id];
    });
  };

  const submit = async () => {
    if (!rating) {
      setError("별점을 골라주세요.");
      return;
    }
    setError(null);
    const body = { rating, keywordIds, content: content.trim() ? content.trim() : null };
    try {
      if (editing) {
        await updateM.mutateAsync({ reviewId: editing.reviewId, body });
        toast.success("리뷰를 수정했어요.");
      } else {
        await createM.mutateAsync({ reservationId: target.reservationId, ...body });
        toast.success("리뷰를 남겼어요. 아티스트에게 알림이 가요.");
      }
      onClose();
    } catch (e) {
      setError(getErrorMessage(e, "리뷰를 저장하지 못했어요."));
    }
  };

  const footer = (
    <div css={s.formFooter}>
      <button type="button" css={s.btn("ghost")} onClick={onClose} disabled={busy}>
        취소
      </button>
      <button type="button" css={s.btn("primary")} onClick={submit} disabled={busy}>
        {busy ? "저장 중..." : editing ? "수정하기" : "리뷰 남기기"}
      </button>
    </div>
  );

  return (
    <CommonModal open={open} title={editing ? "리뷰 수정" : "리뷰 쓰기"} onClose={busy ? () => {} : onClose} footer={footer} width={520}>
      <div css={s.form}>
        <div css={s.formTarget}>
          <strong>{target.lessonTitle}</strong>
          <span>
            {target.artistName} · {target.when}
          </span>
        </div>

        <div css={s.formBlock}>
          <div css={s.formLabel}>레슨은 어떠셨나요?</div>
          <StarInput value={rating} onChange={(v) => { setRating(v); setError(null); }} />
        </div>

        <div css={s.formBlock}>
          <div css={s.formLabel}>
            이런 점이 좋았어요 <span css={s.muted}>(선택 · {keywordIds.length}/{REVIEW_MAX_KEYWORDS})</span>
          </div>
          {keywordsQ.isLoading ? (
            <p css={s.muted}>태그를 불러오는 중...</p>
          ) : (
            <div css={s.keywordPicker} role="group" aria-label="리뷰 태그">
              {(keywordsQ.data ?? []).map((k) => {
                const on = keywordIds.includes(k.reviewKeywordId);
                return (
                  <button
                    key={k.reviewKeywordId}
                    type="button"
                    css={s.keywordOption(on)}
                    aria-pressed={on}
                    onClick={() => toggleKeyword(k.reviewKeywordId)}
                  >
                    {k.keywordName}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div css={s.formBlock}>
          <label css={s.formLabel} htmlFor="review-content">
            후기 <span css={s.muted}>(선택)</span>
          </label>
          <textarea
            id="review-content"
            css={s.textarea}
            rows={5}
            maxLength={REVIEW_CONTENT_MAX}
            placeholder="수업에서 좋았던 점, 다른 수강생에게 알려주고 싶은 점을 적어주세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div css={s.counter}>
            {content.length}/{REVIEW_CONTENT_MAX}
          </div>
        </div>

        {error && (
          <p css={s.errorText} role="alert">
            {error}
          </p>
        )}
        {!editing && <p css={s.muted}>리뷰는 작성 후 7일 동안 수정할 수 있어요.</p>}
      </div>
    </CommonModal>
  );
}

export default ReviewFormModal;
