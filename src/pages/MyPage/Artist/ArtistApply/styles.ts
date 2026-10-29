import { css } from "@emotion/react";

export const chipWrap = css`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
`;

export const chip = css`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #fff;
  font-size: 13px;
  cursor: pointer;
`;

export const chipX = css`
  font-weight: 600;
  opacity: 0.7;
`;


// ---------- 아티스트 신청 화면 (레슨 수정 화면과 같은 톤: 흰 카드 + 아래 고정 버튼) ----------
export const page = css`
  max-width: 760px;
  margin: 0 auto;
  padding: 30px 24px 0;
  text-align: left;

  @media (max-width: 600px) {
    padding: 20px 16px 0;
  }
`;

export const header = css`
  margin-bottom: 24px;
`;

export const title = css`
  margin: 0;
  font-size: 25px;
  font-weight: 700;
  color: #111827;
`;

export const desc = css`
  margin: 8px 0 0;
  max-width: 620px;
  font-size: 14px;
  line-height: 1.6;
  color: #6b7280;
`;

export const steps = css`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 16px 0 0;
  padding: 0;
  list-style: none;

  li {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 30px;
    padding: 0 12px;
    border-radius: 999px;
    background: #f3f4f6;
    color: #374151;
    font-size: 13px;
    font-weight: 500;
  }

  b {
    display: grid;
    place-items: center;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #111827;
    color: #fff;
    font-size: 11px;
  }
`;

export const stack = css`
  display: grid;
  gap: 16px;
`;

export const notice = (tone: "warn" | "error" | "info") => css`
  display: grid;
  gap: 4px;
  margin-bottom: 16px;
  padding: 16px 18px;
  border-radius: 14px;
  border: 1px solid ${tone === "error" ? "#fecaca" : tone === "warn" ? "#e2e5e9" : "#e5e7eb"};
  background: ${tone === "error" ? "#fef2f2" : tone === "warn" ? "#f7f8f9" : "#f9fafb"};
  color: ${tone === "error" ? "#991b1b" : tone === "warn" ? "#1b1d20" : "#374151"};
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;

  strong {
    font-size: 14px;
  }
`;

// 반려 안내 안의 사유 제목 / 내용
export const rejectTitle = css`
  font-weight: 600;
`;

export const rejectReason = css`
  padding: 10px 12px;
  border-radius: 10px;
  background: #fff;
  color: #1b1d20;
  overflow-wrap: anywhere;
`;

export const majorRow = css`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 8px;
  align-items: center;

  @media (max-width: 480px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const toggleChip = (on: boolean) => css`
  height: 44px;
  padding: 0 14px;
  border: 1px solid ${on ? "#111827" : "#e5e7eb"};
  border-radius: 999px;
  background: ${on ? "#111827" : "#fff"};
  color: ${on ? "#fff" : "#111827"};
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const guide = css`
  margin: 0;
  padding: 14px 16px 14px 34px;
  border-radius: 12px;
  background: #f9fafb;
  color: #4b5563;
  font-size: 13px;
  line-height: 1.8;
`;

export const textBtn = css`
  justify-self: start;
  margin-top: 4px;
  padding: 0;
  border: 0;
  background: none;
  color: #111827;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;

  &:disabled {
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

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

export const progress = css`
  margin-right: auto;
  font-size: 13px;
  color: #6b7280;

  b {
    color: #111827;
  }
`;

export const btn = (variant: "primary" | "ghost") => css`
  height: 44px;
  padding: 0 18px;
  border-radius: 12px;
  border: 1px solid ${variant === "primary" ? "#111827" : "#e5e7eb"};
  background: ${variant === "primary" ? "#111827" : "#fff"};
  color: ${variant === "primary" ? "#fff" : "#111827"};
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    border-color: #e5e7eb;
    background: #f3f4f6;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

export const state = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 80px 16px;
  color: #6b7280;
  font-size: 14px;
  text-align: center;

  strong {
    color: #111827;
    font-size: 18px;
  }
`;

// 심사 중 화면 카드
export const pendingCard = css`
  display: grid;
  justify-items: center;
  gap: 12px;
  margin-top: 8px;
  padding: 40px 24px;
  border: 1px solid #e8e8e8;
  border-radius: 20px;
  background: #fff;
  text-align: center;
  color: #6b7280;
  font-size: 14px;
  line-height: 1.6;

  strong {
    color: #111827;
    font-size: 19px;
  }
`;

export const pendingIcon = css`
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: #f7f8f9;
  color: #4b5563;
  font-size: 24px;
`;
