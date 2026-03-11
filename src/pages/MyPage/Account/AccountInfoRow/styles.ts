import { css } from "@emotion/react";

export const row = css`
  display: grid;
  grid-template-columns: 160px 1fr auto;
  align-items: center;
  gap: 16px;
  padding: 24px 28px;
  border-bottom: 1px solid #eeeeee;
  background-color: #fcfcfc;

  &:last-child {
    border-bottom: none;
  }
`;

export const label = css`
  font-size: 18px;
  font-weight: 600;
  color: #111;
`;

export const content = css`
  display: flex;
  font-size: 16px;
  color: #333;
`;

export const action = css`
  display: flex;
  align-items: center;
  gap: 12px;
`;
