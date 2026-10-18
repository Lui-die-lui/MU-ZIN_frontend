import { css } from "@emotion/react";

// 다른 화면과 같은 카드·버튼 값 (브랜드 톤: 검정 + 회색, 그라데이션 없음)
const ink = "#111827";
const text = "#1b1d20";
const muted = "#6b7280";
const line = "#e2e5e9";

export const page = css`
  max-width: 1120px;
  margin: 0 auto;
  padding: 48px 24px 80px;
  color: ${text};
  text-align: left;
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 24px 16px 60px;
  }
`;

export const hero = css`
  display: grid;
  gap: 12px;
  padding: 40px;
  border: 1px solid ${line};
  border-radius: 18px;
  background: #fff;

  @media (max-width: 600px) {
    padding: 24px 20px;
  }
`;

export const eyebrow = css`
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  color: ${muted};
`;

export const title = css`
  margin: 0;
  font-size: 34px;
  font-weight: 800;
  letter-spacing: -0.03em;
  word-break: keep-all;

  @media (max-width: 600px) {
    font-size: 26px;
  }
`;

export const desc = css`
  margin: 0;
  font-size: 16px;
  line-height: 1.7;
  color: #4b5563;
  word-break: keep-all;
`;

export const meta = css`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin: 4px 0 0;
  padding: 0;
  list-style: none;

  li {
    padding: 4px 10px;
    border-radius: 999px;
    background: #f3f4f6;
    font-size: 13px;
    font-weight: 600;
    color: #374151;
  }
`;

export const actions = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
`;

export const cta = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 52px;
  padding: 0 24px;
  border-radius: 12px;
  background: ${ink};
  color: #fff;
  font-size: 16px;
  font-weight: 700;
  text-decoration: none;

  &:hover {
    background: #000;
  }
  &:focus-visible {
    outline: 3px solid rgba(17, 24, 39, 0.25);
    outline-offset: 2px;
  }
`;

export const secondary = css`
  ${cta};
  border: 1px solid #cfd4da;
  background: #fff;
  color: ${text};

  &:hover {
    background: #f7f8f9;
  }
`;

export const links = css`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-auto-rows: 1fr;
  gap: 12px;
  margin-top: 16px;

  @media (max-width: 600px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const linkCard = css`
  display: grid;
  gap: 4px;
  padding: 20px 22px;
  border: 1px solid ${line};
  border-radius: 14px;
  background: #fff;
  color: ${text};
  text-decoration: none;
  transition: border-color 150ms ease;

  strong {
    font-size: 16px;
  }
  span {
    font-size: 13px;
    color: ${muted};
  }
  &:hover {
    border-color: #aeb4bc;
  }
`;
