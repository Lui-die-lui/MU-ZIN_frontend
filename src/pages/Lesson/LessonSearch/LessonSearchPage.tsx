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
import SearchHero from "../../../components/search/SearchHero";
import Chevron from "../../../components/common/Chevron";
import * as ui from "../../../components/search/searchStyles";
import { useScrollFade } from "../../../hooks/useScrollFade";
import { PiMagnifyingGlassBold, PiSlidersHorizontalBold } from "react-icons/pi";
import * as s from "./styles";

type SelectOption<T> = { value: T; label: string };

const MODE_OPTIONS: SelectOption<LessonMode | "ALL">[] = [
  { value: "ALL", label: "전체" },
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
  const toolbarRef = useScrollFade<HTMLDivElement>();
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
  // 들어오자마자 전체 레슨을 보여줌 (예전: 검색 버튼을 눌러야 목록이 나옴)
  const [applied, setApplied] = useState<AppliedFilters | null>({});
  const [panelOpen, setPanelOpen] = useState(false);
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
  // 상세 조건(접힌 곳)에 적용된 개수 - 상세 조건 버튼에 표시
  const detailCount = applied
    ? [applied.styleTagIds?.length, applied.instCategory || applied.instIds?.length,
        applied.region1DepthName, applied.time].filter(Boolean).length
    : 0;
  const appliedFilterCount = applied ? detailCount + [applied.keyword, applied.mode].filter(Boolean).length : 0;

  // 지금 고른 조건(draft)을 적용. 칩처럼 바로 적용하는 곳은 바뀐 값만 넘김
  const apply = (over: { mode?: LessonMode | "ALL" } = {}) => {
    if (draftTime.from && draftTime.to && draftTime.to < draftTime.from) {
      setFilterError("종료 날짜는 시작 날짜보다 빠를 수 없어요.");
      setPanelOpen(true);
      return;
    }
    const mode = over.mode ?? draftMode;
    setFilterError(null);
    setApplied({
      keyword: draftKeyword.trim() || undefined,
      mode: mode === "ALL" ? undefined : mode,
      styleTagIds: draftTagIds.length ? draftTagIds : undefined,
      instIds: draftInstIds.length ? draftInstIds : undefined,
      instCategory: draftInstCategory === "ALL" ? undefined : draftInstCategory,
      region1DepthName: normalizeRegion1DepthName(draftRegion.region1DepthName).trim() || undefined,
      region2DepthName: draftRegion.region2DepthName?.trim() || undefined,
      region3DepthName: draftRegion.region3DepthName?.trim() || undefined,
      time: hasTimeFilter(draftTime) ? draftTime : undefined,
    });
  };

  const onSearch = (event?: FormEvent) => {
    event?.preventDefault();
    apply();
  };

  // 수업 방식 칩: 누르면 바로 적용
  const pickMode = (mode: LessonMode | "ALL") => {
    setDraftMode(mode);
    apply({ mode });
  };

  const onReset = () => {
    setDraftKeyword("");
    setDraftMode("ALL");
    setDraftTagIds([]);
    setDraftTime(EMPTY_OPEN_SLOT_FILTER);
    setDraftInstCategory("ALL");
    setDraftInstIds([]);
    setDraftRegion(EMPTY_REGION);
    setApplied({});
    setFilterError(null);
    setRegionResetKey((value) => value + 1);
  };

  const initialOpenSlotFilter = useMemo<OpenSlotFilter | null>(
    () => applied?.time ?? null,
    [applied],
  );
  const activeMode = applied?.mode ?? "ALL";

  return (
    <main css={ui.page}>
      <SearchHero
        eyebrow="LESSON SEARCH"
        title="내게 맞는 레슨 찾기"
        desc="악기와 수업 방식, 가능한 일정까지 한 번에 비교해 보세요."
      >
        <form onSubmit={onSearch} css={s.form}>
          <div css={ui.searchPill}>
            <PiMagnifyingGlassBold css={ui.searchIcon} size={18} aria-hidden="true" />
            <input
              value={draftKeyword}
              onChange={(e) => setDraftKeyword(e.target.value)}
              placeholder="레슨명, 배우고 싶은 내용"
              aria-label="레슨 검색어"
              css={ui.searchInput}
            />
            <button type="submit" css={ui.searchButton} disabled={isInitialLoading}>
              검색
            </button>
          </div>

          {/* 상세 조건 열기 | 수업 방식 (바로 적용) */}
          <div css={ui.toolbar} ref={toolbarRef}>
            <button
              type="button"
              css={ui.chip(panelOpen)}
              aria-expanded={panelOpen}
              aria-controls="lesson-filter-panel"
              onClick={() => setPanelOpen((v) => !v)}
            >
              <PiSlidersHorizontalBold size={15} aria-hidden="true" />
              상세 조건
              {detailCount > 0 && <span css={ui.chipCount(panelOpen)}>{detailCount}</span>}
            </button>
            <span css={ui.divider} aria-hidden="true" />
            <div css={s.chipGroup} role="group" aria-label="수업 방식">
              {MODE_OPTIONS.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  css={ui.chip(activeMode === o.value)}
                  aria-pressed={activeMode === o.value}
                  onClick={() => pickMode(o.value)}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          {panelOpen && (
            <div id="lesson-filter-panel" css={ui.panel}>
              <div css={ui.panelGrid}>
                <div css={ui.field}>
                  <span css={ui.fieldLabel}>악기</span>
                  <InstFilterDropdown category={draftInstCategory} onChangeCategory={setDraftInstCategory}
                    instIds={draftInstIds} onChangeInstIds={setDraftInstIds} resetOnCategoryChange />
                </div>
                <div css={ui.field}>
                  <span css={ui.fieldLabel}>레슨 스타일</span>
                  <StyleDropdown lessonStyleTagIds={draftTagIds} onChangeStyleTagIds={setDraftTagIds} />
                </div>
                <div css={ui.fieldWide}>
                  <span css={ui.fieldLabel}>지역</span>
                  <RegionSearchInput key={regionResetKey} value={draftRegion} onChange={setDraftRegion} />
                </div>
                <div css={ui.fieldWide}>
                  <span css={ui.fieldLabel}>
                    가능한 일정 <small>고른 조건을 모두 만족하는 레슨만 보여줘요.</small>
                  </span>
                  <SearchTimeFilter value={draftTime} onChange={setDraftTime} />
                  {filterError && <p css={ui.validation}>{filterError}</p>}
                </div>
              </div>
              <div css={ui.panelActions}>
                <button type="button" css={ui.ghostButton} onClick={onReset}>초기화</button>
                <button type="submit" css={ui.primaryButton} disabled={isInitialLoading}>조건 적용</button>
              </div>
            </div>
          )}
        </form>
      </SearchHero>

      <section css={ui.results} aria-live="polite">
        <div css={ui.resultHead}>
          <h2 css={ui.resultTitle}>
            레슨
            {!isInitialLoading && !isError && <span>{lessons.length}{hasNextPage ? "+" : ""}개</span>}
          </h2>
          {appliedFilterCount > 0 && (
            <div css={ui.resultTools}>
              <span>{appliedFilterCount}개 조건 적용</span>
              <button type="button" css={ui.textButton} onClick={onReset}>조건 지우기</button>
            </div>
          )}
        </div>

        {isError ? (
          <div css={ui.emptyState}>
            <strong>{getErrorMessage(error, "검색 중 오류가 발생했어요.")}</strong>
            <button type="button" css={ui.primaryButton} onClick={() => refetch()}>다시 시도</button>
          </div>
        ) : isInitialLoading ? (
          <div css={s.list} aria-busy="true" aria-label="레슨을 찾고 있어요">
            {Array.from({ length: 6 }, (_, i) => <span key={i} css={[ui.skeleton, s.cardSkeleton]} />)}
          </div>
        ) : lessons.length === 0 ? (
          <div css={ui.emptyState}>
            <strong>조건에 맞는 레슨이 없어요.</strong>
            <span>지역이나 일정 조건을 조금 넓혀보세요.</span>
          </div>
        ) : (
          <>
            <div css={[s.list, ui.listBusy]} aria-busy={isFetchingNextPage}>
              {lessons.map((lesson) => {
                const region = lesson.mainRegionSummary;
                const regionLabel = region
                  ? [region.region1DepthName, region.region2DepthName, region.region3DepthName]
                      .filter(Boolean).join(" ")
                  : null;
                return (
                  <button type="button" key={lesson.lessonId} css={s.card}
                    onClick={() => { setSelectedId(lesson.lessonId); setOpen(true); }}>
                    <span css={s.cardHead}>
                      <span css={s.instBadge}>{lesson.instName}</span>
                      <span css={s.cardSub}>{LESSON_MODE_LABEL[lesson.mode]} · {lesson.durationMin}분</span>
                    </span>
                    <h3 css={s.cardTitle}>{lesson.title}</h3>
                    {lesson.description && <p css={s.cardDescription}>{lesson.description}</p>}
                    <span css={s.cardFoot}>
                      <span css={s.cardMeta}>
                        <strong>{lesson.price == null ? "가격 협의" : lesson.price === 0 ? "무료" : formatKRW(lesson.price)}</strong>
                        {regionLabel && <span>{regionLabel}</span>}
                      </span>
                      <span css={s.cardArrow} aria-hidden="true"><Chevron size={16} /></span>
                    </span>
                  </button>
                );
              })}
            </div>
            <div ref={loadMoreRef} css={ui.loadMore} aria-live="polite">
              {isFetchingNextPage
                ? "다음 레슨을 불러오는 중..."
                : hasNextPage
                  ? "스크롤하면 더 불러와요"
                  : "모든 레슨을 확인했어요."}
            </div>
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
