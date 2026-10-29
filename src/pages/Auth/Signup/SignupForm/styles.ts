import { css } from "@emotion/react";

export const ruleList = css`
  display: flex;
  flex-wrap: wrap;
  gap: 4px 14px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const ruleItem = (ok: boolean) => css`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: ${ok ? "#111827" : "#8b9096"};
  font-weight: ${ok ? 600 : 400};
  transition: color 0.15s ease;
`;

export const okText = css`
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  color: #111827;
`;
