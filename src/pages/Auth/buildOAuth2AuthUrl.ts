// URL 규칙 파일
// flow/redirect_url/redirect 파라미터를 어떻게 구성할지
// 엔드 포인트 경로가 뭔지 (/oauth2/authorization/{provider})
// 정책이 바뀌어도 UI를 건들이지 않고 URL 규칙만 고치면 되게 관심사 분리 시킴

// OAuth2 types
export type OAuthProvider = "google" | "naver" | "kakao";
export type OAuthFlow = "signin" | "signup" | "merge";

export function buildOAuth2AuthUrl(args: {
  provider: OAuthProvider;
  flow: OAuthFlow;
  redirectPath?: string;
}) {
  const { provider, flow, redirectPath = "/" } = args;

  const apiBase = import.meta.env.VITE_API_BASE_URL;
  const redirectUrl = `${window.location.origin}/oauth2/redirect`;

  const params = new URLSearchParams();
  params.set("flow", flow);
  params.set("redirect_url", redirectUrl);
  params.set("redirect", redirectPath);

  return `${apiBase}/oauth2/authorization/${provider}?${params.toString()}`;
}
