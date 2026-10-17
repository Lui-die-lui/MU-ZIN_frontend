/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";

export type SelectOption<V extends string> = {
  value: V;
  label: string;
  disabled?: boolean;
};

type Props<V extends string> = {
  value: V | "";
  options: SelectOption<V>[];
  onChange: (value: V) => void;
  placeholder?: string; // value 가 옵션에 없을 때 보여줄 문구
  disabled?: boolean;
  ariaLabel?: string;
  className?: string; // 바깥 너비 지정용 (css prop)
};

/*
 * 네이티브 <select> 대신 쓰는 단일 선택 드롭다운
 *  - 네이티브 select 는 열림 상태를 CSS 로 알 수 없어서 아이콘을 돌릴 수 없음
 *    -> 다른 드롭다운처럼 열리면 아이콘이 뒤집히고, 목록 디자인도 같게
 *  - 바깥 클릭 / Esc 로 닫힘, 키보드: ↓↑ 이동, Enter·Space 선택, Home/End
 */
function SelectDropdown<V extends string>({
  value,
  options,
  onChange,
  placeholder = "선택",
  disabled = false,
  ariaLabel,
  className,
}: Props<V>) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null;

  // 선택 가능한 다음/이전 옵션 찾기
  const step = (from: number, dir: 1 | -1) => {
    for (let i = 1; i <= options.length; i++) {
      const idx = (from + dir * i + options.length) % options.length;
      if (!options[idx].disabled) return idx;
    }
    return from;
  };

  const openMenu = () => {
    if (disabled) return;
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : step(-1, 1));
    setOpen(true);
  };

  const close = (focusTrigger = true) => {
    setOpen(false);
    if (focusTrigger) triggerRef.current?.focus();
  };

  const choose = (idx: number) => {
    const opt = options[idx];
    if (!opt || opt.disabled) return;
    if (opt.value !== value) onChange(opt.value);
    close();
  };

  // 바깥 클릭 시 닫기
  useEffect(() => {
    if (!open) return;
    const onDocDown = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocDown);
    return () => document.removeEventListener("mousedown", onDocDown);
  }, [open]);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openMenu();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => step(i, 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => step(i, -1));
        break;
      case "Home":
        e.preventDefault();
        setActiveIndex(step(-1, 1));
        break;
      case "End":
        e.preventDefault();
        setActiveIndex(step(options.length, -1));
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        choose(activeIndex);
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "Tab":
        setOpen(false);
        break;
    }
  };

  return (
    <div css={s.root} className={className} ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        css={s.trigger(!selected)}
        disabled={disabled}
        onClick={() => (open ? close(false) : openMenu())}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-label={ariaLabel}
        aria-activedescendant={open && activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
      >
        <span css={s.label}>{selected ? selected.label : placeholder}</span>
        <span css={s.caret(open)} aria-hidden="true" />
      </button>

      {open && (
        <ul css={s.menu} role="listbox" id={listId} aria-label={ariaLabel}>
          {options.map((o, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <li
                key={o.value}
                id={`${listId}-${idx}`}
                role="option"
                aria-selected={isSelected}
                aria-disabled={o.disabled || undefined}
                css={s.option(isSelected, idx === activeIndex, !!o.disabled)}
                onMouseEnter={() => !o.disabled && setActiveIndex(idx)}
                // 트리거 포커스를 잃지 않도록 mousedown 기본 동작 막음
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => choose(idx)}
              >
                {o.label}
                {isSelected && <span css={s.check} aria-hidden="true">✓</span>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default SelectDropdown;
