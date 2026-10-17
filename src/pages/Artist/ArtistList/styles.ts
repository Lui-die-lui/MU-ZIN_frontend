import { css } from "@emotion/react";

export const list = css`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  width: 100%;

  @media (max-width: 820px) {
    grid-template-columns: 1fr;
  }
`;

export const empty = css`
  min-height: 160px;
  padding: 40px 20px;
  box-sizing: border-box;
  border: 1px dashed #d5d9de;
  border-radius: 14px;
  background: #fafafa;
  text-align: center;
  color: #777;
`;
