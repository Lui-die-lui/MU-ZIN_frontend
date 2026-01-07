import { css } from "@emotion/react";

export const page = css`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const headerRow = css`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
   text-align: left;
  gap: 12px;
`;


export const title = css`
  margin: 0;
  font-size: 20px;
`;

export const sub = css`
  margin: 6px 0 0;
  font-size: 13px;
  opacity: 0.75;
`;

export const headerActions = css`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const sortSelect = css`
  height: 36px;
  padding: 0 10px;
  border: 1px solid #e5e5e5;
  border-radius: 10px;
  background: #fff;
`;

export const primaryBtn = css`
  height: 36px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid #111;
  background: #111;
  color: #fff;
  cursor: pointer;
`;

export const hint = css`
  font-size: 12px;
  opacity: 0.7;
`;