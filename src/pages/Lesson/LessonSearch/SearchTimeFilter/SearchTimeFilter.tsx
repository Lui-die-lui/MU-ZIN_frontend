/** @jsxImportSource @emotion/react */
import DateRangeInputs from "../../../../components/common/DateRangeInputs/DateRangeInputs";
import ToggleChips from "../../../../components/common/ToggleChips/ToggleChips";
import {
  TIME_PART_LABEL,
  WEEKDAY_LABEL,
  type OpenSlotFilter,
  type TimePart,
  type Weekday,
} from "../../../../Types/searchForTimeTypes";
import { toggleArr } from "../../../../utils/searchForTimeUtils";
import * as s from "./styles";

const WEEKDAY_OPTIONS: Weekday[] = [1, 2, 3, 4, 5, 6, 7];
const TIME_PART_OPTIONS: TimePart[] = [
  "MORNING",
  "AFTERNOON",
  "EVENING",
  "DAWN",
];

type Props = {
  value: OpenSlotFilter;
  onChange: (next: OpenSlotFilter) => void;
  disabled?: boolean;
};

function SearchTimeFilter({ value, onChange, disabled = false }: Props) {
  const onChangeDate = (next: { from?: string; to?: string }) => {
    onChange({ ...value, ...next });
  };

  const toggleWeekday = (d: Weekday) => {
    const next = toggleArr(value.daysOfWeek, d).sort(
      (a, b) => a - b,
    ) as Weekday[];
    onChange({ ...value, daysOfWeek: next });
  };

  const toggleTimePart = (tp: TimePart) => {
    onChange({ ...value, timeParts: toggleArr(value.timeParts, tp) });
  };
  return (
    <div css={s.wrap}>
      {/* 날짜 */}
      <div css={s.row}>
        <div css={s.label}>날짜</div>
        <DateRangeInputs
          from={value.from}
          to={value.to}
          disabled={disabled}
          onChange={(next) => onChange({ ...value, ...next })}
        />
      </div>

      {/* 요일 */}
      <div css={s.row}>
        <div css={s.label}>요일</div>

        {/* 주말이랑 나눠서 월 - 금 (해당 정책 생각해보기)*/}
        <div css={s.inline}>
          <ToggleChips<Weekday>
            options={WEEKDAY_OPTIONS.slice(0, 5)}
            selected={value.daysOfWeek}
            getLabel={(d) => WEEKDAY_LABEL[d]}
            onToggle={toggleWeekday}
            disabled={disabled}
          />

          <span css={s.gap} />

          {/* 토 - 일 */}
          <div css={s.inline}>
            <ToggleChips<Weekday>
              options={WEEKDAY_OPTIONS.slice(5)}
              selected={value.daysOfWeek}
              getLabel={(d) => WEEKDAY_LABEL[d]}
              onToggle={toggleWeekday}
              disabled={disabled}
            />
          </div>
        </div>

        {/* 시간대 */}
        <div css={s.low}>
          <div css={s.label}>시간</div>
          <ToggleChips<TimePart>
            options={TIME_PART_OPTIONS}
            selected={value.timeParts}
            getLabel={(tp) => TIME_PART_LABEL[tp]}
            onToggle={toggleTimePart}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  );
}

export default SearchTimeFilter;
