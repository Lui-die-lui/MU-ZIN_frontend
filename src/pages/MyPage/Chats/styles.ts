import { css } from "@emotion/react";

// 브랜드 톤 (검정 + 회색)
const ink = "#111827";
const text = "#1b1d20";
const muted = "#6b7280";
const line = "#e2e5e9";
const soft = "#f3f4f6";
const softer = "#f7f8f9";
const MOBILE = "@media (max-width: 760px)";

export const page = css`
  display: grid;
  gap: 16px;
  max-width: 1040px;
  margin: 0 auto;
  padding: 28px 24px 32px;
  color: ${text};
  text-align: left;
  box-sizing: border-box;

  ${MOBILE} {
    padding: 16px 12px 16px;
  }
`;

export const header = (inRoom: boolean) => css`
  display: grid;
  gap: 6px;

  ${MOBILE} {
    display: ${inRoom ? "none" : "grid"};
  }
`;

export const title = css`
  margin: 0;
  font-size: 25px;
  font-weight: 700;
`;

export const desc = css`
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: ${muted};
`;

export const layout = css`
  display: grid;
  grid-template-columns: 320px minmax(0, 1fr);
  height: min(680px, calc(100vh - 200px));
  min-height: 460px;
  border: 1px solid ${line};
  border-radius: 16px;
  background: #fff;
  overflow: hidden;

  ${MOBILE} {
    grid-template-columns: minmax(0, 1fr);
    height: calc(100dvh - 120px);
  }
`;

export const listPane = (inRoom: boolean) => css`
  min-height: 0;
  overflow-y: auto;
  border-right: 1px solid ${line};

  ${MOBILE} {
    display: ${inRoom ? "none" : "block"};
    border-right: 0;
  }
`;

export const roomPane = (inRoom: boolean) => css`
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;

  ${MOBILE} {
    display: ${inRoom ? "flex" : "none"};
  }
`;

export const roomList = css`
  margin: 0;
  padding: 6px;
  list-style: none;
`;

export const roomItem = (active: boolean) => css`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px;
  border: 0;
  border-radius: 12px;
  background: ${active ? soft : "transparent"};
  font: inherit;
  color: ${text};
  text-align: left;
  cursor: pointer;

  &:hover {
    background: ${soft};
  }
  &:focus-visible {
    outline: 2px solid ${ink};
  }
`;

export const roomText = (hasUnread: boolean) => css`
  display: grid;
  gap: 4px;
  flex: 1;
  min-width: 0;

  strong {
    font-weight: ${hasUnread ? 800 : 700};
  }
  [data-preview] {
    color: ${hasUnread ? text : muted};
    font-weight: ${hasUnread ? 600 : 400};
  }
`;

export const roomTop = css`
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;

  strong {
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  time {
    margin-left: auto;
    flex-shrink: 0;
    font-size: 12px;
    color: ${muted};
  }
`;

export const roleTag = css`
  flex-shrink: 0;
  padding: 1px 6px;
  border-radius: 6px;
  background: ${soft};
  font-size: 11px;
  font-weight: 600;
  color: ${muted};
`;

export const roomBottom = css`
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
`;

export const preview = css`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  color: ${muted};
`;

export const readOnlyTag = css`
  flex-shrink: 0;
  font-size: 11px;
  color: #9ca3af;
`;

export const unread = css`
  flex-shrink: 0;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  box-sizing: border-box;
  border-radius: 999px;
  background: ${ink};
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  line-height: 20px;
  text-align: center;
`;

export const emptyRoom = css`
  display: grid;
  align-content: center;
  justify-items: center;
  gap: 6px;
  flex: 1;
  padding: 24px;
  background: ${softer};
  font-size: 13px;
  color: ${muted};
  text-align: center;
  word-break: keep-all;

  strong {
    font-size: 15px;
    color: ${text};
  }
`;

export const stateBox = css`
  display: grid;
  justify-items: center;
  gap: 8px;
  padding: 28px 16px;
  font-size: 14px;
  color: ${muted};
  text-align: center;
  word-break: keep-all;
`;

export const textBtn = css`
  padding: 4px 6px;
  border: 0;
  background: none;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  color: ${text};
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
`;

// ---------- 대화방 ----------
export const room = css`
  position: relative;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
`;

export const roomHeader = css`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-bottom: 1px solid ${line};
`;

export const backBtn = css`
  display: none;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 8px;
  background: transparent;
  font-size: 18px;
  cursor: pointer;

  ${MOBILE} {
    display: inline-grid;
    place-items: center;
  }
`;

export const roomWho = css`
  display: grid;
  gap: 2px;
  flex: 1;
  min-width: 0;

  a,
  strong {
    font-size: 15px;
    font-weight: 600;
    color: ${text};
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    color: ${muted};
  }
`;

export const headerBtn = css`
  flex-shrink: 0;
  height: 32px;
  padding: 0 10px;
  border: 1px solid ${line};
  border-radius: 8px;
  background: #fff;
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  color: ${muted};
  cursor: pointer;

  &:hover {
    color: ${text};
    border-color: #cfd4da;
  }
`;

export const contextRow = css`
  display: flex;
  gap: 6px;
  margin: 0;
  padding: 8px 16px;
  overflow-x: auto;
  list-style: none;
  border-bottom: 1px solid ${soft};

  li {
    flex-shrink: 0;
    padding: 3px 9px;
    border-radius: 999px;
    background: ${softer};
    font-size: 12px;
    color: ${muted};
    white-space: nowrap;
  }
`;

export const messages = css`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 16px;
  background: ${softer};
`;

export const olderBtn = css`
  display: block;
  margin: 0 auto 12px;
  padding: 6px 12px;
  border: 1px solid ${line};
  border-radius: 999px;
  background: #fff;
  font: inherit;
  font-size: 12px;
  color: ${muted};
  cursor: pointer;
`;

export const emptyMessages = css`
  padding: 40px 12px;
  text-align: center;
  font-size: 13px;
  color: ${muted};
`;

export const daySep = css`
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 18px 0 12px;
  font-size: 12px;
  font-weight: 500;
  color: ${muted};

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: ${line};
  }

  span {
    padding: 3px 10px;
    border-radius: 999px;
    background: #fff;
    border: 1px solid ${line};
  }
`;

export const notice = css`
  margin: 10px auto;
  width: fit-content;
  padding: 4px 12px;
  border-radius: 999px;
  background: ${soft};
  font-size: 12px;
  color: ${muted};
`;

// 묶음의 첫 메시지만 위 간격을 넓게
export const msgRow = (mine: boolean, groupStart: boolean) => css`
  display: flex;
  flex-direction: ${mine ? "row-reverse" : "row"};
  align-items: flex-end;
  gap: 6px;
  margin-top: ${groupStart ? 10 : 2}px;

  /* 마우스로 올리거나 키보드로 고르면 "⋯" 버튼 보이기 */
  &:hover [data-more],
  &:focus-within [data-more] {
    opacity: 1;
  }
`;

// 묶음 안에서 상대 쪽 모서리만 덜 둥글게 → 한 덩어리로 읽힘
export const bubble = (mine: boolean, groupStart = true) => {
  const r = 18;
  const tight = 6;
  const top = groupStart ? r : tight;
  const radius = mine ? `${r}px ${top}px ${tight}px ${r}px` : `${top}px ${r}px ${r}px ${tight}px`;
  return bubbleBase(mine, radius);
};

const bubbleBase = (mine: boolean, radius: string) => css`
  max-width: min(72%, 520px);
  margin: 0;
  padding: 9px 14px;
  border-radius: ${radius};
  background: ${mine ? ink : "#fff"};
  border: 1px solid ${mine ? ink : line};
  color: ${mine ? "#fff" : text};
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
  overflow-wrap: anywhere;

  &:focus-visible {
    outline: 3px solid rgba(17, 24, 39, 0.25);
    outline-offset: 2px;
  }
`;

// 말풍선 옆: "⋯" 버튼 + 읽음 · 수정됨 · 시간 (말풍선 쪽으로 붙임)
export const msgSide = (mine: boolean) => css`
  display: flex;
  flex-direction: column;
  align-items: ${mine ? "flex-end" : "flex-start"};
  gap: 2px;
  flex-shrink: 0;
`;

export const moreBtn = css`
  width: 24px;
  height: 20px;
  padding: 0;
  border: 0;
  border-radius: 6px;
  background: transparent;
  font: inherit;
  font-size: 14px;
  line-height: 1;
  color: ${muted};
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.12s ease, background 0.12s ease;

  &:hover,
  &:focus-visible {
    background: ${soft};
    color: ${text};
    outline: none;
    opacity: 1;
  }

  /* 터치 화면은 올려 볼 수 없으니 항상 보이게 */
  @media (hover: none) {
    opacity: 1;
  }
`;

// 삭제된 메시지: 테두리 없는 알약 모양, 살짝 어두운 배경
export const deletedBubble = css`
  margin: 0;
  padding: 5px 14px;
  border-radius: 999px;
  background: #e5e7eb;
  color: ${muted};
  font-size: 13px;
  white-space: nowrap;
`;

export const editBox = css`
  display: grid;
  gap: 6px;
  width: min(80%, 560px);
`;

export const editActions = css`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;

  span {
    margin-right: auto;
    font-size: 11px;
    color: #9ca3af;
  }
`;

export const msgMenu = css`
  position: fixed;
  z-index: 1000;
  display: grid;
  min-width: 132px;
  padding: 4px;
  border: 1px solid ${line};
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(17, 24, 39, 0.12);
`;

export const msgMenuItem = (danger: boolean) => css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: 34px;
  padding: 0 10px;
  border: 0;
  border-radius: 7px;
  background: none;
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  color: ${danger ? "#b42318" : text};
  text-align: left;
  cursor: pointer;

  small {
    font-size: 11px;
    font-weight: 500;
    color: #9ca3af;
  }
  &:hover:not(:disabled),
  &:focus-visible {
    background: ${soft};
    outline: none;
  }
  &:disabled {
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

export const msgMeta = css`
  display: flex;
  gap: 4px;
  font-size: 11px;
  color: #9ca3af;
  white-space: nowrap;

  b {
    font-weight: 600;
    color: ${muted};
  }
`;

// 위쪽을 읽는 중 새 메시지가 오면 입력창 바로 위에 뜨는 버튼
export const newBelowWrap = css`
  position: relative;
  height: 0;
`;

export const newBelowBtn = css`
  position: absolute;
  left: 50%;
  bottom: 10px;
  transform: translateX(-50%);
  height: 32px;
  padding: 0 14px;
  border: 0;
  border-radius: 999px;
  background: ${ink};
  color: #fff;
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 6px 18px rgba(17, 24, 39, 0.18);
  cursor: pointer;
`;

export const readOnly = css`
  display: grid;
  gap: 2px;
  padding: 14px 16px;
  border-top: 1px solid ${line};
  background: ${soft};
  font-size: 13px;
  color: ${muted};
  word-break: keep-all;

  strong {
    color: ${text};
  }
`;

export const composer = css`
  display: grid;
  gap: 6px;
  padding: 10px 12px 12px;
  border-top: 1px solid ${line};
`;

export const untilNote = css`
  margin: 0;
  font-size: 12px;
  color: ${muted};
`;

export const error = css`
  margin: 0;
  font-size: 13px;
  color: #b42318;
`;

export const inputRow = css`
  display: flex;
  align-items: flex-end;
  gap: 8px;
`;

export const input = css`
  flex: 1;
  min-height: 44px;
  max-height: 140px;
  padding: 11px 14px;
  box-sizing: border-box;
  border: 1px solid ${line};
  border-radius: 14px;
  background: ${softer};
  font: inherit;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  field-sizing: content;
  transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;

  &:focus {
    outline: none;
    border-color: ${ink};
    background: #fff;
    box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.08);
  }
  ${MOBILE} {
    font-size: 16px;
  }
`;

export const sendBtn = css`
  flex-shrink: 0;
  height: 44px;
  padding: 0 16px;
  border: 0;
  border-radius: 14px;
  background: ${ink};
  color: #fff;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover:enabled {
    background: #2b3240;
  }
  &:disabled {
    background: ${soft};
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

export const counter = css`
  justify-self: end;
  font-size: 11px;
  color: ${muted};
`;

export const srOnly = css`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
`;

export const leaveText = css`
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  color: #4b5563;
  word-break: keep-all;

  strong {
    color: ${text};
  }
`;
