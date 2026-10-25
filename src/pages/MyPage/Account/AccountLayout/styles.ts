import { css } from "@emotion/react";

export const page = css`
  width: 100%;
`;

// 다른 마이페이지 화면(내 예약 · 리뷰 관리)과 같은 폭 · 여백
export const container = css`
  max-width: 920px;
  margin: 0 auto;
  padding: 28px 24px 48px;
  box-sizing: border-box;

  /* 마이페이지 본문에 이미 좌우 여백(16px)이 있어 좁은 화면에선 겹치지 않게 */
  @media (max-width: 600px) {
    padding: 20px 0 40px;
  }
`;

export const header = css`
  width: 100%;
  display: flex;
  justify-content: flex-start;
  margin-bottom: 20px;
`;

export const content = css`
  width: 100%;
`;
