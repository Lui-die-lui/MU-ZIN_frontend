import { css, keyframes } from "@emotion/react";

// 메인 - 밝은 바탕 + 충분한 여백, 차콜 글자 / 오프화이트 · 밝은 회색 면
// 포인트 컬러 없음 (주요 버튼은 차콜), 실버는 얇은 선에만
// 둥근 정도: 섹션 24 · 카드 18 · 버튼 14 · 칩 8 (모바일 섹션 20)
import { faint, focusRing, ink, line, mist, paper, silver, sub } from "../../constants/uiTone";
// 일정 패널 스타일에서도 같이 씀
export { faint, focusRing, ink, line, mist, paper, silver, sub };

export const page = css`
  display: grid;
  gap: 24px;
  /* 폭은 #root(1440) 를 그대로 씀. 좌우 8px + 바깥 16px = 상단 메뉴 로고와 같은 선 */
  /* 위: 바깥 16px + 4px = 상단 메뉴와 20px */
  padding: 4px 8px 88px;
  color: ${ink};
  text-align: left;
  box-sizing: border-box;

  @media (max-width: 600px) {
    gap: 16px;
    padding: 0 0 56px;
  }
`;

// ---------- ① 메인 배너 (+ 내 레슨 일정) ----------

// 회원: 배너 | 일정 패널 (1120px 이하에서는 패널이 배너 아래로)
export const top = (member: boolean) => css`
  display: grid;
  grid-template-columns: ${member ? "minmax(0, 1fr) 400px" : "minmax(0, 1fr)"};
  align-items: stretch;
  gap: 20px;

  @media (max-width: 1120px) {
    grid-template-columns: minmax(0, 1fr);
  }

  @media (max-width: 600px) {
    gap: 12px;
  }
`;

// 로그인 복구 중 일정 패널 자리 (복구가 끝나면 패널로 바뀜)
export const schedulePlaceholder = css`
  min-height: 560px;
  border-radius: 24px;
  background: ${mist};

  @media (max-width: 1120px) {
    min-height: 320px;
  }
  @media (max-width: 768px) {
    order: -1;
  }
`;

// 데스크톱: 왼쪽 [제목 → AI 질문 → 찾기 버튼], 오른쪽 악기가 세로 전체
//   위아래 빈 1fr 줄이 남는 높이를 나눠 가져서 왼쪽 묶음이 가운데에 모임
// 960px 이하: 제목 → 악기 → AI 질문 → 찾기 버튼
export const hero = (member: boolean) => css`
  position: relative;
  display: grid;
  grid-template-columns: ${member ? "minmax(0, 1fr) minmax(220px, 0.7fr)" : "minmax(0, 1.15fr) minmax(320px, 0.85fr)"};
  grid-template-rows: 1fr auto auto auto 1fr;
  grid-template-areas:
    ". visual"
    "head visual"
    "ai visual"
    "paths visual"
    ". visual";
  column-gap: ${member ? 24 : 56}px;
  padding: ${member ? "48px 40px 40px 48px" : "64px 64px 56px"};
  border-radius: 24px;
  background: ${paper};
  overflow: hidden;

  @media (max-width: 960px) {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: none;
    grid-template-areas: "head" "visual" "ai" "paths";
    padding: 44px 32px 28px;
  }

  @media (max-width: 600px) {
    padding: 28px 20px 20px;
    border-radius: 20px;
  }
`;

export const heroHead = css`
  grid-area: head;
  display: grid;
  gap: 14px;
  min-width: 0;
  margin-bottom: 28px;

  @media (max-width: 960px) {
    margin-bottom: 0;
  }
`;

export const title = (member: boolean) => css`
  margin: 0;
  font-size: ${member ? "clamp(34px, 3.3vw, 50px)" : "clamp(34px, 4.4vw, 62px)"};
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -0.045em;
  color: ${ink};
  word-break: keep-all;
`;

export const heroDesc = css`
  max-width: 32em;
  margin: 0;
  font-size: 15px;
  line-height: 1.7;
  color: ${sub};
  word-break: keep-all;

  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

export const heroVisual = (member: boolean) => css`
  grid-area: visual;
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  min-height: ${member ? 400 : 460}px;

  @media (max-width: 960px) {
    min-height: 0;
    padding: 24px 0 20px;
  }

  /* 모바일: 포장을 조금 크게 (212 -> 약 250px) */
  @media (max-width: 600px) {
    padding: 20px 0 16px;
    zoom: 1.18;
  }

  /* 회원 + 배너 옆 일정 패널: 배너 칸이 가장 좁은 구간에서 포장(300px)이 잘리지 않게 */
  ${member ? "@media (min-width: 1121px) and (max-width: 1300px) { zoom: 0.75; }" : ""}
`;

// ---------- 배너 > AI 질문 (입력창 모양 링크) ----------

const rise = keyframes`
  from { opacity: 0; transform: translateY(70%); }
  to { opacity: 1; transform: none; }
`;

export const heroAi = css`
  grid-area: ai;
  /* 폭에 따라 질문 줄 수를 바꾸려고 이 칸 폭을 기준으로 삼음 */
  container-type: inline-size;
  max-width: 640px;
  margin-bottom: 14px;
`;

export const aiPrompt = css`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 64px;
  padding: 8px 8px 8px 24px;
  border-radius: 999px;
  background: #FFFFFF;
  box-shadow: 0 14px 30px -22px rgba(23, 25, 28, 0.45);
  color: ${sub};
  text-decoration: none;
  box-sizing: border-box;
  transition: box-shadow 0.15s ease;

  &:hover {
    color: ${sub};
    box-shadow: 0 18px 34px -20px rgba(23, 25, 28, 0.5);
  }
  &:hover > span:last-of-type {
    background: #000000;
  }
  ${focusRing}

  @container (max-width: 520px) {
    padding-left: 20px;
  }
`;

// 한 줄(넓을 때) / 두 줄(좁을 때) 높이를 고정해서 문장이 바뀌어도 배너 높이가 흔들리지 않음
// 짧은 문장(한 줄)도 두 줄 칸 안에서 세로 가운데
export const aiField = css`
  flex: 1;
  display: flex;
  align-items: center;
  min-width: 0;
  height: 24px;
  overflow: hidden;

  & > span {
    flex: 1;
    min-width: 0;
  }

  @container (max-width: 520px) {
    height: 40px;
  }
`;

export const aiText = css`
  display: block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 15px;
  line-height: 24px;
  animation: ${rise} 0.55s cubic-bezier(0.2, 0.7, 0.2, 1) both;

  @container (max-width: 520px) {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    white-space: normal;
    word-break: keep-all;
    font-size: 14px;
    line-height: 20px;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const aiButton = css`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 48px;
  padding: 0 18px;
  border-radius: 999px;
  background: ${ink};
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  transition: background 0.15s ease;

  /* 좁으면 질문 칸을 남기려고 버튼을 줄임 */
  @container (max-width: 400px) {
    padding: 0 16px;
  }
`;

// 좁은 폭에서는 "AI" 만 남김 (링크 이름은 aria-label 로 전체 전달)
export const aiButtonMore = css`
  @container (max-width: 400px) {
    display: none;
  }
`;

// ---------- 배너 > 레슨·아티스트 찾기 ----------

// 넓으면 나란히, 좁으면 위아래 (회원 배너는 칸이 좁아 기준을 낮춤)
export const paths = (member: boolean) => css`
  grid-area: paths;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(${member ? 220 : 260}px, 1fr));
  gap: 10px;
  max-width: 640px;

  @media (max-width: 600px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const pathBase = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  min-height: 76px;
  padding: 14px 16px 14px 22px;
  border-radius: 18px;
  box-sizing: border-box;
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;

  &:hover {
    transform: translateY(-1px);
  }
  ${focusRing}

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    &:hover {
      transform: none;
    }
  }
`;

export const pathPrimary = css`
  ${pathBase};
  background: ${ink};
  color: #FFFFFF;
  box-shadow: 0 14px 28px -16px rgba(23, 25, 28, 0.75);

  strong {
    color: #FFFFFF;
  }
  span span {
    color: rgba(255, 255, 255, 0.72);
  }
  /* 차콜 판 위에서는 화살표 원을 흰색으로 */
  & > span[aria-hidden] {
    background: #FFFFFF;
    color: ${ink};
  }

  &:hover {
    color: #FFFFFF;
    background: #000000;
  }
`;

// 보조: 테두리 없이 흰 판 + 옅은 그림자 (일정 패널과 같은 결)
export const pathSecondary = css`
  ${pathBase};
  background: rgba(255, 255, 255, 0.85);
  color: ${ink};
  box-shadow: 0 10px 24px -20px rgba(23, 25, 28, 0.45);

  span span {
    color: ${sub};
  }

  &:hover {
    color: ${ink};
    background: #FFFFFF;
    box-shadow: 0 14px 28px -18px rgba(23, 25, 28, 0.45);
  }
`;

export const pathText = css`
  display: grid;
  gap: 3px;
  min-width: 0;

  strong {
    font-size: 17px;
    font-weight: 800;
    line-height: 1.3;
    letter-spacing: -0.02em;
  }
  span {
    font-size: 13px;
    line-height: 1.5;
    word-break: keep-all;
  }
`;

// 원 안의 꺾쇠 (SVG 를 정확히 가운데에)
export const pathArrow = css`
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${ink};
  color: #FFFFFF;

  svg {
    display: block;
  }
`;

// ---------- 공통 섹션 머리 ----------

export const section = css`
  display: grid;
  gap: 20px;
  padding: 40px 8px 8px;

  @media (max-width: 600px) {
    gap: 16px;
    padding: 24px 4px 4px;
  }
`;

export const sectionHead = css`
  display: grid;
  gap: 6px;
`;

export const eyebrow = css`
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.14em;
  color: ${faint};
`;

export const sectionTitle = css`
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.035em;
  word-break: keep-all;

  @media (max-width: 600px) {
    font-size: 22px;
  }
`;

// ---------- ② 신청 순서 (번호를 잇는 얇은 실버 선) ----------

export const steps = css`
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
  margin: 0;
  padding: 0;
  list-style: none;

  /* 첫 번호 가운데부터 마지막 번호 가운데까지 */
  &::before {
    content: "";
    position: absolute;
    top: 19px;
    left: 20px;
    right: calc((100% - 72px) / 4 - 20px);
    height: 1px;
    background: ${silver};
  }

  /* 좁은 화면: 세로로, 선은 왼쪽에 */
  @media (max-width: 760px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 18px;

    &::before {
      top: 20px;
      bottom: 20px;
      left: 19px;
      right: auto;
      width: 1px;
      height: auto;
    }
  }
`;

export const step = css`
  position: relative;
  display: grid;
  gap: 14px;
  align-content: start;
  min-width: 0;

  @media (max-width: 760px) {
    grid-template-columns: 40px minmax(0, 1fr);
    align-items: start;
  }
`;

export const stepNo = (first: boolean) => css`
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  /* 선이 번호 뒤로 지나가도 보이지 않게 바탕색 링 */
  box-shadow: 0 0 0 6px #FFFFFF;
  background: ${first ? ink : "#FFFFFF"};
  border: 1px solid ${first ? ink : silver};
  box-sizing: border-box;
  font-size: 15px;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
  color: ${first ? "#FFFFFF" : ink};
`;

export const stepText = css`
  display: grid;
  gap: 4px;
  min-width: 0;

  strong {
    font-size: 17px;
    font-weight: 800;
    letter-spacing: -0.02em;
  }
  p {
    margin: 0;
    font-size: 14px;
    line-height: 1.6;
    color: ${sub};
    word-break: keep-all;
  }

  @media (max-width: 760px) {
    padding-top: 8px;
  }
`;

// ---------- ③ 내 음악 스타일 찾기 ----------

export const finder = css`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  gap: 32px;
  margin-top: 16px;
  padding: 36px 40px;
  border-radius: 24px;
  background: ${mist};

  @media (max-width: 760px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
    margin-top: 8px;
    padding: 28px 20px 20px;
    border-radius: 20px;
  }
`;

export const finderBody = css`
  display: grid;
  gap: 10px;
  min-width: 0;
`;

// 라벨 바로 옆에 악기 묶음 (넓은 화면에서 가운데에 떠 보이지 않게)
export const finderTop = css`
  display: flex;
  align-items: center;
  gap: 14px;
`;

// 악기 3개 겹친 원 (배너와 다른 악기, 장식)
export const instStack = css`
  display: flex;
  flex-shrink: 0;
`;

export const instChip = css`
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #FFFFFF;
  box-shadow: 0 0 0 3px ${mist}, inset 0 0 0 1px ${line};

  & + & {
    margin-left: -10px;
  }

  img {
    width: 32px;
    height: 32px;
    object-fit: contain;
  }
`;

export const finderTitle = css`
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.035em;
  word-break: keep-all;

  @media (max-width: 600px) {
    font-size: 22px;
  }
`;

export const finderDesc = css`
  max-width: 34em;
  margin: 0;
  font-size: 15px;
  line-height: 1.7;
  color: ${sub};
  word-break: keep-all;
`;

// 질문 수 · 시간 · 로그인: 흰 칩
export const meta = css`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 4px 0 0;
  padding: 0;
  list-style: none;

  li {
    padding: 5px 11px;
    border-radius: 8px;
    background: #FFFFFF;
    box-shadow: inset 0 0 0 1px ${line};
    font-size: 13px;
    font-weight: 600;
    color: ${sub};
  }
`;

export const finderActions = css`
  display: grid;
  gap: 10px;
  min-width: 220px;

  @media (max-width: 760px) {
    min-width: 0;
  }
`;

export const cta = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 54px;
  padding: 0 26px;
  border-radius: 14px;
  background: ${ink};
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 700;
  text-decoration: none;
  transition: background 0.15s ease;

  &:hover {
    color: #FFFFFF;
    background: #000000;
  }
  ${focusRing}
`;

export const secondary = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  padding: 0 22px;
  border-radius: 14px;
  background: #FFFFFF;
  box-shadow: inset 0 0 0 1px ${line};
  color: ${ink};
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    color: ${ink};
    box-shadow: inset 0 0 0 1px ${silver};
  }
  ${focusRing}
`;
