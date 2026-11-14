import { css, keyframes } from "@emotion/react";
import { ink } from "../../../constants/uiTone";

const appear = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const rise = keyframes`
  0%, 80%, 100% { transform: translateY(0); opacity: 0.25; }
  40% { transform: translateY(-6px); opacity: 1; }
`;

export const wrap = css`
  display: grid;
  place-items: center;
  min-height: 100vh;
  min-height: 100dvh; /* 화면 정가운데 (상단 메뉴가 뜨기 전이라 화면 전체 기준) */
  opacity: 0;
  animation: ${appear} 0.3s ease 0.25s forwards; /* 0.25초 안에 끝나면 아무것도 안 보임 */
`;

export const dots = css`
  display: inline-flex;
  gap: 7px;

  i {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${ink};
    animation: ${rise} 1.1s ease-in-out infinite;
  }
  i:nth-of-type(2) {
    animation-delay: 0.15s;
  }
  i:nth-of-type(3) {
    animation-delay: 0.3s;
  }

  @media (prefers-reduced-motion: reduce) {
    i {
      animation: none;
      opacity: 0.5;
    }
  }
`;

export const srOnly = css`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
`;
