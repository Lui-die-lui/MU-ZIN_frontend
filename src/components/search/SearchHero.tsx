/** @jsxImportSource @emotion/react */
import { useId, useState, type ReactNode } from "react";
import * as s from "./searchStyles";
import InstrumentPack from "../../pages/Home/InstrumentPack";
import { pickInstruments } from "../../pages/Home/instruments";

type Props = {
  eyebrow: string;
  title: string;
  desc: string;
  children: ReactNode;
};

// 레슨 찾기 · 아티스트 찾기 상단 판 - 메인 배너처럼 오프화이트 판 + 비닐 포장 악기(축소, 장식)
function SearchHero({ eyebrow, title, desc, children }: Props) {
  const titleId = useId();
  // 들어올 때 한 번만 고름 (메인과 같은 방식)
  const [inst] = useState(() => pickInstruments(0).hero);

  return (
    <section css={s.hero} aria-labelledby={titleId}>
      <div css={s.heroText}>
        <span css={s.eyebrow}>{eyebrow}</span>
        <h1 id={titleId} css={s.title}>
          {title}
        </h1>
        <p css={s.desc}>{desc}</p>
      </div>
      <div css={s.heroArt} aria-hidden="true">
        <InstrumentPack inst={inst} />
      </div>
      <div css={s.heroBody}>{children}</div>
    </section>
  );
}

export default SearchHero;
