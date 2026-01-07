// src/pages/myPage/lessons/styles.ts
import { css } from "@emotion/react";
// 리스트
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
  font-weight: 700;
  margin-bottom: 6px;
`;


// 카드 관련
export const card = css`
  text-align: left;
  border: 1px solid #eee;
  background: #fff;
  border-radius: 14px;
  padding: 14px;
  cursor: pointer;

  &:hover {
    border-color: #ddd;
  }
`;

export const cardTop = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const cardTitleRow = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

export const cardTitle = css`
  font-size: 15px;
`;

export const badge = (status: "ACTIVE" | "INACTIVE") => css`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid ${status === "ACTIVE" ? "#cfe8d5" : "#eee"};
  background: ${status === "ACTIVE" ? "#eefaf1" : "#f6f6f6"};
`;

export const cardMeta = css`
  font-size: 13px;
  opacity: 0.8;
  display: flex;
  gap: 6px;
`;


export const tagRow = css`
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const tagChip = css`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 999px;
  background: #f4f4f4;
`;

export const tagMore = css`
  font-size: 12px;
  opacity: 0.7;
  padding: 4px 6px;
`;


