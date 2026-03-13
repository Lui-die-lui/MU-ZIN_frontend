import { css } from "@emotion/react";

export const card = css`
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 18px;
  border: 1px solid #ececec;
  border-radius: 16px;
  background: #fff;
`;

export const image = css`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  background: #f3f3f3;
  flex-shrink: 0;
`;

export const content = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const topRow = css`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const username = css`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
`;

export const major = css`
  font-size: 14px;
  color: #666;
`;

export const chips = css`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const chip = css`
  padding: 6px 10px;
  border-radius: 999px;
  background: #f5f5f5;
  font-size: 13px;
`;