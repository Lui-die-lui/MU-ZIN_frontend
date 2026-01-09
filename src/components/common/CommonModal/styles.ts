import styled from "@emotion/styled";
import { css } from "@emotion/react";

// 모달 뒤 명도 낮아지게 오버레이
export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.55);
  display: grid;
  place-items: center;
  z-index: 9999;
`;

// 모달
export const Modal = styled.div<{ width?: number }>`
  width: ${({ width }) =>
    width
      ? `min(${width}px, calc(100vw - 24px))`
      : "min(520px, calc(100vw - 24px))"};
  background: #fff;
  border-radius: 16px;
  overflow: hidden;
`;

// 제목 및 취소 아이콘
export const Header = styled.div`
  padding: 14px 16px;
  /* display: flex;
  align-items: center;
  justify-content: space-between; */
  display: flex;
  justify-content: flex-end;
`;

// props 내 제목
export const Title = styled.h3`
  margin: 0;
  font-size: 14px;
  font-weight: 900;
`;

// 닫기 버튼
export const CloseBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 50px;
  border: 1px solid #e5e7eb;
  background: #fff;
  cursor: pointer;
`;

// 바디 영역
export const Body = styled.div`
  position: relative;
  width: 100%;
  height: 360px;
`;

// 버튼 공간
export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
`;
