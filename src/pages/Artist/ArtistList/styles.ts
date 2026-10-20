import { css } from "@emotion/react";
import { paper, sub } from "../../../constants/uiTone";

// 넓으면 3칸, 중간 2칸, 모바일 1칸 (레슨 카드와 같은 기준)
export const list = css`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  grid-auto-rows: 1fr; /* 모든 카드 같은 높이 */
  gap: 14px;
  width: 100%;

  @media (max-width: 1080px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
    grid-auto-rows: auto;
    gap: 10px;
  }
`;

export const empty = css`
  padding: 48px 20px;
  border-radius: 18px;
  background: ${paper};
  color: ${sub};
  font-size: 14px;
  text-align: center;
`;
