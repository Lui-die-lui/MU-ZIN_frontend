import { css } from "@emotion/react";
import { ink, mist } from "../../../constants/uiTone";

// 모달 하단 버튼 공용 - 모든 모달이 같은 높이·모서리·글자 (예전: 모달마다 38~44px, 모서리 8~12px, 테두리 제각각)
// primary = 차콜(주 동작) / secondary = 밝은 회색(닫기·취소) / danger = 차분한 빨강(되돌리기 어려운 동작)
export type ModalButtonVariant = "primary" | "secondary" | "danger";

export const DANGER = "#C8463F";

const FILL: Record<ModalButtonVariant, { bg: string; hover: string; color: string }> = {
  primary: { bg: ink, hover: "#000000", color: "#ffffff" },
  secondary: { bg: mist, hover: "#E2E1DC", color: ink },
  danger: { bg: DANGER, hover: "#B23C36", color: "#ffffff" },
};

export const modalBtn = (variant: ModalButtonVariant = "secondary") => css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 44px;
  padding: 0 20px;
  border: 0;
  border-radius: 14px;
  background: ${FILL[variant].bg};
  color: ${FILL[variant].color};
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover:not(:disabled) {
    background: ${FILL[variant].hover};
  }
  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: 3px solid rgba(23, 25, 28, 0.35);
    outline-offset: 2px;
  }
`;
