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
  font-weight: 800;
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
    height: calc(100vh - 120px);
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

export const roomText = css`
  display: grid;
  gap: 4px;
  flex: 1;
  min-width: 0;
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
  font-weight: 700;
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
  font-weight: 800;
  line-height: 20px;
  text-align: center;
`;

export const emptyRoom = css`
  display: grid;
  place-items: center;
  flex: 1;
  font-size: 14px;
  color: ${muted};
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
  font-weight: 700;
  color: ${text};
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;
`;

// ---------- 대화방 ----------
export const room = css`
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
    font-weight: 800;
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
  font-weight: 700;
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
  margin: 14px 0 10px;
  text-align: center;
  font-size: 12px;
  color: ${muted};
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

export const msgRow = (mine: boolean) => css`
  display: flex;
  flex-direction: ${mine ? "row-reverse" : "row"};
  align-items: flex-end;
  gap: 6px;
  margin: 4px 0;
`;

export const bubble = (mine: boolean) => css`
  max-width: min(70%, 520px);
  margin: 0;
  padding: 6px 12px;
  border-radius: ${mine ? "14px 14px 4px 14px" : "14px 14px 14px 4px"};
  background: ${mine ? ink : "#fff"};
  border: 1px solid ${mine ? ink : line};
  color: ${mine ? "#fff" : text};
  font-size: 14px;
  line-height: 1.45;
  white-space: pre-wrap;
  overflow-wrap: anywhere;

  &:focus-visible {
    outline: 3px solid rgba(17, 24, 39, 0.25);
    outline-offset: 2px;
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
  font-weight: 600;
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
  flex-shrink: 0;
  font-size: 11px;
  color: #9ca3af;
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
  border: 1px solid #cfd4da;
  border-radius: 12px;
  font: inherit;
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  field-sizing: content;

  &:focus {
    outline: 3px solid rgba(17, 24, 39, 0.1);
    border-color: ${ink};
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
  border-radius: 12px;
  background: ${ink};
  color: #fff;
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
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
