import { css } from "@emotion/react";

const ink = "#111827";
const text = "#1b1d20";
const mutedColor = "#6b7280";
const line = "#e2e5e9";

export { page, header, title, desc } from "../Reviews/styles";

export const list = css`
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const item = css`
  display: grid;
  gap: 10px;
  padding: 18px;
  border: 1px solid ${line};
  border-radius: 14px;
  background: #fff;
`;

export const itemHead = css`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const who = css`
  display: grid;
  gap: 2px;
  flex: 1;
  min-width: 0;

  strong,
  a {
    font-size: 14px;
    font-weight: 800;
    color: ${text};
    text-decoration: none;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  a:hover {
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  span {
    font-size: 12px;
    color: ${mutedColor};
  }
`;

export const status = (st: "OPEN" | "REPLIED" | "CHAT") => css`
  flex-shrink: 0;
  padding: 3px 9px;
  border-radius: 999px;
  border: 1px solid ${st === "OPEN" ? ink : line};
  background: ${st === "OPEN" ? "#fff" : st === "CHAT" ? ink : "#f3f4f6"};
  color: ${st === "CHAT" ? "#fff" : text};
  font-size: 12px;
  font-weight: 700;
`;

export const content = css`
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  color: ${text};
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

export const reply = css`
  display: grid;
  gap: 4px;
  margin-left: 12px;
  padding: 12px 14px;
  border-left: 3px solid ${ink};
  border-radius: 0 10px 10px 0;
  background: #f7f8f9;

  p {
    margin: 0;
    font-size: 13px;
    line-height: 1.7;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
`;

export const replyLabel = css`
  font-size: 12px;
  font-weight: 800;
  color: ${mutedColor};
`;

export const replyBox = css`
  display: grid;
  gap: 8px;
`;

export const textarea = css`
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border: 1px solid #cfd4da;
  border-radius: 10px;
  font: inherit;
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;

  &:focus {
    outline: 3px solid rgba(17, 24, 39, 0.1);
    border-color: ${ink};
  }
`;

export const actions = css`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  flex-wrap: wrap;
`;

export const btn = (primary: boolean) => css`
  height: 38px;
  padding: 0 14px;
  border: 1px solid ${primary ? ink : "#cfd4da"};
  border-radius: 10px;
  background: ${primary ? ink : "#fff"};
  color: ${primary ? "#fff" : text};
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const muted = css`
  margin: 0;
  font-size: 12px;
  color: ${mutedColor};
`;

export const error = css`
  margin: 0;
  font-size: 13px;
  color: #b42318;
`;

export const stateBox = css`
  display: grid;
  justify-items: center;
  gap: 8px;
  padding: 28px 16px;
  border: 1px dashed #d8dce1;
  border-radius: 14px;
  font-size: 14px;
  color: ${mutedColor};
  text-align: center;
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

export const srOnly = css`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
`;
