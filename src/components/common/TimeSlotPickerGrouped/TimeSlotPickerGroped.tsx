/** @jsxImportSource @emotion/react */
import { useMemo } from "react";
import type { SlotItem } from "../../../Types/searchForTimeTypes";
import * as s from "./styles";
import { groupByMonthDay, toTimeLabel } from "../../../utils/groupByMonthDayUtils";

type Props = {
  slots: SlotItem[];

  selectedId: number | null;
  onChangeSelectedId: (next: number | null) => void;

  isDisabled?: (s: SlotItem) => boolean;
  emptyText?: string;
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const weekday = (ym: string, day: string) =>
  WEEKDAYS[new Date(Number(ym.slice(0, 4)), Number(ym.slice(5, 7)) - 1, Number(day)).getDay()];

// 예약 가능한 시간을 월 > 일 로 묶어서 시간 버튼으로 보여줌 (레슨 상세 창 전용)
// 예전엔 검색 필터용 둥근 칩(ToggleChips)을 같이 써서 크기가 들쭉날쭉했음 -> 같은 크기의 시간 버튼으로
function TimeSlotPickerGrouped({
  slots,
  selectedId,
  onChangeSelectedId,
  isDisabled,
  emptyText = "조건에 맞는 타임슬롯이 없어요.",
}: Props) {
  const disabledFn = isDisabled ?? ((x) => x.state === "BOOKED" || x.active === false);

  const grouped = useMemo(() => groupByMonthDay(slots, (x) => x.startDt), [slots]);

  if (slots.length === 0) {
    return <p css={s.emptyText}>{emptyText}</p>;
  }

  return (
    <div css={s.wrap}>
      {Object.entries(grouped).map(([ym, days]) => (
        <section key={ym} css={s.month}>
          <div css={s.monthTitle}>
            {ym.slice(0, 4)}년 {Number(ym.slice(5, 7))}월
          </div>

          <div css={s.dayList}>
            {Object.entries(days).map(([day, daySlots]) => (
              <div key={`${ym}-${day}`} css={s.dayRow}>
                <div css={s.dayLabel}>
                  <strong>{Number(day)}일</strong>
                  <span>{weekday(ym, day)}요일</span>
                </div>

                <div css={s.timeGrid}>
                  {daySlots.map((slot) => {
                    const active = selectedId === slot.timeSlotId;
                    const disabled = disabledFn(slot);
                    return (
                      <button
                        key={slot.timeSlotId}
                        type="button"
                        css={s.timeBtn(active)}
                        aria-pressed={active}
                        disabled={disabled}
                        // 같은 시간을 다시 누르면 선택 해제
                        onClick={() => onChangeSelectedId(active ? null : slot.timeSlotId)}
                      >
                        {toTimeLabel(slot.startDt)}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default TimeSlotPickerGrouped;
