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

  @media (max-width: 760px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));

    > div:first-of-type { grid-column: 1 / -1; }
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const locationButtonWrap = css`
  width: fit-content;
`;

export const locationButton = css`
  height: 44px;
  padding: 0 14px;
  border-radius: 10px;
  border: 1px solid #d4d8dd;
  background: #f6f7f8;
  color: #40464d;
  cursor: pointer;
  white-space: nowrap;
  font-weight: 600;

  &:hover { background: #eceef0; }
`;
