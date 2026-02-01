import { css } from "@emotion/react";

export const wrap = css`
  display: grid;
  gap: 12px;
`;

export const btnRow = css`
  display: flex;
  gap: 8px;
  justify-content: flex-end;
`;

export const ghostBtn = css`
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #e6e6e6;
  background: #fff;
  cursor: pointer;
`;

export const solidBtn = css`
  padding: 10px 14px;
  border-radius: 12px;
  border: none;
  background: #111;
  color: #fff;
  cursor: pointer;
`;
