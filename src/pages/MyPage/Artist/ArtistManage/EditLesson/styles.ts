import { css } from "@emotion/react";

// 레슨 수정 화면 (마이페이지 계정 화면과 같은 톤: 왼쪽 정렬 제목, 흰 카드, 검정 버튼)

export const page = css`
  max-width: 820px;
  margin: 0 auto;
  padding: 28px 24px 0;
  text-align: left;

  @media (max-width: 600px) {
    padding: 20px 16px 0;
  }
`;

export const backLink = css`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-bottom: 14px;
  padding: 0;
  border: 0;
  background: none;
  color: #6b7280;
  font: inherit;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    color: #111827;
  }
`;

export const header = css`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
`;

export const title = css`
  margin: 0 0 6px;
  font-size: 25px;
  font-weight: 700;
  color: #111827;
`;

export const subtitle = css`
  margin: 0;
  font-size: 13px;
  color: #6b7280;
`;

export const statusBadge = (active: boolean) => css`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  background: ${active ? "#ecfdf3" : "#f3f4f6"};
  color: ${active ? "#047857" : "#6b7280"};

  &::before {
    content: "";
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: currentColor;
  }
`;

export const stack = css`
  display: grid;
  gap: 16px;
`;

// 예약 진행 중 안내
export const banner = css`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px solid #fde68a;
  background: #fffbeb;
  color: #78350f;
  font-size: 13px;
  line-height: 1.6;

  strong {
    display: block;
    margin-bottom: 2px;
    font-size: 14px;
    color: #92400e;
  }
`;

export const bannerLink = css`
  flex-shrink: 0;
  align-self: center;
  padding: 0;
  border: 0;
  background: none;
  color: #92400e;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  text-decoration: underline;
  cursor: pointer;
`;

// ---------- 레슨 시간 ----------

export const summary = css`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const sectionLabel = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin: 22px 0 10px;
  font-size: 14px;
  font-weight: 700;
  color: #111827;

  small {
    font-size: 12px;
    font-weight: 500;
    color: #6b7280;
  }
`;

export const textBtn = css`
  padding: 0;
  border: 0;
  background: none;
  color: #6b7280;
  font: inherit;
  font-size: 12px;
  text-decoration: underline;
  cursor: pointer;
`;

// 저장 전 추가 예정 시간
export const draftList = css`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 12px;
  border: 1px dashed #9ca3af;
  border-radius: 12px;
  background: #fafafa;
`;

export const draftChip = css`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 6px 0 12px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #e5e7eb;
  font-size: 13px;
  color: #111827;

  button {
    width: 22px;
    height: 22px;
    border: 0;
    border-radius: 6px;
    background: transparent;
    color: #6b7280;
    font-size: 15px;
    line-height: 1;
    cursor: pointer;
  }

  button:hover {
    background: #f3f4f6;
    color: #111827;
  }
`;

export const dayGroup = css`
  border: 1px solid #eef0f2;
  border-radius: 12px;
  overflow: hidden;

  & + & {
    margin-top: 10px;
  }
`;

export const dayHeader = css`
  padding: 10px 14px;
  background: #fafafa;
  border-bottom: 1px solid #eef0f2;
  font-size: 13px;
  font-weight: 700;
  color: #374151;
`;

export const slotRow = css`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 52px;
  padding: 8px 14px;

  & + & {
    border-top: 1px solid #f3f4f6;
  }
`;

export const slotTime = css`
  min-width: 112px;
  font-size: 14px;
  font-weight: 600;
  color: #111827;
  font-variant-numeric: tabular-nums;
`;

export const slotActions = css`
  margin-left: auto;
  display: flex;
  gap: 6px;
`;

export const smallBtn = (variant: "ghost" | "danger" = "ghost") => css`
  height: 32px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid ${variant === "danger" ? "#fecaca" : "#d1d5db"};
  background: #fff;
  color: ${variant === "danger" ? "#b91c1c" : "#374151"};
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${variant === "danger" ? "#fef2f2" : "#f3f4f6"};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const slotNote = css`
  margin-left: auto;
  font-size: 12px;
  color: #6b7280;
`;

export const empty = css`
  padding: 20px;
  border: 1px dashed #d1d5db;
  border-radius: 12px;
  text-align: center;
  font-size: 13px;
  color: #6b7280;
`;

// ---------- 하단 고정 바 ----------

export const actionBar = css`
  position: sticky;
  bottom: 0;
  z-index: 20;
  margin: 24px -24px 0;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(6px);
  border-top: 1px solid #e5e7eb;

  @media (max-width: 600px) {
    margin: 20px -16px 0;
    padding: 12px 16px;
    flex-wrap: wrap;
  }
`;

export const dirtyText = (dirty: boolean) => css`
  margin-left: auto;
  font-size: 13px;
  color: ${dirty ? "#111827" : "#9ca3af"};
  font-weight: ${dirty ? 600 : 400};
`;

export const centerState = css`
  max-width: 820px;
  margin: 60px auto;
  padding: 0 24px;
  text-align: center;
  color: #6b7280;

  h2 {
    margin: 0 0 8px;
    font-size: 20px;
    color: #111827;
  }
`;
