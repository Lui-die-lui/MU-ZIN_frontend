import { css } from "@emotion/react";

export const layout = css`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  width: 100%;
`;