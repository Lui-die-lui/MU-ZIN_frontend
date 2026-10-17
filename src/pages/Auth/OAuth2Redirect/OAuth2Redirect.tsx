import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { AuthRedirectState } from "../../../Types/routerState";

const PROVIDER_NAMES: Record<string, string> = {
  google: "구글",
  naver: "네이버",
  kakao: "카카오",
};

// 백엔드 OAuth2SuccessHandler / OAuth2FailureHandler 의 errorCode
function oauthErrorMessage(code: string, registeredWith: string | null) {
  switch (code) {
    case "EMAIL_ALREADY_REGISTERED":
      if (!registeredWith || registeredWith === "email") {
        return "이미 이메일로 가입된 계정입니다. 이메일과 비밀번호로 로그인해주세요.";
      }
      return `이미 ${PROVIDER_NAMES[registeredWith] ?? registeredWith} 계정으로 가입된 이메일입니다. ${
        PROVIDER_NAMES[registeredWith] ?? registeredWith
      } 로그인을 이용해주세요.`;
    case "EMAIL_REQUIRED":
      return "이메일 제공에 동의해야 가입할 수 있습니다. 소셜 로그인 시 이메일 제공에 동의해주세요.";
    case "ACCOUNT_SUSPENDED":
      return "이용이 정지된 계정입니다. 관리자에게 문의해주세요.";
    default:
      return "소셜 로그인에 실패했습니다. 다시 시도해주세요.";
  }
}

// 내부 경로만 허용 ("//evil.com" 처럼 외부로 나가는 경로 차단)
function safeInternalPath(next: string | null) {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.startsWith("/\\")) return "/";
  return next;
}

function OAuth2Redirect() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const handled = useRef(false);

  useEffect(() => {
    if (handled.current) return; // StrictMode 이중 실행 방지
    handled.current = true;

    const token = params.get("accessToken");
    const errorCode = params.get("errorCode");

    if (errorCode || !token) {
      const state: AuthRedirectState = {
        oauthError: oauthErrorMessage(errorCode ?? "", params.get("registeredWith")),
      };
      navigate("/signin", { replace: true, state });
      return;
    }

    const pure = token.startsWith("Bearer ") ? token.slice(7) : token;
    localStorage.setItem("accessToken", pure);

    // 새로고침 이동으로 주소창의 토큰 제거 + principal 상태를 확실히 갱신
    window.location.replace(safeInternalPath(params.get("redirect")));
  }, [params, navigate]);

  return <div style={{ padding: 16 }}>로그인 처리중...</div>;
}

export default OAuth2Redirect;
