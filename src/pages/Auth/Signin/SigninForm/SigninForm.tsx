/** @jsxImportSource @emotion/react */
import * as s from "./styles";

import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePrincipalState } from "../../../../stores/usePrincipalState";
import type { AuthRedirectState } from "../../../../Types/routerState";
import AuthInput from "../../AuthInput/AuthInput";
import OAuth2Button from "../../OAuth2Button/OAuth2Button";

function SigninForm() {
  const navigate = useNavigate();
  const loc = useLocation();

  const state = loc.state as AuthRedirectState | null;
  const fromPath = state?.from?.pathname ?? "/";

  // 로그인 되어있으면 로그인 화면 접근 불가
  const isAuthenticated = usePrincipalState((s) => s.isAuthenticated);
  const signin = usePrincipalState((s) => s.signin);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsloading] = useState(false);
  // 소셜 로그인 실패 사유가 넘어왔으면 처음부터 보여줌
  const [errorMsg, setErrorMsg] = useState<string | null>(state?.oauthError ?? null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(fromPath, { replace: true });
    }
  }, [isAuthenticated, navigate, fromPath]);

  // 제출
  const onSubmit = async () => {
    setErrorMsg(null);

    // 둘 중 하나가 공백이면
    if (!email.trim() || !password.trim()) {
      setErrorMsg("이메일/비밀번호를 입력해주세요.");
      return;
    }
    if (isLoading) return;

    setIsloading(true);
    // 로그인 시작
    try {
      await signin(email, password);
      navigate(fromPath, { replace: true });
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "로그인에 실패했습니다.");
      setPassword(""); // 비번만 지워줌
    } finally {
      setIsloading(false);
    }
  };

  const signupOnClick = () => {
    navigate("/signup", { replace: true });
  };


  return (
        <div css={s.formWrap}>
    <div
      css={s.form}
      onKeyDown={(e) => {
        if (e.key === "Enter") onSubmit();
      }}
    >
      <AuthInput
        label="이메일"
        name="email"
        value={email}
        placeholder="이메일을 입력해주세요"
        autoComplete="email"
        onChange={setEmail}
      />

      <AuthInput
        label="비밀번호"
        name="password"
        type="password"
        value={password}
        placeholder="비밀번호를 입력해주세요"
        autoComplete="current-password"
        onChange={setPassword}
      />

      {errorMsg && <p css={s.errorMsg}>{errorMsg}</p>}

      <button css={s.submitButton} onClick={onSubmit} disabled={isLoading}>
        {isLoading ? "로그인 중..." : "로그인"}
      </button>

      <div css={s.signupArea}>
        <span css={s.signupText}>아직 계정이 없나요?</span>
        <button css={s.signupButton} type="button" onClick={signupOnClick}>
          회원가입
        </button>
      </div>

      <div css={s.oauthArea}>
        <OAuth2Button provider="google" flow="signin" redirectPath={fromPath} />
        <OAuth2Button provider="naver" flow="signin" redirectPath={fromPath} />
        <OAuth2Button provider="kakao" flow="signin" redirectPath={fromPath} />
      </div>
    </div>
  </div>
  );
}

export default SigninForm;
