import { css } from "@emotion/react";

export const page = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const headerRow = css`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 10px;
`;

export const title = css`
  font-size: 18px;
  font-weight: 900;
  letter-spacing: -0.3px;
`;

export const sub = css`
  font-size: 13px;
  opacity: 0.7;
`;

export const list = css`
  display: grid;
  gap: 12px;
`;

export const skeleton = css`
  height: 96px;
  border-radius: 14px;
  background: #f3f3f3;
`;

export const empty = css`
  border: 1px dashed #ddd;
  border-radius: 14px;
  padding: 18px;
  background: #fafafa;
`;

export const emptyTitle = css`
  font-weight: 800;
  margin-bottom: 6px;
`;

export const actionBtn = (tone: "primary" | "danger" | "ghost" = "ghost") => css`
  height: 32px;
  padding: 0 12px;
  border-radius: 999px;

  font-size: 12px;
  font-weight: 900;
  letter-spacing: -0.2px;

  border: 1px solid rgba(0, 0, 0, 0.08);
  cursor: pointer;

  transition:
    transform 120ms ease,
    background-color 120ms ease,
    border-color 120ms ease,
    opacity 120ms ease;

  ${tone === "primary" &&
  css`
    background: #eef4ff;
    border-color: #d6e4ff;
    color: #1e3a8a;
  `}

  ${tone === "danger" &&
  css`
    background: #ffeaea;
    border-color: #fda29b;
    color: #b42318;
  `}

  ${tone === "ghost" &&
  css`
    background: rgba(255, 255, 255, 0.9);
    color: rgba(0, 0, 0, 0.78);
  `}

  &:hover {
    transform: translateY(-1px);
    opacity: 0.96;
  }

  &:active {
    transform: translateY(0px);
    opacity: 0.9;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
    transform: none;
  }
`;
