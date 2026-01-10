import { css } from "@emotion/react";

export const chipWrap = css`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

export const chip = css`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #fff;
  font-size: 13px;
  cursor: pointer;
`;

export const chipX = css`
  font-weight: 700;
  opacity: 0.7;
`;


export const page = css`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const card = css`
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const h2 = css`
  font-size: 14px;
  font-weight: 800;
  margin: 0;
`;

export const hint = css`
  font-size: 12px;
  color: #64748b;
  margin: 0;
`;

export const state = css`
  padding: 12px;
  color: #64748b;
`;