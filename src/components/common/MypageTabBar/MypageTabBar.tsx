/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import { useEffect, useRef } from "react";

export type TabItem<T extends string> = { key: T; label: string };

type Props<T extends string> = {
  value: T;
  items: readonly TabItem<T>[];
  // readonly 이유 - items 타입 오류남(as any 사용해야함)
  // 수정하지 않는 값이라 그대로 as const 상수 받을 수 있음
  onChange: (next: T) => void;
  className?: string;
};

function MypageTabBar<T extends string>({ value, items, onChange }: Props<T>) {
  const wrapRef = useRef<HTMLDivElement>(null);

  // 좁은 화면에서 탭 줄이 옆으로 스크롤될 때, 선택된 탭이 가려지지 않게 그 탭까지 옆으로만 이동
  // (탭 이름에 개수가 붙어 폭이 바뀔 수 있어 이름이 바뀔 때도 다시 맞춤)
  const labels = items.map((t) => t.label).join("|");
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const wrap = wrapRef.current;
      const active = wrap?.querySelector<HTMLElement>('[aria-selected="true"]');
      if (!wrap || !active) return;
      const w = wrap.getBoundingClientRect();
      const r = active.getBoundingClientRect();
      if (r.left < w.left) wrap.scrollBy({ left: r.left - w.left - 12 });
      else if (r.right > w.right) wrap.scrollBy({ left: r.right - w.right + 12 });
    });
    return () => cancelAnimationFrame(id);
  }, [value, labels]);

  return (
    <div css={s.wrap} ref={wrapRef} role="tablist">
      {items.map((t) => (
        <button
          key={t.key}
          css={s.tab(t.key === value)}
          onClick={() => onChange(t.key)}
          type="button"
          role="tab"
          aria-selected={t.key === value}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export default MypageTabBar;
