import styled from "@emotion/styled";
import { css } from "@emotion/react";

export const chip = (active: boolean) => css`
  height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid ${active ? "#111" : "#e6e6e6"};
  background: ${active ? "#111" : "#fff"};
  color: ${active ? "#fff" : "#111"};
  font-size: 13px;
  cursor: pointer;
  user-select: none;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;

export const row = css`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;
