import styled from "@emotion/styled";
import { css } from "@emotion/react";


export const form = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const label = css`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  color: #334155;
`;

export const input = css`
  height: 40px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 0 12px;
  outline: none;

  &:focus {
    border-color: #94a3b8;
  }
`;

export const error = css`
  margin-top: 6px;
  font-size: 12px;
  color: #dc2626;
`;

export const footerRow = css`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
`;

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
