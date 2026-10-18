import { css } from "@emotion/react";

export const wrap = css`
  display: grid;
  justify-items: center;
  gap: 8px;
  padding: 28px 4px 8px;
  text-align: center;
`;

export const check = css`
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #f3f4f6;
  color: #111827;
  font-size: 26px;
  font-weight: 800;
`;

export const title = css`
  margin: 8px 0 0;
  font-size: 19px;
  color: #1b1d20;
`;

export const desc = css`
  margin: 0;
  font-size: 14px;
  color: #697078;
`;

export const summary = css`
  display: grid;
  gap: 4px;
  width: 100%;
  margin-top: 14px;
  padding: 16px;
  border: 1px solid #e2e5e9;
  border-radius: 14px;
  background: #fafafa;
  font-size: 14px;
  color: #1b1d20;
  text-align: left;
  box-sizing: border-box;
`;

export const meta = css`
  font-size: 13px;
  color: #697078;
`;

export const note = css`
  margin: 8px 0 0;
  font-size: 13px;
  line-height: 1.6;
  color: #697078;
`;
