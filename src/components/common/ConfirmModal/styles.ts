import { css } from "@emotion/react";

export const ghostBtn = css`
  height: 38px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: #fff;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const primaryBtn = css`
  height: 38px;
  padding: 0 14px;
  border-radius: 10px;
  border: none;
  background: #111827;
  color: #fff;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;