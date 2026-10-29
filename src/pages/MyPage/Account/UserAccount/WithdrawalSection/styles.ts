import { css } from "@emotion/react";
import { tone } from "../../styles";

export const openButton = css`
  height: 38px;
  padding: 0 16px;
  border: 1px solid #d8aaa6;
  border-radius: 12px;
  background: #fff;
  color: ${tone.danger};
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  &:hover { background: #fff7f6; }
  &:focus-visible { outline: 3px solid rgba(192, 54, 44, 0.18); outline-offset: 2px; }
`;

export const body = css`
  display: grid;
  gap: 18px;
`;

export const warning = css`
  padding: 14px 16px;
  border-radius: 12px;
  background: #fff5f4;
  color: #6f2b26;
  font-size: 13px;
  line-height: 1.55;

  ul { margin: 8px 0 0; padding-left: 18px; }
`;

export const field = css`
  display: grid;
  gap: 8px;
  font-size: 14px;
  color: ${tone.text};

  input {
    height: 42px;
    box-sizing: border-box;
    padding: 0 12px;
    border: 1px solid ${tone.border};
    border-radius: 10px;
    font: inherit;
  }
  input:focus { outline: 3px solid ${tone.ring}; border-color: ${tone.text}; }
`;

export const error = css`
  margin: 0;
  color: ${tone.danger};
  font-size: 13px;
  line-height: 1.5;
`;

export const footer = css`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;
