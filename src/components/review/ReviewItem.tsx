/** @jsxImportSource @emotion/react */
import type { ReactNode } from "react";
import * as s from "./styles";
import { StarDisplay } from "./StarRating";
import ProfileAvatar from "../common/ProfileAvatar/ProfileAvatar";
import type { ReviewResp } from "../../Types/reviewTypes";
import { formatMonthDay } from "../../utils/reservationFormat";
import { formatReviewDate } from "../../utils/reviewFormat";

type Props = {
  review: ReviewResp;
  // 아티스트 페이지 / 내 리뷰: 어떤 레슨의 리뷰인지 표시
  showLesson?: boolean;
  // 내 리뷰: 누구(아티스트)에게 쓴 리뷰인지
  showArtist?: boolean;
  actions?: ReactNode; // 수정/삭제 등
  replyArea?: ReactNode; // 아티스트 답글 쓰기/수정 영역 (있으면 답글 표시 대신 사용)
};

function ReviewItem({ review, showLesson, showArtist, actions, replyArea }: Props) {
  const edited = review.updateDt && new Date(review.updateDt).getTime() - new Date(review.createDt).getTime() > 60_000;

  return (
    <article css={s.item} aria-label={`${review.reviewerName}님의 리뷰`}>
      <header css={s.itemHead}>
        <ProfileAvatar src={review.reviewerProfileImgUrl} name={review.reviewerName} size={36} />
        <div css={s.itemWho}>
          <strong>{review.reviewerName}</strong>
          <div css={s.itemMeta}>
            <StarDisplay value={review.rating} size={14} />
            <span>{formatReviewDate(review.createDt)}{edited ? " · 수정됨" : ""}</span>
          </div>
        </div>
        {actions && <div css={s.itemActions}>{actions}</div>}
      </header>

      {(showLesson || showArtist) && (
        <div css={s.lessonTag}>
          {showArtist && <span css={s.lessonTagArtist}>{review.artistName}</span>}
          <span css={s.lessonTagTitle}>{review.lessonTitle}</span>
          <span css={s.lessonTagDate}>{formatMonthDay(review.lessonStartDt)} 레슨</span>
        </div>
      )}

      {review.keywords.length > 0 && (
        <ul css={s.chips} aria-label="선택한 태그">
          {review.keywords.map((k) => (
            <li key={k.reviewKeywordId} css={s.chip}>
              {k.keywordName}
            </li>
          ))}
        </ul>
      )}

      {review.content && <p css={s.content}>{review.content}</p>}

      {replyArea ??
        (review.reply && (
          <div css={s.reply}>
            <div css={s.replyHead}>
              <span css={s.replyBadge}>아티스트 답글</span>
              <strong>{review.reply.artistName}</strong>
              <span>{formatReviewDate(review.reply.createDt)}</span>
            </div>
            <p css={s.replyContent}>{review.reply.content}</p>
          </div>
        ))}
    </article>
  );
}

export default ReviewItem;
