/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import type { StatusTone } from "./badgeUi";


// 브랜드 톤(검정 + 회색): 색 대신 채움/테두리로 구분
//  확정 = 검정 채움 · 확인 대기 = 검정 테두리 · 완료 확인 중 = 점선 · 완료 = 연회색 채움 · 거절/취소/만료 = 흐린 회색
export const toneVars: Record<StatusTone, { bg: string; fg: string; bd: string; style?: "dashed" }> = {
  confirmed: { bg: "#111827", fg: "#ffffff", bd: "#111827" },
  info: { bg: "#ffffff", fg: "#111827", bd: "#111827" },
  progress: { bg: "#ffffff", fg: "#374151", bd: "#9ca3af", style: "dashed" },
  success: { bg: "#eef0f2", fg: "#1b1d20", bd: "#e2e5e9" },
  warning: { bg: "#f3f4f6", fg: "#111827", bd: "#d1d5db" },
  danger: { bg: "#ffffff", fg: "#6b7280", bd: "#d1d5db" },
  neutral: { bg: "#f7f8f9", fg: "#9ca3af", bd: "#eef0f2" },
};

const basePill = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 26px;
  padding: 0 10px;
  border-radius: 999px;

  font-size: 12px;
  font-weight: 600;
  line-height: 1;

  white-space: nowrap;
  user-select: none;
`;

export const badge = (tone: StatusTone) => {
  const v = toneVars[tone];
  return css`
    ${basePill};
    background: ${v.bg};
    color: ${v.fg};
    border: 1px ${v.style ?? "solid"} ${v.bd};
  `;
};

export const statusBtn = (tone: StatusTone) => {
  const v = toneVars[tone];
  return css`
    ${basePill};
    background: ${v.bg};
    color: ${v.fg};
    border: 1px ${v.style ?? "solid"} ${v.bd};
    cursor: pointer;

    transition: transform 0.08s ease, filter 0.12s ease;

    &:hover {
      filter: brightness(0.98);
    }
    &:active {
      transform: translateY(1px);
    }
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }

    /* 키보드 접근성: focus 스타일은 꼭 넣자… 나중에 고생함 */
    &:focus-visible {
      outline: 2px solid #111827;
      outline-offset: 2px;
    }
  `;
};