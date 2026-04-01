/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import type { StatusTone } from "./badgeUi";


export const toneVars: Record<StatusTone, { bg: string; fg: string; bd: string }> = {
  neutral: { bg: "rgba(0,0,0,0.06)", fg: "rgba(0,0,0,0.72)", bd: "rgba(0,0,0,0.12)" },
  info:    { bg: "rgba(0,120,255,0.10)", fg: "rgba(0,90,200,1)", bd: "rgba(0,120,255,0.22)" },
  success: { bg: "rgba(0,180,120,0.12)", fg: "rgba(0,120,80,1)", bd: "rgba(0,180,120,0.24)" },
  warning: { bg: "rgba(255,170,0,0.14)", fg: "rgba(160,100,0,1)", bd: "rgba(255,170,0,0.28)" },
  danger:  { bg: "rgba(255,60,80,0.12)", fg: "rgba(190,0,30,1)", bd: "rgba(255,60,80,0.26)" },
  progress:{ bg: "rgba(0, 150, 200, 0.12)", fg: "rgba(0, 110, 150, 1)", bd: "rgba(0, 150, 200, 0.26)" },
  confirmed: { bg: "rgba(124, 92, 255, 0.12)", fg: "rgba(88, 56, 220, 1)", bd: "rgba(124, 92, 255, 0.28)" },
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
  font-weight: 700;
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
    border: 1px solid ${v.bd};
  `;
};

export const statusBtn = (tone: StatusTone) => {
  const v = toneVars[tone];
  return css`
    ${basePill};
    background: ${v.bg};
    color: ${v.fg};
    border: 1px solid ${v.bd};
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
      outline: 2px solid ${v.fg};
      outline-offset: 2px;
    }
  `;
};