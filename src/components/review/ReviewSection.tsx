/** @jsxImportSource @emotion/react */
import { useMemo, useState, type ReactNode } from "react";
import * as s from "./styles";
import ReviewSummary from "./ReviewSummary";
import ReviewItem from "./ReviewItem";
import ReportButton from "../report/ReportButton";
import SelectDropdown from "../common/SelectDropdown/SelectDropdown";
import type { ReviewListResp, ReviewResp } from "../../Types/reviewTypes";

type Sort = "latest" | "high" | "low";

type Props = {
  data: ReviewListResp | undefined;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  showLesson?: boolean; // 아티스트 페이지: 리뷰마다 레슨 표시 + 레슨별로 보기
  limit?: number; // 처음엔 N개만, "리뷰 모두 보기"로 펼침
  emptyText?: string;
  // 받은 리뷰 관리: 리뷰마다 답글 영역
  renderReplyArea?: (review: ReviewResp) => ReactNode;
  extraFilter?: { label: string; test: (r: ReviewResp) => boolean }; // 예: "답글 안 단 리뷰만"
  compact?: boolean; // 좁은 곳(레슨 상세 창)
};

// 리뷰 모음: 요약(평균·별점별·많이 선택된 태그) + 태그/레슨 필터 + 정렬 + 목록
function ReviewSection({ data, isLoading, isError, onRetry, showLesson, limit, emptyText = "아직 리뷰가 없어요.", renderReplyArea, extraFilter, compact }: Props) {
  const [keywordId, setKeywordId] = useState<number | null>(null);
  const [lessonId, setLessonId] = useState<string>("");
  const [sort, setSort] = useState<Sort>("latest");
  const [onlyExtra, setOnlyExtra] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const reviews = useMemo(() => data?.reviews ?? [], [data]);

  // 레슨별로 보기 (리뷰가 있는 레슨만)
  const lessonOptions = useMemo(() => {
    const map = new Map<number, string>();
    reviews.forEach((r) => map.set(r.lessonId, r.lessonTitle));
    return [...map.entries()].map(([id, title]) => ({ value: String(id), label: title }));
  }, [reviews]);

  const shown = useMemo(() => {
    let list = reviews;
    if (keywordId) list = list.filter((r) => r.keywords.some((k) => k.reviewKeywordId === keywordId));
    if (lessonId) list = list.filter((r) => String(r.lessonId) === lessonId);
    if (onlyExtra && extraFilter) list = list.filter(extraFilter.test);
    if (sort !== "latest") list = [...list].sort((a, b) => (sort === "high" ? b.rating - a.rating : a.rating - b.rating));
    return list;
  }, [reviews, keywordId, lessonId, onlyExtra, extraFilter, sort]);

  if (isLoading) {
    return (
      <div css={s.stateBox} aria-busy="true">
        리뷰를 불러오는 중...
      </div>
    );
  }
  if (isError || !data) {
    return (
      <div css={s.stateBox}>
        리뷰를 불러오지 못했어요.
        <button type="button" css={s.textButton} onClick={onRetry}>
          다시 불러오기
        </button>
      </div>
    );
  }
  if (data.summary.reviewCount === 0) {
    return <div css={s.stateBox}>{emptyText}</div>;
  }

  const filtering = !!keywordId || !!lessonId || onlyExtra;
  const visible = limit && !expanded && !filtering ? shown.slice(0, limit) : shown;
  const selectedKeyword = data.summary.topKeywords.find((k) => k.reviewKeywordId === keywordId);

  return (
    <div css={s.section}>
      <ReviewSummary summary={data.summary} selectedKeywordId={keywordId} onSelectKeyword={setKeywordId} compact={compact} topCount={compact ? 3 : 5} />

      <div css={s.toolbar}>
        <div css={s.toolbarLeft}>
          {showLesson && lessonOptions.length > 1 && (
            <SelectDropdown<string>
              css={s.toolbarSelect}
              ariaLabel="레슨별로 보기"
              value={lessonId}
              placeholder="모든 레슨"
              onChange={setLessonId}
              options={[{ value: "", label: "모든 레슨" }, ...lessonOptions]}
            />
          )}
          {extraFilter && (
            <button type="button" css={s.toggleChip(onlyExtra)} aria-pressed={onlyExtra} onClick={() => setOnlyExtra((v) => !v)}>
              {extraFilter.label}
            </button>
          )}
          {selectedKeyword && (
            <button type="button" css={s.toggleChip(true)} onClick={() => setKeywordId(null)} aria-label={`'${selectedKeyword.keywordName}' 필터 해제`}>
              {selectedKeyword.keywordName} ×
            </button>
          )}
        </div>
        <SelectDropdown<Sort>
          css={s.toolbarSelectSmall}
          ariaLabel="리뷰 정렬"
          value={sort}
          onChange={setSort}
          options={[
            { value: "latest", label: "최신순" },
            { value: "high", label: "별점 높은순" },
            { value: "low", label: "별점 낮은순" },
          ]}
        />
      </div>

      {shown.length === 0 ? (
        <div css={s.stateBox}>
          조건에 맞는 리뷰가 없어요.
          <button
            type="button"
            css={s.textButton}
            onClick={() => {
              setKeywordId(null);
              setLessonId("");
              setOnlyExtra(false);
            }}
          >
            필터 초기화
          </button>
        </div>
      ) : (
        <div css={s.list}>
          {visible.map((r) => (
            <ReviewItem
              key={r.reviewId}
              review={r}
              showLesson={showLesson}
              replyArea={renderReplyArea?.(r)}
              actions={
                <ReportButton
                  targetType="REVIEW"
                  targetId={r.reviewId}
                  targetName={`${r.reviewerName}님의 리뷰`}
                  targetUserId={r.reviewerUserId}
                />
              }
            />
          ))}
        </div>
      )}

      {limit && !expanded && !filtering && shown.length > limit && (
        <button type="button" css={s.moreButton} onClick={() => setExpanded(true)}>
          리뷰 {shown.length}개 모두 보기
        </button>
      )}
    </div>
  );
}

export default ReviewSection;
