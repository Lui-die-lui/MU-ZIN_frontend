import { css } from "@emotion/react";

export const card = css`
  width: 100%;
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 20px;
  border: 1px solid #e2e5e9;
  border-radius: 14px;
  background: #fff;
  color: #1b1d20;
  text-align: left;
  transition: border-color 150ms ease, transform 150ms ease, box-shadow 150ms ease;

  &:hover {
    border-color: #aeb4bc;
    box-shadow: 0 10px 24px rgba(20, 25, 30, 0.07);
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 3px solid rgba(17, 24, 39, 0.16);
    outline-offset: 2px;
  }

  > div:first-of-type {
    background: #eef0f2;
    color: #535a62;
  }

  @media (max-width: 560px) {
    align-items: flex-start;
    padding: 16px;
  }
`;

export const content = css`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const topRow = css`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const username = css`
  margin: 0;
  font-size: 18px;
  font-weight: 700;
`;

export const major = css`
  font-size: 14px;
  color: #697078;
`;

export const chips = css`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const chip = css`
  padding: 5px 8px;
  border-radius: 6px;
  background: #f0f1f2;
  color: #4c5157;
  font-size: 13px;
`;

export const regions = css`
  display: flex;
  flex-direction: column;
  gap: 3px;
  color: #767c83;
  font-size: 12px;
`;

export const arrow = css`
  margin-left: auto;
  color: #6e747b;
  font-size: 18px;
`;
