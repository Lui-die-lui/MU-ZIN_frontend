import { css } from "@emotion/react";

// 공개 아티스트 프로필 (/artists/:id) - 레슨 검색 화면과 같은 톤 (흰 카드, 얇은 테두리, 검정 강조)
const border = "#e2e5e9";
const text = "#1b1d20";
const muted = "#697078";

export const wrap = css`
  width: min(960px, 100%);
  margin: 0 auto;
  padding: 28px 8px 72px;
  color: ${text};
  text-align: left;
  box-sizing: border-box;

  @media (max-width: 720px) {
    padding: 16px 0 48px;
  }
`;

export const backLink = css`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 16px;
  padding: 0;
  border: 0;
  background: none;
  color: ${muted};
  font: inherit;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    color: ${text};
  }
`;

export const stack = css`
  display: grid;
  gap: 16px;
`;

export const card = css`
  padding: 28px;
  border: 1px solid ${border};
  border-radius: 18px;
  background: #fff;

  @media (max-width: 720px) {
    padding: 20px;
    border-radius: 14px;
  }
`;

// ---------- 상단 소개 카드 ----------
export const hero = css`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 22px;
  align-items: start;

  @media (max-width: 560px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 16px;
  }
`;

export const heroTop = css`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const nameRow = css`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
`;

export const name = css`
  margin: 0;
  font-size: clamp(22px, 3vw, 28px);
  line-height: 1.25;
  letter-spacing: -0.03em;
  word-break: break-all;
`;

export const majorBadge = css`
  padding: 4px 8px;
  border-radius: 6px;
  background: #f0f1f2;
  color: #4c5157;
  font-size: 12px;
  font-weight: 700;
`;

export const location = css`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  color: ${muted};
  font-size: 14px;

  svg {
    flex-shrink: 0;
    color: #9aa0a6;
  }
`;

export const actions = css`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

export const btn = (variant: "primary" | "ghost") => css`
  display: inline-flex;
  align-items: center;
  height: 40px;
  padding: 0 16px;
  border-radius: 10px;
  border: 1px solid ${variant === "primary" ? text : border};
  background: ${variant === "primary" ? text : "#fff"};
  color: ${variant === "primary" ? "#fff" : text};
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    border-color: ${text};
  }
`;

export const facts = css`
  display: grid;
  gap: 12px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #f0f1f2;
`;

export const factRow = css`
  display: grid;
  grid-template-columns: 96px minmax(0, 1fr);
  gap: 12px;
  align-items: start;

  @media (max-width: 480px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 6px;
  }
`;

export const factLabel = css`
  padding-top: 5px;
  color: ${muted};
  font-size: 13px;
  font-weight: 700;
`;

export const chips = css`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const chip = (tone: "neutral" | "style" | "region") => css`
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;
  background: ${tone === "style" ? "#eef2ff" : tone === "region" ? "#ecfdf3" : "#f3f4f6"};
  color: ${tone === "style" ? "#3730a3" : tone === "region" ? "#047857" : "#374151"};
  font-size: 13px;
  font-weight: 600;
`;

export const emptyInline = css`
  padding-top: 5px;
  color: #9aa0a6;
  font-size: 13px;
`;

// ---------- 소개 / 경력 ----------
export const sectionTitle = css`
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 0 0 12px;
  font-size: 18px;
  letter-spacing: -0.02em;

  span {
    color: ${muted};
    font-size: 14px;
    font-weight: 600;
  }
`;

export const bodyText = css`
  margin: 0;
  font-size: 15px;
  line-height: 1.75;
  color: #2f3337;
  white-space: pre-wrap; /* 줄바꿈 그대로 */
  word-break: keep-all;
  overflow-wrap: anywhere;
`;

export const mutedText = css`
  margin: 0;
  color: #9aa0a6;
  font-size: 14px;
`;

// ---------- 레슨 카드 ----------
export const lessonGrid = css`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 720px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const lessonCard = css`
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: stretch;
  padding: 18px 20px;
  border: 1px solid ${border};
  border-radius: 14px;
  background: #fff;
  color: ${text};
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease;

  &:hover {
    border-color: #aeb4bc;
    box-shadow: 0 10px 24px rgba(20, 25, 30, 0.07);
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 3px solid rgba(17, 24, 39, 0.16);
    outline-offset: 2px;
  }
`;

export const lessonTop = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const instBadge = css`
  padding: 5px 8px;
  border-radius: 6px;
  background: #f0f1f2;
  color: #4c5157;
  font-size: 12px;
  font-weight: 700;
`;

export const arrow = css`
  color: #6e747b;
  font-size: 18px;
`;

export const lessonTitle = css`
  margin: 12px 0 0;
  font-size: 17px;
  line-height: 1.4;
  letter-spacing: -0.02em;
  word-break: keep-all;
  overflow-wrap: anywhere;
`;

export const lessonMeta = css`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 7px;
  margin-top: 14px;
  color: #5f666d;
  font-size: 13px;

  strong {
    color: ${text};
  }
`;

export const lessonHint = css`
  margin: 12px 0 0;
  color: ${muted};
  font-size: 13px;
`;

// ---------- 상태 화면 ----------
export const state = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 72px 16px;
  color: ${muted};
  font-size: 14px;
  text-align: center;

  strong {
    color: ${text};
    font-size: 17px;
  }
`;

export const skeleton = (h: number) => css`
  height: ${h}px;
  border-radius: 18px;
  background: linear-gradient(90deg, #f3f4f6 0%, #f9fafb 50%, #f3f4f6 100%);
  background-size: 800px 100%;
  animation: shimmer 1.2s linear infinite;

  @keyframes shimmer {
    0% { background-position: -400px 0; }
    100% { background-position: 400px 0; }
  }
`;
