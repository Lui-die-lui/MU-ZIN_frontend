import { css } from "@emotion/react";
import { faint, ink, line, mist, sub } from "../../../constants/uiTone";

// 알림 설정 - 마이페이지 카드 톤 (흰 카드, 옅은 테두리)

export const page = css`
  display: grid;
  gap: 16px;
  max-width: 820px;
  margin: 0 auto;
  padding: 28px 24px 48px;
  color: ${ink};
  text-align: left;

  @media (max-width: 600px) {
    padding: 20px 16px 40px;
  }
`;

export const header = css`
  display: grid;
  gap: 6px;
  margin-bottom: 4px;
`;

export const title = css`
  margin: 0;
  font-size: 25px;
  font-weight: 700;
`;

export const desc = css`
  margin: 0;
  font-size: 13px;
  color: ${sub};
`;

export const card = css`
  display: grid;
  gap: 16px;
  padding: 24px;
  border: 1px solid #e8e8e8;
  border-radius: 20px;
  background: #fff;

  @media (max-width: 600px) {
    padding: 18px 16px;
    border-radius: 16px;
  }
`;

export const cardHead = css`
  display: flex;
  align-items: center;
  gap: 14px;
`;

export const icon = css`
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 14px;
  background: ${mist};
  color: ${ink};
`;

export const cardTitle = css`
  margin: 0;
  font-size: 17px;
  font-weight: 600;
`;

export const cardDesc = css`
  margin: 4px 0 0;
  font-size: 13px;
  line-height: 1.5;
  color: ${sub};
`;

// 받는 소식 목록
export const topicList = css`
  display: grid;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    display: grid;
    gap: 2px;
    padding: 12px 0;
    border-top: 1px solid ${line};
  }
  li:first-of-type {
    border-top: 0;
    padding-top: 0;
  }
  b {
    font-size: 14px;
    font-weight: 600;
  }
  span {
    font-size: 13px;
    line-height: 1.5;
    color: ${sub};
  }
`;

export const note = css`
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: ${faint};
`;

// 안내 다시 보기 줄
export const helpRow = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
  }
`;
