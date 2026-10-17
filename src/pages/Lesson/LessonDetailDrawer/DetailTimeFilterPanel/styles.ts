import { css } from "@emotion/react";

export const wrap = css`
  display: grid;
  gap: 16px;
`;

export const btnRow = css`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

export const ghostBtn = css`
  height: 38px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid #e2e5e9;
  background: #fff;
  color: #1b1d20;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
`;

export const solidBtn = css`
  height: 38px;
  padding: 0 16px;
  border-radius: 10px;
  border: 1px solid #1b1d20;
  background: #1b1d20;
  color: #fff;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
`;
