import { css } from "@emotion/react";

// 리뷰 공통 디자인 (공개 프로필 · 레슨 상세 창 · 마이페이지 리뷰 관리) - 메인 톤: 테두리 없는 오프화이트 판 + 흰 면
const text = "#1b1d20";
const mutedColor = "#6b7280";
const soft = "#f7f8f9";

// ---------- 별 ----------
export const stars = css`
  display: inline-flex;
  align-items: center;
  gap: 1px;
`;

export const star = (size: number) => css`
  position: relative;
  display: inline-block;
  width: ${size}px;
  height: ${size}px;
  line-height: 0;
`;

export const starFill = (pct: number) => css`
  position: absolute;
  inset: 0;
  width: ${pct}%;
  overflow: hidden;
`;

export const starInputWrap = css`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

export const starButton = css`
  padding: 2px;
  border: 0;
  border-radius: 6px;
  background: none;
  cursor: pointer;
  line-height: 0;
  transition: transform 0.1s ease;

  @media (hover: hover) {
    &:hover {
      transform: scale(1.08);
    }
  }
  &:active {
    transform: scale(1.08);
  }
  &:focus-visible {
    outline: 2px solid #111827;
  }
`;

export const starInputLabel = (on: boolean) => css`
  font-size: 14px;
  font-weight: ${on ? 700 : 400};
  color: ${on ? text : mutedColor};
`;

// ---------- 요약 ----------
// compact: 좁은 곳(레슨 상세 창)은 한 줄에 하나씩
export const summary = (compact = false) => css`
  display: grid;
  grid-template-columns: ${compact ? "1fr" : "150px 1fr 1.3fr"};
  gap: 24px;
  align-items: center;
  padding: 24px;
  border-radius: 18px;
  background: #f5f4f0; /* 메인 톤: 테두리 없는 오프화이트 판 */

  @media (max-width: 760px) {
    grid-template-columns: 1fr;
    gap: 18px;
    padding: 20px;
  }
`;

export const summaryScore = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;

  strong {
    font-size: 40px;
    font-weight: 800;
    line-height: 1;
    color: ${text};
  }
  span:last-of-type {
    font-size: 13px;
    color: ${mutedColor};
  }
`;

export const ratingBars = css`
  display: grid;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: grid;
    grid-template-columns: 32px 1fr 28px;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: ${mutedColor};
  }
`;

export const bar = css`
  position: relative;
  height: 8px;
  border-radius: 999px;
  background: #ffffff; /* 오프화이트 판 위에서 빈 칸이 보이게 */
  overflow: hidden;
`;

export const barFill = (pct: number, color: string) => css`
  position: absolute;
  inset: 0 auto 0 0;
  width: ${pct}%;
  border-radius: 999px;
  background: ${color};
`;

export const barCount = css`
  text-align: right;
  font-variant-numeric: tabular-nums;
`;

export const topKeywords = css`
  display: grid;
  gap: 8px;
  min-width: 0;
`;

export const topKeywordsTitle = css`
  font-size: 14px;
  font-weight: 600;
  color: ${text};
`;

export const keywordRank = css`
  display: grid;
  gap: 4px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

const rankGrid = css`
  display: grid;
  grid-template-columns: 22px minmax(0, 1fr) 70px 24px;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 4px 6px;
  font-size: 13px;
  color: ${text};
  text-align: left;
`;

export const rankRow = rankGrid;

export const rankButton = (selected: boolean) => css`
  ${rankGrid};
  border: 1px solid ${selected ? "#111827" : "transparent"};
  border-radius: 8px;
  background: ${selected ? "#f3f4f6" : "transparent"};
  font: inherit;
  font-size: 13px;
  cursor: pointer;

  @media (hover: hover) {
    &:hover {
      background: #f3f4f6;
    }
  }
  &:active {
    background: #f3f4f6;
  }
  &:focus-visible {
    outline: 2px solid #111827;
  }
`;

export const rankNo = (i: number) => css`
  display: inline-grid;
  place-items: center;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  background: ${i === 0 ? "#111827" : "#eef0f2"};
  color: ${i === 0 ? "#fff" : mutedColor};
  font-size: 11px;
  font-weight: 600;
`;

export const rankName = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 600;
`;

// ---------- 목록 ----------
export const section = css`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 14px;
  text-align: left;
`;

export const toolbar = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  flex-wrap: wrap;
`;

export const toolbarLeft = css`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  min-width: 0;
`;

export const toolbarSelect = css`
  width: 240px;
  max-width: 100%;
`;

export const toolbarSelectSmall = css`
  width: 140px;
`;

export const toggleChip = (on: boolean) => css`
  height: 36px;
  padding: 0 14px;
  border: 0;
  border-radius: 999px;
  background: ${on ? "#17191c" : "#f2f1ed"};
  color: ${on ? "#fff" : text};
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
`;

export const list = css`
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 12px;
`;

export const item = css`
  display: grid;
  min-width: 0;
  gap: 10px;
  padding: 20px;
  border-radius: 18px;
  background: #f5f4f0; /* 테두리 없는 오프화이트 판 (안쪽 레슨·칩·답글은 흰 면) */

  @media (max-width: 600px) {
    padding: 16px;
  }
`;

export const itemHead = css`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const itemWho = css`
  display: grid;
  gap: 2px;
  min-width: 0;
  flex: 1;

  strong {
    font-size: 14px;
    color: ${text};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const itemMeta = css`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${mutedColor};
`;

export const itemActions = css`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
`;

// 어떤 레슨의 리뷰인지
export const lessonTag = css`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  min-width: 0;
  overflow-wrap: anywhere;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 12px;
  background: #ffffff;
  font-size: 13px;
`;

export const lessonTagArtist = css`
  font-weight: 600;
  color: ${text};
`;

export const lessonTagTitle = css`
  font-weight: 600;
  color: ${text};
`;

export const lessonTagDate = css`
  color: ${mutedColor};
`;

export const chips = css`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const chip = css`
  padding: 4px 10px;
  border-radius: 999px;
  background: #ffffff;
  color: #17191c;
  font-size: 12px;
  font-weight: 600;
`;

export const content = css`
  margin: 0;
  font-size: 14px;
  line-height: 1.7;
  color: ${text};
  white-space: pre-wrap;
  word-break: break-word;
`;

export const reply = css`
  display: grid;
  gap: 6px;
  margin-left: 12px;
  padding: 12px 14px;
  border-left: 2px solid #17191c;
  border-radius: 0 12px 12px 0;
  background: #ffffff;
`;

export const replyHead = css`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 4px 8px;
  min-width: 0;
  overflow-wrap: anywhere; /* 띄어쓰기 없는 긴 이름도 줄바꿈 */
  font-size: 12px;
  color: ${mutedColor};

  strong {
    font-size: 13px;
    color: ${text};
  }
`;

export const replyBadge = css`
  padding: 2px 8px;
  border-radius: 6px;
  background: #111827;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
`;

export const replyContent = css`
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: ${text};
  white-space: pre-wrap;
  word-break: break-word;
`;

export const replyActions = css`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-left: auto;
`;

export const replyEmpty = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 14px;
  border: 1px dashed #cfd4da;
  border-radius: 10px;
  font-size: 13px;
  color: ${mutedColor};
`;

export const replyEditor = css`
  display: grid;
  gap: 8px;
  padding: 12px 14px;
  border-radius: 10px;
  background: ${soft};
`;

export const replyEditorBar = css`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;

  span:first-of-type {
    margin-right: auto;
  }
`;

export const stateBox = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px 16px;
  border-radius: 18px;
  background: #f5f4f0;
  font-size: 14px;
  color: ${mutedColor};
  text-align: center;
`;

export const moreButton = css`
  height: 44px;
  border: 0;
  border-radius: 14px;
  background: #ecebe7;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  color: ${text};
  cursor: pointer;

  @media (hover: hover) {
    &:hover {
      background: #e2e1dc;
    }
  }
  &:active {
    background: #e2e1dc;
  }
`;

export const textButton = css`
  padding: 4px 6px;
  border: 0;
  border-radius: 6px;
  background: none;
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  color: ${text};
  text-decoration: underline;
  text-underline-offset: 3px;
  cursor: pointer;

  &:disabled {
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

export const textButtonDanger = css`
  ${textButton};
  color: #e11d48;
`;

export const muted = css`
  margin: 0;
  font-size: 13px;
  font-weight: 400;
  color: ${mutedColor};
`;

// ---------- 작성 폼 ----------
export const form = css`
  display: grid;
  gap: 20px;
  text-align: left;
`;

export const formTarget = css`
  display: grid;
  gap: 4px;
  padding: 12px 14px;
  border-radius: 10px;
  background: ${soft};

  strong {
    font-size: 15px;
    color: ${text};
  }
  span {
    font-size: 13px;
    color: ${mutedColor};
  }
`;

export const formBlock = css`
  display: grid;
  gap: 10px;
`;

export const formLabel = css`
  font-size: 14px;
  font-weight: 600;
  color: ${text};
`;

export const keywordPicker = css`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const keywordOption = (on: boolean) => css`
  height: 36px;
  padding: 0 14px;
  border: 1px solid ${on ? "#111827" : "#d8dce1"};
  border-radius: 999px;
  background: ${on ? "#f3f4f6" : "#fff"};
  color: ${on ? "#374151" : text};
  font: inherit;
  font-size: 13px;
  font-weight: ${on ? 700 : 500};
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease;

  @media (hover: hover) {
    &:hover {
      border-color: ${on ? "#111827" : "#9ca3af"};
    }
  }
  &:active {
    border-color: ${on ? "#111827" : "#9ca3af"};
  }
  &:focus-visible {
    outline: 2px solid #111827;
    outline-offset: 1px;
  }
`;

export const textarea = css`
  width: 100%;
  box-sizing: border-box;
  padding: 12px 14px;
  border: 1px solid #cfd4da;
  border-radius: 10px;
  background: #fff;
  font: inherit;
  font-size: 14px;
  line-height: 1.6;
  color: ${text};
  resize: vertical;

  &:focus {
    outline: 3px solid rgba(17, 24, 39, 0.1);
    border-color: #111827;
  }
`;

export const counter = css`
  justify-self: end;
  font-size: 12px;
  color: ${mutedColor};
  font-variant-numeric: tabular-nums;
`;

export const errorText = css`
  margin: 0;
  font-size: 13px;
  color: #e11d48;
`;

export const formFooter = css`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  width: 100%;
`;

export const btn = (tone: "primary" | "ghost" | "danger", small = false) => css`
  height: ${small ? 34 : 44}px;
  padding: 0 ${small ? 12 : 18}px;
  border: 1px solid ${tone === "primary" ? "#111827" : tone === "danger" ? "#e2e5e9" : "#cfd4da"};
  border-radius: 10px;
  background: ${tone === "primary" ? "#111827" : "#fff"};
  color: ${tone === "primary" ? "#fff" : tone === "danger" ? "#e11d48" : text};
  font: inherit;
  font-size: ${small ? 13 : 14}px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`;
