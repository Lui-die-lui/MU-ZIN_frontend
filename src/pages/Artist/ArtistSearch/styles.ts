import { css } from "@emotion/react";

export const searchSection = css`
  display: flex; flex-direction: column; gap: 22px; width: 100%; padding: 24px;
  box-sizing: border-box; border: 1px solid #e2e5e9; border-radius: 18px; background: #fff;
  box-shadow: 0 8px 30px rgba(23, 27, 31, 0.045);
  @media (max-width: 720px) { gap: 20px; padding: 18px; border-radius: 14px; }
`;
export const fieldLabel = css`color: #3f444a; font-size: 13px; font-weight: 700;`;
export const keywordGroup = css`
  display: flex; flex-direction: column; gap: 8px; min-width: 0;
  input { width: 100%; height: 46px; box-sizing: border-box; border-radius: 10px; }
`;
export const filterGrid = css`
  display: grid; grid-template-columns: minmax(220px, 0.7fr) minmax(420px, 1.3fr); gap: 12px;
  @media (max-width: 860px) { grid-template-columns: 1fr; }
`;
export const filterGroup = css`
  display: flex; flex-direction: column; gap: 8px; min-width: 0;
  > div, > div > button { width: 100%; }
`;
export const instrumentGroup = css`
  ${filterGroup};
  > div { display: grid; grid-template-columns: minmax(150px, 0.7fr) minmax(190px, 1fr); }
  @media (max-width: 520px) { > div { grid-template-columns: 1fr; } }
`;
export const regionGroup = css`
  display: flex; flex-direction: column; gap: 10px; padding-top: 20px; border-top: 1px solid #eef0f2;
`;
export const buttonGroup = css`display: flex; justify-content: flex-end; gap: 10px;`;
const actionButton = css`
  height: 46px; padding: 0 22px; border-radius: 10px; font: inherit; font-size: 14px; font-weight: 700;
  &:focus-visible { outline: 3px solid rgba(17, 24, 39, 0.18); outline-offset: 2px; }
`;
export const searchButton = css`
  ${actionButton}; min-width: 146px; border: 1px solid #111827; background: #111827; color: #fff;
  &:hover:not(:disabled) { background: #2b3442; }
  &:disabled { cursor: wait; opacity: 0.65; }
`;
export const resetButton = css`
  ${actionButton}; border: 1px solid #d4d8dd; background: #fff; color: #4f555c;
  &:hover { background: #f6f7f8; }
`;
