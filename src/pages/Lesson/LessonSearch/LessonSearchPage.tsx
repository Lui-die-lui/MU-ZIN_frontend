/** @jsxImportSource @emotion/react */
import { useQuery } from "@tanstack/react-query";
import type { LessonMode } from "../../../Types/lessonTypes";
import * as s from "./styles";

import React, { useMemo, useState } from "react";
import { getLessonStyleTagsReq } from "../../../apis/lesson/lessonApis";
import { searchLessonReq } from "../../../apis/lesson/lessonSearchApis";
import { css } from "@emotion/react";

function LessonSearchPage() {
  // draft (입력중)
  const [draftKeyword, setDraftKeyword] = useState("");
  const [draftMode, setDraftMode] = useState<LessonMode | "ALL">("ALL");
  const [draftTagIds, setDraftTagIds] = useState<number[]>([]);

  // 검색버튼 눌러서 확정된 조건
  const [applied, setApplied] = useState<null | {
    keyword?: string;
    mode?: LessonMode;
    styleTagIds?: number[];
  }>(null);

  // 태그 목록(chip UI)
  const { data: tagResp } = useQuery({
    queryKey: ["lessonStyleTags"],
    queryFn: async () => (await getLessonStyleTagsReq()).data,
  });

  const tags = tagResp?.data ?? [];

  const appliedParams = useMemo(() => {
    if (!applied) return null;
    return {
      keyword: applied.keyword,
      mode: applied.mode,
      styleTagIds: applied.styleTagIds,
    };
  }, [applied]);

  // 레슨 검색(버튼 누른 후에만)
  const {
    data: lessonResp,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["lessons", "search", appliedParams],
    queryFn: async () => (await searchLessonReq(appliedParams!)).data,
    enabled: !!appliedParams, // applied가 되기 전에 호출하지 않음
  });

  const lessons = lessonResp?.data ?? [];

  const toggleTag = (id: number) => {
    setDraftTagIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const onSearch = () => {
    setApplied({
      keyword: draftKeyword.trim() || undefined,
      mode: draftMode === "ALL" ? undefined : draftMode,
      styleTagIds: draftTagIds.length ? draftTagIds : undefined,
    });

    // enabled가 true로 바뀌면서 자동호출되긴하는데 즉시호출 원하면
    refetch();
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
              <div key={l.lessonId} css={s.card}>
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
                  {l.price ? `${l.price.toLocaleString()}원` : "가격 협의"}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default LessonSearchPage;
