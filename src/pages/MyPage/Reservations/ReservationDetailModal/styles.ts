import { css } from "@emotion/react";

const border = "#e2e5e9";
const text = "#1b1d20";
const muted = "#697078";

export const body = css`
  display: grid;
  gap: 20px;
  color: ${text};
  text-align: left;
`;

export const loading = css`
  padding: 32px 4px;
  color: ${muted};
  font-size: 14px;
`;

export const head = css`
  display: grid;
  justify-items: start;
  gap: 8px;
`;

export const lessonTitle = css`
  margin: 4px 0 0;
  font-size: 20px;
  font-weight: 800;
  line-height: 1.35;
  word-break: keep-all;
`;

export const when = css`
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #374151;
  font-variant-numeric: tabular-nums;
`;

export const guide = (tone: "info" | "warn" | "muted") => css`
  margin: 0;
  padding: 12px 14px;
  border-radius: 12px;
  background: ${tone === "warn" ? "#fffbeb" : tone === "info" ? "#f3f6ff" : "#f6f7f8"};
  color: ${tone === "warn" ? "#92400e" : tone === "info" ? "#1e3a8a" : "#4b5563"};
  font-size: 13px;
  line-height: 1.6;
`;

export const rows = css`
  display: grid;
  gap: 10px;
  margin: 0;

  div {
    display: grid;
    grid-template-columns: 88px minmax(0, 1fr);
    gap: 12px;
    font-size: 14px;
  }

  dt {
    color: ${muted};
  }

  dd {
    margin: 0;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    overflow-wrap: anywhere;
  }
`;

export const blockTitle = css`
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 700;
`;

export const message = css`
  margin: 0;
  padding: 12px 14px;
  border-radius: 12px;
  background: #f6f7f8;
  font-size: 14px;
  line-height: 1.65;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
`;

export const emptyText = css`
  margin: 0;
  color: #9aa0a6;
  font-size: 14px;
`;

// 되돌릴 수 없는 동작 확인
export const confirmBox = css`
  display: grid;
  gap: 8px;
  padding: 16px;
  border: 1px solid #fecaca;
  border-radius: 14px;
  background: #fef2f2;
  color: #7f1d1d;
  font-size: 13px;
  line-height: 1.6;

  strong {
    font-size: 15px;
    color: #991b1b;
  }
`;

export const reasonLabel = css`
  margin-top: 4px;
  font-size: 13px;
  font-weight: 700;
  color: ${text};

  span {
    font-weight: 500;
    color: ${muted};
  }
`;

export const reasonInput = css`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid ${border};
  border-radius: 10px;
  background: #fff;
  color: ${text};
  font: inherit;
  font-size: 14px;
  line-height: 1.6;
  box-sizing: border-box;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${text};
  }
`;

export const checkRow = css`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${text};
  cursor: pointer;

  input {
    width: 16px;
    height: 16px;
    accent-color: ${text};
  }
`;

export const footer = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
`;

export const footerRight = css`
  display: flex;
  gap: 8px;
  margin-left: auto;
`;

export const btn = (variant: "primary" | "ghost" | "danger") => css`
  height: 42px;
  padding: 0 16px;
  border-radius: 12px;
  border: 1px solid ${variant === "primary" ? text : variant === "danger" ? "#dc2626" : border};
  background: ${variant === "primary" ? text : variant === "danger" ? "#dc2626" : "#fff"};
  color: ${variant === "ghost" ? text : "#fff"};
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
