import { css } from "@emotion/react";

// 로그인 / 회원가입 화면 공통 틀 (네이버 로그인 화면 구성: 큰 로고 → 테두리 상자 → 상자 아래 링크)

export const page = css`
  display: flex;
  justify-content: center;
  padding: 48px 16px 80px;
  box-sizing: border-box;
  text-align: left;

  @media (max-width: 600px) {
    padding-top: 24px;
  }
`;

export const container = css`
  width: 100%;
  max-width: 440px;
`;

export const logo = css`
  display: block;
  margin-bottom: 28px;
  text-align: center;
  font-size: 34px;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: #111827;
  text-decoration: none;
`;

// 요즘 네이버 로그인처럼 상자 테두리 없이 입력칸만
export const box = css`
  padding: 0 4px;
`;

export const title = css`
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 700;
  color: #1b1d20;
`;

export const primaryButton = css`
  width: 100%;
  height: 52px;
  margin-top: 37px;
  border: 0;
  border-radius: 10px;
  background: #111827;
  color: #fff;
  font: inherit;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover:not(:disabled) {
    background: #000;
  }

  &:focus-visible {
    outline: 3px solid rgba(17, 24, 39, 0.25);
    outline-offset: 2px;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

export const infoText = css`
  margin: 16px 2px 0;
  font-size: 13px;
  line-height: 1.6;
  color: #6b7280;
`;

export const divider = css`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 28px 0 18px;
  font-size: 13px;
  color: #989da3;

  &::before,
  &::after {
    content: "";
    flex: 1;
    height: 1px;
    background: #e5e7eb;
  }
`;

export const socialList = css`
  display: flex;
  justify-content: center;
  gap: 14px;
`;

// 상자 아래 링크 줄 (네이버의 "비밀번호 찾기 | 아이디 찾기 | 회원가입" 자리)
export const links = css`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 24px;
  font-size: 14px;
  color: #6b7280;
`;

export const linkBar = css`
  width: 1px;
  height: 12px;
  background: #d1d5db;
`;

export const link = css`
  color: #374151;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;
