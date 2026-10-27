import { css } from "@emotion/react";

const text = "#1b1d20";
const mutedColor = "#6b7280";

export const closedToggle = css`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: fit-content;
  font-size: 13px;
  color: ${mutedColor};
  cursor: pointer;

  input {
    width: 16px;
    height: 16px;
    accent-color: #111827;
  }
`;

export const detail = css`
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: ${text};
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

// 신고 당시 내용 (채팅은 여러 줄)
export const snapshot = css`
  display: grid;
  gap: 6px;
  padding: 12px 14px;
  border-radius: 10px;
  background: #f7f8f9;

  strong {
    font-size: 12px;
    color: ${mutedColor};
  }
  pre {
    margin: 0;
    max-height: 220px;
    overflow-y: auto;
    font-family: inherit;
    font-size: 13px;
    line-height: 1.6;
    color: ${text};
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
`;

// 버튼처럼 보이는 링크 (회원 정보로 이동)
export const linkBtn = css`
  display: inline-flex;
  align-items: center;
  height: 38px;
  padding: 0 14px;
  border: 1px solid #cfd4da;
  border-radius: 10px;
  background: #fff;
  color: ${text};
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
`;
