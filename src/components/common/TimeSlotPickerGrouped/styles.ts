import { css } from "@emotion/react";

export const wrap = css`
  display: grid;
  gap: 12px;
`;

export const monthCard = css`
  padding: 14px;
  border: 1px solid #eee;
  border-radius: 16px;
  background: #fff;
`;

export const monthTitle = css`
  text-align: center;
  font-weight: 800;
  margin-bottom: 10px;
`;

export const dayGrid = css`
  display: grid;
  gap: 14px;
`;

export const dayRow = css`
  display: grid;
  grid-template-columns: 52px 1fr;
  gap: 12px;
  align-items: start;
`;

export const dayLabel = css`
  opacity: 0.75;
  padding-top: 6px;
`;

export const emptyText = css`
  margin: 0;
  opacity: 0.7;
`;