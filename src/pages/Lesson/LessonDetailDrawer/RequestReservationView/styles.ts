import { css } from "@emotion/react";

export const section = css`
  display: grid;
  gap: 12px;
  margin-top: 20px;
`;

export const requestBox = css`
  border: 1px solid #eee;
  border-radius: 14px;
  background: #fff;
  padding: 14px;
  display: grid;
  gap: 12px;
`;

export const requestTitle = css`
  font-weight: 800;
  font-size: 15px;
`;

export const requestSub = css`
  font-size: 13px;
  color: #666;
`;

export const textarea = css`
  width: 100%;
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 12px;
  font-size: 14px;
  line-height: 1.4;
  resize: none;
  outline: none;

  &:focus {
    border-color: #bbb;
  }
`;

export const errorText = css`
  color: #d32f2f;
  font-size: 13px;
`;

export const requestBtnRow = css`
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 10px;
`;

export const baseBtn = css`
  height: 44px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const backBtn = css`
  ${baseBtn};
  border: 1px solid #ddd;
  background: #fff;
  color: #111;
`;

export const submitBtn = css`
  ${baseBtn};
  border: none;
  background: #111;
  color: #fff;
`;
