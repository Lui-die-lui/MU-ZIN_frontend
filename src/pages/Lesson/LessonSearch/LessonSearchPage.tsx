/** @jsxImportSource @emotion/react */
import { useCallback, useMemo, useState, type FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import type { InstrumentCategory } from "../../../Types/instrumentTypes";
import { LESSON_MODE_LABEL, type LessonMode } from "../../../Types/lessonTypes";
import { EMPTY_OPEN_SLOT_FILTER, type OpenSlotFilter } from "../../../Types/searchForTimeTypes";
import type { RegionSearchValue } from "../../../Types/artistRegionTypes";
import { searchLessonReq } from "../../../apis/lesson/lessonSearchApis";
import { formatKRW } from "../../../utils/myPageUtils";
import { getErrorMessage } from "../../../utils/errorUtils";
import { normalizeRegion1DepthName } from "../../../utils/regionUtils";
import LessonDetailDrawer from "../LessonDetailDrawer/LessonDetailDrawer";
import InstFilterDropdown from "../InstFilterDropdown/InstFilterDropdown";
import StyleDropdown from "../../Artist/ArtistSearch/StyleDropdown/StyleDropdown";
import RegionSearchInput from "../../Artist/ArtistSearch/RegionSearchInput/RegionSearchInput";
import SearchTimeFilter from "./SearchTimeFilter/SearchTimeFilter";
import { hasTimeFilter } from "./SearchTimeFilter/hasTimeFilter";
import { useInfiniteScroll } from "../../../hooks/useInfiniteScroll";
import SelectDropdown, { type SelectOption } from "../../../components/common/SelectDropdown/SelectDropdown";
import * as s from "./styles";

const MODE_OPTIONS: SelectOption<LessonMode | "ALL">[] = [
  { value: "ALL", label: "전체 방식" },
  { value: "ONLINE", label: "온라인" },
  { value: "OFFLINE", label: "대면" },
  { value: "VISIT", label: "방문 레슨" },
  { value: "REQUEST_ONLY", label: "일정 협의" },
];

type AppliedFilters = {
  keyword?: string;
  mode?: LessonMode;
  styleTagIds?: number[];
  instIds?: number[];
  instCategory?: InstrumentCategory;
  region1DepthName?: string;
  region2DepthName?: string;
  region3DepthName?: string;
  time?: OpenSlotFilter;
};

const EMPTY_REGION: RegionSearchValue = {
  region1DepthName: "",
  region2DepthName: null,
  region3DepthName: null,
};

function LessonSearchPage() {
  // /lessons/:lessonId 로 들어오면 그 레슨 상세를 열어 둠. 닫으면 /lessons 로 (뒤로 가기로 다시 열리지 않게 replace)
  const { lessonId: lessonIdParam } = useParams();
  const navigate = useNavigate();
  const urlLessonId = Number(lessonIdParam) > 0 ? Number(lessonIdParam) : null;
  const [open, setOpen] = useState(urlLessonId != null);
  const [selectedId, setSelectedId] = useState<number | null>(urlLessonId);
  // 같은 화면에서 주소의 레슨이 바뀌면 (예: 다른 추천 카드) 렌더 중에 맞춤
  const [prevUrlLessonId, setPrevUrlLessonId] = useState(urlLessonId);
  if (urlLessonId !== prevUrlLessonId) {
    setPrevUrlLessonId(urlLessonId);
    if (urlLessonId != null) {
      setSelectedId(urlLessonId);
      setOpen(true);
    }
  }
  const [draftKeyword, setDraftKeyword] = useState("");
  const [draftMode, setDraftMode] = useState<LessonMode | "ALL">("ALL");
  const [draftTagIds, setDraftTagIds] = useState<number[]>([]);
  const [draftTime, setDraftTime] = useState<OpenSlotFilter>(EMPTY_OPEN_SLOT_FILTER);
  const [draftInstCategory, setDraftInstCategory] = useState<InstrumentCategory | "ALL">("ALL");
  const [draftInstIds, setDraftInstIds] = useState<number[]>([]);
  const [draftRegion, setDraftRegion] = useState<RegionSearchValue>(EMPTY_REGION);
  const [applied, setApplied] = useState<AppliedFilters | null>(null);
  const [filterError, setFilterError] = useState<string | null>(null);
  const [regionResetKey, setRegionResetKey] = useState(0);

  const appliedParams = useMemo(() => {
    if (!applied) return null;
    const time = applied.time;
    return {
      keyword: applied.keyword,
      mode: applied.mode,
      styleTagIds: applied.styleTagIds,
      instIds: applied.instIds,
      instCategory: applied.instCategory,
      region1DepthName: applied.region1DepthName,
      region2DepthName: applied.region2DepthName,
      region3DepthName: applied.region3DepthName,
      from: time?.from?.trim() || undefined,
      to: time?.to?.trim() || undefined,
      daysOfWeek: time?.daysOfWeek.length ? time.daysOfWeek : undefined,
      timeParts: time?.timeParts.length ? time.timeParts : undefined,
    };
  }, [applied]);

  const pageSize = 12;
  const {
    data: lessonPages,
    isPending,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["lessons", "search", appliedParams],
    queryFn: async ({ pageParam }) =>
      searchLessonReq({
        ...appliedParams!,
        page: pageParam,
        size: pageSize,
      }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      lastPage.data.length === pageSize ? lastPageParam + 1 : undefined,
    enabled: !!appliedParams,
  });

  const lessons = useMemo(
    () => lessonPages?.pages.flatMap((page) => page.data) ?? [],
    [lessonPages],
  );
  const isInitialLoading = !!appliedParams && isPending;
  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) void fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);
  const loadMoreRef = useInfiniteScroll({
    enabled: !!appliedParams && !!hasNextPage && !isFetchingNextPage && !isError,
    onLoadMore: loadMore,
  });
  const appliedFilterCount = applied
    ? [applied.keyword, applied.mode, applied.styleTagIds?.length,
        applied.instCategory || applied.instIds?.length,
        applied.region1DepthName, applied.time].filter(Boolean).length
    : 0;

  const onSearch = (event?: FormEvent) => {
    event?.preventDefault();
    if (draftTime.from && draftTime.to && draftTime.to < draftTime.from) {
      setFilterError("종료 날짜는 시작 날짜보다 빠를 수 없어요.");
      return;
    }

    setFilterError(null);
    setApplied({
      keyword: draftKeyword.trim() || undefined,
      mode: draftMode === "ALL" ? undefined : draftMode,
      styleTagIds: draftTagIds.length ? draftTagIds : undefined,
      instIds: draftInstIds.length ? draftInstIds : undefined,
      instCategory: draftInstCategory === "ALL" ? undefined : draftInstCategory,
      region1DepthName: normalizeRegion1DepthName(draftRegion.region1DepthName).trim() || undefined,
      region2DepthName: draftRegion.region2DepthName?.trim() || undefined,
      region3DepthName: draftRegion.region3DepthName?.trim() || undefined,
      time: hasTimeFilter(draftTime) ? draftTime : undefined,
    });
  };

  const onReset = () => {
    setDraftKeyword("");
    setDraftMode("ALL");
    setDraftTagIds([]);
    setDraftTime(EMPTY_OPEN_SLOT_FILTER);
    setDraftInstCategory("ALL");
    setDraftInstIds([]);
    setDraftRegion(EMPTY_REGION);
    setApplied(null);
    setFilterError(null);
    setRegionResetKey((value) => value + 1);
  };

  const initialOpenSlotFilter = useMemo<OpenSlotFilter | null>(
    () => applied?.time ?? null,
    [applied],
  );

  return (
    <main css={s.wrap}>
      <header css={s.pageHeader}>
        <span css={s.eyebrow}>LESSON SEARCH</span>
        <h1 css={s.pageTitle}>내게 맞는 레슨 찾기</h1>
        <p css={s.pageDescription}>악기와 수업 방식, 가능한 일정까지 한 번에 비교해 보세요.</p>
      </header>

      <form css={s.filterPanel} onSubmit={onSearch}>
        <div css={s.primaryRow}>
          <label css={s.keywordField}>
            <span css={s.fieldLabel}>검색어</span>
            <input value={draftKeyword} onChange={(e) => setDraftKeyword(e.target.value)}
              placeholder="레슨명이나 배우고 싶은 내용을 입력하세요" css={s.input} />
          </label>
          <div css={s.modeField}>
            <span css={s.fieldLabel}>수업 방식</span>
            <SelectDropdown<LessonMode | "ALL">
              css={s.select}
              ariaLabel="수업 방식"
              value={draftMode}
              onChange={setDraftMode}
              options={MODE_OPTIONS}
            />
          </div>
        </div>

        <div css={s.filterGrid}>
          <div css={s.filterGroup}>
            <span css={s.fieldLabel}>레슨 스타일</span>
            <StyleDropdown lessonStyleTagIds={draftTagIds} onChangeStyleTagIds={setDraftTagIds} />
          </div>
          <div css={s.filterGroupWide}>
            <span css={s.fieldLabel}>악기</span>
            <InstFilterDropdown category={draftInstCategory} onChangeCategory={setDraftInstCategory}
              instIds={draftInstIds} onChangeInstIds={setDraftInstIds} resetOnCategoryChange />
          </div>
        </div>

        <div css={s.filterBlock}>
          <span css={s.fieldLabel}>지역</span>
          <RegionSearchInput key={regionResetKey} value={draftRegion} onChange={setDraftRegion} />
        </div>

        <div css={s.filterBlock}>
          <div css={s.blockHeading}>
            <span css={s.fieldLabel}>가능한 일정</span>
            <span css={s.optionalText}>선택한 조건을 모두 만족하는 레슨만 보여줘요.</span>
          </div>
          <SearchTimeFilter value={draftTime} onChange={setDraftTime} />
          {filterError && <p css={s.validationMessage}>{filterError}</p>}
        </div>

        <div css={s.actions}>
          <button type="button" css={s.resetButton} onClick={onReset}>초기화</button>
          <button type="submit" css={s.searchButton} disabled={isInitialLoading}>
            {isInitialLoading ? "검색 중..." : "레슨 검색"}
          </button>
        </div>
      </form>

      <section css={s.resultSection} aria-live="polite">
        {!appliedParams ? (
          <div css={s.emptyState}>
            <strong>원하는 조건으로 레슨을 찾아보세요.</strong>
            <span>조건 없이 검색하면 현재 열려 있는 모든 레슨을 볼 수 있어요.</span>
          </div>
        ) : (
          <>
            <div css={s.resultHeader}>
              <div>
                <span css={s.resultLabel}>검색 결과</span>
                <h2 css={s.resultTitle}>{isInitialLoading ? "레슨을 찾고 있어요" : `${lessons.length}개 불러옴`}</h2>
              </div>
              {appliedFilterCount > 0 && <span css={s.filterCount}>{appliedFilterCount}개 조건 적용</span>}
            </div>

            {isError ? (
              <div css={s.emptyState}>
                <strong>{getErrorMessage(error, "검색 중 오류가 발생했어요.")}</strong>
                <button type="button" css={s.retryButton} onClick={() => refetch()}>다시 시도</button>
              </div>
            ) : !isInitialLoading && lessons.length === 0 ? (
              <div css={s.emptyState}>
                <strong>조건에 맞는 레슨이 없어요.</strong>
                <span>지역이나 일정 조건을 조금 넓혀보세요.</span>
              </div>
            ) : (
              <>
              <div css={s.list} aria-busy={isFetchingNextPage}>
                {lessons.map((lesson) => {
                  const region = lesson.mainRegionSummary;
                  const regionLabel = region
                    ? [region.region1DepthName, region.region2DepthName, region.region3DepthName]
                        .filter(Boolean).join(" ")
                    : null;
                  return (
                    <button type="button" key={lesson.lessonId} css={s.card}
                      onClick={() => { setSelectedId(lesson.lessonId); setOpen(true); }}>
                      <div css={s.cardTop}>
                        <span css={s.instrumentBadge}>{lesson.instName}</span>
                        <span css={s.cardArrow} aria-hidden="true">→</span>
                      </div>
                      <h3 css={s.cardTitle}>{lesson.title}</h3>
                      <p css={s.cardDescription}>{lesson.description ?? ""}</p>
                      <div css={s.cardMeta}>
                        <span>{LESSON_MODE_LABEL[lesson.mode]}</span><span aria-hidden="true">·</span>
                        <span>{lesson.durationMin}분</span><span aria-hidden="true">·</span>
                        <strong>{lesson.price == null ? "가격 협의" : lesson.price === 0 ? "무료" : formatKRW(lesson.price)}</strong>
                      </div>
                      {regionLabel && <span css={s.regionText}>{regionLabel}</span>}
                    </button>
                  );
                })}
              </div>
              <div ref={loadMoreRef} css={s.loadMore} aria-live="polite">
                {isFetchingNextPage
                  ? "다음 레슨을 불러오는 중..."
                  : hasNextPage
                    ? "스크롤하면 더 불러와요"
                    : lessons.length > 0
                      ? "모든 레슨을 확인했어요."
                      : null}
              </div>
              </>
            )}
          </>
        )}
      </section>

      <LessonDetailDrawer open={open} lessonId={selectedId}
        onClose={() => {
          setOpen(false);
          setSelectedId(null);
          if (urlLessonId != null) navigate("/lessons", { replace: true });
        }}
        initialOpenSlotFilter={initialOpenSlotFilter} />
    </main>
  );
}

export default LessonSearchPage;
