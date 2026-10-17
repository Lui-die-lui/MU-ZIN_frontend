import { css } from "@emotion/react";

export const input = css`
  /* flex: 1 만 쓰면 세로로 쌓이는 부모 안에서 높이가 0 기준으로 줄어들어 46px이 무시됨
     -> 레슨 검색창과 높이가 달라 탭을 넘길 때 아래 필터들이 위아래로 튀었음 */
  flex: 1 1 auto;
  width: 100%;
  box-sizing: border-box;
  height: 46px;
  min-height: 46px;
  padding: 0 14px;
  border: 1px solid #cfd4da;
  border-radius: 10px;
  font: inherit;
  font-size: 14px;
  color: #1b1d20; /* 레슨 검색어 입력칸과 동일 */
  background-color: #fff;

  &::placeholder { color: #989da3; }

  &:focus { outline: 3px solid rgba(17, 24, 39, 0.1); border-color: #111827; }
`;
