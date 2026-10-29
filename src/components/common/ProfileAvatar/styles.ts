import { css } from "@emotion/react";

export const circle = (size: number) => css`
  width: ${size}px;
  height: ${size}px;
  border-radius: 9999px;
  overflow: hidden;
  flex: 0 0 auto;
`;

export const img = css`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

// 사진이 없을 때 이름 첫 글자 (예전 배경은 흰 화면에서 거의 안 보여서 빈 칸처럼 보였음)
export const fallback = (size: number) => css`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  background: #eef0f2;
  color: #4c5157;
  font-size: ${Math.max(12, Math.round(size * 0.4))}px;
  font-weight: 600;
`;
