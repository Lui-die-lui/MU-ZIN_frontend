import { css } from "@emotion/react";

// 이메일 인증 결과 - 로그인 화면 틀(authStyles) 안에서 가운데 정렬 안내

export const result = css`
  display: grid;
  justify-items: center;
  gap: 8px;
  padding: 8px 4px 0;
  text-align: center;
`;

export const icon = (ok: boolean) => css`
  display: grid;
  place-items: center;
  width: 56px;
  height: 56px;
  margin-bottom: 8px;
  border-radius: 50%;
  background: ${ok ? "#f3f4f6" : "#fbeeed"};
  color: ${ok ? "#111827" : "#a3332d"};
`;

export const desc = css`
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #6b7280;
  word-break: keep-all;
`;

// 버튼 모양 링크 (authStyles.primaryButton 과 함께)
export const linkButton = css`
  display: grid;
  place-items: center;
  margin-top: 28px;
  text-decoration: none;
`;
