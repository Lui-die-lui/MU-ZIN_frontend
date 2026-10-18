/** @jsxImportSource @emotion/react */
import { Link } from "react-router-dom";
import * as s from "./styles";
import { isComplete } from "../../features/hobbyFinder/engine";
import { loadSaved } from "../../features/hobbyFinder/storage";
import { usePrincipalState } from "../../stores/usePrincipalState";

// 메인: 내 음악 스타일 찾기 진입 + 레슨·아티스트 찾기
function Home() {
  const userId = usePrincipalState((st) => st.principal?.userId ?? null);
  const hasResult = isComplete(loadSaved(userId).answers);

  return (
    <main css={s.page}>
      <section css={s.hero} aria-labelledby="hobby-entry-title">
        <span css={s.eyebrow}>MY MUSIC STYLE</span>
        <h1 id="hobby-entry-title" css={s.title}>
          나도 음악을 한다면?
        </h1>
        <p css={s.desc}>악기부터 보컬까지, 내 취향에 어울리는 음악과 우리 동네 레슨을 찾아보세요.</p>
        <ul css={s.meta}>
          <li>질문 8~9개</li>
          <li>약 2분</li>
          <li>로그인 없이</li>
        </ul>
        <div css={s.actions}>
          <Link to="/hobby-finder" css={s.cta}>
            내 음악 스타일 찾기
          </Link>
          {hasResult && (
            <Link to="/hobby-finder?step=result" css={s.secondary}>
              지난 결과 다시 보기
            </Link>
          )}
        </div>
      </section>

      <section css={s.links} aria-label="바로 찾기">
        <Link to="/lessons" css={s.linkCard}>
          <strong>레슨 찾기</strong>
          <span>악기·지역·시간으로 레슨을 찾아보세요.</span>
        </Link>
        <Link to="/artists" css={s.linkCard}>
          <strong>아티스트 찾기</strong>
          <span>전공과 레슨 스타일로 아티스트를 찾아보세요.</span>
        </Link>
      </section>
    </main>
  );
}

export default Home;
