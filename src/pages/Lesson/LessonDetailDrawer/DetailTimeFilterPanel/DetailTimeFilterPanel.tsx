/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import { useEffect, useState } from "react";
import {
  EMPTY_OPEN_SLOT_FILTER,
  type OpenSlotFilter,
} from "../../../../Types/searchForTimeTypes";
import SearchTimeFilter from "../../LessonSearch/SearchTimeFilter/SearchTimeFilter";

type Props = {
  // 드로어(사이드 패널)가 검색 페이지에서 넘어온 조건을 가지고 시작 가능하게
  initial?: OpenSlotFilter | null;
  // 적용 선택 시 부모쪽으로 올려보냄(탭 밖 결과 갱신)
  onApply: (v: OpenSlotFilter | null) => void;
};

function DetailTimeFilterPanel({ initial, onApply }: Props) {
  // draft: 입력중(탭 안에서 토글하다가 적용 누르기 전)
  const [draft, setDraft] = useState<OpenSlotFilter>(
    initial ?? EMPTY_OPEN_SLOT_FILTER,
  );

  // lessonId가 바뀌거나 검색에서 넘어온 초기값이 바뀌면 draft도 동기화
  useEffect(() => {
    setDraft(initial ?? EMPTY_OPEN_SLOT_FILTER);
  }, [initial]);

  // 입력 초기화
  const resetDraft = () => setDraft(EMPTY_OPEN_SLOT_FILTER);

  // 전체 초기화
  const resetAll = () => {
    setDraft(EMPTY_OPEN_SLOT_FILTER);
  onApply(null); // 시간필터 자체 제거
  };

  const apply = () => {
    // draft (기본 상태 일반 값 설정해둠)
    onApply(draft);
  };

  return (
    <div css={s.wrap}>
      <SearchTimeFilter value={draft} onChange={setDraft} />

      <div css={s.btnRow}>
        <button type="button" css={s.ghostBtn} onClick={resetDraft}>
          입력 초기화
        </button>
        <button type="button" css={s.ghostBtn} onClick={resetAll}>
          전체 초기화
        </button>
        <button type="button" css={s.ghostBtn} onClick={apply}>
          적용
        </button>
      </div>
    </div>
  );
}

export default DetailTimeFilterPanel;
