import { css } from "@emotion/react";

// 마이페이지 공통 틀 (내 예약 화면과 같은 값)
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

export const hint = css`
  margin: 0;
  font-size: 13px;
  color: ${muted};
`;

export const notice = css`
  margin: 0;
  padding: 12px 14px;
  border-radius: 10px;
  background: #f3f4f6;
  color: #1b1d20;
  font-size: 14px;
  font-weight: 600;
`;

export const writableList = css`
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const writableCard = css`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border: 1px solid #e2e5e9;
  border-radius: 14px;
  background: #fff;

  @media (max-width: 600px) {
    flex-wrap: wrap;
  }
`;

export const writableInfo = css`
  display: grid;
  gap: 4px;
  flex: 1;
  min-width: 0;

  strong {
    font-size: 15px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  span {
    font-size: 13px;
    color: ${muted};
  }
`;

export const deadline = (urgent: boolean) => css`
  flex-shrink: 0;
  padding: 4px 10px;
  border-radius: 999px;
  background: ${urgent ? "#fff1f2" : "#f3f4f6"};
  color: ${urgent ? "#be123c" : muted};
  font-size: 12px;
  font-weight: 700;
`;
