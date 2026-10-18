/** @jsxImportSource @emotion/react */
import { useState } from "react";
import * as s from "./styles";

const STAR_PATH = "M12 2.5l2.94 5.96 6.58.96-4.76 4.64 1.12 6.55L12 17.52l-5.88 3.09 1.12-6.55L2.48 9.42l6.58-.96L12 2.5z";

// 별 1개 (fill 0~1 비율만큼 채움 -> 4.4점처럼 소수점도 표시)
function Star({ fill, size }: { fill: number; size: number }) {
  const pct = Math.max(0, Math.min(1, fill)) * 100;
  return (
    <span css={s.star(size)} aria-hidden="true">
      <svg viewBox="0 0 24 24" width={size} height={size}>
        <path d={STAR_PATH} fill="#e5e7eb" />
      </svg>
      <span css={s.starFill(pct)}>
        <svg viewBox="0 0 24 24" width={size} height={size}>
          <path d={STAR_PATH} fill="#111827" />
        </svg>
      </span>
    </span>
  );
}

// 보기용 별점 ("별점 4.4점" 으로 읽힘)
export function StarDisplay({ value, size = 16 }: { value: number; size?: number }) {
  return (
    <span css={s.stars} role="img" aria-label={`별점 ${value}점`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} fill={value - (i - 1)} size={size} />
      ))}
    </span>
  );
}

const RATING_LABEL = ["", "별로예요", "아쉬워요", "괜찮아요", "좋아요", "최고예요"];

// 입력용 별점: 마우스를 올리면 미리 보기, 키보드 ←→, 숫자 1~5
export function StarInput({ value, onChange, size = 36 }: { value: number; onChange: (v: number) => void; size?: number }) {
  const [hover, setHover] = useState(0);
  const shown = hover || value;

  return (
    <div css={s.starInputWrap}>
      <div
        css={s.stars}
        role="radiogroup"
        aria-label="별점"
        onMouseLeave={() => setHover(0)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowUp") onChange(Math.min(5, (value || 0) + 1));
          else if (e.key === "ArrowLeft" || e.key === "ArrowDown") onChange(Math.max(1, (value || 1) - 1));
          else if (/^[1-5]$/.test(e.key)) onChange(Number(e.key));
          else return;
          e.preventDefault();
        }}
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={value === i}
            aria-label={`${i}점 ${RATING_LABEL[i]}`}
            // 선택된 별(없으면 첫 별)만 Tab 으로 들어감
            tabIndex={(value || 1) === i ? 0 : -1}
            css={s.starButton}
            onMouseEnter={() => setHover(i)}
            onFocus={() => setHover(0)}
            onClick={() => onChange(i)}
          >
            <Star fill={shown >= i ? 1 : 0} size={size} />
          </button>
        ))}
      </div>
      <span css={s.starInputLabel(!!shown)}>{shown ? `${shown}점 · ${RATING_LABEL[shown]}` : "별점을 골라주세요"}</span>
    </div>
  );
}
