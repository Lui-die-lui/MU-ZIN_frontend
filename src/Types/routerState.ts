import type { Location } from "react-router-dom";

export type AuthRedirectState = {
  from?: Location;
  // 소셜 로그인 실패 사유 (OAuth2Redirect -> 로그인 화면)
  oauthError?: string;
};
