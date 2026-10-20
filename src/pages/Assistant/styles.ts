import { css, keyframes } from "@emotion/react";
import { faint, focusRing, ink, line, mist, paper, silver, sub } from "../../constants/uiTone";

// AI 레슨 내비게이터 - 대화형 AI 화면처럼 단순하게, 사이트 톤(차콜 · 오프화이트 · 무테)은 그대로
// [대화 기록 패널 | 대화 칸(가운데 좁은 열)] - 화면은 고정, 대화만 스크롤, 입력창은 항상 아래
// 900px 이하: 대화 기록은 버튼으로 여닫는 서랍

const NARROW = "@media (max-width: 900px)";
const MOBILE = "@media (max-width: 600px)";
const COLUMN = "760px"; // 대화 칸 폭

// ---------- 틀 ----------

export const shell = css`
  display: grid;
  grid-template-columns: 264px minmax(0, 1fr);
  height: calc(100dvh - 64px - 16px); /* 상단 메뉴 64 + 바깥 여백 */
  margin: -16px -16px 0; /* AppLayout 의 16px 여백 없이 화면을 꽉 채움 */
  color: ${ink};
  text-align: left;

  ${NARROW} {
    grid-template-columns: minmax(0, 1fr);
  }
  ${MOBILE} {
    height: calc(100dvh - 56px - 16px);
  }
`;

// 로그인 전 · 불러오는 중
export const page = css`
  display: grid;
  place-items: center;
  min-height: calc(100dvh - 64px - 32px);
  color: ${ink};
  text-align: center;
`;

export const gate = css`
  display: grid;
  justify-items: center;
  gap: 14px;
  max-width: 460px;
  padding: 24px;

  h1 {
    margin: 4px 0 0;
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.03em;
  }
  p {
    margin: 0;
    color: ${sub};
    font-size: 15px;
    line-height: 1.7;
    word-break: keep-all;
  }
`;

// ---------- 대화 기록 패널 ----------

export const side = (open: boolean) => css`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 0;
  padding: 16px 12px;
  background: ${paper};
  overflow: hidden;

  ${NARROW} {
    position: fixed;
    top: 64px;
    bottom: 0;
    left: 0;
    z-index: 60;
    width: min(300px, 86vw);
    box-shadow: 24px 0 60px -40px rgba(23, 25, 28, 0.6);
    transform: translateX(${open ? "0" : "-105%"});
    visibility: ${open ? "visible" : "hidden"};
    transition: transform 0.22s cubic-bezier(0.2, 0.7, 0.2, 1), visibility 0.22s;
  }
  ${MOBILE} {
    top: 56px;
  }
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const sideBackdrop = css`
  display: none;

  ${NARROW} {
    display: block;
    position: fixed;
    inset: 64px 0 0 0;
    z-index: 55;
    background: rgba(23, 25, 28, 0.32);
  }
  ${MOBILE} {
    inset: 56px 0 0 0;
  }
`;

export const newChatBtn = css`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 14px;
  border: 0;
  border-radius: 14px;
  background: #ffffff;
  color: ${ink};
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: box-shadow 0.15s ease;

  &:hover {
    box-shadow: 0 8px 18px -14px rgba(23, 25, 28, 0.55);
  }
  ${focusRing}
`;

export const sideLabel = css`
  margin: 14px 10px 4px;
  font-size: 12px;
  font-weight: 800;
  color: ${faint};
`;

export const convScroll = css`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  margin: 0 -4px;
  padding: 0 4px;
`;

export const convList = css`
  display: grid;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const convItem = (active: boolean) => css`
  display: grid;
  gap: 2px;
  width: 100%;
  padding: 10px 12px;
  border: 0;
  border-radius: 12px;
  background: ${active ? "#ffffff" : "transparent"};
  color: ${ink};
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s ease;

  strong {
    overflow: hidden;
    font-size: 14px;
    font-weight: ${active ? 800 : 600};
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  span {
    font-size: 12px;
    color: ${faint};
    font-variant-numeric: tabular-nums;
  }
  &:hover {
    background: ${active ? "#ffffff" : "rgba(255, 255, 255, 0.6)"};
  }
  ${focusRing}
`;

export const sideFoot = css`
  display: grid;
  gap: 6px;
  padding: 10px 10px 0;
  border-top: 1px solid ${line};
`;

// ---------- 대화 칸 ----------

export const chat = css`
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
`;

export const topbar = css`
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 56px;
  padding: 8px 20px;

  ${MOBILE} {
    padding: 6px 12px;
  }
`;

export const historyBtn = css`
  display: none;

  ${NARROW} {
    display: grid;
    flex-shrink: 0;
    place-items: center;
    width: 40px;
    height: 40px;
    padding: 0;
    border: 0;
    border-radius: 12px;
    background: transparent;
    color: ${ink};
    cursor: pointer;

    &:hover {
      background: #f2f1ed;
    }
    ${focusRing}
  }
`;

export const brand = css`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  font-size: 15px;
  font-weight: 800;
  white-space: nowrap;
`;

export const sparkle = (size = 28) => css`
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: ${size}px;
  height: ${size}px;
  border-radius: 50%;
  background: ${ink};
  color: #ffffff;

  svg {
    width: ${Math.round(size * 0.52)}px;
    height: ${Math.round(size * 0.52)}px;
  }
`;

// 이번 주 n/3회 · 초기화 시각 (작게)
export const quota = css`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  font-size: 12px;
  color: ${sub};
  white-space: nowrap;

  ${MOBILE} {
    gap: 6px;
  }
`;

export const quotaChip = (strong: boolean) => css`
  padding: 6px 10px;
  border-radius: 999px;
  background: ${strong ? mist : "transparent"};
  color: ${strong ? ink : sub};
  font-weight: ${strong ? 800 : 500};
  font-variant-numeric: tabular-nums;

  ${MOBILE} {
    ${strong ? "" : "display: none;"}
  }
`;

// 대화만 스크롤 (입력창은 아래에 고정)
export const scroll = css`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  scroll-behavior: smooth;

  @media (prefers-reduced-motion: reduce) {
    scroll-behavior: auto;
  }
`;

export const column = css`
  width: min(${COLUMN}, 100%);
  margin: 0 auto;
  padding: 8px 24px 24px;
  box-sizing: border-box;

  ${MOBILE} {
    padding: 4px 16px 16px;
  }
`;

// 대화 머리 (제목 · 질문 수 · 삭제)
export const threadHead = css`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0 16px;
  border-bottom: 1px solid ${line};
  margin-bottom: 20px;

  h2 {
    flex: 1;
    min-width: 0;
    margin: 0;
    overflow: hidden;
    font-size: 16px;
    font-weight: 800;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

export const metaText = css`
  flex-shrink: 0;
  font-size: 12px;
  color: ${sub};
  font-variant-numeric: tabular-nums;
`;

export const contextLine = css`
  margin: -8px 0 20px;
  font-size: 13px;
  color: ${faint};
  word-break: keep-all;
`;

export const messages = css`
  display: grid;
  gap: 24px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

// 내 질문: 오른쪽 회색 말풍선
export const userBubble = css`
  justify-self: end;
  max-width: 82%;
  padding: 12px 16px;
  border-radius: 20px 20px 6px 20px;
  background: ${mist};
  font-size: 15px;
  line-height: 1.6;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

// AI 답변: 말풍선 없이 왼쪽 ✦ + 본문
export const answer = css`
  display: grid;
  grid-template-columns: 28px minmax(0, 1fr);
  gap: 12px;
  align-items: start;
`;

export const answerBody = css`
  display: grid;
  gap: 14px;
  min-width: 0;
`;

export const answerText = css`
  padding-top: 3px;
  font-size: 15px;
  line-height: 1.75;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  word-break: keep-all;
`;

export const followUp = css`
  margin: 0;
  padding: 12px 14px;
  border-radius: 14px;
  background: ${paper};
  font-size: 14px;
  line-height: 1.6;
  color: ${ink};
  word-break: keep-all;
`;

const dot = keyframes`
  0%, 80%, 100% { opacity: 0.25; transform: translateY(0); }
  40% { opacity: 1; transform: translateY(-3px); }
`;

export const thinking = css`
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: 4px;
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
    background: ${ink};
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

// ---------- 첫 화면 (새 대화) ----------

export const hello = css`
  display: grid;
  justify-items: center;
  gap: 12px;
  padding: 10vh 0 28px;
  text-align: center;

  h2 {
    margin: 6px 0 0;
    font-size: clamp(24px, 3vw, 32px);
    font-weight: 800;
    letter-spacing: -0.035em;
  }
  p {
    margin: 0;
    max-width: 30em;
    font-size: 15px;
    line-height: 1.65;
    color: ${sub};
    word-break: keep-all;
  }

  ${MOBILE} {
    padding: 6vh 0 20px;
  }
`;

export const examples = css`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
  margin-top: 16px;
`;

export const exampleBtn = css`
  max-width: 100%;
  padding: 10px 14px;
  border: 0;
  border-radius: 14px;
  background: ${paper};
  color: ${ink};
  font-family: inherit;
  font-size: 13px;
  line-height: 1.4;
  text-align: left;
  word-break: keep-all;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover:not(:disabled) {
    background: #ecebe7;
  }
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
  ${focusRing}
`;

// 취향 반영: 입력창 아래 한 줄
export const context = css`
  display: grid;
  justify-items: center;
  gap: 8px;
  margin-top: 14px;
  font-size: 13px;
  color: ${sub};
  text-align: center;
  word-break: keep-all;

  a {
    color: ${ink};
    font-weight: 700;
    text-underline-offset: 3px;
  }
`;

export const check = css`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  background: ${paper};
  cursor: pointer;

  input {
    width: 16px;
    height: 16px;
    margin: 0;
    accent-color: ${ink};
  }
  strong {
    font-size: 13px;
    font-weight: 700;
    color: ${ink};
  }
  span {
    font-size: 12px;
    color: ${faint};
  }
`;

export const chips = css`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 6px;
`;

export const chip = css`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  background: #ffffff;
  font-size: 12px;
  font-weight: 700;
  color: ${ink};
  white-space: nowrap;
`;

export const startNote = css`
  margin: 12px 0 0;
  font-size: 12px;
  color: ${faint};
  text-align: center;
  word-break: keep-all;
`;

// ---------- 입력창 (둥근 상자, 자동 높이, 원형 전송) ----------

export const composerWrap = css`
  flex-shrink: 0;
  width: min(${COLUMN}, 100%);
  margin: 0 auto;
  padding: 0 24px 16px;
  box-sizing: border-box;

  ${MOBILE} {
    padding: 0 12px calc(12px + env(safe-area-inset-bottom));
  }
`;

export const composer = css`
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 10px 10px 10px 18px;
  border-radius: 26px;
  background: #ffffff;
  box-shadow: 0 0 0 1px ${line}, 0 18px 40px -28px rgba(23, 25, 28, 0.45);
  transition: box-shadow 0.15s ease;

  &:focus-within {
    box-shadow: 0 0 0 1.5px ${silver}, 0 18px 40px -26px rgba(23, 25, 28, 0.5);
  }
`;

export const textarea = css`
  flex: 1;
  width: 0;
  min-width: 0;
  min-height: 26px;
  max-height: 200px;
  margin: 0 0 7px;
  padding: 0;
  border: 0;
  outline: none;
  resize: none;
  background: transparent;
  color: ${ink};
  font-family: inherit;
  font-size: 15px;
  line-height: 1.6;

  &::placeholder {
    color: ${faint};
  }
  &:disabled {
    cursor: not-allowed;
  }
  ${MOBILE} {
    font-size: 16px; /* iOS 확대 방지 */
  }
`;

export const sendBtn = css`
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 40px;
  height: 40px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: ${ink};
  color: #ffffff;
  cursor: pointer;
  transition: background 0.15s ease, opacity 0.15s ease;

  &:hover:not(:disabled) {
    background: #000000;
  }
  &:disabled {
    background: #c9ccce;
    cursor: default;
  }
  ${focusRing}
`;

export const composerMeta = css`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 8px 0;
  font-size: 12px;
  color: ${faint};

  span:last-of-type {
    font-variant-numeric: tabular-nums;
  }
`;

// ---------- 안내 ----------

export const notice = (tone: "info" | "warn" | "error") => css`
  display: grid;
  gap: 6px;
  margin: 8px 0;
  padding: 16px 18px;
  border-radius: 18px;
  background: ${tone === "error" ? "#FBEFEE" : paper};
  color: ${sub};
  font-size: 14px;
  line-height: 1.6;
  word-break: keep-all;

  strong {
    color: ${tone === "error" ? "#A83A33" : ink};
    font-size: 15px;
  }
`;

export const noticeActions = css`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 6px;
`;

export const primaryBtn = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  padding: 0 22px;
  border: 0;
  border-radius: 14px;
  background: ${ink};
  color: #ffffff;
  font-family: inherit;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;

  &:hover:not(:disabled) {
    color: #ffffff;
    background: #000000;
  }
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
  ${focusRing}
`;

export const secondaryBtn = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 16px;
  border: 0;
  border-radius: 12px;
  background: ${mist};
  color: ${ink};
  font-family: inherit;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    color: ${ink};
    background: #e2e1dc;
  }
  ${focusRing}
`;

export const textBtn = css`
  justify-self: start;
  padding: 4px 2px;
  border: 0;
  background: none;
  color: ${sub};
  font-family: inherit;
  font-size: 12px;
  font-weight: 700;
  text-decoration: underline;
  text-decoration-color: ${silver};
  text-underline-offset: 3px;
  cursor: pointer;

  &:hover:not(:disabled) {
    color: ${ink};
  }
  &:disabled {
    opacity: 0.5;
  }
  ${focusRing}
`;

export const muted = css`
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: ${faint};
  word-break: keep-all;
`;

export const srOnly = css`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

// ---------- 추천 카드 (레슨 찾기 카드와 같은 결) ----------

export const cards = css`
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const card = css`
  display: grid;
  gap: 12px;
  padding: 18px;
  border-radius: 18px;
  background: ${paper};

  ${MOBILE} {
    padding: 16px;
  }
`;

export const cardTop = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
`;

export const kind = css`
  padding: 4px 9px;
  border-radius: 8px;
  background: ${ink};
  color: #ffffff;
  font-size: 11px;
  font-weight: 800;
`;

export const cardTitle = css`
  margin: 0;
  font-size: 17px;
  font-weight: 800;
  line-height: 1.4;
  letter-spacing: -0.02em;
  overflow-wrap: anywhere;
  word-break: keep-all;
`;

export const cardMeta = css`
  margin: 0;
  font-size: 13px;
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
    padding: 10px 12px;
    border-radius: 12px;
    background: #ffffff;
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
  }
`;

export const slots = css`
  margin: 0;
  font-size: 13px;
  color: ${sub};
  line-height: 1.6;
  word-break: keep-all;

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
  word-break: keep-all;

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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 16px;
  border-radius: 12px;
  background: ${ink};
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    color: #ffffff;
    background: #000000;
  }
  ${focusRing}
`;

export const unavailable = css`
  padding: 14px 16px;
  border-radius: 14px;
  background: ${paper};
  font-size: 13px;
  color: ${faint};
`;
