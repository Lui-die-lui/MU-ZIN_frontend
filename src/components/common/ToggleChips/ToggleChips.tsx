/** @jsxImportSource @emotion/react */
import * as s from "./styles";

type Props<T extends string | number> = {
  options: T[];
  selected: T[];
  getLabel: (v: T) => string;
  onToggle: (v: T) => void;
  disabled?: boolean;
};

function ToggleChips<T extends string | number>({
  options,
  selected,
  getLabel,
  onToggle,
  disabled = false,
}: Props<T>) {
  return (
    <div css={s.row}>
      {options.map((v) => {
        const active = selected.includes(v);
        return (
          <button
            key={String(v)}
            type="button"
            css={s.chip(active)}
            onClick={() => onToggle(v)}
            disabled={disabled}
          >
            {getLabel(v)}
          </button>
        );
      })}
    </div>
  );
}

export default ToggleChips;
