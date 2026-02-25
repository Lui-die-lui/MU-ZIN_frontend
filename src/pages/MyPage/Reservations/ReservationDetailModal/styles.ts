import { css } from "@emotion/react";

export const body = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const row = css`
  display: flex;
  justify-content: space-between;
  gap: 12px;
`;

export const rowLabel = css`
  color: #64748b;
  font-size: 12px;
  flex: 0 0 auto;
`;

export const rowValue = css`
  font-size: 13px;
  text-align: right;
  overflow-wrap: anywhere;
`;

export const block = css`
  margin-top: 8px;
  padding-top: 10px;
  border-top: 1px solid #e5e7eb;
`;

export const blockTitle = css`
  font-weight: 800;
  font-size: 13px;
  margin-bottom: 6px;
`;

export const blockText = css`
  font-size: 13px;
  line-height: 1.5;
  color: #111827;
`;

export const hint = css`
  margin: 8px 0 0;
  font-size: 12px;
  color: #64748b;
`;