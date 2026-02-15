/** @jsxImportSource @emotion/react */
import * as s from "./styles";

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
  return (
    <div css={s.wrap}>
      {items.map((t) => (
        <button
          key={t.key}
          css={s.tab(t.key === value)}
          onClick={() => onChange(t.key)}
          type="button"
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export default MypageTabBar;
