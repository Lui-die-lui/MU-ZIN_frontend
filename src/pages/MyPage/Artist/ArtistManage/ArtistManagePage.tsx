/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import * as ls from "./MyLessonList/styles";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import SelectDropdown from "../../../../components/common/SelectDropdown/SelectDropdown";
import {
  useMyLessonUiStore,
  type LessonSort,
  type LessonStatusFilter,
} from "../../../../stores/myLessonUiState";
import { useMyLessonList } from "../../../../hooks/Lesson/useLessonEdit";
import MyLessonList from "./MyLessonList/MyLessonList";

const SORT_OPTIONS: { value: LessonSort; label: string }[] = [
  { value: "LATEST", label: "최신순" },
  { value: "OLDEST", label: "오래된순" },
  { value: "TITLE", label: "이름순" },
];

const STATUS_TABS: { value: LessonStatusFilter; label: string }[] = [
  { value: "ALL", label: "전체" },
  { value: "ACTIVE", label: "공개 중" },
  { value: "INACTIVE", label: "비공개" },
];

function ArtistManagePage() {
  const navigate = useNavigate();
  const { sort, statusFilter, keyword, setSort, setStatusFilter, setKeyword, reset } = useMyLessonUiStore();

  // 수정/삭제/생성 화면과 같은 캐시 키를 써서 다녀오면 바로 최신 목록이 보이게 함
  // (예전엔 ["myLessons", sort] 키를 따로 써서 삭제한 레슨이 잠시 남아 있었고, 정렬은 키만 바뀌고 실제로 정렬되지 않았음)
  const { data: lessons = [], isLoading, isError, refetch, isRefetching } = useMyLessonList();

  const counts = useMemo(
    () => ({
      ALL: lessons.length,
      ACTIVE: lessons.filter((l) => l.status === "ACTIVE").length,
      INACTIVE: lessons.filter((l) => l.status === "INACTIVE").length,
    }),
    [lessons],
  );

  const pendingTotal = useMemo(() => lessons.reduce((sum, l) => sum + (l.pendingRequestCount ?? 0), 0), [lessons]);

  const visible = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    const filtered = lessons.filter(
      (l) =>
        (statusFilter === "ALL" || l.status === statusFilter) &&
        (!q || l.title.toLowerCase().includes(q) || (l.instName ?? "").toLowerCase().includes(q)),
    );
    const byCreated = (a: string, b: string) => a.localeCompare(b);
    return [...filtered].sort((a, b) => {
      if (sort === "TITLE") return a.title.localeCompare(b.title, "ko");
      const diff = byCreated(a.createDt ?? "", b.createDt ?? "") || a.lessonId - b.lessonId;
      return sort === "OLDEST" ? diff : -diff;
    });
  }, [lessons, statusFilter, keyword, sort]);

  const filtering = statusFilter !== "ALL" || keyword.trim() !== "";

  const renderBody = () => {
    if (isLoading) {
      return (
        <div css={ls.list} aria-busy="true">
          <div css={ls.skeleton} />
          <div css={ls.skeleton} />
          <div css={ls.skeleton} />
        </div>
      );
    }
    // 예전엔 불러오기 실패도 "아직 레슨이 없습니다"로 보였음
    if (isError) {
      return (
        <div css={ls.empty} role="alert">
          <p css={ls.emptyTitle}>레슨 목록을 불러오지 못했어요.</p>
          <p css={ls.emptyDesc}>잠시 후 다시 시도해주세요.</p>
          <button type="button" css={ls.emptyBtn(false)} onClick={() => refetch()} disabled={isRefetching}>
            {isRefetching ? "불러오는 중..." : "다시 불러오기"}
          </button>
        </div>
      );
    }
    if (lessons.length === 0) {
      return (
        <div css={ls.empty}>
          <p css={ls.emptyTitle}>아직 만든 레슨이 없어요.</p>
          <p css={ls.emptyDesc}>레슨을 만들고 예약 가능한 시간을 열어두면 수강생이 예약할 수 있어요.</p>
          <button type="button" css={ls.emptyBtn(true)} onClick={() => navigate("/mypage/artist/new")}>
            첫 레슨 만들기
          </button>
        </div>
      );
    }
    if (visible.length === 0) {
      return (
        <div css={ls.empty}>
          <p css={ls.emptyTitle}>조건에 맞는 레슨이 없어요.</p>
          <p css={ls.emptyDesc}>검색어나 공개 상태 필터를 바꿔보세요.</p>
          <button type="button" css={ls.emptyBtn(false)} onClick={reset}>
            필터 초기화
          </button>
        </div>
      );
    }
    return (
      <>
        {filtering && <p css={s.resultText}>{visible.length}개 레슨</p>}
        <MyLessonList lessons={visible} />
      </>
    );
  };

  return (
    <div css={s.page}>
      <div css={s.headerRow}>
        <div>
          <h2 css={s.title}>내 레슨 관리</h2>
          <p css={s.sub}>레슨 정보와 공개 여부, 예약 가능한 시간을 관리해요.</p>
        </div>
        <button type="button" css={s.primaryBtn} onClick={() => navigate("/mypage/artist/new")}>
          + 레슨 만들기
        </button>
      </div>

      {pendingTotal > 0 && (
        <div css={s.banner} role="status">
          <span>
            확인을 기다리는 예약 요청이 <b>{pendingTotal}건</b> 있어요.
          </span>
          <button type="button" css={s.bannerLink} onClick={() => navigate("/mypage/reservations/requests")}>
            예약 요청 보기 →
          </button>
        </div>
      )}

      {lessons.length > 0 && (
        <div css={s.toolbar}>
          <div css={s.segment} role="tablist" aria-label="공개 상태">
            {STATUS_TABS.map((t) => (
              <button
                key={t.value}
                type="button"
                role="tab"
                aria-selected={statusFilter === t.value}
                css={s.segmentBtn(statusFilter === t.value)}
                onClick={() => setStatusFilter(t.value)}
              >
                {t.label}
                <span>{counts[t.value]}</span>
              </button>
            ))}
          </div>

          <div css={s.searchWrap}>
            <input
              css={s.searchInput}
              type="text"
              value={keyword}
              maxLength={50}
              placeholder="레슨 이름이나 악기로 찾기"
              aria-label="레슨 검색"
              onChange={(e) => setKeyword(e.target.value)}
            />
            {keyword && (
              <button type="button" css={s.searchClear} aria-label="검색어 지우기" onClick={() => setKeyword("")}>
                ×
              </button>
            )}
          </div>

          <SelectDropdown<LessonSort>
            css={s.sortSelect}
            ariaLabel="정렬"
            value={sort}
            onChange={setSort}
            options={SORT_OPTIONS}
          />
        </div>
      )}

      {renderBody()}
    </div>
  );
}

export default ArtistManagePage;
