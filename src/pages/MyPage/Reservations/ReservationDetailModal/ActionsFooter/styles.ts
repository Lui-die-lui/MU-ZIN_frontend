import { css } from "@emotion/react";

export const footer = css`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 15px 9px;
`;

export const right = css`
  display: flex;
  gap: 8px;
`;

export const btnBase = css`
  height: 38px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #fff;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const ghost = css`
  ${btnBase}
`;

export const primary = css`
  ${btnBase};
  border: none;
  background: #111827;
  color: #fff;
`;

export const danger = css`
  ${btnBase};
  border: none;
  background: #d84646;
  color: #fff;
`;
