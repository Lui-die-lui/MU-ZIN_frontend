import { css } from "@emotion/react";

export const layout = css`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  width: 100%;
`;

export const locationButton = css`
  padding: 10px 14px;
  border-radius: 12px;
  border: none;
  background: #111;
  color: #fff;
  cursor: pointer;
`;