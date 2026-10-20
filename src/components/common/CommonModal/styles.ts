import styled from "@emotion/styled";
import { keyframes } from "@emotion/react";
import { ink, line, sub } from "../../../constants/uiTone";

// 공용 모달 - 메인과 같은 결: 테두리 없는 흰 판 + 깊고 부드러운 그림자, 차분한 차콜 배경
// 하단 버튼은 옅은 띠 위 오른쪽 (버튼 모양은 modalButtons.ts)
// 600px 이하: 화면 아래에서 올라오는 시트, 버튼은 같은 폭으로 꽉 채움

const MOBILE = "@media (max-width: 600px)";

const fadeIn = keyframes`from { opacity: 0; }`;
const rise = keyframes`from { opacity: 0; transform: translateY(10px) scale(0.985); }`;
const slideUp = keyframes`from { transform: translateY(100%); }`;

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: grid;
  place-items: center;
  padding: 16px;
  background: rgba(23, 25, 28, 0.42);
  backdrop-filter: blur(3px);
  -webkit-backdrop-filter: blur(3px);
  animation: ${fadeIn} 0.16s ease-out;

  ${MOBILE} {
    align-items: end;
    padding: 0;
  }
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const Modal = styled.div<{ width?: number }>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: ${({ width }) => `min(${width ?? 520}px, 100%)`};
  /* 내용이 길어도 화면 안에: 본문만 스크롤, 아래 버튼은 항상 보임 */
  max-height: calc(100dvh - 32px);
  overflow: hidden;
  border-radius: 24px;
  background: #ffffff;
  color: ${ink};
  text-align: left;
  box-shadow: 0 32px 80px -32px rgba(23, 25, 28, 0.5), 0 2px 8px rgba(23, 25, 28, 0.06);
  outline: none;
  animation: ${rise} 0.2s cubic-bezier(0.2, 0.7, 0.2, 1);

  ${MOBILE} {
    width: 100%;
    max-height: 90dvh;
    border-radius: 24px 24px 0 0;
    animation: ${slideUp} 0.24s cubic-bezier(0.2, 0.7, 0.2, 1);

    /* 시트 손잡이 (장식) */
    &::before {
      content: "";
      position: absolute;
      top: 8px;
      left: 50%;
      width: 36px;
      height: 4px;
      margin-left: -18px;
      border-radius: 999px;
      background: ${line};
    }
  }
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

export const Header = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 20px 18px 8px 24px;

  ${MOBILE} {
    padding: 22px 14px 6px 20px;
  }
`;

export const Title = styled.h3`
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.4;
  word-break: keep-all;
`;

export const CloseBtn = styled.button`
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: ${sub};
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover {
    background: #f2f1ed;
    color: ${ink};
  }
  &:focus-visible {
    outline: 3px solid rgba(23, 25, 28, 0.35);
    outline-offset: 1px;
  }
`;

// 예전: 높이 360px 고정 + 넘치는 내용을 가리지 않아서, 내용이 길면 아래 버튼 위로 겹쳐 버튼을 누를 수 없었음
export const Body = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
  width: 100%;
  padding: 8px 24px 24px;
  overflow-y: auto;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 1.65;

  ${MOBILE} {
    padding: 8px 20px 20px;
  }
`;

// 하단: 옅은 띠 위 오른쪽 정렬 (모바일은 버튼이 같은 폭으로 꽉 참)
export const Footer = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 8px;
  padding: 14px 24px 18px;
  border-top: 1px solid #eeede8;
  background: #faf9f6;

  ${MOBILE} {
    padding: 12px 16px calc(12px + env(safe-area-inset-bottom));

    & button {
      flex: 1 1 0;
      min-width: 0;
    }
    /* 모달이 버튼을 묶음(div)으로 넘기는 경우: 바깥 묶음은 한 줄 전체, 안쪽 묶음은 다른 버튼과 나란히 */
    & > div {
      flex: 1 1 100%;
      min-width: 0;
    }
    & > div > div {
      flex: 1 1 0;
      min-width: 0;
    }
  }
`;
