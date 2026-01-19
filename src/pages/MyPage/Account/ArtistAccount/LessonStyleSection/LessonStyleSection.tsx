/** @jsxImportSource @emotion/react */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as s from "./styles";
import { getLessonStyleTagsReq } from "../../../../../apis/lesson/lessonApis";
import {
  getMyArtistStyleTagsReq,
  setMyArtistStyleTagsReq,
} from "../../../../../apis/artist/artistApi";
import { useEffect, useMemo, useRef, useState } from "react";
import type { LessonStyleTagResponse } from "../../../../../Types/lessonTypes";
import MultiSelectDropdown from "../../../../../components/common/MultiSelectDropdown/MultiSelectDropdown";
import SelectedChips from "../../../../../components/common/SelectedChips/SelectedChips";

const MAX_STYLE_TAGS = 5; // 백엔드에도 동일한 규칙 적용 중

function LessonStyleSection() {
  const qc = useQueryClient();

  // 드롭다운이 검색/선택을 히려면 선택지 풀이 필요하니까 그걸 한번에 받아옴
  const { data: allTags = [] } = useQuery({
    queryKey: ["lessonStyleTags"],
    queryFn: async () => (await getLessonStyleTagsReq()).data.data ?? [], // 레슨 스타일 태그 다 가져옴
    staleTime: 10 * 60 * 1000,
  });

  // 내 아티스트 스타일 태그(초기값)
  const { data: myTags = [], isFetched: myTagsFetched } = useQuery({
    queryKey: ["artistStyleTags", "me"],
    queryFn: async () => (await getMyArtistStyleTagsReq()).data.data ?? [], // 내 레슨 스타일 태그 다 가져옴
  });

  // 드롭다운/칩 공용으로 쓰기 좋게: id 배열만 state로 관리 - 내가 고른것들
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // 유저가 수정했는지
  const touchedRef = useRef(false);

  // myTags 기본값 때문에 useEffect 가 너무 일찍 한 번 실행됨
  // useEffect(() => {
  //   // myTags가 아직 로딩 전이면 빈배열일 수도 있으니 "쿼리 결과가 한번 들어온 뒤" 주입하려면 조건 걸어도 ok
  //   if (didInitRef.current) return;
  //   setSelectedIds(myTags.map((t) => t.lessonStyleTagId));
  //   didInitRef.current = true; // 초기 주입 완료
  // }, [myTags]);

  // id -> tag 객체 싱크용 (칩 표시 안정화) - id만 있으면 styleName을 못 보여주니까
  // 각 태그 for문 돌려서 map으로 만듦 - 선택된 id를 태그객체로 빠르고 안전하게 변환
  const tagMap = useMemo(() => {
    const m = new Map<number, LessonStyleTagResponse>();
    for (const t of allTags) m.set(t.lessonStyleTagId, t); // 전체 스타일 아이디 넣음
    for (const t of myTags) m.set(t.lessonStyleTagId, t); // 내가 고른 스타일 아이디(보험)
    return m;
  }, [allTags, myTags]);

  const selectedTags = useMemo(() => {
    return selectedIds
      .map((id) => tagMap.get(id))
      .filter((v): v is LessonStyleTagResponse => !!v);
  }, [selectedIds, tagMap]);

  // 저장 버튼 활성화 여부(서버값과 비교)
  // 아이디 순서가 다르면 내용은 같은데 순서가 다르다고 다르다고 판단해버림
  // 비교 함수 결과가 음수면 a를 b보다 앞에, 0이면 순서 유지. 양수면 a를 b보다 뒤에 둠
  const isDirty = useMemo(() => {
    const server = myTags
      .map((t) => t.lessonStyleTagId)
      .slice()
      .sort((a, b) => a - b);
    const local = selectedIds.slice().sort((a, b) => a - b);
    if (server.length !== local.length) return true;
    return server.some((v, i) => v !== local[i]); // some = 하나라도 조건을 만족하면 true
    // 정렬된 상태에서 i 값이 하나라도 다르면 변경됨 v = 배열 안에 들어있는 현재 요소 값
  }, [myTags, selectedIds]);

  // 저장
  const saveMutation = useMutation({
    mutationFn: async () => {
      // 백엔드에서 5개 제한 걸어놓긴 했는데 프론트에서도 ux로 막아주면 좋을듯
      if (selectedIds.length > MAX_STYLE_TAGS) {
        throw new Error(
          `스타일 태그는 최대 ${MAX_STYLE_TAGS}개까지 선택 가능합니다.`
        );
      }
      return (await setMyArtistStyleTagsReq({ styleTagIds: selectedIds })).data
        .data;
    },
    onSuccess: async (updated) => {
      // 서버 캐시 갱신
      await qc.invalidateQueries({ queryKey: ["artistStyleTags", "me"] });

      // 서버가 내려준 최종 상태로 동기화
      if (updated) {
        setSelectedIds(updated.map((t) => t.lessonStyleTagId));

        touchedRef.current = false; // 저장 후 다시 동기화 가능 상태
      }
      alert("스타일 태그 저장 완료");
    },
    onError: (err: unknown) => {
      const msg = err instanceof Error ? err.message : "저장 실패";
      alert(msg);
    },
  });

  useEffect(() => {
    if (!myTagsFetched) return;
    if (touchedRef.current) return; // 유저가 바꾼 상태면 덮어쓰지 않음

    setSelectedIds((myTags ?? []).map((t) => t.lessonStyleTagId));
  }, [myTagsFetched, myTags, isDirty]);

  const locked = saveMutation.isPending; // 로딩 상태일때 버튼 lock

  // 드롭다운에서 ids 변경될 때 5개 제한 ux 처리
  const onChangeSelectedIds = (ids: number[]) => {
    touchedRef.current = true; // 사용자가 변경함
    const unique = Array.from(new Set(ids));
    if (unique.length > MAX_STYLE_TAGS) {
      alert(`스타일 태그는 최대 ${MAX_STYLE_TAGS}개까지 선택 가능합니다.`);
      return;
    }
    setSelectedIds(unique);
  };

  const onRemoveChip = (t: LessonStyleTagResponse) => {
    touchedRef.current = true;
    setSelectedIds((prev) => prev.filter((id) => id !== t.lessonStyleTagId));
  };

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <h3 style={{ margin: 0 }}>레슨 스타일</h3>
        <p style={{ margin: "6px 0 0", fontSize: 13, color: "#667" }}>
          최대 {MAX_STYLE_TAGS}개 선택 가능
        </p>
      </div>

      <MultiSelectDropdown<LessonStyleTagResponse>
        label="스타일 선택"
        selectedCountLabel={(n) => `스타일 ${n}개 선택됨`}
        searchPlaceholder="스타일 검색 (예:체계적)"
        items={allTags}
        isLoading={false}
        getId={(t) => t.lessonStyleTagId}
        getLabel={(t) => t.styleName}
        selectedIds={selectedIds}
        onChangeSelectedIds={onChangeSelectedIds}
      />

      <div style={{ marginTop: 10 }}>
        <SelectedChips<LessonStyleTagResponse>
          disabled={locked}
          items={selectedTags}
          getKey={(t) => t.lessonStyleTagId}
          getLabel={(t) => t.styleName}
          onRemove={onRemoveChip}
        />
      </div>

      <button
        type="button"
        disabled={locked || !isDirty}
        onClick={() => saveMutation.mutate()}
        style={{ marginTop: 12 }}
      >
        {locked ? "저장중..." : "저장"}
      </button>
    </div>
  );
}

export default LessonStyleSection;
