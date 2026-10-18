import { css } from "@emotion/react";

const muted = "#697078";

export const page = css`
  width: min(1120px, 100%); margin: 0 auto; padding: 40px 8px 72px;
  color: #1b1d20; text-align: left;
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
export const resultSection = css`margin-top: 34px; width: 100%;`;
export const resultHeader = css`
  display: flex; align-items: flex-end; justify-content: space-between; gap: 16px; margin-bottom: 16px;
`;
export const resultLabel = css`color: ${muted}; font-size: 12px; font-weight: 700;`;
export const resultTitle = css`margin: 4px 0 0; font-size: 22px; letter-spacing: -0.025em;`;
export const filterCount = css`color: ${muted}; font-size: 13px;`;
export const resultBody = css`
  transition: opacity 150ms ease;
  &[aria-busy="true"] { opacity: 0.6; }
`;
export const emptyState = css`
  display: flex; min-height: 160px; flex-direction: column; align-items: center; justify-content: center;
  gap: 8px; padding: 24px; border: 1px dashed #d5d9de; border-radius: 14px;
  background: #fafafa; color: ${muted}; text-align: center;
  strong { color: #34383d; font-size: 15px; }
`;
export const loadingState = css`
  ${emptyState}; color: ${muted};
`;
export const retryButton = css`
  margin-top: 8px; padding: 9px 14px; border: 1px solid #cfd4da; border-radius: 8px;
  background: #fff; color: #1b1d20;
`;
export const loadMore = css`
  min-height: 48px; display: grid; place-items: center; padding: 8px;
  color: #7c8289; font-size: 13px;
`;

export const resultTools = css`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

// 팔로우한 아티스트만 보기
export const followedChip = (on: boolean) => css`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 36px;
  padding: 0 14px;
  border: 1px solid ${on ? "#111827" : "#cfd4da"};
  border-radius: 999px;
  background: ${on ? "#f3f4f6" : "#fff"};
  color: ${on ? "#111827" : "#1b1d20"};
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  svg {
    color: ${on ? "#111827" : "#9ca3af"};
  }
  &:hover {
    border-color: ${on ? "#111827" : "#9ca3af"};
  }
`;
