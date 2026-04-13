import { css } from "@emotion/react";

export const section = css`
  width: 100%;
`;

// main
export const buttonRow = css`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
`;

export const selectedAddress = css`
  margin-top: 12px;
  font-size: 14px;
  color: #111827;
`;

export const detailAddressInput = css`
  width: 100%;
  height: 44px;
  margin-top: 10px;
  padding: 0 12px;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  background: #fff;
  box-sizing: border-box;

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


export const regionInputRow = css`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr)) auto;
  gap: 4px;
  align-items: start;
  width: 100%;
`;

export const fieldItem = css`
  min-width: 0;
  width: 100%;
`;

export const addButton = css`
  height: 44px;
  padding: 0 12px;
  border: 1px solid #bfc5cc;
  border-radius: 10px;
  background: #fff;
  white-space: nowrap;
  flex-shrink: 0;
  cursor: pointer;
`;

export const emptyText = css`
  margin-top: 12px;
`;

export const countText = css`
  margin-top: 12px;
  text-align: center;
`;
