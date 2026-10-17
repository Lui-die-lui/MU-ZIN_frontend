import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { usePrincipalState } from "../../../stores/usePrincipalState";

// 백엔드 /mail/verify 가 인증 처리 후 이 페이지로 리다이렉트 (?result=...)
const RESULT_TEXT: Record<string, { title: string; desc: string; ok: boolean }> = {
  VERIFIED: { title: "이메일 인증 완료", desc: "이제 모든 기능을 이용할 수 있어요.", ok: true },
  ALREADY_VERIFIED: { title: "이미 인증된 이메일이에요", desc: "추가로 할 일은 없어요.", ok: true },
  EXPIRED: {
    title: "인증 링크가 만료되었어요",
    desc: "마이페이지 > 계정 설정에서 인증 메일을 다시 요청해주세요.",
    ok: false,
  },
  INVALID: {
    title: "올바르지 않은 인증 링크예요",
    desc: "메일의 링크를 다시 확인하거나, 인증 메일을 다시 요청해주세요.",
    ok: false,
  },
};

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
    <div style={{ padding: "64px 16px", textAlign: "center" }}>
      <h2 style={{ marginBottom: 8 }}>{result.title}</h2>
      <p style={{ color: "#666", marginBottom: 24 }}>{result.desc}</p>
      <Link to={isAuthenticated ? "/mypage/account" : "/signin"}>
        {isAuthenticated ? "계정 설정으로 이동" : "로그인하러 가기"}
      </Link>
    </div>
  );
}

export default MailVerifyResult;
