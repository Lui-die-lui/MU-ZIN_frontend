import { css } from "@emotion/react";

export const inputGroup = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const label = css`
  font-size: 13px;
  font-weight: 600;
  color: #374151;
`;

export const input = (hasError?: string) => css`
  width: 100%;
  height: 44px;
  padding: 0 14px;
  border-radius: 12px;
  border: 1px solid ${hasError ? "#ef4444" : "#d7dfe7"};
  background-color: #eaf2ff;
  font-size: 14px;
  color: #111827;
  outline: none;
  box-sizing: border-box;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    border-color: ${hasError ? "#ef4444" : "#4f8cff"};
    box-shadow: 0 0 0 3px
      ${hasError ? "rgba(239, 68, 68, 0.12)" : "rgba(79, 140, 255, 0.12)"};
  }
`;

export const errorText = css`
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  color: #ef4444;
`;

