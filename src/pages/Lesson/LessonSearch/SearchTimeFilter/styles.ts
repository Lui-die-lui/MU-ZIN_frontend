import { css } from "@emotion/react";

export const wrap = css`
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
  width: 100%;
`;

export const row = css`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  min-width: fit-content;
`;
export const label = css`
  font-weight: 700;
  font-size: 13px;
  color: #222;
  white-space: nowrap;
`;

export const inline = css`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const gap = css`
  width: 10px;
`;