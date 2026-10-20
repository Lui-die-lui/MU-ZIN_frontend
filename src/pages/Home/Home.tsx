/** @jsxImportSource @emotion/react */
import { useState } from "react";
import { Link } from "react-router-dom";
import * as s from "./styles";
import InstrumentPack from "./InstrumentPack";
import MySchedule from "./MySchedule";
import AiPrompt from "./AiPrompt";
import Chevron from "../../components/common/Chevron";
import { instrumentSrc, pickInstruments } from "./instruments";
import { isComplete } from "../../features/hobbyFinder/engine";
import { loadSaved } from "../../features/hobbyFinder/storage";
import { usePrincipalState } from "../../stores/usePrincipalState";

// 레슨 신청 순서 - 레슨 상세 창의 단계(시간 선택 → 요청 보내기)와 안내 문구에 맞춤
const STEPS = [
  { title: "레슨 찾기", desc: "악기·지역·시간으로 레슨을 찾아요." },
  { title: "시간 선택", desc: "레슨에서 원하는 시간을 골라요." },
  { title: "요청 보내기", desc: "아티스트에게 예약을 요청해요." },
  { title: "확정", desc: "아티스트가 확인하면 확정되고, 알림으로 알려드려요." },
] as const;

// 메인: ① 레슨·아티스트 찾기(배너) [+ 로그인 회원은 오른쪽에 내 레슨 일정] → ② 신청 순서 → ③ 내 음악 스타일 찾기
function Home() {
  const userId = usePrincipalState((st) => st.principal?.userId ?? null);
  const hydrated = usePrincipalState((st) => st.hydrated);
  // 로그인 복구 중에도 토큰이 있으면 회원 배치로 그려서, 복구가 끝날 때 배너 폭이 바뀌며 깜빡이지 않게
  const member = !!userId || (!hydrated && !!localStorage.getItem("accessToken"));
  const hasResult = isComplete(loadSaved(userId).answers);
  // 서버 렌더링 없는 SPA: 첫 렌더에서 한 번만 고름 (다시 그려져도 바뀌지 않음)
  const [picked] = useState(() => pickInstruments(3));

  return (
    <main css={s.page}>
      <div css={s.top(member)}>
        {/* ① 메인 배너 - 데스크톱: 왼쪽 [제목 → AI 질문 → 찾기 버튼] / 오른쪽 악기
                         모바일: 제목 → 악기 → AI 질문 → 찾기 버튼 */}
        <section css={s.hero(member)} aria-labelledby="home-title">
          <div css={s.heroHead}>
            <h1 id="home-title" css={s.title(member)}>
              내 근처 레슨을
              <br />
              빠르고 간편하게!
            </h1>
            <p css={s.heroDesc}>악기·지역·시간으로 원하는 레슨을 찾고, 마음에 드는 시간에 바로 예약을 요청해 보세요.</p>
          </div>

          <div css={s.heroVisual(member)}>
            <InstrumentPack inst={picked.hero} />
          </div>

          {/* 말로 설명해서 찾기 (로그인 회원 - 비로그인은 내비게이터 화면에서 로그인 안내) */}
          <div css={s.heroAi}>
            <AiPrompt />
          </div>

          <nav css={s.paths(member)} aria-label="바로 찾기">
            <Link to="/lessons" css={s.pathPrimary}>
              <span css={s.pathText}>
                <strong>레슨 찾기</strong>
                <span>악기·지역·시간으로 레슨을 찾아보세요.</span>
              </span>
              <span css={s.pathArrow} aria-hidden="true">
                <Chevron />
              </span>
            </Link>
            <Link to="/artists" css={s.pathSecondary}>
              <span css={s.pathText}>
                <strong>아티스트 찾기</strong>
                <span>전공과 레슨 스타일로 아티스트를 찾아보세요.</span>
              </span>
              <span css={s.pathArrow} aria-hidden="true">
                <Chevron />
              </span>
            </Link>
          </nav>
        </section>

        {/* 로그인 회원: 내 레슨 일정 (복구 중엔 목록 요청 없이 자리만) */}
        {member && (userId ? <MySchedule key={userId} /> : <div css={s.schedulePlaceholder} aria-hidden="true" />)}
      </div>

      {/* ② 신청 순서 */}
      <section css={s.section} aria-labelledby="home-steps-title">
        <div css={s.sectionHead}>
          <span css={s.eyebrow}>HOW IT WORKS</span>
          <h2 id="home-steps-title" css={s.sectionTitle}>
            레슨 신청, 이렇게 진행돼요
          </h2>
        </div>
        <ol css={s.steps}>
          {STEPS.map((step, i) => (
            <li key={step.title} css={s.step}>
              <span css={s.stepNo(i === 0)} aria-hidden="true">
                {i + 1}
              </span>
              <div css={s.stepText}>
                <strong>{step.title}</strong>
                <p>{step.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ③ 내 음악 스타일 찾기 */}
      <section css={s.finder} aria-labelledby="hobby-entry-title">
        <div css={s.finderBody}>
          <div css={s.finderTop}>
            <span css={s.eyebrow}>MY MUSIC STYLE</span>
            <span css={s.instStack} aria-hidden="true">
              {picked.others.map((inst) => (
                <span key={inst.key} css={s.instChip}>
                  <img src={instrumentSrc(inst.key)} alt="" width={40} height={40} loading="lazy" decoding="async" />
                </span>
              ))}
            </span>
          </div>
          <h2 id="hobby-entry-title" css={s.finderTitle}>
            나도 음악을 한다면?
          </h2>
          <p css={s.finderDesc}>악기부터 보컬까지, 내 취향에 어울리는 음악과 우리 동네 레슨을 찾아보세요.</p>
          <ul css={s.meta}>
            <li>질문 8~9개</li>
            <li>약 2분</li>
            <li>로그인 없이</li>
          </ul>
        </div>
        <div css={s.finderActions}>
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
    </main>
  );
}

export default Home;
