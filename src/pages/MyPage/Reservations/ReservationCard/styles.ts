import { css } from "@emotion/react";

export const list = css`
  display: grid;
  gap: 12px;
`;

export const skeleton = css`
  height: 96px;
  border-radius: 14px;
  background: #f3f3f3;
`;

export const empty = css`
  border: 1px dashed #ddd;
  border-radius: 14px;
  padding: 18px;
  background: #fafafa;
`;

export const emptyTitle = css`
  font-weight: 700;
  margin-bottom: 6px;
`;

export const card = css`
  text-align: left;
  border: 1px solid #eee;
  background: #fff;
  border-radius: 14px;
  padding: 14px;
  cursor: pointer;

  &:hover {
    border-color: #ddd;
  }
`;

export const cardTop = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const titleRow = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

export const title = css`
  font-size: 15px;
`;

export const metaRow = css`
  font-size: 13px;
  opacity: 0.82;
  display: flex;
  gap: 6px;
  align-items: center;
`;

export const rightActions = css`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;