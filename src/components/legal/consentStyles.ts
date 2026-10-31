import { css } from "@emotion/react";
import { faint, focusRing, ink, line, sub } from "../../constants/uiTone";

export const box = css`
  display: grid;
  gap: 10px;
  margin: 20px 0 16px;
  padding: 16px;
  border: 0;
  border-radius: 14px;
  box-shadow: inset 0 0 0 1px ${line};
  text-align: left;
`;

export const legend = css`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
`;

const check = css`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;

  input {
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    margin: 0;
    accent-color: ${ink};
  }
`;

export const all = css`
  ${check};
  padding-bottom: 10px;
  border-bottom: 1px solid ${line};
  font-size: 15px;
  font-weight: 600;
  color: ${ink};
`;

export const list = css`
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const item = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

export const label = css`
  ${check};
  min-width: 0;
  font-size: 14px;
  color: ${ink};
  word-break: keep-all;
`;

export const required = css`
  color: ${sub};
  font-weight: 600;
`;

export const view = css`
  flex-shrink: 0;
  font-size: 12px;
  color: ${faint};
  text-decoration: underline;
  text-underline-offset: 3px;
  border-radius: 4px;
  ${focusRing};

  @media (hover: hover) {
    &:hover {
      color: ${ink};
    }
  }
  &:active {
    color: ${ink};
  }
`;
