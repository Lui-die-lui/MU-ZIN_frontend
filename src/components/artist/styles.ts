import { css } from "@emotion/react";

// 팔로우 버튼: 인스타그램 모양 + 브랜드 톤 (팔로우 = 검정 / 팔로잉 = 연회색)
const ink = "#111827";
const inkHover = "#000000";
const gray = "#f3f4f6";
const grayHover = "#e5e7eb";

export const followButton = (on: boolean, size: "md" | "sm") => css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  box-sizing: border-box;
  height: ${size === "md" ? 40 : 32}px; /* md: 아티스트 페이지의 다른 버튼(40px)과 같은 높이 */
  min-width: ${size === "md" ? 104 : 72}px;
  padding: 0 ${size === "md" ? 18 : 12}px;
  border: 1px solid ${on ? gray : ink};
  border-radius: ${size === "md" ? 10 : 8}px;
  background: ${on ? gray : ink};
  color: ${on ? "#000" : "#fff"};
  font: inherit;
  font-size: ${size === "md" ? 14 : 13}px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover {
    background: ${on ? grayHover : inkHover};
    border-color: ${on ? grayHover : inkHover};
  }
  &:focus-visible {
    outline: 3px solid rgba(17, 24, 39, 0.25);
    outline-offset: 2px;
  }
`;

// ---------- 팔로우 취소 확인 창 ----------
// 팔로우 취소 확인 - 공용 모달과 같은 배경·모서리·그림자, 버튼은 세로로 쌓는 형태 유지
export const dialogOverlay = css`
  position: fixed;
  inset: 0;
  z-index: 10000; /* 다른 모달(9999)·상단 메뉴 위 */
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(23, 25, 28, 0.42);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  animation: unfollowFade 0.16s ease-out;

  @keyframes unfollowFade {
    from {
      opacity: 0;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const dialog = css`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 360px;
  overflow: hidden;
  border-radius: 24px;
  background: #fff;
  text-align: center;
  box-shadow: 0 32px 80px -32px rgba(23, 25, 28, 0.5), 0 2px 8px rgba(23, 25, 28, 0.06);
  animation: unfollowPop 0.2s cubic-bezier(0.2, 0.7, 0.2, 1);

  @keyframes unfollowPop {
    from {
      transform: translateY(10px) scale(0.985);
      opacity: 0;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const dialogHead = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 32px 24px 24px;
`;

export const dialogText = css`
  margin: 0;
  word-break: keep-all; /* "취소하시겠어 / 요?" 처럼 단어 중간에서 줄바꿈되지 않게 */
  overflow-wrap: anywhere;
  font-size: 15px;
  line-height: 1.55;
  color: #5f656a;

  strong {
    font-weight: 800;
    color: #17191c;
  }
`;

const dialogRow = css`
  height: 52px;
  border: 0;
  border-top: 1px solid #eeede8;
  background: #fff;
  font: inherit;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover,
  &:active {
    background: #faf9f6;
  }
  &:focus-visible {
    outline: none;
    background: #f2f1ed;
  }
`;

export const dialogDanger = css`
  ${dialogRow};
  color: #c8463f;
  font-weight: 800;
`;

export const dialogCancel = css`
  ${dialogRow};
  color: #17191c;
  font-weight: 600;
`;
