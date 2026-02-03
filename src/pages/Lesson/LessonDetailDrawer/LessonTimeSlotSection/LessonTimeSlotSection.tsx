/** @jsxImportSource @emotion/react */
import * as s from "./styles";

import type { OpenSlotFilter } from "../../../../Types/searchForTimeTypes";
import { useEffect, useMemo, useState } from "react";
import { hasTimeFilter } from "../../LessonSearch/SearchTimeFilter/hasTimeFilter";
import { useQuery } from "@tanstack/react-query";
import { getOpenTimeSlotsReq } from "../../../../apis/lesson/timeSlotApis";
import TimeSlotPickerGrouped from "../../../../components/common/TimeSlotPickerGrouped/TimeSlotPickerGroped";
import DetailTimeFilterPanel from "../DetailTimeFilterPanel/DetailTimeFilterPanel";

type Props = {
  lessonId: number;
  // initialOpenSlotFilter: OpenSlotFilter | null;
  filter:OpenSlotFilter | null;
  onClickReserve: (timeSlotId: number) => void; // 예약버튼 누를 시 전환 트리거
};

function LessonTimeSlotSection({
  lessonId,
  filter,
  onClickReserve,
}: Props) {

  // 칩 단일 선택 상태
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // 필터가 바뀌면 선택은 풀어주는게 UX 안전(다른 목록이니까)
  useEffect(() => {
    setSelectedId(null);
  }, [filter]);

  // 슬롯을 보여줄지 결정
  const shouldShowSlots = hasTimeFilter(filter);

  // 요청 파라미터 정리
  const params = useMemo(() => {
    if (!filter) return {};
    return {
      from: filter.from?.trim() || undefined,
      to: filter.to?.trim() || undefined,
      daysOfWeek: filter.daysOfWeek?.length ? filter.daysOfWeek : undefined,
      timeParts: filter.timeParts?.length ? filter.timeParts : undefined,
    };
  }, [filter]);

  // openSlots 조회(레슨 검색 시간 필터 존재할 때)
  const { data, isFetching, isError } = useQuery({
    queryKey: ["lessonOpenSlots", lessonId, params],
    queryFn: async () => (await getOpenTimeSlotsReq(lessonId, params!)).data,
    enabled: shouldShowSlots,
  });

  const slots = data?.data ?? [];

 return (
    <section css={s.wrap}>
      {!shouldShowSlots ? (
        <div css={s.emptyBox}>
          <div css={s.emptyTitle}>레슨 시간을 검색해주세요</div>
          <div css={s.emptyDesc}>
            위의 시간 필터에서 기간/요일/시간대를 선택하고 “적용”을 눌러주세요.
          </div>
        </div>
      ) : (
        <div css={s.resultBox}>
          {isFetching && <div css={s.hint}>불러오는 중...</div>}
          {isError && <div css={s.hint}>타임슬롯 조회 중 오류가 발생했어요.</div>}

          {!isFetching && !isError && (
            <>
              <TimeSlotPickerGrouped
                slots={slots}
                selectedId={selectedId}
                onChangeSelectedId={setSelectedId}
                isDisabled={(s) => s.state === "BOOKED" || s.active === false}
                emptyText="조건에 맞는 타임슬롯이 없어요."
              />

              <button
                type="button"
                css={s.reserveBtn}
                disabled={selectedId == null}
                onClick={() => onClickReserve(selectedId!)}
              >
                예약하기
              </button>
            </>
          )}
        </div>
      )}
    </section>
  );
}

export default LessonTimeSlotSection;
