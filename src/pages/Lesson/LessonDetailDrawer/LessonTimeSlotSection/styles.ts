import { css } from "@emotion/react";

export const wrap = css`
  display: grid;
  gap: 12px;
`;

export const header = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const title = css`
  margin: 0;
  font-size: 16px;
  font-weight: 800;
`;

export const panelBox = css`
  border: 1px solid #eee;
  border-radius: 14px;
  padding: 12px;
  background: #fff;
`;

export const emptyBox = css`
  border: 1px dashed #ddd;
  border-radius: 14px;
  padding: 14px;
  background: #fafafa;
`;

export const emptyTitle = css`
  font-weight: 800;
  margin-bottom: 6px;
`;

export const emptyDesc = css`
  opacity: 0.8;
  font-size: 13px;
`;

export const resultBox = css`
  display: grid;
  gap: 12px;
`;

export const hint = css`
  opacity: 0.8;
`;

export const reserveBtn = css`
  padding: 12px 14px;
  border-radius: 14px;
  border: none;
  background: #111;
  color: #fff;
  cursor: pointer;

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;