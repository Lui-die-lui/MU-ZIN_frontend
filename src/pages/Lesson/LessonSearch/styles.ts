import styled from "@emotion/styled";
import { css } from "@emotion/react";

export const wrap = css`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  margin: 0 auto;
`;

export const row = css`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: center;
`;

// 입력창
export const input = css`
  flex: 1;
  min-width: 220px;
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #d7dfe7;
`;

// 조건 선택
export const select = css`
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #d7dfe7;
`;

export const timeSearchRow = css`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  flex-wrap: nowrap;

  @media (max-width: 1100px) {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
`;

export const timeFilterArea = css`
  flex: 0 0 auto;
  min-width: 0;

  @media (max-width: 1100px) {
    width: 100%;
  }
`;

export const searchButton = css`
  flex: 1 1 auto;
  min-width: 76px;
  height: 42px;
  padding: 0 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 14px;
  border: none;
  background: #111;
  color: #fff;

  cursor: pointer;
  white-space: nowrap;
  font-weight: 700;
  font-size: 14px;

  @media (max-width: 1100px) {
    width: 100%;
    flex: none;
    height: 46px;
  }
`;

// 칩 UI
export const chip = (active: boolean) => css`
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid #d7dfe7;
  background: ${active ? "#111" : "#fff"};
  color: ${active ? "#fff" : "#111"};
  cursor: pointer;
  user-select: none;
  font-size: 14px;
`;

export const card = css`
  border: 1px solid #e7edf3;
  border-radius: 14px;
  padding: 14px;
  background: #fff;
  cursor: pointer;
`;

export const helperText = css`
  color: #667;
  padding: 10px 2px;
`;

export const list = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const cardTitle = css`
  font-weight: 700;
`;

export const cardDesc = css`
  color: #556;
  margin-top: 6px;
`;

export const cardMeta = css`
  color: #667;
  margin-top: 10px;
  font-size: 13px;
`;
