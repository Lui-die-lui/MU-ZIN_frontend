import { css } from "@emotion/react";

export const dropdownRoot = css`
  position: relative;
`;

export const trigger = css`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #d7dfe7;
  background: #fff;
  cursor: pointer;
  min-width: 220px;
  justify-content: space-between;
`;

export const caret = (open: boolean) => css`
  transform: rotate(${open ? "180deg" : "0deg"});
  transition: transform 140ms ease;
`;

export const menu = css`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: min(360px, 92vw);
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 14px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.16);
  z-index: 50;
  overflow: hidden;
`;

export const menuTop = css`
  display: flex;
  gap: 8px;
  padding: 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
`;

export const searchInput = css`
  flex: 1;
  padding: 10px 10px;
  border-radius: 10px;
  border: 1px solid #d7dfe7;
`;

export const clearBtn = css`
  padding: 10px 10px;
  border-radius: 10px;
  border: 1px solid #d7dfe7;
  background: #fff;
  cursor: pointer;
  white-space: nowrap;
`;

export const list = css`
  max-height: 280px;
  overflow: auto;
  padding: 8px;
`;

export const item = (checked: boolean) => css`
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 10px 10px;
  border-radius: 10px;
  cursor: pointer;

  background: ${checked ? "rgba(0,0,0,0.06)" : "transparent"};

  &:hover {
    background: rgba(0, 0, 0, 0.06);
  }

  input {
    width: 16px;
    height: 16px;
  }
`;

export const hint = css`
  padding: 14px 10px;
  color: #667;
  font-size: 13px;
`;
