import { css } from "@emotion/react";

// 요즘 네이버 로그인처럼 밑줄 입력칸 + 위로 올라가는 라벨

export const group = css`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const field = (invalid: boolean) => css`
  display: flex;
  align-items: flex-end;
  gap: 4px;
  border-bottom: 1px solid ${invalid ? "#e11d48" : "#d1d5db"};
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:focus-within {
    border-bottom-color: ${invalid ? "#e11d48" : "#111827"};
    box-shadow: 0 1px 0 0 ${invalid ? "#e11d48" : "#111827"};
  }
`;

export const control = css`
  position: relative;
  flex: 1;
  min-width: 0;
  height: 60px;
`;

export const input = css`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 36px;
  width: 100%;
  padding: 0 0 6px;
  border: 0;
  background: transparent;
  color: #1b1d20;
  font: inherit;
  font-size: 17px;
  outline: none;
  box-sizing: border-box;

  /* 브라우저 자동완성 시 노란/파란 배경 대신 흰 배경 유지 */
  &:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px #fff inset;
    -webkit-text-fill-color: #1b1d20;
  }

  /* 비어 있고 초점이 없으면 라벨이 칸 안에 크게 */
  &:placeholder-shown:not(:focus) + label {
    top: 30px;
    font-size: 16px;
    color: #9ca3af;
  }
`;

// 기본(값 있음/초점) 위치: 위쪽에 작게
export const label = css`
  position: absolute;
  left: 0;
  top: 6px;
  font-size: 13px;
  color: #6b7280;
  pointer-events: none;
  transition: top 0.15s ease, font-size 0.15s ease, color 0.15s ease;
`;

export const actions = css`
  display: flex;
  align-items: center;
  gap: 2px;
  height: 40px;
  padding-bottom: 2px;
`;

export const iconButton = css`
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #6b7280;
  font-size: 20px;
  cursor: pointer;

  &:hover {
    color: #1b1d20;
  }

  &:focus-visible {
    outline: 2px solid #111827;
  }
`;

export const clearButton = css`
  ${iconButton};
  font-size: 18px;
  color: #c4c8cd;

  &:hover {
    color: #6b7280;
  }
`;

export const capsBadge = css`
  margin-right: 4px;
  padding: 2px 6px;
  border-radius: 6px;
  background: #f3f4f6;
  color: #1b1d20;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
`;

export const srOnly = css`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
`;

// 칸 아래 안내 문구
export const messages = css`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin: 12px 0 0;
  padding: 0;
  list-style: none;
  text-align: left;
`;

export const errorText = css`
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: #e11d48;
`;
