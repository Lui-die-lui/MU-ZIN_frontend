import { css } from "@emotion/react";

export const card = (selected: boolean) => css`
  width: 100%;
  text-align: left;
  border: 1px solid ${selected ? "#222" : "#ddd"};
  border-radius: 16px;
  padding: 16px;
  background-color: ${selected ? "#fafafa" : "#fff"};
  cursor: pointer;
`;