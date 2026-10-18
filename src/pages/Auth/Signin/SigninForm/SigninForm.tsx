/** @jsxImportSource @emotion/react */
import * as s from "../../authStyles";
import * as f from "../../AuthInput/styles";

import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { usePrincipalState } from "../../../../stores/usePrincipalState";
import type { AuthRedirectState } from "../../../../Types/routerState";
import AuthInput from "../../AuthInput/AuthInput";
import OAuth2Button from "../../OAuth2Button/OAuth2Button";

type FieldErrors = { email?: string; password?: string };

const MESSAGE_ID = "signin-messages";

function SigninForm() {
  const navigate = useNavigate();
  const loc = useLocation();

  const state = loc.state as AuthRedirectState | null;
  const fromPath = state?.from?.pathname ?? "/";

  // 로그인 되어있으면 로그인 화면 접근 불가
  const isAuthenticated = usePrincipalState((s) => s.isAuthenticated);
  const signin = usePrincipalState((s) => s.signin);

  // 회원가입 직후면 가입한 이메일을 채워두고 비밀번호 칸부터
  const [email, setEmail] = useState(state?.email ?? "");
  const [password, setPassword] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  // 소셜 로그인 실패 사유가 넘어왔으면 처음부터 보여줌
  const [errorMsg, setErrorMsg] = useState<string | null>(state?.oauthError ?? null);

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(fromPath, { replace: true });
    }
  }, [isAuthenticated, navigate, fromPath]);

  // 제출
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setErrorMsg(null);

    const errs: FieldErrors = {};
    if (!email.trim()) errs.email = "이메일을 입력해주세요.";
    if (!password) errs.password = "비밀번호를 입력해주세요.";
    setFieldErrors(errs);
    if (errs.email) return emailRef.current?.focus();
    if (errs.password) return passwordRef.current?.focus();

    setIsloading(true);
    // 로그인 시작
    try {
      await signin(email.trim(), password);
      navigate(fromPath, { replace: true });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "로그인에 실패했어요. 잠시 후 다시 시도해주세요.");
      setPassword(""); // 비번만 지우고 다시 입력하기 쉽게
      passwordRef.current?.focus();
    } finally {
      setIsloading(false);
    }
  };

  const messages = [fieldErrors.email, fieldErrors.password, errorMsg].filter(Boolean) as string[];

  return (
    <div css={s.page}>
      <div css={s.container}>
        <Link to="/" css={s.logo} aria-label="MU:ZIN 홈으로">
          MU:ZIN
        </Link>

        <div css={s.box}>
          <h1 css={s.title}>로그인</h1>

          <form onSubmit={onSubmit} noValidate>
            <div css={f.group}>
              <AuthInput
                label="이메일"
                name="email"
                type="email"
                value={email}
                autoComplete="email"
                autoFocus={!state?.email}
                inputRef={emailRef}
                invalid={!!fieldErrors.email}
                describedBy={messages.length ? MESSAGE_ID : undefined}
                onChange={(v) => {
                  setEmail(v);
                  if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
                }}
              />
              <AuthInput
                label="비밀번호"
                name="password"
                type="password"
                value={password}
                autoComplete="current-password"
                autoFocus={!!state?.email}
                inputRef={passwordRef}
                invalid={!!fieldErrors.password}
                describedBy={messages.length ? MESSAGE_ID : undefined}
                onChange={(v) => {
                  setPassword(v);
                  if (fieldErrors.password) setFieldErrors((p) => ({ ...p, password: undefined }));
                }}
              />
            </div>

            {messages.length > 0 && (
              <ul id={MESSAGE_ID} css={f.messages} role="alert">
                {messages.map((m) => (
                  <li key={m} css={f.errorText}>
                    {m}
                  </li>
                ))}
              </ul>
            )}

            <button css={s.primaryButton} type="submit" disabled={isLoading}>
              {isLoading ? "로그인 중..." : "로그인"}
            </button>
          </form>

          <div css={s.divider}>또는 소셜 계정으로 로그인</div>

          <div css={s.socialList}>
            <OAuth2Button provider="google" flow="signin" redirectPath={fromPath} />
            <OAuth2Button provider="naver" flow="signin" redirectPath={fromPath} />
            <OAuth2Button provider="kakao" flow="signin" redirectPath={fromPath} />
          </div>
        </div>

        <nav css={s.links} aria-label="계정">
          <span>아직 계정이 없나요?</span>
          <span css={s.linkBar} aria-hidden="true" />
          {/* 가입 후 돌아올 곳(from)을 그대로 넘김 */}
          <Link css={s.link} to="/signup" state={{ from: state?.from }}>
            회원가입
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default SigninForm;
