/** @jsxImportSource @emotion/react */
import {
  pickYmdFromLocalDateTime,
  ymdToEndOfDay,
  ymdToStartOfDay,
} from "../../../utils/searchForTimeUtils";
import * as s from "./styles";

type Props = {
  from?: string;
  to?: string;
  onChange: (next: { from?: string; to?: string }) => void;
  disabled?: boolean;
};

function DateRangeInputs({ from, to, onChange, disabled = false }: Props) {
  const fromYmd = pickYmdFromLocalDateTime(from) ?? "";
  const toYmd = pickYmdFromLocalDateTime(to) ?? "";
  return (
    <div css={s.wrap}>
      <input
        css={s.input}
        type="date"
        value={fromYmd}
        onChange={(e) => {
          const ymd = e.target.value;
          onChange({ from: ymd ? ymdToStartOfDay(ymd) : undefined, to });
        }}
        disabled={disabled}
      />
      <span>~</span>
      <input
        css={s.input}
        type="date"
        value={toYmd}
        onChange={(e) => {
          const ymd = e.target.value;
          onChange({ from, to: ymd ? ymdToEndOfDay(ymd) : undefined });
        }}
        disabled={disabled}
      />
    </div>
  );
}

export default DateRangeInputs;
