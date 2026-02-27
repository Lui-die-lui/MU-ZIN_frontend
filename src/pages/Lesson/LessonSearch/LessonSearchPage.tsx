/** @jsxImportSource @emotion/react */
import { useQuery } from "@tanstack/react-query";
import type { LessonMode } from "../../../Types/lessonTypes";
import * as s from "./styles";

import { useMemo, useState } from "react";
import { getLessonStyleTagsReq } from "../../../apis/lesson/lessonApis";
import { searchLessonReq } from "../../../apis/lesson/lessonSearchApis";
import { css } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "../../../hooks/useIsMobile";
import LessonDetailDrawer from "../LessonDetailDrawer/LessonDetailDrawer";
import InstFilterDropdown from "../InstFilterDropdown/InstFilterDropdown";
import {
  EMPTY_OPEN_SLOT_FILTER,
  type OpenSlotFilter,
} from "../../../Types/searchForTimeTypes";
import SearchTimeFilter from "./SearchTimeFilter/SearchTimeFilter";
import type { InstrumentCategory } from "../../../Types/instrumentTypes";
import { hasTimeFilter } from "./SearchTimeFilter/hasTimeFilter";
import { formatKRW } from "../../../utils/myPageUtils";

function LessonSearchPage() {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // draft (입력중)
  const [draftKeyword, setDraftKeyword] = useState("");
  const [draftMode, setDraftMode] = useState<LessonMode | "ALL">("ALL");
  const [draftTagIds, setDraftTagIds] = useState<number[]>([]);
  const [draftTime, setDraftTime] = useState<OpenSlotFilter>(
    EMPTY_OPEN_SLOT_FILTER,
  );

  //악기 카테고리
  const [draftInstCategory, setDraftInstCategory] = useState<
    InstrumentCategory | "ALL"
  >("ALL");
  const [draftInstIds, setDraftInstIds] = useState<number[]>([]);

  // 검색버튼 눌러서 확정된 조건
  const [applied, setApplied] = useState<null | {
    keyword?: string;
    mode?: LessonMode;
    styleTagIds?: number[];
    instIds?: number[];
    instCategory?: InstrumentCategory;
    time?: OpenSlotFilter;
  }>(null);

  // 태그 목록(chip UI)
  const { data: tagResp } = useQuery({
    queryKey: ["lessonStyleTags"],
    queryFn: async () => (await getLessonStyleTagsReq()).data,
  });

  const tags = tagResp?.data ?? [];

  const appliedParams = useMemo(() => {
    if (!applied) return null;

    const t = applied.time;

    // 빈배열/빈 문자열ㅇ이면 꼬일 가능성때문에 연산자 사용
    return {
      keyword: applied.keyword,
      mode: applied.mode,
      styleTagIds: applied.styleTagIds,

      instIds: applied.instIds,
      instCategory: applied.instCategory,

      from: t?.from?.trim() || undefined,
      to: t?.to?.trim() || undefined,

      daysOfWeek: t?.daysOfWeek?.length ? t.daysOfWeek : undefined,
      timeParts: t?.timeParts?.length ? t.timeParts : undefined,
    };
  }, [applied]);

  // 레슨 검색(버튼 누른 후에만)
  const {
    data: lessonResp,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["lessons", "search", appliedParams],
    queryFn: async () => (await searchLessonReq(appliedParams!)).data,
    enabled: !!appliedParams, // applied가 되기 전에 호출하지 않음
  });

  const lessons = lessonResp?.data ?? [];

  const toggleTag = (id: number) => {
    setDraftTagIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  // 검색
  const onSearch = () => {
    setApplied({
      keyword: draftKeyword.trim() || undefined,
      mode: draftMode === "ALL" ? undefined : draftMode,
      styleTagIds: draftTagIds.length ? draftTagIds : undefined,
      instIds: draftInstIds.length ? draftInstIds : undefined,
      instCategory: draftInstCategory === "ALL" ? undefined : draftInstCategory,
      time: hasTimeFilter(draftTime) ? draftTime : undefined,
    });
  };

  const initialOpenSlotFilter = useMemo<OpenSlotFilter | null>(() => {
    // onSearch에서 필터 없으면 undefined라서 null로 떨어짐
    return applied?.time ?? null;
  }, [applied]);

  // 레슨 클릭 시
  const onClickLesson = (lessonId: number) => {
    // if (isMobile) {
    //   // 모바일이면
    //   navigate(`/lessons/${lessonId}`);
    //   return;
    // }
    setSelectedId(lessonId);
    setOpen(true); // 데스크탑이면 사이드바
  };

  const close = () => {
    setOpen(false);
    setSelectedId(null);
  };

  return (
    <div css={s.wrap}>
      {/* 검색창 */}
      <div css={s.row}>
        <input
          value={draftKeyword}
          onChange={(e) => setDraftKeyword(e.target.value)}
          placeholder="레슨 검색어를 입력하세요 (예: 플룻, 기본기)"
          css={css`
            flex: 1;
            min-width: 220px;
            padding: 10px 12px;
            border-radius: 12px;
            border: 1px solid #d7dfe7;
          `}
        />

        <select
          value={draftMode}
          onChange={(e) => setDraftMode(e.target.value as any)}
          css={css`
            padding: 10px 12px;
            border-radius: 12px;
            border: 1px solid #d7dfe7;
          `}
        >
          <option value="ALL">전체</option>
          <option value="REQUEST_ONLY">요청만</option>
          <option value="ONLINE">온라인</option>
          <option value="OFFLINE">오프라인</option>
        </select>
        <InstFilterDropdown
          category={draftInstCategory}
          onChangeCategory={setDraftInstCategory}
          instIds={draftInstIds}
          onChangeInstIds={setDraftInstIds}
          resetOnCategortChange={true}
        />

        <button
          onClick={onSearch}
          css={css`
            padding: 10px 14px;
            border-radius: 12px;
            border: none;
            background: #111;
            color: #fff;
            cursor: pointer;
          `}
        >
          검색
        </button>
      </div>

      <SearchTimeFilter value={draftTime} onChange={setDraftTime} />

      {/* 스타일 태그 필터 */}
      <div css={s.row}>
        {tags.map((t) => {
          const active = draftTagIds.includes(t.lessonStyleTagId);
          return (
            <div
              key={t.lessonStyleTagId}
              css={s.chip(active)}
              onClick={() => toggleTag(t.lessonStyleTagId)}
            >
              {t.styleName}
            </div>
          );
        })}
      </div>
      <div css={s.row}></div>

      {/* 결과 */}
      {!appliedParams && (
        <div
          css={css`
            color: #667;
            padding: 10px 2px;
          `}
        >
          검색어/필터 설정 후 검색 버튼을 눌러주세요.
        </div>
      )}

      {appliedParams && (
        <>
          {isFetching && <div>불러오는 중...</div>}
          {isError && <div>검색 중 오류가 발생했어요.</div>}

          {!isFetching && lessons.length === 0 && (
            <div
              css={css`
                color: #667;
                padding: 10px 2px;
              `}
            >
              조건에 맞는 레슨이 없어요.
            </div>
          )}

          <div
            css={css`
              display: flex;
              flex-direction: column;
              gap: 10px;
            `}
          >
            {lessons.map((l) => (
              <div
                key={l.lessonId}
                css={s.card}
                onClick={() => onClickLesson(l.lessonId)}
              >
                <div
                  css={css`
                    font-weight: 700;
                  `}
                >
                  {l.title}
                </div>
                {/* {l.description && (
                  <div
                    css={css`
                      color: #556;
                      margin-top: 6px;
                    `}
                  >
                    {l.description}
                  </div>
                )} */}
                <div
                  css={css`
                    color: #667;
                    margin-top: 10px;
                    font-size: 13px;
                  `}
                >
                  {l.mode} · {l.durationMin}분 ·{" "}
                  {l.price ? `${formatKRW(l.price)}` : "가격 협의"}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      <LessonDetailDrawer
        open={open}
        lessonId={selectedId}
        onClose={close}
        initialOpenSlotFilter={initialOpenSlotFilter}
      />
    </div>
  );
}

export default LessonSearchPage;
