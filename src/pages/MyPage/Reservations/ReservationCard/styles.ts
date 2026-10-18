import { css } from "@emotion/react";

const border = "#e2e5e9";
const text = "#1b1d20";
const muted = "#697078";

// 날짜 | 레슨 정보 | 상태·버튼
export const card = (past: boolean) => css`
  display: grid;
  grid-template-columns: 112px minmax(0, 1fr) auto;
  align-items: center;
  gap: 16px;
  padding: 16px 18px;
  border: 1px solid ${border};
  border-radius: 14px;
  background: #fff;
  color: ${text};
  text-align: left;
  cursor: pointer;
  opacity: ${past ? 0.75 : 1};
  transition: border-color 150ms ease, box-shadow 150ms ease;

  &:hover {
    border-color: #aeb4bc;
    box-shadow: 0 6px 18px rgba(20, 25, 30, 0.06);
  }

  &:focus-visible {
    outline: 3px solid rgba(17, 24, 39, 0.16);
    outline-offset: 2px;
  }

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 10px 12px;
  }
`;

export const dateBox = css`
  display: grid;
  gap: 2px;
  padding-right: 16px;
  border-right: 1px solid #f0f1f2;

  @media (max-width: 640px) {
    grid-column: 1 / -1;
    display: flex;
    gap: 8px;
    padding-right: 0;
    border-right: 0;
  }
`;

export const dateDay = css`
  font-size: 14px;
  font-weight: 700;
`;

export const dateTime = css`
  font-size: 13px;
  color: ${muted};
  font-variant-numeric: tabular-nums;
`;

export const info = css`
  display: grid;
  gap: 6px;
  min-width: 0;
`;

export const title = css`
  overflow: hidden;
  font-size: 15px;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const meta = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: ${muted};

  span:not(:last-child)::after {
    content: "·";
    margin-left: 6px;
    color: #d1d5db;
  }
`;

export const msgTag = css`
  color: #111827;
  font-weight: 600;
`;

export const side = css`
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: flex-end;
`;

export const actions = css`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const actionBtn = (variant: "primary" | "ghost" | "danger") => css`
  height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid ${variant === "primary" ? text : variant === "danger" ? "#fecaca" : border};
  background: ${variant === "primary" ? text : variant === "danger" ? "#fef2f2" : "#fff"};
  color: ${variant === "primary" ? "#fff" : variant === "danger" ? "#b91c1c" : text};
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
