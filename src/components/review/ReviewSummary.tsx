/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import { StarDisplay } from "./StarRating";
import type { ReviewSummary as Summary } from "../../Types/reviewTypes";

type Props = {
  summary: Summary;
  // 태그를 누르면 그 태그가 있는 리뷰만 보기 (선택된 태그 다시 누르면 해제)
  selectedKeywordId?: number | null;
  onSelectKeyword?: (id: number | null) => void;
  topCount?: number;
  compact?: boolean;
};

// 리뷰 모음 상단: 평균 별점 · 별점별 개수 · 많이 선택된 태그 순위
function ReviewSummary({ summary, selectedKeywordId = null, onSelectKeyword, topCount = 5, compact = false }: Props) {
  const top = summary.topKeywords.slice(0, topCount);
  const maxRating = Math.max(1, ...summary.ratingCounts);
  const maxKeyword = Math.max(1, ...top.map((k) => k.count));

  return (
    <div css={s.summary(compact)}>
      <div css={s.summaryScore}>
        <strong>{summary.averageRating.toFixed(1)}</strong>
        <StarDisplay value={summary.averageRating} size={18} />
        <span>리뷰 {summary.reviewCount}개</span>
      </div>

      <ul css={s.ratingBars} aria-label="별점별 리뷰 수">
        {summary.ratingCounts.map((count, idx) => {
          const star = 5 - idx;
          return (
            <li key={star}>
              <span>{star}점</span>
              <span css={s.bar}>
                <span css={s.barFill((count / maxRating) * 100, "#111827")} />
              </span>
              <span css={s.barCount}>{count}</span>
            </li>
          );
        })}
      </ul>

      <div css={s.topKeywords}>
        <div css={s.topKeywordsTitle}>이런 점이 좋았어요</div>
        {top.length === 0 ? (
          <p css={s.muted}>아직 선택된 태그가 없어요.</p>
        ) : (
          <ol css={s.keywordRank}>
            {top.map((k, i) => {
              const selected = selectedKeywordId === k.reviewKeywordId;
              const content = (
                <>
                  <span css={s.rankNo(i)}>{i + 1}</span>
                  <span css={s.rankName}>{k.keywordName}</span>
                  <span css={s.bar}>
                    <span css={s.barFill((k.count / maxKeyword) * 100, i === 0 ? "#111827" : "#9ca3af")} />
                  </span>
                  <span css={s.barCount}>{k.count}</span>
                </>
              );
              return (
                <li key={k.reviewKeywordId}>
                  {onSelectKeyword ? (
                    <button
                      type="button"
                      css={s.rankButton(selected)}
                      aria-pressed={selected}
                      title={selected ? "필터 해제" : `'${k.keywordName}' 리뷰만 보기`}
                      onClick={() => onSelectKeyword(selected ? null : k.reviewKeywordId)}
                    >
                      {content}
                    </button>
                  ) : (
                    <div css={s.rankRow}>{content}</div>
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </div>
  );
}

export default ReviewSummary;
