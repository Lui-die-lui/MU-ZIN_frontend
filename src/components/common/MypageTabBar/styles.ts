

import { css } from "@emotion/react";

export const wrap = css`
   width: 100%;           
  display: flex;
  gap: 6px;

  padding: 6px;
  border: 1px solid #eee;
  background: #fafafa;
  border-radius: 14px;
`;

export const tab = (active: boolean) => css`
  border: 1px solid ${active ? "#d6e4ff" : "transparent"};
  background: ${active ? "#eef4ff" : "transparent"};
  color: ${active ? "#1e3a8a" : "rgba(0,0,0,0.78)"};

  border-radius: 999px;
  padding: 8px 12px;

  font-size: 13px;
  font-weight: 800;
  letter-spacing: -0.2px;

  cursor: pointer;
  transition:
    transform 120ms ease,
    background-color 120ms ease,
    opacity 120ms ease;

  &:hover {
    transform: translateY(-1px);
    background: ${active ? "#e6efff" : "rgba(0,0,0,0.04)"};
  }
  &:active {
    transform: translateY(0);
    opacity: 0.92;
  }
`;
