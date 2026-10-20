import { css } from "@emotion/react";
import { faint, focusRing, ink, line, mist, paper, sub } from "../../constants/uiTone";

// 레슨 찾기 · 아티스트 찾기 공용 - 메인과 같은 결
// 오프화이트 상단 판(제목 + 작은 포장 악기) → 알약 검색창 → 바로 적용 칩 한 줄 → 접히는 상세 조건 → 결과

export const page = css`
  display: grid;
  gap: 28px;
  /* 좌우 8px + 바깥 16px = 상단 메뉴 로고와 같은 선 (메인과 같음) */
  padding: 4px 8px 88px;
  color: ${ink};
  text-align: left;
  box-sizing: border-box;

  @media (max-width: 600px) {
    gap: 20px;
    padding: 0 0 56px;
  }
`;

// ---------- 상단 판 ----------

export const hero = css`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  grid-template-areas:
    "text art"
    "body body";
  column-gap: 32px;
  padding: 32px 48px 32px;
  border-radius: 24px;
  background: ${paper};

  @media (max-width: 760px) {
    grid-template-columns: minmax(0, 1fr);
    grid-template-areas: "text" "body";
  }

  @media (max-width: 600px) {
    padding: 24px 20px 20px;
    border-radius: 20px;
  }
`;

export const heroText = css`
  grid-area: text;
  display: grid;
  align-content: center;
  gap: 10px;
  min-width: 0;
`;

export const eyebrow = css`
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.14em;
  color: ${faint};
`;

export const title = css`
  margin: 0;
  font-size: clamp(28px, 3.4vw, 44px);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.04em;
  word-break: keep-all;
`;

export const desc = css`
  max-width: 36em;
  margin: 0;
  font-size: 15px;
  line-height: 1.65;
  color: ${sub};
  word-break: keep-all;

  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

// 오른쪽 작은 포장 악기 (메인 배너의 축소판, 장식) - 좁으면 숨김
export const heroArt = css`
  grid-area: art;
  align-self: center;
  width: 150px;
  height: 172px;
  margin: -16px 8px -16px 0;

  & > div {
    zoom: 0.44;
  }

  @media (max-width: 760px) {
    display: none;
  }
`;

export const heroBody = css`
  grid-area: body;
  display: grid;
  gap: 14px;
  min-width: 0;
  margin-top: 24px;

  @media (max-width: 600px) {
    gap: 12px;
    margin-top: 18px;
  }
`;

// ---------- 알약 검색창 (메인 AI 질문창과 같은 모양) ----------

export const searchPill = css`
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 8px;
  max-width: 760px;
  min-height: 60px;
  padding: 6px 6px 6px 22px;
  border-radius: 999px;
  background: #ffffff;
  box-shadow: 0 14px 30px -22px rgba(23, 25, 28, 0.45);
  box-sizing: border-box;
  transition: box-shadow 0.15s ease;

  &:focus-within {
    box-shadow: 0 0 0 3px rgba(23, 25, 28, 0.14), 0 14px 30px -22px rgba(23, 25, 28, 0.45);
  }

  @media (max-width: 600px) {
    min-height: 54px;
    padding-left: 18px;
  }
`;

export const searchIcon = css`
  flex-shrink: 0;
  color: ${faint};
`;

// 입력칸 기본 폭(약 20글자)이 남으면 좁은 화면에서 검색창이 판 밖으로 밀림 -> 0 에서 남는 만큼 늘어남
export const searchInput = css`
  flex: 1;
  width: 0;
  min-width: 0;
  height: 44px;
  padding: 0;
  border: 0;
  outline: none;
  background: transparent;
  color: ${ink};
  font-family: inherit;
  font-size: 15px;

  &::placeholder {
    color: ${faint};
  }

  @media (max-width: 600px) {
    font-size: 14px;
  }
`;

export const searchButton = css`
  flex-shrink: 0;
  height: 48px;
  padding: 0 24px;
  border: 0;
  border-radius: 999px;
  background: ${ink};
  color: #ffffff;
  font-family: inherit;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover:not(:disabled) {
    background: #000000;
  }
  &:disabled {
    opacity: 0.6;
    cursor: default;
  }
  ${focusRing}

  @media (max-width: 600px) {
    height: 42px;
    padding: 0 18px;
    font-size: 14px;
  }
`;

// ---------- 칩 한 줄 (좁으면 옆으로 넘김, 줄바꿈 없음) ----------

export const toolbar = css`
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  padding: 2px 0;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  /* 모바일: 판 끝까지 넘겨 볼 수 있게 */
  @media (max-width: 600px) {
    margin: 0 -20px;
    padding: 2px 20px;
  }
`;

export const divider = css`
  flex-shrink: 0;
  width: 1px;
  height: 20px;
  background: ${line};
`;

export const chip = (active: boolean) => css`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 6px;
  height: 38px;
  padding: 0 15px;
  border: 0;
  border-radius: 999px;
  background: ${active ? ink : "rgba(255, 255, 255, 0.75)"};
  color: ${active ? "#ffffff" : sub};
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    background: ${active ? "#000000" : "#ffffff"};
    color: ${active ? "#ffffff" : ink};
  }
  ${focusRing}

  svg {
    flex-shrink: 0;
  }
`;

export const chipCount = (active: boolean) => css`
  display: grid;
  place-items: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: ${active ? "rgba(255, 255, 255, 0.22)" : ink};
  color: #ffffff;
  font-size: 11px;
  font-weight: 800;
  line-height: 1;
  box-sizing: border-box;
`;

// ---------- 상세 조건 (접힘) ----------

export const panel = css`
  display: grid;
  gap: 20px;
  padding: 22px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.62);

  @media (max-width: 600px) {
    gap: 18px;
    padding: 16px;
  }
`;

export const panelGrid = css`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;

  @media (max-width: 760px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 18px;
  }
`;

export const field = css`
  display: grid;
  gap: 8px;
  min-width: 0;
`;

export const fieldWide = css`
  ${field};
  grid-column: 1 / -1;
`;

export const fieldLabel = css`
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 8px;
  font-size: 13px;
  font-weight: 800;
  color: ${ink};

  small {
    font-size: 12px;
    font-weight: 500;
    color: ${faint};
  }
`;

export const validation = css`
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: #c2410c;
`;

export const panelActions = css`
  display: flex;
  justify-content: flex-end;
  gap: 8px;

  @media (max-width: 600px) {
    & > button {
      flex: 1;
    }
  }
`;

export const ghostButton = css`
  height: 44px;
  padding: 0 20px;
  border: 0;
  border-radius: 14px;
  background: ${mist};
  color: ${ink};
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: #e2e1dc;
  }
  ${focusRing}
`;

export const primaryButton = css`
  height: 44px;
  padding: 0 24px;
  border: 0;
  border-radius: 14px;
  background: ${ink};
  color: #ffffff;
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #000000;
  }
  &:disabled {
    opacity: 0.6;
  }
  ${focusRing}
`;

// ---------- 결과 ----------

export const results = css`
  display: grid;
  gap: 16px;
  min-width: 0;
`;

export const resultHead = css`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px 16px;
  padding: 0 8px;

  @media (max-width: 600px) {
    padding: 0 4px;
  }
`;

export const resultTitle = css`
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.03em;

  span {
    font-size: 15px;
    font-weight: 700;
    color: ${sub};
    font-variant-numeric: tabular-nums;
  }

  @media (max-width: 600px) {
    font-size: 19px;
  }
`;

export const resultTools = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 12px;
  font-size: 13px;
  color: ${sub};
`;

export const textButton = css`
  padding: 4px 2px;
  border: 0;
  background: none;
  color: ${ink};
  font-family: inherit;
  font-size: 13px;
  font-weight: 700;
  text-decoration: underline;
  text-decoration-color: #c5cacd;
  text-underline-offset: 3px;
  cursor: pointer;
  ${focusRing}
`;

export const listBusy = css`
  transition: opacity 0.15s ease;
  &[aria-busy="true"] {
    opacity: 0.6;
  }
`;

export const emptyState = css`
  display: grid;
  justify-items: center;
  gap: 8px;
  padding: 48px 20px;
  border-radius: 18px;
  background: ${paper};
  color: ${sub};
  font-size: 14px;
  text-align: center;
  word-break: keep-all;

  strong {
    color: ${ink};
    font-size: 16px;
  }
`;

export const skeleton = css`
  border-radius: 18px;
  background: ${paper};
  animation: muzinPulse 1.4s ease-in-out infinite;

  @keyframes muzinPulse {
    50% {
      opacity: 0.55;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const loadMore = css`
  display: grid;
  place-items: center;
  min-height: 48px;
  padding: 8px;
  color: ${faint};
  font-size: 13px;
`;
