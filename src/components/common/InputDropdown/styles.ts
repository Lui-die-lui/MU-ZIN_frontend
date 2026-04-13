/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

export const root = css`
  position: relative;
  width: 100%;
  min-width: 0;
`;

export const input = css`
  width: 100%;
  height: 44px;
  box-sizing: border-box;
  padding: 0 12px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  background: #fff;
  font-size: 14px;
  color: #111827;

  &:focus {
    outline: none;
    border-color: #111827;
  }

  &:disabled {
    background: #f3f4f6;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

export const helperText = css`
  margin-top: 6px;
  font-size: 12px;
  color: #6b7280;
`;

export const errorText = css`
  margin-top: 6px;
  font-size: 12px;
  color: #dc2626;
`;

export const dropdown = css`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  z-index: 30;
  max-height: 240px;
  overflow-y: auto;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.08);
`;

export const stateText = css`
  padding: 12px;
  font-size: 14px;
  color: #6b7280;
`;

export const optionButton = css`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  padding: 10px 12px;
  border: 0;
  background: transparent;
  text-align: left;
  cursor: pointer;

  &:hover {
    background: #f9fafb;
  }
`;

export const optionButtonActive = css`
  background: #f3f4f6;
`;

export const optionLabel = css`
  font-size: 14px;
  color: #111827;
`;

export const optionSubLabel = css`
  font-size: 12px;
  color: #6b7280;
`;
