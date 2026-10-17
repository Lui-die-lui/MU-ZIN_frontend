/** @jsxImportSource @emotion/react */
import * as s from "./styles";

import type { OpenSlotFilter, SlotItem } from "../../../../Types/searchForTimeTypes";
import { useMemo } from "react";
import { hasTimeFilter } from "../../LessonSearch/SearchTimeFilter/hasTimeFilter";
import { useQuery } from "@tanstack/react-query";
import { getOpenTimeSlotsReq } from "../../../../apis/lesson/timeSlotApis";
import TimeSlotPickerGrouped from "../../../../components/common/TimeSlotPickerGrouped/TimeSlotPickerGroped";
import { timeSlotKeys } from "../../../../hooks/Lesson/timeSlotKeys";

type Props = {
  lessonId: number;
  filter: OpenSlotFilter | null;
  // 고른 시간은 상세 창이 관리 (아래 고정 버튼에 선택한 시간을 보여주기 위해)
  selectedId: number | null;
  onSelect: (slot: SlotItem | null) => void;
  requireFilterToShow?: boolean; // 필터를 기본으로 보여줄건지 아닌지
};

// 예약 가능한 시간 목록 (날짜별로 묶어서 칩으로 선택)
// 예전: 이 안에 예약 버튼 + 로그인 alert 가 있었음 -> 상세 창 아래 고정 영역으로 옮김
function LessonTimeSlotSection({ lessonId, filter, selectedId, onSelect, requireFilterToShow = false }: Props) {
  // 실제로 적용된 필터만(필터 선택없을 때 전체 검색을 위해서)
  const effectiveFilter = hasTimeFilter(filter) ? filter : null;
  const shouldShowSlots = requireFilterToShow ? !!effectiveFilter : true;

  const params = useMemo(() => {
    if (!effectiveFilter) return undefined;
    return {
      from: effectiveFilter.from?.trim() || undefined,
      to: effectiveFilter.to?.trim() || undefined,
      daysOfWeek: effectiveFilter.daysOfWeek?.length ? effectiveFilter.daysOfWeek : undefined,
      timeParts: effectiveFilter.timeParts?.length ? effectiveFilter.timeParts : undefined,
    };
  }, [effectiveFilter]);

  const { data, isFetching, isError, refetch } = useQuery({
    queryKey: timeSlotKeys.openSlots(lessonId, params),
    queryFn: async () => (await getOpenTimeSlotsReq(lessonId, params)).data,
    enabled: !!lessonId && shouldShowSlots,
  });

  const slots = useMemo(() => data?.data ?? [], [data]);

  if (!shouldShowSlots) {
    return (
      <div css={s.emptyBox}>
        <div css={s.emptyTitle}>레슨 시간을 검색해주세요</div>
        <div css={s.emptyDesc}>위의 시간 필터에서 기간/요일/시간대를 선택하고 “적용”을 눌러주세요.</div>
      </div>
    );
  }

  if (isFetching && slots.length === 0) return <div css={s.hint}>예약 가능한 시간을 불러오는 중...</div>;

  if (isError) {
    return (
      <div css={s.hint} role="alert">
        시간을 불러오지 못했어요.{" "}
        <button type="button" css={s.linkBtn} onClick={() => refetch()}>
          다시 불러오기
        </button>
      </div>
    );
  }

  return (
    <TimeSlotPickerGrouped
      slots={slots}
      selectedId={selectedId}
      onChangeSelectedId={(id) => onSelect(id == null ? null : (slots.find((x) => x.timeSlotId === id) ?? null))}
      isDisabled={(x) => x.state === "BOOKED" || x.active === false}
      emptyText={
        effectiveFilter
          ? "조건에 맞는 시간이 없어요. 시간대 조건을 바꾸거나 해제해보세요."
          : "지금 예약할 수 있는 시간이 없어요."
      }
    />
  );
}

export default LessonTimeSlotSection;
