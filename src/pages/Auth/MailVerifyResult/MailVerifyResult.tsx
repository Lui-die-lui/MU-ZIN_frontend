/** @jsxImportSource @emotion/react */
import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { usePrincipalState } from "../../../stores/usePrincipalState";
import * as a from "../authStyles";
import * as s from "./styles";

// 백엔드 /mail/verify 가 인증 처리 후 이 페이지로 리다이렉트 (?result=...)
const RESULT_TEXT: Record<string, { title: string; desc: string; ok: boolean }> = {
  VERIFIED: { title: "이메일 인증이 끝났어요", desc: "이제 MU:ZIN 의 모든 기능을 이용할 수 있어요.", ok: true },
  ALREADY_VERIFIED: { title: "이미 인증된 이메일이에요", desc: "추가로 할 일은 없어요.", ok: true },
  EXPIRED: {
    title: "인증 링크가 만료되었어요",
    desc: "마이페이지 > 인증 및 개인정보에서 인증 메일을 다시 요청해주세요.",
    ok: false,
  },
  INVALID: {
    title: "올바르지 않은 인증 링크예요",
    desc: "메일의 링크를 다시 확인하거나, 인증 메일을 다시 요청해주세요.",
    ok: false,
  },
};

const CheckIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12.5l4.5 4.5L19 7.5" />
  </svg>
);

const AlertIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
    <path d="M12 7v6" />
    <path d="M12 17h.01" />
  </svg>
);

function MailVerifyResult() {
  const [params] = useSearchParams();
  const result = RESULT_TEXT[params.get("result") ?? ""] ?? RESULT_TEXT.INVALID;
  const isAuthenticated = usePrincipalState((s) => s.isAuthenticated);
  const updatePrincipal = usePrincipalState((s) => s.updatePrincipal);

  // 로그인 상태에서 인증했으면 화면의 인증 여부도 바로 반영
  useEffect(() => {
    if (result.ok && isAuthenticated) updatePrincipal({ emailVerified: true });
  }, [result.ok, isAuthenticated, updatePrincipal]);

  return (
    <div css={a.page}>
      <div css={a.container}>
        <Link to="/" css={a.logo} aria-label="MU:ZIN 홈으로">
          MU:ZIN
        </Link>

        <div css={s.result} role={result.ok ? "status" : "alert"}>
          <span css={s.icon(result.ok)}>{result.ok ? <CheckIcon /> : <AlertIcon />}</span>
          <h1 css={a.title}>{result.title}</h1>
          <p css={s.desc}>{result.desc}</p>
        </div>

        <Link to={isAuthenticated ? "/mypage/account" : "/signin"} css={[a.primaryButton, s.linkButton]}>
          {isAuthenticated ? "인증 및 개인정보로 가기" : "로그인하러 가기"}
        </Link>

        <nav css={a.links} aria-label="다른 이동">
          <Link to="/" css={a.link}>
            홈으로
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default MailVerifyResult;
