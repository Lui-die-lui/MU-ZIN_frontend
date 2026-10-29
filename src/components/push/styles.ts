import { css } from "@emotion/react";
import { faint, ink, line, mist, paper, sub } from "../../constants/uiTone";

// 알림 설정 안내 - 메인 톤(차콜 · 오프화이트), 포인트 색 없음

export const carousel = css`
  display: grid;
  gap: 14px;
`;

export const track = css`
  display: flex;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
  border-radius: 18px;

  &::-webkit-scrollbar {
    display: none;
  }
  &:focus-visible {
    outline: 3px solid rgba(23, 25, 28, 0.35);
    outline-offset: 2px;
  }
`;

export const card = css`
  flex: 0 0 100%;
  box-sizing: border-box;
  display: grid;
  align-content: start;
  gap: 10px;
  min-height: 260px;
  padding: 24px 20px;
  border-radius: 18px;
  background: ${paper};
  scroll-snap-align: start;
  scroll-snap-stop: always;
  text-align: left;
`;

export const icon = css`
  display: grid;
  place-items: center;
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: #fff;
  color: ${ink};
  box-shadow: 0 1px 2px rgba(23, 25, 28, 0.06);
`;

export const cardTitle = css`
  margin: 4px 0 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.4;
  color: ${ink};
  word-break: keep-all;
`;

export const cardBody = css`
  display: grid;
  gap: 10px;
  font-size: 14px;
  line-height: 1.65;
  color: ${sub};
  word-break: keep-all;

  p {
    margin: 0;
  }
`;

export const dots = css`
  display: flex;
  justify-content: center;
  gap: 6px;
`;

export const dot = (active: boolean) => css`
  width: ${active ? 18 : 8}px;
  height: 8px;
  padding: 0;
  border: 0;
  border-radius: 999px;
  background: ${active ? ink : line};
  cursor: pointer;
  transition: width 0.2s ease;

  /* 누르기 쉬운 크기 (보이는 점보다 넓게) */
  position: relative;
  &::after {
    content: "";
    position: absolute;
    inset: -10px -4px;
  }
  &:focus-visible {
    outline: 2px solid rgba(23, 25, 28, 0.45);
    outline-offset: 3px;
  }
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

export const footer = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
`;

export const footerNav = css`
  display: flex;
  gap: 8px;
`;

export const textBtn = css`
  padding: 8px 4px;
  border: 0;
  background: none;
  color: ${sub};
  font: inherit;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    color: ${ink};
  }
  &:focus-visible {
    outline: 3px solid rgba(23, 25, 28, 0.35);
    border-radius: 8px;
  }
`;

export const check = css`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  width: fit-content;
  margin-top: 6px;
  font-size: 15px;
  font-weight: 600;
  color: ${ink};
  cursor: pointer;

  input {
    width: 20px;
    height: 20px;
    margin: 0;
    accent-color: ${ink};
  }
`;

export const note = css`
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: ${faint};
`;

export const enableBox = css`
  display: grid;
  gap: 8px;
`;

export const primaryBtn = css`
  height: 46px;
  padding: 0 20px;
  border: 0;
  border-radius: 14px;
  background: ${ink};
  color: #fff;
  font: inherit;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: 3px solid rgba(23, 25, 28, 0.35);
    outline-offset: 2px;
  }
`;

// 설정 화면: 버튼을 글자 폭만큼 (안내 모달에서는 가득)
export const fitBtn = css`
  justify-self: start;
  min-width: 160px;

  @media (max-width: 600px) {
    justify-self: stretch;
  }
`;

export const secondaryBtn = css`
  justify-self: start;
  height: 40px;
  padding: 0 16px;
  border: 0;
  border-radius: 12px;
  background: ${mist};
  color: ${ink};
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
  &:focus-visible {
    outline: 3px solid rgba(23, 25, 28, 0.35);
    outline-offset: 2px;
  }
`;

export const status = (tone: "ok" | "warn") => css`
  display: grid;
  gap: 6px;
  padding: 14px 16px;
  border-radius: 14px;
  background: #fff;
  box-shadow: inset 0 0 0 1px ${tone === "warn" ? "#E7C9C6" : line};

  strong {
    font-size: 14px;
    color: ${tone === "warn" ? "#A3332D" : ink};
  }
  p {
    margin: 0;
    font-size: 13px;
    line-height: 1.6;
    color: ${sub};
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
