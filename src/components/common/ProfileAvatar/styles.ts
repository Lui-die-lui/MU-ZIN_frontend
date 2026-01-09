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

export const fallback = css`
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  font-weight: 700;
  /* 배경/색은 너 프로젝트 톤에 맞게 */
  background: rgba(255, 255, 255, 0.08);
`;
