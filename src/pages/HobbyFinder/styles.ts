import { css } from "@emotion/react";

// 브랜드 톤 (검정 #111827 + 회색), 다른 화면과 같은 카드·버튼 값
const ink = "#111827";
const text = "#1b1d20";
const sub = "#4b5563";
const muted = "#6b7280";
const line = "#e2e5e9";
const soft = "#f3f4f6";
const softer = "#f7f8f9";

export const page = css`
  max-width: 760px;
  margin: 0 auto;
  padding: 40px 16px 80px;
  color: ${text};
  text-align: left;
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding-top: 24px;
  }
`;

export const eyebrow = css`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: ${muted};
`;

// ---------- 질문 ----------
export const progressRow = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
  font-size: 13px;
  color: ${muted};

  strong {
    color: ${text};
    font-variant-numeric: tabular-nums;
  }
`;

export const progressBar = css`
  height: 6px;
  border-radius: 999px;
  background: ${soft};
  overflow: hidden;
`;

export const progressFill = (pct: number) => css`
  width: ${pct}%;
  height: 100%;
  border-radius: 999px;
  background: ${ink};
  transition: width 0.2s ease;
`;

export const sectionBadge = (reality: boolean) => css`
  display: inline-block;
  margin-top: 28px;
  padding: 4px 10px;
  border-radius: 999px;
  background: ${reality ? softer : soft};
  border: 1px solid ${reality ? line : soft};
  font-size: 12px;
  font-weight: 600;
  color: ${reality ? muted : sub};
`;

export const question = css`
  margin: 12px 0 6px;
  font-size: 24px;
  font-weight: 700;
  line-height: 1.4;
  letter-spacing: -0.02em;
  word-break: keep-all;

  @media (max-width: 600px) {
    font-size: 21px;
  }
`;

export const questionHint = css`
  margin: 0 0 20px;
  font-size: 13px;
  color: ${muted};
`;

export const options = css`
  display: grid;
  gap: 10px;
`;

export const option = (selected: boolean) => css`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  min-height: 56px;
  padding: 14px 16px;
  box-sizing: border-box;
  border: 1px solid ${selected ? ink : "#cfd4da"};
  border-radius: 12px;
  background: ${selected ? ink : "#fff"};
  color: ${selected ? "#fff" : text};
  font: inherit;
  font-size: 15px;
  font-weight: ${selected ? 700 : 500};
  text-align: left;
  word-break: keep-all;
  cursor: pointer;
  transition: border-color 0.15s ease, background-color 0.15s ease;

  &:hover {
    border-color: ${selected ? ink : "#9ca3af"};
  }
  &:focus-visible {
    outline: 3px solid rgba(17, 24, 39, 0.25);
    outline-offset: 2px;
  }
`;

export const optionKey = (selected: boolean) => css`
  flex-shrink: 0;
  display: inline-grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: ${selected ? "rgba(255,255,255,0.18)" : soft};
  color: ${selected ? "#fff" : muted};
  font-size: 12px;
  font-weight: 600;
`;

export const navRow = css`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  margin-top: 28px;
`;

export const btn = (tone: "primary" | "ghost", wide = false) => css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  box-sizing: border-box;
  height: 48px;
  padding: 0 20px;
  ${wide ? "flex: 1;" : ""}
  border: 1px solid ${tone === "primary" ? ink : "#cfd4da"};
  border-radius: 10px;
  background: ${tone === "primary" ? ink : "#fff"};
  color: ${tone === "primary" ? "#fff" : text};
  font: inherit;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${tone === "primary" ? "#000" : softer};
  }
  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: 3px solid rgba(17, 24, 39, 0.25);
    outline-offset: 2px;
  }
`;

export const smallBtn = css`
  ${btn("ghost")};
  height: 36px;
  padding: 0 12px;
  font-size: 13px;
`;

// ---------- 결과 ----------
export const resultHead = css`
  display: grid;
  gap: 10px;
  padding: 28px;
  border: 1px solid ${line};
  border-radius: 16px;
  background: #fff;

  @media (max-width: 600px) {
    padding: 20px;
  }
`;

export const resultTitle = css`
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.02em;
  word-break: keep-all;
`;

export const resultDesc = css`
  margin: 0;
  font-size: 15px;
  line-height: 1.75;
  color: ${sub};
  word-break: keep-all;
`;

export const keywords = css`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 4px 0 0;
  padding: 0;
  list-style: none;

  li {
    padding: 5px 12px;
    border-radius: 999px;
    background: ${soft};
    font-size: 13px;
    font-weight: 600;
    color: ${text};
  }
`;

export const disclaimer = css`
  margin: 6px 0 0;
  font-size: 12px;
  line-height: 1.6;
  color: ${muted};
`;

export const sectionTitle = css`
  margin: 36px 0 12px;
  font-size: 19px;
  font-weight: 600;
  letter-spacing: -0.02em;
`;

export const hobbyList = css`
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const hobbyCard = (active: boolean) => css`
  display: grid;
  gap: 12px;
  padding: 20px;
  border: 1px solid ${active ? ink : line};
  border-radius: 14px;
  background: #fff;
`;

export const hobbyHead = css`
  display: flex;
  align-items: center;
  gap: 12px;

  h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }
  p {
    margin: 2px 0 0;
    font-size: 13px;
    color: ${muted};
  }
`;

// 카드 위 작은 표시 (대표 추천 · 비슷하게 어울려요 · 레슨 보는 중)
export const cardLabel = (strong: boolean) => css`
  justify-self: start;
  padding: 3px 9px;
  border-radius: 999px;
  border: 1px solid ${strong ? ink : line};
  background: ${strong ? ink : "#fff"};
  color: ${strong ? "#fff" : sub};
  font-size: 12px;
  font-weight: 600;
`;

export const cardText = css`
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  color: ${text};
  word-break: keep-all;
`;

// 비슷한 두 후보: 나란히 (모바일은 위아래)
export const pairGrid = css`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const choiceBox = css`
  display: grid;
  gap: 10px;
  padding: 16px;
  border: 1px solid ${line};
  border-radius: 14px;
  background: ${softer};

  p {
    margin: 0;
    font-size: 14px;
    line-height: 1.7;
    color: ${text};
    word-break: keep-all;
  }
`;

export const choiceRow = css`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const subTitle = css`
  margin: 24px 0 10px;
  font-size: 15px;
  font-weight: 600;
  color: ${text};
`;

export const blockLabel = css`
  margin: 0 0 6px;
  font-size: 12px;
  font-weight: 600;
  color: ${muted};
`;

export const bullet = css`
  display: grid;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    position: relative;
    padding-left: 14px;
    font-size: 14px;
    line-height: 1.6;
    color: ${text};
    word-break: keep-all;
  }
  li::before {
    content: "";
    position: absolute;
    left: 2px;
    top: 0.7em;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: ${muted};
  }
`;

export const tipBox = css`
  padding: 12px 14px;
  border-radius: 10px;
  background: ${softer};
`;

export const hobbyActions = css`
  display: flex;
  justify-content: flex-end;
`;

// ---------- 지역 · 레슨 ----------
export const lessonPanel = css`
  display: grid;
  gap: 16px;
  padding: 24px;
  border: 1px solid ${line};
  border-radius: 16px;
  background: #fff;
  scroll-margin-top: 16px;

  @media (max-width: 600px) {
    padding: 18px;
  }
`;

export const hobbyTabs = css`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

export const hobbyTab = (on: boolean) => css`
  height: 38px;
  padding: 0 14px;
  border: 1px solid ${on ? ink : "#cfd4da"};
  border-radius: 999px;
  background: ${on ? ink : "#fff"};
  color: ${on ? "#fff" : text};
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

export const regionRow = css`
  display: grid;
  gap: 10px;
`;

export const regionApplied = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 14px;
  color: ${sub};

  strong {
    color: ${text};
  }
`;

export const note = css`
  margin: 0;
  padding: 10px 12px;
  border-radius: 10px;
  background: ${softer};
  font-size: 12px;
  line-height: 1.6;
  color: ${muted};
`;

export const stateBox = css`
  display: grid;
  justify-items: center;
  gap: 10px;
  padding: 28px 16px;
  border: 1px dashed #d8dce1;
  border-radius: 14px;
  text-align: center;
  font-size: 14px;
  color: ${muted};
  word-break: keep-all;

  strong {
    color: ${text};
    font-size: 15px;
  }
`;

export const stateActions = css`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
`;

export const lessonGrid = css`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-auto-rows: 1fr;
  gap: 12px;

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const lessonCard = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  padding: 18px;
  border: 1px solid ${line};
  border-radius: 14px;
  background: #fff;
`;

export const lessonOpen = css`
  display: grid;
  gap: 6px;
  padding: 0;
  border: 0;
  background: none;
  font: inherit;
  color: inherit;
  text-align: left;
  cursor: pointer;

  h4 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  &:hover h4 {
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  &:focus-visible {
    outline: 3px solid rgba(17, 24, 39, 0.25);
    outline-offset: 4px;
    border-radius: 6px;
  }
`;

export const lessonMeta = css`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 13px;
  color: ${muted};

  strong {
    color: ${text};
  }
`;

export const tagRow = css`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const tag = (matched: boolean) => css`
  padding: 3px 9px;
  border-radius: 999px;
  border: 1px solid ${matched ? ink : line};
  background: ${matched ? ink : "#fff"};
  color: ${matched ? "#fff" : sub};
  font-size: 12px;
  font-weight: ${matched ? 700 : 500};
`;

export const artistRow = css`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid ${soft};
  font-size: 13px;
  color: ${muted};
  min-width: 0;

  a {
    color: ${text};
    font-weight: 600;
    text-decoration: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  a:hover {
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;

export const regionLine = css`
  margin-top: -4px;
  font-size: 12px;
  color: ${muted};
`;

export const restartRow = css`
  display: flex;
  justify-content: center;
  margin-top: 32px;
`;

// ---------- 시작 화면 ----------
export const introList = css`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 4px 0 0;
  padding: 0;
  list-style: none;

  li {
    padding: 5px 12px;
    border-radius: 999px;
    border: 1px solid ${line};
    font-size: 13px;
    color: ${sub};
  }
`;

// ---------- 샘플(시연용) 레슨 표시 (개발 환경에서만 내려옴) ----------
export const sampleBadge = css`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 6px;
  border: 1px dashed #9ca3af;
  font-size: 11px;
  font-weight: 600;
  color: ${muted};
`;

// ---------- 다른 악기도 둘러보기 (접힌 영역) ----------
export const explore = css`
  margin-top: 16px;
  border: 1px solid ${line};
  border-radius: 16px;
  background: #fff;

  summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 18px 22px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    list-style: none;
  }
  summary::-webkit-details-marker {
    display: none;
  }
  summary::after {
    content: "+";
    font-size: 20px;
    font-weight: 400;
    color: ${muted};
  }
  &[open] summary::after {
    content: "−";
  }
  summary:focus-visible {
    outline: 3px solid rgba(17, 24, 39, 0.25);
    outline-offset: -3px;
    border-radius: 16px;
  }
`;

export const exploreBody = css`
  display: grid;
  gap: 14px;
  padding: 0 22px 22px;

  @media (max-width: 600px) {
    padding: 0 16px 18px;
  }
`;

export const exploreGroup = css`
  display: grid;
  gap: 8px;

  h3 {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    color: ${muted};
  }
`;
