import { css, keyframes } from "@emotion/react";

// AI 레슨 내비게이터 - 메인 화면과 같은 톤 (밝은 바탕, 차콜 글자, 오프화이트·밝은 회색 면, 얇은 실버 선)
// 둥근 정도: 섹션 24 · 카드 18 · 버튼 14 · 칩 8
const ink = "#17191C";
const sub = "#5F656A";
const faint = "#8A9095";
const paper = "#F5F4F0";
const mist = "#ECEBE7";
const line = "#E1E0DB";
const silver = "#C5CACD";
const danger = "#B3261E";

const focusRing = css`
  &:focus-visible {
    outline: 3px solid rgba(23, 25, 28, 0.35);
    outline-offset: 2px;
  }
`;

export const page = css`
  max-width: 1120px;
  margin: 0 auto;
  padding: 24px 24px 72px;
  color: ${ink};
  text-align: left;
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 8px 0 48px;
  }
`;

export const head = css`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px 24px;
  margin-bottom: 16px;
`;

export const titleBlock = css`
  display: grid;
  gap: 6px;
  min-width: 0;

  h1 {
    margin: 0;
    font-size: clamp(26px, 3.4vw, 34px);
    font-weight: 800;
    letter-spacing: -0.04em;
  }
  p {
    margin: 0;
    font-size: 15px;
    line-height: 1.6;
    color: ${sub};
    word-break: keep-all;
  }
`;

// 이번 주 n/3회 · 초기화 시각
export const quota = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`;

export const quotaChip = (strong: boolean) => css`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  border-radius: 8px;
  background: ${strong ? ink : "#FFFFFF"};
  box-shadow: ${strong ? "none" : `inset 0 0 0 1px ${line}`};
  color: ${strong ? "#FFFFFF" : sub};
  font-size: 13px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`;

export const notice = (tone: "info" | "warn" | "error") => css`
  display: grid;
  gap: 8px;
  margin-bottom: 16px;
  padding: 16px 18px;
  border-radius: 18px;
  background: ${tone === "error" ? "#FBF1F0" : tone === "warn" ? paper : "#FFFFFF"};
  box-shadow: inset 0 0 0 1px ${tone === "error" ? "#EBCBC8" : line};
  font-size: 14px;
  line-height: 1.6;
  color: ${tone === "error" ? danger : ink};
  word-break: keep-all;

  strong {
    font-size: 15px;
    color: ${ink};
  }
`;

export const noticeActions = css`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

// ---------- 레이아웃 ----------

export const layout = css`
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 20px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 12px;
  }
`;

// 이전 대화 목록
export const side = css`
  position: sticky;
  top: 84px;
  display: grid;
  gap: 8px;
  padding: 14px;
  border-radius: 24px;
  background: ${paper};

  @media (max-width: 900px) {
    position: static;
    padding: 12px;
    border-radius: 20px;
  }
`;

export const sideHead = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 2px 4px 4px;
  font-size: 13px;
  font-weight: 800;
  color: ${sub};
`;

export const convList = css`
  display: grid;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
  max-height: 420px;
  overflow-y: auto;

  @media (max-width: 900px) {
    max-height: 220px;
  }
`;

export const convItem = (active: boolean) => css`
  display: grid;
  gap: 2px;
  width: 100%;
  padding: 10px 12px;
  border: none;
  border-radius: 12px;
  background: ${active ? "#FFFFFF" : "transparent"};
  box-shadow: ${active ? `inset 0 0 0 1px ${line}` : "none"};
  text-align: left;
  font: inherit;
  color: ${ink};
  cursor: pointer;

  strong {
    overflow: hidden;
    font-size: 14px;
    font-weight: ${active ? 800 : 600};
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  span {
    font-size: 12px;
    color: ${faint};
  }
  &:hover {
    background: #FFFFFF;
  }
  ${focusRing}
`;

export const main = css`
  display: grid;
  gap: 16px;
  min-width: 0;
`;

// ---------- 시작 화면 ----------

export const panel = css`
  display: grid;
  gap: 16px;
  padding: 24px;
  border-radius: 24px;
  background: #FFFFFF;
  box-shadow: inset 0 0 0 1px ${line};

  @media (max-width: 600px) {
    padding: 18px 16px;
    border-radius: 20px;
  }
`;

export const sectionLabel = css`
  margin: 0;
  font-size: 13px;
  font-weight: 800;
  color: ${sub};
`;

// 취향 반영
export const context = css`
  display: grid;
  gap: 10px;
  padding: 14px 16px;
  border-radius: 18px;
  background: ${paper};
`;

export const check = css`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 14px;
  line-height: 1.5;
  cursor: pointer;

  input {
    width: 18px;
    height: 18px;
    margin: 1px 0 0;
    accent-color: ${ink};
    flex-shrink: 0;
  }
  strong {
    font-weight: 800;
  }
  span {
    display: block;
    font-size: 13px;
    color: ${sub};
  }
`;

export const chips = css`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const chip = css`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 8px;
  background: #FFFFFF;
  box-shadow: inset 0 0 0 1px ${line};
  font-size: 12px;
  font-weight: 700;
  color: ${sub};
`;

export const exampleBtn = css`
  ${chip};
  border: none;
  font: inherit;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    color: ${ink};
    box-shadow: inset 0 0 0 1px ${silver};
  }
  ${focusRing}
`;

export const muted = css`
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: ${faint};
  word-break: keep-all;

  a {
    color: ${ink};
    font-weight: 700;
  }
`;

// ---------- 입력 ----------

export const composer = css`
  display: grid;
  gap: 8px;
`;

export const textarea = css`
  width: 100%;
  min-height: 92px;
  padding: 14px 16px;
  border: 1px solid ${line};
  border-radius: 18px;
  background: #FFFFFF;
  box-sizing: border-box;
  font: inherit;
  font-size: 15px;
  line-height: 1.6;
  color: ${ink};
  resize: vertical;

  &::placeholder {
    color: ${faint};
  }
  &:focus {
    outline: none;
    border-color: ${ink};
    box-shadow: 0 0 0 3px rgba(23, 25, 28, 0.08);
  }
  &:disabled {
    background: ${paper};
    color: ${faint};
  }
`;

export const composerRow = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 12px;
`;

export const counter = css`
  font-size: 12px;
  color: ${faint};
  font-variant-numeric: tabular-nums;
`;

export const primaryBtn = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 48px;
  padding: 0 22px;
  border: none;
  border-radius: 14px;
  background: ${ink};
  color: #FFFFFF;
  font: inherit;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;

  &:hover:enabled,
  &:is(a):hover {
    color: #FFFFFF;
    background: #000000;
  }
  &:disabled {
    background: ${silver};
    cursor: not-allowed;
  }
  ${focusRing}
`;

export const secondaryBtn = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 16px;
  border: none;
  border-radius: 12px;
  background: #FFFFFF;
  box-shadow: inset 0 0 0 1px ${line};
  color: ${ink};
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;

  &:hover {
    color: ${ink};
    box-shadow: inset 0 0 0 1px ${silver};
  }
  &:disabled {
    color: ${faint};
    cursor: not-allowed;
  }
  ${focusRing}
`;

export const textBtn = css`
  padding: 4px 6px;
  border: none;
  background: none;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  color: ${sub};
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;

  &:hover {
    color: ${ink};
  }
  &:disabled {
    color: ${faint};
    cursor: not-allowed;
  }
  ${focusRing}
`;

// ---------- 대화 ----------

export const threadHead = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px 12px;

  h2 {
    margin: 0;
    min-width: 0;
    font-size: 19px;
    font-weight: 800;
    letter-spacing: -0.02em;
    overflow-wrap: anywhere;
  }
`;

export const messages = css`
  display: grid;
  gap: 18px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const userBubble = css`
  justify-self: end;
  max-width: min(560px, 88%);
  padding: 12px 16px;
  border-radius: 18px 18px 6px 18px;
  background: ${ink};
  color: #FFFFFF;
  font-size: 15px;
  line-height: 1.6;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

export const answer = css`
  display: grid;
  gap: 12px;
  min-width: 0;
`;

export const answerText = css`
  max-width: 680px;
  padding: 14px 16px;
  border-radius: 18px 18px 18px 6px;
  background: ${paper};
  font-size: 15px;
  line-height: 1.7;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: keep-all;
`;

export const followUp = css`
  max-width: 680px;
  margin: 0;
  padding-left: 14px;
  border-left: 2px solid ${silver};
  font-size: 14px;
  line-height: 1.6;
  color: ${sub};
`;

const dot = keyframes`
  0%, 80%, 100% { opacity: 0.25; }
  40% { opacity: 1; }
`;

export const thinking = css`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  border-radius: 18px 18px 18px 6px;
  background: ${paper};
  font-size: 14px;
  color: ${sub};

  i {
    display: inline-flex;
    gap: 4px;
  }
  i span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${sub};
    animation: ${dot} 1.2s ease-in-out infinite;
  }
  i span:nth-of-type(2) {
    animation-delay: 0.15s;
  }
  i span:nth-of-type(3) {
    animation-delay: 0.3s;
  }
  @media (prefers-reduced-motion: reduce) {
    i span {
      animation: none;
      opacity: 0.6;
    }
  }
`;

// ---------- 추천 카드 ----------

export const cards = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;

  @media (max-width: 600px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const card = css`
  display: grid;
  gap: 12px;
  align-content: start;
  padding: 18px;
  border-radius: 18px;
  background: #FFFFFF;
  box-shadow: inset 0 0 0 1px ${line};
  min-width: 0;
`;

export const cardTop = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
`;

export const kind = css`
  ${chip};
  background: ${mist};
  box-shadow: none;
  color: ${ink};
`;

export const cardTitle = css`
  margin: 0;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.35;
  overflow-wrap: anywhere;
`;

export const cardMeta = css`
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: ${sub};
  overflow-wrap: anywhere;
`;

export const facts = css`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 8px;
  margin: 0;

  div {
    display: grid;
    gap: 2px;
    padding: 8px 10px;
    border-radius: 12px;
    background: ${paper};
    min-width: 0;
  }
  dt {
    font-size: 11px;
    font-weight: 700;
    color: ${faint};
  }
  dd {
    margin: 0;
    font-size: 14px;
    font-weight: 800;
    font-variant-numeric: tabular-nums;
    white-space: nowrap; /* "41,000원"이 줄바꿈되지 않게 */
  }

  @media (max-width: 600px) {
    gap: 6px;

    div {
      padding: 8px;
    }
    dd {
      font-size: 13px;
    }
  }
`;

export const slots = css`
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: ${sub};

  strong {
    color: ${ink};
  }
`;

export const reason = css`
  display: grid;
  gap: 2px;
  margin: 0;
  padding-left: 12px;
  border-left: 2px solid ${silver};
  font-size: 13px;
  line-height: 1.6;
  color: ${ink};

  span {
    font-size: 11px;
    font-weight: 800;
    color: ${faint};
  }
`;

export const cardActions = css`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const cardLink = css`
  ${secondaryBtn};
  height: 40px;
  background: ${ink};
  box-shadow: none;
  color: #FFFFFF;

  &:hover {
    color: #FFFFFF;
    background: #000000;
    box-shadow: none;
  }
`;

export const unavailable = css`
  ${card};
  background: ${paper};
  box-shadow: none;
  color: ${faint};
  font-size: 14px;
`;

// 로그인 안내
export const gate = css`
  display: grid;
  justify-items: start;
  gap: 14px;
  padding: 32px;
  border-radius: 24px;
  background: ${paper};

  h1 {
    margin: 0;
    font-size: clamp(24px, 3vw, 30px);
    font-weight: 800;
    letter-spacing: -0.04em;
  }
  p {
    margin: 0;
    font-size: 15px;
    line-height: 1.7;
    color: ${sub};
    word-break: keep-all;
  }

  @media (max-width: 600px) {
    padding: 24px 20px;
    border-radius: 20px;
  }
`;

export const srOnly = css`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
`;
