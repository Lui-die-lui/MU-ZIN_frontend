import { css } from "@emotion/react";

const border = "#e2e5e9";
const text = "#1b1d20";
const muted = "#697078";

export const wrap = css`
  display: grid;
  gap: 18px;
`;

export const summaryCard = css`
  display: grid;
  gap: 4px;
  padding: 16px;
  border: 1px solid ${border};
  border-radius: 14px;
  background: #fafafa;
`;

export const summaryLabel = css`
  font-size: 12px;
  font-weight: 600;
  color: ${muted};
`;

export const summaryTitle = css`
  font-size: 16px;
  color: ${text};
  word-break: keep-all;
`;

export const summaryWhen = css`
  margin-top: 4px;
  font-size: 15px;
  font-weight: 600;
  color: ${text};
`;

export const summaryMeta = css`
  font-size: 13px;
  color: ${muted};
`;

export const field = css`
  display: grid;
  gap: 8px;
`;

export const labelRow = css`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
`;

export const label = css`
  font-size: 14px;
  font-weight: 600;
  color: ${text};
`;

export const optional = css`
  font-weight: 500;
  color: ${muted};
`;

export const counter = css`
  font-size: 12px;
  color: #9aa0a6;
`;

export const textarea = css`
  width: 100%;
  padding: 12px;
  border: 1px solid ${border};
  border-radius: 12px;
  background: #fff;
  color: ${text};
  font: inherit;
  font-size: 14px;
  line-height: 1.6;
  box-sizing: border-box;
  resize: vertical;

  &::placeholder {
    color: #9aa0a6;
  }

  &:focus {
    outline: none;
    border-color: ${text};
  }
`;

export const errorBox = css`
  display: grid;
  gap: 6px;
  justify-items: start;
  padding: 12px 14px;
  border: 1px solid #fecaca;
  border-radius: 12px;
  background: #fef2f2;
  color: #b91c1c;
  font-size: 13px;
  line-height: 1.5;
`;

export const linkBtn = css`
  padding: 0;
  border: 0;
  background: none;
  color: #991b1b;
  font: inherit;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
`;

export const notes = css`
  margin: 0;
  padding-left: 18px;
  color: ${muted};
  font-size: 13px;
  line-height: 1.7;
`;
