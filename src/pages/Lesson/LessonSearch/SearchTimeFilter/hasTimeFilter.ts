// Lesson Search 에서 시간 관련 필터가 걸렸는지 Lesson detail에서 확인하기 위해 필요한 필터
// 하나라도 true이면 값을 인정해주고 해당 필터에 걸린 timeSlot을 보여줌

import {
  EMPTY_OPEN_SLOT_FILTER,
  type OpenSlotFilter,
} from "../../../../Types/searchForTimeTypes";

// 들어온 값을 normalize 해줌
const norm = (v?: string | null) => (v ?? "").trim();

export const hasTimeFilter = (f: OpenSlotFilter) => {
  // 요일 / 시간대
  const hasDays = (f.daysOfWeek?.length ?? 0) > 0;
  const hasParts = (f.timeParts?.length ?? 0) > 0;

  // 기간(from/to) - EMPTY와 달라졌을 때만 필터를 거쳤다고 인정
  const from = norm(f.from);
  const to = norm(f.to);
  const emptyFrom = norm(EMPTY_OPEN_SLOT_FILTER.from);
  const emptyTo = norm(EMPTY_OPEN_SLOT_FILTER.to);

  const hasDate =
    (from !== "" && from !== emptyFrom) || (to !== "" && to !== emptyTo);

  return hasDays || hasParts || hasDate;
};
