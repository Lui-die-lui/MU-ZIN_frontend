import styled from "@emotion/styled";
import { css } from "@emotion/react";

export const wrap = css`
  display: flex;
  flex-direction: column;
  gap: 14px;
  max-width: 920px;
  margin: 0 auto;
  padding: 16px;
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

// 검색 버튼
export const button = css`
  padding: 10px 14px;
  border-radius: 12px;
  border: none;
  background: #111;
  color: #fff;
  cursor: pointer;
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