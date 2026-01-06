import styled from "@emotion/styled";
import { css } from "@emotion/react";

// 사이드 바 틀
export const root = css`
  position: fixed;
  inset: 0;
  z-index: 9999;
  pointer-events: none;
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
  transition: transform 220ms ease;

  display: flex;
  flex-direction: column;

  pointer-events: auto; /* 패널은 클릭 가능 */
`;

// 헤더 영역
export const header = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
`;

// 타이틀
export const headerTitle = css`
  font-size: 15px;
  font-weight: 700;
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
  padding: 14px;
  overflow: auto;
`;
