/** @jsxImportSource @emotion/react */
import type React from "react";
import * as s from "./styles";
import DateRangeInputs from "../../../../components/common/DateRangeInputs/DateRangeInputs";
import type { DateBasis, SearchDraft } from "../../../../Types/reservationType";
import type { Option, SortOrder } from "../../../../Types/commonTypes";

type Props = {
  draft: SearchDraft;
  onDraftChange: (next: SearchDraft) => void;

  // 버튼 눌렀을 때만 applied
  onSearch: () => void;

  // 검색 옵션
  basisOptions: ReadonlyArray<Option<DateBasis>>;
  sortOptions: ReadonlyArray<Option<SortOrder>>;

  disabled?: boolean;
  isSearching?: boolean;
  searchLabel?: string;

  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
};

function DateRangeSearchBar({
   draft,
  onDraftChange,
  onSearch,
  basisOptions,
  sortOptions,
  disabled,
  isSearching,
  searchLabel = "검색",
  leftSlot,
  rightSlot,
}: Props) {
 return (
    <div css={s.bar}>
      {leftSlot}

      {/* 요청일 / 레슨일 */}
      <select
        css={s.select}
        value={draft.basis}
        disabled={disabled}
        onChange={(e) =>
          onDraftChange({ ...draft, basis: e.target.value as DateBasis })
        }
      >
        {basisOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {/* 기간 */}
      <DateRangeInputs
        from={draft.range.from}
        to={draft.range.to}
        disabled={disabled}
        onChange={(next) =>
          onDraftChange({
            ...draft,
            range: { ...draft.range, ...next },
          })
        }
      />

      {/* 정렬 */}
      <select
        css={s.select}
        value={draft.sort}
        disabled={disabled}
        onChange={(e) =>
          onDraftChange({ ...draft, sort: e.target.value as SortOrder })
        }
      >
        {sortOptions.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {/* 버튼 눌렀을 때만 검색 적용 */}
      <button css={s.searchBtn} disabled={disabled || isSearching} onClick={onSearch}>
        {searchLabel}
      </button>

      {rightSlot}
    </div>
  );
}

export default DateRangeSearchBar;
