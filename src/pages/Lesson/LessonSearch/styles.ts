import { css } from "@emotion/react";


const border = "#e2e5e9";
const text = "#1b1d20";
const muted = "#697078";

export const wrap = css`
  width: min(1120px, 100%);
  margin: 0 auto;
  padding: 40px 8px 72px;
  color: ${text};
  text-align: left;
  @media (max-width: 720px) { padding: 24px 0 48px; }
`;
export const pageHeader = css`margin-bottom: 28px;`;
export const eyebrow = css`
  display: block; margin-bottom: 10px; color: #777d84; font-size: 11px;
  font-weight: 800; letter-spacing: 0.14em;
`;
export const pageTitle = css`
  margin: 0; font-size: clamp(28px, 4vw, 40px); line-height: 1.18; letter-spacing: -0.04em;
`;
export const pageDescription = css`margin: 12px 0 0; color: ${muted}; font-size: 15px;`;

export const filterPanel = css`
  display: flex; flex-direction: column; gap: 22px; padding: 24px;
  border: 1px solid ${border}; border-radius: 18px; background: #fff;
  box-shadow: 0 8px 30px rgba(23, 27, 31, 0.045);
  @media (max-width: 720px) { gap: 20px; padding: 18px; border-radius: 14px; }
`;
export const primaryRow = css`
  display: grid; grid-template-columns: minmax(0, 1fr) 190px; gap: 12px;
  @media (max-width: 640px) { grid-template-columns: 1fr; }
`;
export const keywordField = css`
  display: flex; min-width: 0; flex-direction: column; gap: 8px;
`;
export const modeField = keywordField;
export const fieldLabel = css`color: #3f444a; font-size: 13px; font-weight: 700;`;
const control = css`
  width: 100%; height: 46px; box-sizing: border-box; border: 1px solid #cfd4da;
  border-radius: 10px; background: #fff; color: ${text}; font: inherit; font-size: 14px;
  &:focus { outline: 3px solid rgba(17, 24, 39, 0.1); border-color: #111827; }
`;
export const input = css`
  ${control}; padding: 0 14px;
  &::placeholder { color: #989da3; }
`;
// 수업 방식 드롭다운 (디자인은 components/common/SelectDropdown 공통)
export const select = css`width: 100%;`; // SelectDropdown 바깥 너비
export const filterGrid = css`
  display: grid; grid-template-columns: minmax(220px, 0.7fr) minmax(420px, 1.3fr); gap: 12px;
  @media (max-width: 860px) { grid-template-columns: 1fr; }
`;
export const filterGroup = css`
  display: flex; flex-direction: column; gap: 8px; min-width: 0;
  > div, > div > button { width: 100%; }
`;
export const filterGroupWide = css`
  ${filterGroup};
  > div { display: grid; grid-template-columns: minmax(150px, 0.7fr) minmax(190px, 1fr); }
  @media (max-width: 520px) { > div { grid-template-columns: 1fr; } }
`;
export const filterBlock = css`
  display: flex; flex-direction: column; gap: 10px; padding-top: 20px; border-top: 1px solid #eef0f2;
`;
export const blockHeading = css`display: flex; align-items: baseline; gap: 10px; flex-wrap: wrap;`;
export const optionalText = css`color: #888e95; font-size: 12px;`;
export const validationMessage = css`margin: 0; color: #b42318; font-size: 13px;`;
export const actions = css`display: flex; justify-content: flex-end; gap: 10px;`;
const actionButton = css`
  height: 46px; padding: 0 22px; border-radius: 10px; font: inherit; font-size: 14px; font-weight: 700;
  &:focus-visible { outline: 3px solid rgba(17, 24, 39, 0.18); outline-offset: 2px; }
`;
export const searchButton = css`
  ${actionButton}; min-width: 132px; border: 1px solid #111827; background: #111827; color: #fff;
  &:hover:not(:disabled) { background: #2b3442; }
  &:disabled { cursor: wait; opacity: 0.65; }
`;
export const resetButton = css`
  ${actionButton}; border: 1px solid #d4d8dd; background: #fff; color: #4f555c;
  &:hover { background: #f6f7f8; }
`;
export const resultSection = css`margin-top: 34px;`;
export const resultHeader = css`
  display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; margin-bottom: 16px;
`;
export const resultLabel = css`color: ${muted}; font-size: 12px; font-weight: 700;`;
export const resultTitle = css`margin: 4px 0 0; font-size: 22px; letter-spacing: -0.025em;`;
export const filterCount = css`color: ${muted}; font-size: 13px;`;
export const emptyState = css`
  display: flex; min-height: 160px; flex-direction: column; align-items: center; justify-content: center;
  gap: 8px; padding: 24px; border: 1px dashed #d5d9de; border-radius: 14px;
  background: #fafafa; color: ${muted}; text-align: center;
  strong { color: #34383d; font-size: 15px; }
`;
export const retryButton = css`
  margin-top: 8px; padding: 9px 14px; border: 1px solid #cfd4da; border-radius: 8px;
  background: #fff; color: ${text};
`;
export const list = css`
  display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px;
  grid-auto-rows: 1fr; /* 모든 카드 같은 높이 (가장 큰 카드 기준) */
  &[aria-busy="true"] { opacity: 0.6; }
  @media (max-width: 720px) { grid-template-columns: 1fr; }
`;
export const card = css`
  display: flex; min-width: 0; flex-direction: column; align-items: stretch; padding: 20px;
  border: 1px solid ${border}; border-radius: 14px; background: #fff; color: ${text}; text-align: left;
  transition: border-color 150ms ease, transform 150ms ease, box-shadow 150ms ease;
  &:hover { border-color: #aeb4bc; box-shadow: 0 10px 24px rgba(20, 25, 30, 0.07); transform: translateY(-1px); }
  &:focus-visible { outline: 3px solid rgba(17, 24, 39, 0.16); outline-offset: 2px; }
`;
export const cardTop = css`display: flex; align-items: center; justify-content: space-between; gap: 12px;`;
export const instrumentBadge = css`
  padding: 5px 8px; border-radius: 6px; background: #f0f1f2; color: #4c5157;
  font-size: 12px; font-weight: 700;
`;
export const cardArrow = css`color: #6e747b; font-size: 18px;`;
export const cardTitle = css`
  margin: 15px 0 0; font-size: 18px; line-height: 1.4; letter-spacing: -0.02em;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap; /* 제목은 한 줄 */
`;
export const cardDescription = css`
  display: -webkit-box; overflow: hidden; margin: 7px 0 0; color: ${muted}; font-size: 13px;
  line-height: 1.55; -webkit-box-orient: vertical; -webkit-line-clamp: 2;
  min-height: calc(13px * 1.55 * 2); /* 소개가 짧거나 없어도 2줄 자리 */
`;
export const cardMeta = css`
  display: flex; align-items: center; gap: 7px; margin-top: auto; padding-top: 18px; color: #5f666d; font-size: 13px; /* 맨 아래로 */
  strong { color: ${text}; }
`;
export const regionText = css`margin-top: 9px; color: #7c8289; font-size: 12px;`;
export const loadMore = css`
  min-height: 48px; display: grid; place-items: center; padding: 8px;
  color: #7c8289; font-size: 13px;
`;
