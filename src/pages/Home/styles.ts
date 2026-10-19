import { css } from "@emotion/react";

// 메인 - 밝은 바탕 + 충분한 여백, 차콜 글자 / 오프화이트 · 밝은 회색 면
// 포인트 컬러 없음 (주요 버튼은 차콜), 실버는 얇은 선에만
// 둥근 정도: 섹션 24 · 카드 18 · 버튼 14 · 칩 8 (모바일 섹션 20)
const ink = "#17191C"; // 차콜
const sub = "#5F656A"; // 보조 글자
const faint = "#8A9095";
const paper = "#F5F4F0"; // 오프화이트 면
const mist = "#ECEBE7"; // 밝은 회색 면
const line = "#E1E0DB";
const silver = "#C5CACD"; // 얇은 실버 선

const focusRing = css`
  &:focus-visible {
    outline: 3px solid rgba(23, 25, 28, 0.35);
    outline-offset: 3px;
  }
`;

export const page = css`
  display: grid;
  gap: 24px;
  max-width: 1120px;
  margin: 0 auto;
  padding: 24px 24px 88px;
  color: ${ink};
  text-align: left;
  box-sizing: border-box;

  @media (max-width: 600px) {
    gap: 16px;
    padding: 8px 0 56px;
  }
`;

// ---------- ① 메인 배너 ----------

export const hero = css`
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
  align-items: center;
  gap: 40px;
  padding: 56px 56px 48px;
  border-radius: 24px;
  background: ${paper};
  overflow: hidden;

  @media (max-width: 960px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 4px;
    padding: 44px 32px 24px;
  }

  @media (max-width: 600px) {
    padding: 28px 20px 12px;
    border-radius: 20px;
  }
`;

export const heroBody = css`
  position: relative;
  z-index: 1;
  display: grid;
  gap: 16px;
  min-width: 0;
`;

export const title = css`
  margin: 0;
  font-size: clamp(34px, 5vw, 58px);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -0.045em;
  color: ${ink};
  word-break: keep-all;
`;

export const heroDesc = css`
  max-width: 30em;
  margin: 0;
  font-size: 17px;
  line-height: 1.7;
  color: ${sub};
  word-break: keep-all;

  @media (max-width: 600px) {
    font-size: 15px;
  }
`;

// 두 갈래 찾기: 레슨 = 차콜 큰 판(주), 아티스트 = 흰 판(보조)
export const paths = css`
  display: grid;
  gap: 10px;
  max-width: 460px;
  margin-top: 12px;

  @media (max-width: 960px) {
    max-width: 560px;
  }
`;

const pathBase = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 16px 16px 22px;
  border-radius: 18px;
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
  min-height: 80px;
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
  }
  & > span[aria-hidden]::after {
    border-color: ${ink};
  }

  &:hover {
    color: #FFFFFF;
    background: #000000;
  }
`;

export const pathSecondary = css`
  ${pathBase};
  min-height: 72px;
  background: #FFFFFF;
  color: ${ink};
  box-shadow: inset 0 0 0 1px ${line};

  span span {
    color: ${sub};
  }

  &:hover {
    color: ${ink};
    box-shadow: inset 0 0 0 1px ${silver}, 0 10px 22px -16px rgba(23, 25, 28, 0.4);
  }
`;

export const pathText = css`
  display: grid;
  gap: 3px;
  min-width: 0;

  strong {
    font-size: 18px;
    font-weight: 800;
    letter-spacing: -0.02em;
  }
  span {
    font-size: 13px;
    line-height: 1.5;
    word-break: keep-all;
  }
`;

// AI 레슨 내비게이터 진입: 두 갈래 버튼 아래 한 줄 (보조 동선이라 버튼보다 가볍게)
export const aiLink = css`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 8px;
  padding: 6px 4px 0;
  font-size: 14px;
  color: ${sub};
  text-decoration: none;

  strong {
    position: relative;
    padding-right: 14px;
    font-weight: 800;
    color: ${ink};
    text-decoration: underline;
    text-decoration-color: ${silver};
    text-underline-offset: 4px;
  }
  /* 오른쪽 화살촉 */
  strong::after {
    content: "";
    position: absolute;
    right: 2px;
    top: 50%;
    width: 6px;
    height: 6px;
    margin-top: -3px;
    border-top: 2px solid currentColor;
    border-right: 2px solid currentColor;
    transform: rotate(45deg);
  }
  &:hover {
    color: ${ink};
  }
  &:hover strong {
    text-decoration-color: ${ink};
  }
  ${focusRing}
`;

// 원 안의 화살촉 (선으로만)
export const pathArrow = css`
  position: relative;
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${ink};

  &::after {
    content: "";
    position: absolute;
    left: 14px;
    top: 15px;
    width: 8px;
    height: 8px;
    border-top: 2px solid #FFFFFF;
    border-right: 2px solid #FFFFFF;
    transform: rotate(45deg);
  }
`;

export const heroVisual = css`
  position: relative;
  z-index: 1;
  display: grid;
  place-items: center;
  min-height: 440px;

  @media (max-width: 960px) {
    min-height: 0;
    padding: 20px 0 8px;
  }

  @media (max-width: 600px) {
    padding: 16px 0 4px;
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
