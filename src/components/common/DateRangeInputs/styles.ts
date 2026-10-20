import { css } from "@emotion/react";

export const input = css`
  flex: 1 1 0;
  min-width: 0;
  max-width: 180px;
  height: 38px;
  padding: 0 10px;
  border: 1px solid #e6e6e6;
  border-radius: 10px;
  background: #fff;
  font-family: inherit;
  box-sizing: border-box;
`;

// 시작 ~ 종료 를 항상 한 줄로 (좁으면 두 칸이 반씩 줄어듦)
export const wrap = css`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;

  span {
    flex-shrink: 0;
    color: #8a9095;
  }

  @media (max-width: 600px) {
    gap: 6px;

    input {
      max-width: none;
      padding: 0 8px;
      font-size: 13px;
    }
  }
`;
