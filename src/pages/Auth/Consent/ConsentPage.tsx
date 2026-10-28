/** @jsxImportSource @emotion/react */
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import * as a from "../authStyles";
import ConsentChecklist from "../../../components/legal/ConsentChecklist";
import { allAgreed, EMPTY_CONSENT, type Consent } from "../../../legal/consent";
import { consentReq, oauth2SignupReq } from "../../../apis/auth/authApi";
import { usePrincipalState } from "../../../stores/usePrincipalState";
import { toApiError } from "../../../utils/errorUtils";
import { toast } from "../../../stores/useToastStore";
import { clearPendingSignup, readPendingSignup } from "./pendingSignup";

const PROVIDER_NAMES: Record<string, string> = { google: "구글", naver: "네이버", kakao: "카카오" };

// 내부 경로만 ("//evil.com" 같은 외부 이동 차단)
const safePath = (p: unknown) => (typeof p === "string" && p.startsWith("/") && !p.startsWith("//") ? p : "/");

/*
 * 약관 동의 화면 (/consent)
 *  - 소셜 첫 가입: 소셜 로그인 직후 여기로. 동의해야 계정이 만들어짐
 *  - 기존 회원: 약관이 바뀌었거나 동의 기록이 없으면 로그인 후 여기로 (동의 전에는 다른 화면으로 못 감)
 */
function ConsentPage() {
  const navigate = useNavigate();
  const loc = useLocation();
  const [pending] = useState(readPendingSignup);
  const hydrated = usePrincipalState((st) => st.hydrated);
  const principal = usePrincipalState((st) => st.principal);
  const logout = usePrincipalState((st) => st.logout);
  const [consent, setConsent] = useState<Consent>(EMPTY_CONSENT);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signupMode = !!pending && !principal;
  if (!signupMode) {
    if (!hydrated) return <div style={{ padding: 16 }}>로딩중...</div>;
    if (!principal) return <Navigate to="/signin" replace />;
    if (!principal.consentRequired) return <Navigate to="/" replace />;
  }

  const back = safePath((loc.state as { from?: { pathname?: string } } | null)?.from?.pathname);

  const submit = async () => {
    if (!allAgreed(consent) || busy) return;
    setBusy(true);
    setError(null);
    try {
      if (signupMode && pending) {
        const res = await oauth2SignupReq({ signupToken: pending.token, ...consent });
        clearPendingSignup();
        const token = res.data.data;
        localStorage.setItem("accessToken", token.startsWith("Bearer ") ? token.slice(7) : token);
        // 새로고침 이동으로 로그인 상태를 확실히 반영
        window.location.replace(safePath(pending.redirect));
        return;
      }
      await consentReq(consent);
      await usePrincipalState.getState().refreshPrincipal();
      toast.success("동의가 저장됐어요.");
      navigate(back, { replace: true });
    } catch (e) {
      const err = toApiError(e);
      if (err.code === "SIGNUP_TOKEN_INVALID") clearPendingSignup();
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const cancel = () => {
    if (signupMode) {
      clearPendingSignup();
      navigate("/signin", { replace: true });
    } else {
      logout();
      navigate("/", { replace: true });
    }
  };

  const providerName = pending?.provider ? PROVIDER_NAMES[pending.provider] ?? pending.provider : null;

  return (
    <div css={a.page}>
      <div css={a.container}>
        <Link to="/" css={a.logo} aria-label="MU:ZIN 홈으로">
          MU:ZIN
        </Link>
        <div css={a.box}>
          <h1 css={a.title}>{signupMode ? "가입을 마무리해 주세요" : "약관 동의가 필요해요"}</h1>
          <p css={a.infoText}>
            {signupMode
              ? `${providerName ? `${providerName} 계정으로 ` : ""}MU:ZIN 에 가입하려면 아래 항목에 동의해 주세요. 동의하기 전에는 계정이 만들어지지 않아요.`
              : "이용약관과 개인정보 처리방침이 새로 생겼거나 바뀌었어요. 계속 이용하려면 동의해 주세요."}
          </p>

          <ConsentChecklist value={consent} onChange={setConsent} disabled={busy} />

          {error && (
            <p role="alert" css={a.infoText} style={{ color: "#A3332D" }}>
              {error}
              {signupMode && (
                <>
                  {" "}
                  <Link to="/signin" css={a.link}>
                    로그인 화면으로
                  </Link>
                </>
              )}
            </p>
          )}

          <button type="button" css={a.primaryButton} onClick={submit} disabled={busy || !allAgreed(consent)}>
            {busy ? "처리하는 중..." : signupMode ? "동의하고 가입하기" : "동의하고 계속하기"}
          </button>
        </div>

        <nav css={a.links} aria-label="다른 선택">
          <button type="button" css={a.link} onClick={cancel} style={{ background: "none", border: 0, cursor: "pointer", font: "inherit" }}>
            {signupMode ? "가입하지 않기" : "동의하지 않고 로그아웃"}
          </button>
        </nav>
      </div>
    </div>
  );
}

export default ConsentPage;
