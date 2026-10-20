import { css } from "@emotion/react";

// 메인 톤 (메인 · 레슨 찾기 · 아티스트 찾기 공용)
// 밝은 바탕 + 충분한 여백, 차콜 글자 / 오프화이트 · 밝은 회색 면, 포인트 컬러 없음 (주요 버튼은 차콜)
// 테두리 대신 반투명 면과 옅은 그림자로 층을 나눔. 실버는 얇은 선에만
// 둥근 정도: 섹션 24 · 카드 18 · 버튼 14 · 칩 8 (모바일 섹션 20)
export const ink = "#17191C"; // 차콜
export const sub = "#5F656A"; // 보조 글자
export const faint = "#8A9095";
export const paper = "#F5F4F0"; // 오프화이트 면
export const mist = "#ECEBE7"; // 밝은 회색 면
export const line = "#E1E0DB";
export const silver = "#C5CACD"; // 얇은 실버 선

export const focusRing = css`
  &:focus-visible {
    outline: 3px solid rgba(23, 25, 28, 0.35);
    outline-offset: 3px;
  }
`;
