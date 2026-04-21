import { css } from "@emotion/react";

// export const layout = css`
//   display: grid;
//   grid-template-columns: repeat(3, minmax(0, 1fr));
//   gap: 12px;
//   width: 100%;
// `;

// export const locationButton = css`
//   padding: 10px 14px;
//   border-radius: 12px;
//   border: none;
//   background: #111;
//   color: #fff;
//   cursor: pointer;
// `;

export const layout = css`
  display: grid;
  grid-template-columns: auto repeat(3, minmax(0, 1fr));
  gap: 12px;
  width: 100%;
  align-items: start;
`;

export const locationButtonWrap = css`
  width: fit-content;
`;

export const locationButton = css`
  padding: 12px 14px;
  border-radius: 12px;
  border: none;
  background: #5c5c5c;
  color: #fff;
  cursor: pointer;
  white-space: nowrap;
`;