import { css, keyframes } from "@emotion/react";

export const list = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

export const skeleton = css`
  height: 132px;
  border-radius: 18px;
  background: linear-gradient(90deg, #f3f4f6 0%, #f9fafb 50%, #f3f4f6 100%);
  background-size: 800px 100%;
  animation: ${shimmer} 1.2s linear infinite;
`;

// 빈 목록 / 검색 결과 없음 / 오류
export const empty = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 48px 20px;
  border: 1px dashed #d1d5db;
  border-radius: 18px;
  background: #fafafa;
  text-align: center;
`;

export const emptyTitle = css`
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
`;

export const emptyDesc = css`
  margin: 0;
  font-size: 14px;
  color: #6b7280;
`;

export const emptyBtn = (primary: boolean) => css`
  margin-top: 8px;
  height: 40px;
  padding: 0 16px;
  border-radius: 10px;
  border: 1px solid ${primary ? "#111827" : "#d1d5db"};
  background: ${primary ? "#111827" : "#fff"};
  color: ${primary ? "#fff" : "#111827"};
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
`;

export const card = (busy: boolean) => css`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px 22px;
  border: 1px solid #e8e8e8;
  border-radius: 18px;
  background: #fff;
  cursor: pointer;
  opacity: ${busy ? 0.7 : 1};
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  @media (hover: hover) {
    &:hover {
      border-color: #d1d5db;
      box-shadow: 0 4px 14px rgba(17, 24, 39, 0.06);
    }
  }
  &:active {
    border-color: #d1d5db;
    box-shadow: 0 4px 14px rgba(17, 24, 39, 0.06);
  }

  &:focus-visible {
    outline: 2px solid #111827;
    outline-offset: 2px;
  }

  @media (max-width: 600px) {
    padding: 16px;
  }
`;

export const cardTop = css`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

export const titleBlock = css`
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
`;

export const titleRow = css`
  display: flex;
  align-items: flex-start;
  gap: 8px;
  min-width: 0;
`;

export const cardTitle = css`
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.35;
  color: #111827;
  word-break: keep-all;
  overflow-wrap: anywhere;
`;

export const statusChip = (active: boolean) => css`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  background: ${active ? "#f3f4f6" : "#f3f4f6"};
  color: ${active ? "#111827" : "#6b7280"};
  font-size: 12px;
  font-weight: 600;
`;

export const cardMeta = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #4b5563;

  /* 구분점을 앞 항목 뒤에 붙여서 줄바꿈될 때 점이 줄 맨 앞에 오지 않게 */
  span {
    white-space: nowrap;
  }

  span:not(:last-child)::after {
    content: "·";
    margin-left: 6px;
    color: #d1d5db;
  }
`;

// 공개 스위치
export const switchWrap = css`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 4px 4px 10px;
  border-radius: 999px;
  cursor: default;

  label {
    font-size: 13px;
    font-weight: 500;
    color: #4b5563;
    cursor: pointer;
  }
`;

export const cardBottom = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding-top: 12px;
  border-top: 1px solid #f3f4f6;
`;

export const infoRow = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
`;

type Tone = "neutral" | "good" | "warn" | "alert" | "info";
const TONES: Record<Tone, { bg: string; color: string }> = {
  neutral: { bg: "#f3f4f6", color: "#4b5563" },
  good: { bg: "#f3f4f6", color: "#111827" },
  warn: { bg: "#f7f8f9", color: "#4b5563" },
  alert: { bg: "#f7f8f9", color: "#4b5563" },
  info: { bg: "#f3f4f6", color: "#111827" },
};

export const infoChip = (tone: Tone) => css`
  display: inline-flex;
  align-items: center;
  height: 26px;
  padding: 0 10px;
  border: 0;
  border-radius: 8px;
  background: ${TONES[tone].bg};
  color: ${TONES[tone].color};
  font: inherit;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
`;

export const chipButton = css`
  cursor: pointer;

  @media (hover: hover) {
    &:hover {
      text-decoration: underline;
    }
  }
  &:active {
    text-decoration: underline;
  }
`;

export const manageBtn = css`
  height: 34px;
  padding: 0 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  background: #fff;
  color: #111827;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  @media (hover: hover) {
    &:hover {
      border-color: #111827;
    }
  }
  &:active {
    border-color: #111827;
  }
`;
