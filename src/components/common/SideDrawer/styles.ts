import { css, keyframes } from "@emotion/react";

// 모바일(600px 이하)에서는 아래에서 올라오는 시트
const MOBILE = "@media (max-width: 600px)";

const slideFromRight = keyframes`from { transform: translateX(100%); } to { transform: translateX(0); }`;
const slideFromLeft = keyframes`from { transform: translateX(-100%); } to { transform: translateX(0); }`;
const slideUp = keyframes`from { transform: translateY(100%); } to { transform: translateY(0); }`;
const fadeIn = keyframes`from { opacity: 0; } to { opacity: 1; }`;

// 사이드 바 틀
export const root = css`
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(17, 24, 39, 0.2);
  pointer-events: auto;
  animation: ${fadeIn} 180ms ease;

  ${MOBILE} {
    background: rgba(17, 24, 39, 0.4);
  }
`;

// 패널 붙일 곳
export const panel = (
  open: boolean,
  width: number,
  anchor: "right" | "left"
) => css`
  position: absolute;
  top: 0;
  bottom: 0;
  ${anchor}: 0;

  width: ${width}px;
  max-width: 92vw;

  background: #fff;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.18);

  transform: translateX(${open ? "0" : anchor === "right" ? "100%" : "-100%"});
  /* 열릴 때만 그려지므로 transition 대신 등장 애니메이션 */
  animation: ${anchor === "right" ? slideFromRight : slideFromLeft} 220ms ease;

  display: flex;
  flex-direction: column;

  pointer-events: auto;
  outline: none;

  ${MOBILE} {
    top: auto;
    left: 0;
    right: 0;
    bottom: 0;
    /* 스크롤바 자리(scrollbar-gutter)까지 덮어 화면 끝에 붙게 (100% 면 그 자리만큼 비어 보임) */
    width: 100vw;
    max-width: 100vw;
    max-height: 88dvh;
    border-radius: 20px 20px 0 0;
    box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.18);
    transform: none;
    animation: ${slideUp} 260ms cubic-bezier(0.2, 0.8, 0.2, 1);
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// 헤더 영역
export const header = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);

  ${MOBILE} {
    position: relative;
    padding: 20px 16px 12px;

    /* 시트 손잡이 */
    &::before {
      content: "";
      position: absolute;
      top: 8px;
      left: 50%;
      width: 40px;
      height: 4px;
      border-radius: 999px;
      background: #d1d5db;
      transform: translateX(-50%);
    }
  }
`;

// 타이틀
export const headerTitle = css`
  font-size: 15px;
  font-weight: 600;
`;

// 닫기 버튼
export const closeBtn = css`
  border: 0;
  background: transparent;
  font-size: 26px;
  line-height: 1;
  cursor: pointer;
  padding: 4px 8px;
`;

// 상세 정보
export const content = css`
  flex: 1;
  min-height: 0;
  padding: 16px 18px 20px;
  overflow: auto;
`;

// 아래 고정 영역 (주요 버튼)
export const footer = css`
  flex-shrink: 0;
  padding: 12px 18px 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  background: #fff;

  ${MOBILE} {
    padding: 12px 16px calc(12px + env(safe-area-inset-bottom));
  }
`;
