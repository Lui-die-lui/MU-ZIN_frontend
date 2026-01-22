/** @jsxImportSource @emotion/react */
import * as s from "./styles";

type Props<T> = {
  disabled?: boolean;
  items: T[];
  getKey: (item: T) => string | number;
  getLabel: (item: T) => string;
  onRemove: (item: T) => void;
  title?: string;
};

function SelectedChips<T>({
  disabled = false,
  items,
  getKey,
  getLabel,
  onRemove,
  title = "클릭 시 삭제",
}: Props<T>) {
  if (items.length === 0) return null;
  return (
    <div css={s.chipWrap}>
      {items.map((item) => (
        <button
          key={getKey(item)}
          type="button"
          css={s.chip}
          disabled={disabled}
          onClick={() => onRemove(item)}
          title={title}
        >
          {getLabel(item)}
          <span css={s.chipX} aria-hidden="true">
            ×
          </span>
        </button>
      ))}
    </div>
  );
}

export default SelectedChips;
