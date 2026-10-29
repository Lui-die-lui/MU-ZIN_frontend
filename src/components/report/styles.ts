import { css } from "@emotion/react";
import { faint, ink, line, mist, sub } from "../../constants/uiTone";
import { DANGER } from "../common/CommonModal/modalButtons";

export const lead = css`
  margin: 0 0 14px;
  font-size: 14px;
  line-height: 1.6;
  color: ${sub};

  strong {
    color: ${ink};
  }
`;

export const legend = css`
  display: block;
  margin-bottom: 8px;
  padding: 0;
  font-size: 13px;
  font-weight: 600;
  color: ${ink};
`;

export const reasons = css`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0 0 16px;
  padding: 0;
  border: 0;
`;

export const reason = (on: boolean) => css`
  display: inline-flex;
  align-items: center;
  height: 36px;
  padding: 0 14px;
  border-radius: 999px;
  background: ${on ? ink : mist};
  color: ${on ? "#fff" : ink};
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;

  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }
  &:focus-within {
    outline: 3px solid rgba(23, 25, 28, 0.35);
    outline-offset: 2px;
  }
`;

export const textarea = css`
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border: 1px solid ${line};
  border-radius: 12px;
  font: inherit;
  font-size: 14px;
  line-height: 1.5;
  resize: vertical;

  &::placeholder {
    color: ${faint};
  }
  &:focus {
    outline: none;
    border-color: ${ink};
  }
`;

export const error = css`
  margin: 8px 0 0;
  font-size: 13px;
  color: ${DANGER};
`;

// 작은 글자 버튼 (리뷰 옆 "신고" 등)
export const textButton = css`
  padding: 4px 6px;
  border: 0;
  background: none;
  color: ${faint};
  font: inherit;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    color: ${sub};
    text-decoration: underline;
  }
  &:focus-visible {
    outline: 2px solid rgba(23, 25, 28, 0.35);
    border-radius: 6px;
  }
`;
