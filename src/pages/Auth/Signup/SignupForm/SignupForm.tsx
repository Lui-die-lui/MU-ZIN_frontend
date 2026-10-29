/** @jsxImportSource @emotion/react */
import { useRef } from "react";
import { Link, type Location } from "react-router-dom";
import type { SignupErrors, SignupPayload } from "../../../../Types/auth";
import { PASSWORD_RULES } from "../../../../utils/passwordRules";
import AuthInput from "../../AuthInput/AuthInput";
import OAuth2Button from "../../OAuth2Button/OAuth2Button";
import * as a from "../../authStyles";
import * as f from "../../AuthInput/styles";
import * as s from "./styles";
import ConsentChecklist from "../../../../components/legal/ConsentChecklist";
import { allAgreed, type Consent } from "../../../../legal/consent";

type Props = {
  form: SignupPayload; // ts 파일 내 signupPayload 타입
  errors: SignupErrors; // Optional인 위 타입의 에러
  isSubmitting: boolean;
  from?: Location;
  onChange: (name: keyof SignupPayload, value: string) => void;
  onBlur: (name: keyof SignupPayload) => void;
  onSubmit: () => Promise<SignupErrors>; // 남은 오류를 돌려줌 -> 첫 오류 칸으로 초점
  consent: Consent;
  onConsentChange: (next: Consent) => void;
};

const MESSAGE_ID = "signup-messages";

function SignupForm({ form, errors, isSubmitting, from, onChange, onBlur, onSubmit, consent, onConsentChange }: Props) {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmRef = useRef<HTMLInputElement>(null);

  const redirectPath = from?.pathname ?? "/";
  const confirmMatches = !!form.passwordConfirm && form.password === form.passwordConfirm;

  return (
    <div css={a.page}>
      <div css={a.container}>
        <Link to="/" css={a.logo} aria-label="MU:ZIN 홈으로">
          MU:ZIN
        </Link>

        <div css={a.box}>
          <h1 css={a.title}>회원가입</h1>

          <form
            noValidate
            onSubmit={async (e) => {
              e.preventDefault();
              const remaining = await onSubmit();
              if (remaining.email) emailRef.current?.focus();
              else if (remaining.password) passwordRef.current?.focus();
              else if (remaining.passwordConfirm) confirmRef.current?.focus();
            }}
          >
            <div css={f.group}>
              <AuthInput
                label="이메일"
                name="email"
                type="email"
                value={form.email}
                autoComplete="email"
                inputRef={emailRef}
                invalid={!!errors.email}
                describedBy={MESSAGE_ID}
                onChange={(value) => onChange("email", value)}
                onBlur={() => onBlur("email")}
              />
              <AuthInput
                label="비밀번호"
                name="password"
                type="password"
                value={form.password}
                autoComplete="new-password"
                inputRef={passwordRef}
                invalid={!!errors.password}
                describedBy={MESSAGE_ID}
                onChange={(value) => onChange("password", value)}
                onBlur={() => onBlur("password")}
              />
              <AuthInput
                label="비밀번호 확인"
                name="passwordConfirm"
                type="password"
                value={form.passwordConfirm}
                autoComplete="new-password"
                inputRef={confirmRef}
                invalid={!!errors.passwordConfirm}
                describedBy={MESSAGE_ID}
                onChange={(value) => onChange("passwordConfirm", value)}
                onBlur={() => onBlur("passwordConfirm")}
              />
            </div>

            {/* 묶음 아래 안내: 칸 순서대로 오류 → 비밀번호 조건(입력할수록 충족 표시) → 확인 일치 */}
            <div id={MESSAGE_ID} css={f.messages} aria-live="polite">
              {errors.email && <p css={f.errorText}>{errors.email}</p>}
              {errors.password && <p css={f.errorText}>{errors.password}</p>}
              <ul css={s.ruleList} aria-label="비밀번호 조건">
                {PASSWORD_RULES.map((r) => {
                  const ok = !!form.password && r.test(form.password);
                  return (
                    <li key={r.key} css={s.ruleItem(ok)}>
                      <span aria-hidden="true">{ok ? "✓" : "·"}</span>
                      {r.label}
                      <span css={f.srOnly}>{ok ? " 충족" : " 미충족"}</span>
                    </li>
                  );
                })}
              </ul>
              {errors.passwordConfirm ? (
                <p css={f.errorText}>{errors.passwordConfirm}</p>
              ) : (
                confirmMatches && <p css={s.okText}>✓ 비밀번호가 일치해요.</p>
              )}
            </div>

            <ConsentChecklist value={consent} onChange={onConsentChange} disabled={isSubmitting} />

            <button css={a.primaryButton} type="submit" disabled={isSubmitting || !allAgreed(consent)}>
              {isSubmitting ? "가입하는 중..." : "회원가입"}
            </button>

            <p css={a.centerNote}>가입 후 마이페이지에서 이메일 인증을 마치면 레슨을 예약할 수 있어요.</p>
          </form>

          <div css={a.divider}>또는 소셜 계정으로 가입</div>
          <div css={a.socialList}>
            <OAuth2Button provider="google" flow="signup" redirectPath={redirectPath} />
            <OAuth2Button provider="naver" flow="signup" redirectPath={redirectPath} />
            <OAuth2Button provider="kakao" flow="signup" redirectPath={redirectPath} />
          </div>
          <p css={a.centerNote}>소셜 계정으로 가입하면 다음 화면에서 약관 동의를 받아요.</p>
        </div>

        <nav css={a.links} aria-label="계정">
          <span>이미 계정이 있나요?</span>
          <span css={a.linkBar} aria-hidden="true" />
          <Link css={a.link} to="/signin" state={{ from }}>
            로그인
          </Link>
        </nav>
      </div>
    </div>
  );
}

export default SignupForm;
