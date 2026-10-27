/** @jsxImportSource @emotion/react */
import { useId, type ReactNode } from "react";
import * as s from "./searchStyles";

type Props = {
  eyebrow: string;
  title: string;
  desc: string;
  children: ReactNode;
};

// 레슨 찾기 · 아티스트 찾기 상단 판 - 오프화이트 판에 제목 + 검색창 + 칩 (검색창은 판 너비에 맞춤)
function SearchHero({ eyebrow, title, desc, children }: Props) {
  const titleId = useId();

  return (
    <section css={s.hero} aria-labelledby={titleId}>
      <div css={s.heroText}>
        <span css={s.eyebrow}>{eyebrow}</span>
        <h1 id={titleId} css={s.title}>
          {title}
        </h1>
        <p css={s.desc}>{desc}</p>
      </div>
      <div css={s.heroBody}>{children}</div>
    </section>
  );
}

export default SearchHero;
