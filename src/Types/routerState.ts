import type { Location } from "react-router-dom";

export type AuthRedirectState = {
  from?: Location;
  // 소셜 로그인 실패 사유 (OAuth2Redirect -> 로그인 화면)
  oauthError?: string;
  // 회원가입 직후 로그인 화면에 채워둘 이메일
  email?: string;
};
