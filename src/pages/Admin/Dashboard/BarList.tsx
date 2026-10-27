/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import type { NameCount } from "../../../Types/adminTypes";

type Props = {
  items: NameCount[];
  label?: (name: string) => string; // 화면에 보일 이름 (예: SEARCH -> 검색)
  emptyText?: string;
  showShare?: boolean; // 전체 중 비율(%) 같이 표시
};

// 순위 목록 + 가로 막대 (값은 모두 글자로 보여서 마우스 없이도 읽힘)
function BarList({ items, label = (n) => n, emptyText = "아직 기록이 없어요.", showShare = true }: Props) {
  if (!items.length) return <p css={s.empty}>{emptyText}</p>;
  const max = Math.max(...items.map((i) => i.count));
  const total = items.reduce((sum, i) => sum + i.count, 0);

  return (
    <ul css={s.barList}>
      {items.map((i) => (
        <li key={i.name} css={s.barRow}>
          <div css={s.barHead}>
            <span css={s.barName} title={label(i.name)}>
              {label(i.name)}
            </span>
            <span css={s.barValue}>
              {i.count.toLocaleString("ko-KR")}
              {showShare && total > 0 && <span css={s.barShare}>{Math.round((i.count / total) * 100)}%</span>}
            </span>
          </div>
          <div css={s.barTrack} aria-hidden="true">
            <div css={s.barFill} style={{ width: `${max ? Math.max(2, (i.count / max) * 100) : 0}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default BarList;
