import { css } from "@emotion/react";

export const page = css`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

// export const searchSection = css`
//   width: 100%;
// `;
export const searchSection = css`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
`;

export const regionArea = css`
  flex: 1;
  min-width: 0;
`;

export const buttonGroup = css`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
`;


export const searchBar = css`
  display: flex;
  gap: 10px;
  width: 100%;
  flex-wrap: wrap;
  align-items: center;
`;

export const searchButton = css`
  padding: 10px 14px;
  border-radius: 12px;
  border: none;
  background: #111;
  color: #fff;
  cursor: pointer;
`;

export const resetButton = css`
  height: 40px;
  padding: 0 18px;
  border: 1px solid #ddd;
  border-radius: 12px;
  background: white;
  cursor: pointer;
  flex: 0 0 auto;
  white-space: nowrap;
`;

export const resultSection = css`
  width: 100%;
`;

export const message = css`
  padding: 24px 0;
  color: #666;
`;
