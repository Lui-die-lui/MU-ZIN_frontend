import { css } from "@emotion/react";

// shared
export const section = css`
  width: 100%;
`;

export const subSection = css`
  width: 100%;

  & + & {
    margin-top: 28px;
  }
`;

export const sectionHeader = css`
  margin-bottom: 12px;
`;

export const title = css`
  margin: 0 0 4px;
  font-size: 15px;
  font-weight: 800;
  color: #111827;
`;

export const desc = css`
  margin: 0;
  font-size: 12px;
  line-height: 1.5;
  color: #6b7280;
`;

export const buttonRow = css`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  gap: 8px;
  margin-top: 12px;
  flex-wrap: wrap;
`;

export const outlineButton = css`
  height: 36px;
  padding: 0 13px;
  border: 1px solid #cfd7e2;
  border-radius: 999px;
  background: #fff;
  color: #111827;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;

  &:disabled {
    background: #f3f4f6;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

export const ghostButton = css`
  height: 36px;
  padding: 0 13px;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  background: #f9fafb;
  color: #6b7280;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;

  &:disabled {
    color: #b6bdc7;
    cursor: not-allowed;
  }
`;

// main region
export const addressBox = (hasAddress: boolean) => css`
  margin-top: 12px;
  padding: 12px 14px;
  border: 1px solid ${hasAddress ? "#d1d5db" : "#e5e7eb"};
  border-radius: 12px;
  background: ${hasAddress ? "#fff" : "#f9fafb"};
  color: ${hasAddress ? "#111827" : "#9ca3af"};
  font-size: 13px;
  line-height: 1.5;
  word-break: keep-all;
`;

export const detailAddressInput = css`
  width: 100%;
  height: 40px;
  margin-top: 10px;
  padding: 0 12px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  background: #fff;
  color: #111827;
  font-size: 14px;
  box-sizing: border-box;

  &::placeholder {
    color: #b6bdc7;
  }

  &:disabled {
    background: #f3f4f6;
    color: #9ca3af;
    cursor: not-allowed;
  }

  &:focus {
    outline: none;
    border-color: #111827;
  }
`;

// service region
export const regionInputRow = css`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr)) auto;
  gap: 8px;
  align-items: start;
  width: 100%;

  @media (max-width: 720px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const fieldItem = css`
  min-width: 0;
  width: 100%;
`;

export const addButton = css`
  height: 40px;
  padding: 0 13px;
  border: 1px solid #cfd7e2;
  border-radius: 10px;
  background: #fff;
  color: #111827;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  flex-shrink: 0;
  cursor: pointer;

  &:disabled {
    background: #f3f4f6;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

export const emptyText = css`
  margin: 12px 0 0;
  font-size: 13px;
  color: #9ca3af;
`;

export const countText = css`
  margin: 12px 0 0;
  text-align: right;
  font-size: 12px;
  color: #6b7280;
`;