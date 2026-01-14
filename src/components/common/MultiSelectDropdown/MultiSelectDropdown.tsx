/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import { useEffect, useMemo, useRef, useState } from "react";

type Props<T> = {
  label: string;
  selectedCountLabel?: (n: number) => string;
  searchPlaceholder?: string;

  items: T[];
  isLoading?: boolean;

  getId: (item: T) => number;
  getLabel: (item: T) => string;

  selectedIds: number[];
  onChangeSelectedIds: (ids: number[]) => void;

  filterFn?: (items: T[], keyword: string) => T[];
};

function MultiSelectDropdown<T>({
  label,
  selectedCountLabel = (n) => `${label} ${n}개 선택됨`,
  searchPlaceholder = "검색…",
  items,
  isLoading = false,
  getId,
  getLabel,
  selectedIds,
  onChangeSelectedIds,
  filterFn,
}: Props<T>) {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = keyword.trim(); // 쿼리
    if (!q) return items;
    if (filterFn) return filterFn(items, q);
    const lower = q.toLowerCase(); // 들어온 키워드를 소문자로
    return items.filter((item) => getLabel(item).toLowerCase().includes(lower));
  }, [items, keyword, filterFn, getLabel]);

  const toggle = (id: number) => {
    onChangeSelectedIds(
      selectedIds.includes(id)
        ? selectedIds.filter((x) => x !== id)
        : [...selectedIds, id]
    );
  };

  // 선택한 카테고리 전체 해제
  const clear = () => onChangeSelectedIds([]);

  // 바깥 클릭 및 키 이벤트
  useEffect(() => {
    if (!open) return;

    const onDocDown = (e: MouseEvent) => {
      if (!rootRef.current) return; // 선택된게 없으면 그냥 return
      if (!rootRef.current.contains(e.target as Node)) setOpen(false);
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onDocDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selectedCount = selectedIds.length;

  return (
    <div css={s.dropdownRoot} ref={rootRef}>
      <button type="button" onClick={() => setOpen((v) => !v)}>
        {selectedCount ? selectedCountLabel(selectedCount) : label}
        <span css={s.caret(open)}>▾</span>
      </button>

      {open && (
        <div css={s.menu}>
          <div css={s.menuTop}>
            <input
              css={s.searchInput}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={searchPlaceholder}
            />
            <button type="button" css={s.clearBtn} onClick={clear}>
              전체 해제
            </button>
          </div>

          <div css={s.list}>
            {isLoading && <div css={s.hint}>불러오는 중...</div>}
            {!isLoading && filtered.length === 0 && ( 
              <div css={s.hint}>결과가 없습니다.</div>
            )}

            {filtered.map((item) => {
              const id = getId(item);
              const checked = selectedIds.includes(id); // 선택한 값중에 존재하는지
              return (
                <label key={id} css={s.item(checked)}>
                  <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(id)}
                  />
                  <span>{getLabel(item)}</span>
                </label>
              )
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default MultiSelectDropdown;
