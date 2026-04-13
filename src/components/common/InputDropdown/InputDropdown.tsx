/** @jsxImportSource @emotion/react */
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import type { Option } from "../../../Types/commonTypes";
import * as s from "./styles";

type Props<T extends string | number> = {
  value: string;
  options: Option<T>[];
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  error?: boolean;
  helperText?: string;
  emptyText?: string;
  onChange: (value: string) => void;
  onSelect: (option: Option<T>) => void;
  onBlur?: () => void;
};

function InputDropdown<T extends string | number>({
  value,
  options,
  placeholder,
  disabled = false,
  loading = false,
  error = false,
  helperText,
  emptyText = "검색 결과가 없습니다.",
  onChange,
  onSelect,
  onBlur,
}: Props<T>) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [open, setOpen] = useState(false);
  // -1 = 강조되지 않은 상태
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const hasOptions = options.length > 0;
  const showDropdown = open && !disabled;
  const canHighlight = !loading && hasOptions;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(event.target as Node)) {
        setOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!showDropdown) {
      setHighlightedIndex(-1);
      return;
    }

    if (!canHighlight) {
      setHighlightedIndex(-1);
      return;
    }

    setHighlightedIndex(0);
  }, [showDropdown, canHighlight, options]);

  const highlightedOption = useMemo(() => {
    if (highlightedIndex < 0 || highlightedIndex >= options.length) return null;
    return options[highlightedIndex];
  }, [highlightedIndex, options]);

  const handleSelect = (option: Option<T>) => {
    onSelect(option);
    setOpen(false);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) {
      if (e.key === "ArrowDown" && hasOptions) {
        e.preventDefault();
        setOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      setHighlightedIndex(-1);
      return;
    }

    if (!canHighlight) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0));
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1));
      return;
    }

    if (e.key === "Enter" && highlightedOption) {
      e.preventDefault();
      handleSelect(highlightedOption);
    }
  };

  return (
    <div css={s.root} ref={rootRef}>
      <input
        ref={inputRef}
        css={[s.input, error && s.errorText]}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onBlur={onBlur}
        onKeyDown={handleKeyDown}
      />

      {helperText ? (
        <p css={error ? s.errorText : s.helperText}>{helperText}</p>
      ) : null}

      {showDropdown ? (
        <div css={s.dropdown}>
          {loading ? (
            <div css={s.stateText}>불러오는 중...</div>
          ) : !hasOptions ? (
            <div css={s.stateText}>{emptyText}</div>
          ) : (
            options.map((option, index) => (
              <button
                key={option.value}
                type="button"
                css={[
                  s.optionButton,
                  index === highlightedIndex && s.optionButtonActive,
                ]}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setHighlightedIndex(index)}
                onClick={() => handleSelect(option)}
              >
                <span css={s.optionLabel}>{option.label}</span>
                {option.subLabel ? (
                  <span css={s.optionSubLabel}>{option.subLabel}</span>
                ) : null}
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}

export default InputDropdown;
