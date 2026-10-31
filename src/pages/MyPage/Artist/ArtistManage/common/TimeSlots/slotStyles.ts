import { css } from "@emotion/react";
import { dropdownField } from "../../../../../../components/common/dropdownStyles";

// 레슨 시간 추가/목록 공통 디자인

export const panel = css`
  display: grid;
  gap: 14px;
  padding: 16px;
  border: 1px solid #eef0f2;
  border-radius: 14px;
  background: #fafafa;
  text-align: left;
`;

// 하루씩 / 반복 전환 (세그먼트)
export const segment = css`
  display: inline-flex;
  padding: 3px;
  border-radius: 10px;
  background: #eceef1;
  gap: 2px;
  justify-self: start;
`;

export const segmentBtn = (active: boolean) => css`
  height: 34px;
  padding: 0 14px;
  border: 0;
  border-radius: 8px;
  background: ${active ? "#fff" : "transparent"};
  box-shadow: ${active ? "0 1px 3px rgba(17, 24, 39, 0.12)" : "none"};
  color: ${active ? "#111827" : "#6b7280"};
  font: inherit;
  font-size: 13px;
  font-weight: ${active ? 700 : 500};
  cursor: pointer;
`;

export const inlineRow = css`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 10px;
`;

export const miniField = css`
  display: grid;
  gap: 6px;
  min-width: 0;
`;

export const miniLabel = css`
  font-size: 12px;
  font-weight: 600;
  color: #4b5563;
`;

export const control = css`
  ${dropdownField};
  height: 42px;
  padding: 0 12px;
`;

export const btn = (variant: "primary" | "ghost" | "danger" = "ghost") => css`
  height: 42px;
  padding: 0 16px;
  border-radius: 10px;
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid ${variant === "primary" ? "#111827" : variant === "danger" ? "#fecaca" : "#cfd4da"};
  background: ${variant === "primary" ? "#111827" : "#fff"};
  color: ${variant === "primary" ? "#fff" : variant === "danger" ? "#b91c1c" : "#1b1d20"};

  @media (hover: hover) {
    &:hover:not(:disabled) {
      background: ${variant === "primary" ? "#1f2937" : variant === "danger" ? "#fef2f2" : "#f3f4f6"};
    }
  }
  &:active:not(:disabled) {
    background: ${variant === "primary" ? "#1f2937" : variant === "danger" ? "#fef2f2" : "#f3f4f6"};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const dowGroup = css`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const dowChip = (active: boolean) => css`
  width: 40px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid ${active ? "#111827" : "#cfd4da"};
  background: ${active ? "#111827" : "#fff"};
  color: ${active ? "#fff" : "#374151"};
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
`;

export const message = (tone: "error" | "info" | "warn") => css`
  margin: 0;
  font-size: 13px;
  color: ${tone === "error" ? "#dc2626" : tone === "warn" ? "#1b1d20" : "#4b5563"};
`;

export const previewBox = css`
  display: grid;
  gap: 8px;
  padding: 12px;
  border-radius: 10px;
  background: #fff;
  border: 1px dashed #d1d5db;
`;

export const previewList = css`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const previewChip = css`
  padding: 4px 8px;
  border-radius: 6px;
  background: #f3f4f6;
  font-size: 12px;
  color: #374151;
`;
