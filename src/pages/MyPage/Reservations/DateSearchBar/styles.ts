import { css } from "@emotion/react";

export const bar = css`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;

  padding: 12px;
  border: 1px solid #eee;
  border-radius: 14px;
  background: #fff;
`;

export const select = css`
  height: 36px;
  padding: 0 10px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #fff;
  font-size: 14px;
  outline: none;

  &:focus {
    border-color: #bbb;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const searchBtn = css`
  height: 36px;
  padding: 0 14px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: #111;
  color: #fff;
  font-size: 14px;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;