import { css } from "@emotion/react";

export const page = css`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

export const searchSection = css`
  width: 100%;
`;

export const searchBar = css`
  display: flex;
  gap: 10px;
  width: 100%;
`;

export const searchButton = css`
  height: 40px;
  padding: 0 18px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
`;

export const resetButton = css`
  height: 40px;
  padding: 0 18px;
  border: 1px solid #ddd;
  border-radius: 10px;
  background: white;
  cursor: pointer;
`;

export const resultSection = css`
  width: 100%;
`;

export const message = css`
  padding: 24px 0;
  color: #666;
`;