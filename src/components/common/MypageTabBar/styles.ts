

import { css } from "@emotion/react";

export const wrap = css`
   width: 100%;           
  display: flex;
  gap: 6px;

  padding: 6px;
  border: 1px solid #eee;
  background: #fafafa;
  border-radius: 14px;
  box-sizing: border-box;
  /* 좁은 화면: 탭 이름이 한 글자씩 줄바꿈되던 문제 -> 한 줄 유지 + 옆으로 스크롤 */
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export const tab = (active: boolean) => css`
  flex-shrink: 0;
  white-space: nowrap;
  border: 1px solid ${active ? "#e5e7eb" : "transparent"};
  background: ${active ? "#f3f4f6" : "transparent"};
  color: ${active ? "#111827" : "rgba(0,0,0,0.78)"};

  border-radius: 999px;
  padding: 8px 12px;

  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.2px;

  cursor: pointer;
  transition:
    transform 120ms ease,
    background-color 120ms ease,
    opacity 120ms ease;

  @media (hover: hover) {
    &:hover {
      transform: translateY(-1px);
      background: ${active ? "#eef0f2" : "rgba(0,0,0,0.04)"};
    }
  }
  &:active {
    transform: translateY(-1px);
    background: ${active ? "#eef0f2" : "rgba(0,0,0,0.04)"};
  }
  &:active {
    transform: translateY(0);
    opacity: 0.92;
  }
`;
