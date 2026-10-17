import { css } from "@emotion/react";

const border = "#e2e5e9";
const text = "#1b1d20";
const muted = "#697078";

export const page = css`
  display: grid;
  gap: 16px;
  max-width: 920px;
  margin: 0 auto;
  padding: 28px 24px 48px;
  color: ${text};
  text-align: left;

  @media (max-width: 600px) {
    padding: 20px 16px 40px;
  }
`;

export const header = css`
  display: grid;
  gap: 8px;
  margin-bottom: 4px;
`;

export const title = css`
  margin: 0;
  font-size: 25px;
  font-weight: 800;
`;

export const desc = css`
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: ${muted};
`;

export const toolbar = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
`;

export const basisSelect = css`
  width: 140px;
`;

export const sortSelect = css`
  width: 120px;
`;

export const range = css`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #9aa0a6;
`;

export const dateInput = (invalid: boolean) => css`
  height: 46px;
  padding: 0 10px;
  border: 1px solid ${invalid ? "#ef4444" : border};
  border-radius: 12px;
  background: #fff;
  color: ${text};
  font: inherit;
  font-size: 14px;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: ${invalid ? "#ef4444" : text};
  }
`;

export const textBtn = css`
  padding: 0 4px;
  border: 0;
  background: none;
  color: ${muted};
  font: inherit;
  font-size: 13px;
  text-decoration: underline;
  cursor: pointer;
`;

export const calendarToggle = (on: boolean) => css`
  margin-left: auto;
  height: 46px;
  padding: 0 16px;
  border: 1px solid ${on ? text : border};
  border-radius: 12px;
  background: ${on ? text : "#fff"};
  color: ${on ? "#fff" : text};
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  @media (max-width: 600px) {
    margin-left: 0;
  }
`;

export const warn = css`
  margin: -8px 0 0;
  font-size: 13px;
  color: #dc2626;
`;

export const pickedChip = css`
  display: inline-flex;
  align-items: center;
  justify-self: start;
  gap: 6px;
  height: 32px;
  padding: 0 6px 0 12px;
  border-radius: 999px;
  background: ${text};
  color: #fff;
  font-size: 13px;
  font-weight: 600;

  button {
    width: 22px;
    height: 22px;
    border: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.18);
    color: #fff;
    cursor: pointer;
  }
`;

export const count = css`
  margin: 4px 0 -6px;
  font-size: 13px;
  color: ${muted};
`;

export const list = css`
  display: grid;
  gap: 10px;
`;

export const skeleton = css`
  height: 84px;
  border-radius: 14px;
  background: #f3f4f6;
`;

export const empty = css`
  display: grid;
  justify-items: center;
  gap: 12px;
  padding: 48px 20px;
  border: 1px dashed #d1d5db;
  border-radius: 16px;
  background: #fafafa;
  color: ${muted};
  font-size: 14px;
  text-align: center;

  strong {
    color: ${text};
    font-size: 15px;
  }
`;

export const askText = css`
  font-size: 13px;
  font-weight: 700;
  color: #b91c1c;
  white-space: nowrap;
`;
