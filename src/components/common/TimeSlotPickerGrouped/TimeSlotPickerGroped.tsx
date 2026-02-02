/** @jsxImportSource @emotion/react */
import { useMemo } from "react";
import type { SlotItem } from "../../../Types/searchForTimeTypes";
import * as s from "./styles";
import { groupByMonthDay, toTimeLabel } from "../../../utils/groupByMonthDayUtils";
import ToggleChips from "../ToggleChips/ToggleChips";

type Props = {
  slots: SlotItem[];

  selectedId: number | null;
  onChangeSelectedId: (next: number | null) => void;

  isDisabled?: (s: SlotItem) => boolean;
  emptyText?: string;
};

function TimeSlotPickerGrouped({
  slots,
  selectedId,
  onChangeSelectedId,
  isDisabled,
  emptyText = "조건에 맞는 타임슬롯이 없어요.",
}: Props) {
  const disabledFn =
    isDisabled ?? ((s) => s.state === "BOOKED" || s.active === false);

  // slotItem[]을 월/일로 그룹핑
  const grouped = useMemo(
    () => groupByMonthDay(slots, (s) => s.startDt),
    [slots],
  );

  if (slots.length === 0) {
    return <p css={s.emptyText}>{emptyText}</p>;
  }

  // dt -> slot 매핑
  return (
    <div css={s.wrap}>
      {Object.entries(grouped).map(([ym, days]) => (
        <section key={ym} css={s.monthCard}>
          <div css={s.monthTitle}>
            {ym.slice(0, 4)}년 {ym.slice(5, 7)}월
          </div>

          <div css={s.dayGrid}>
            {Object.entries(days).map(([day, daySlots]) => {
              // ToggleChips는 string|number만 받으니까 옵션을 id로 넘김
              const optionIds = daySlots.map((x) => x.timeSlotId);

              // id -> SlotItem lookup (label/disabled용)
              const idToSlot = new Map(daySlots.map((x) => [x.timeSlotId, x] as const));

              return (
                <div key={`${ym}-${day}`} css={s.dayRow}>
                  <div css={s.dayLabel}>{Number(day)}일</div>

                  <ToggleChips
                    options={optionIds}
                    selected={selectedId == null ? [] : [selectedId]} // 단일을 배열로 표현
                    getLabel={(id) => toTimeLabel(idToSlot.get(id)!.startDt)}
                    isDisabled={(id) => disabledFn(idToSlot.get(id)!)}
                    onToggle={(id) => {
                      // 단일 토글: 같으면 해제, 다르면 교체
                      onChangeSelectedId(selectedId === id ? null : id);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}

export default TimeSlotPickerGrouped;
