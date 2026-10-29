import { css } from "@emotion/react";

const text = "#1b1d20";
const muted = "#697078";

export const wrap = css`
  display: grid;
  gap: 20px;
`;

export const month = css`
  display: grid;
  gap: 4px;
`;

export const monthTitle = css`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: ${muted};
`;

export const dayList = css`
  display: grid;
`;

// 날짜 | 시간 버튼들, 날짜 사이 얇은 구분선
export const dayRow = css`
  display: grid;
  grid-template-columns: 64px minmax(0, 1fr);
  gap: 12px;
  align-items: start;
  padding: 12px 0;
  border-bottom: 1px solid #f0f1f2;

  &:last-of-type {
    border-bottom: 0;
  }
`;

export const dayLabel = css`
  display: grid;
  gap: 2px;
  padding-top: 4px;
  line-height: 1.2;

  strong {
    font-size: 15px;
    font-weight: 600;
    color: ${text};
  }

  span {
    font-size: 12px;
    color: ${muted};
  }
`;

export const timeGrid = css`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(76px, 1fr));
  gap: 8px;
`;

// 알약 모양 + 테두리는 거의 안 보이게 (연한 배경으로 구분)
export const timeBtn = (active: boolean) => css`
  height: 40px;
  border: 1px solid ${active ? text : "#f1f2f4"};
  border-radius: 999px;
  background: ${active ? text : "#f6f7f8"};
  color: ${active ? "#fff" : text};
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  font-variant-numeric: tabular-nums;
  cursor: pointer;
  transition: background 120ms ease, border-color 120ms ease;

  /* 마우스를 올리거나 키보드로 초점이 오면 테두리 대신 배경만 살짝 진하게 */
  &:focus-visible {
    outline: none;
    background: ${active ? "#000" : "#e9ebee"};
  }
  @media (hover: hover) {
    &:hover:not(:disabled) {
      outline: none;
      background: ${active ? "#000" : "#e9ebee"};
    }
  }
  &:active:not(:disabled) {
    outline: none;
    background: ${active ? "#000" : "#e9ebee"};
  }

  &:disabled {
    background: #fafafa;
    color: #c4c8cd;
    text-decoration: line-through;
    cursor: not-allowed;
  }
`;

export const emptyText = css`
  margin: 0;
  padding: 20px 16px;
  border: 1px dashed #d1d5db;
  border-radius: 12px;
  color: ${muted};
  font-size: 14px;
  line-height: 1.6;
  text-align: center;
`;
