/** @jsxImportSource @emotion/react */
import type { SignupErrors, SignupPayload } from "../../../../Types/auth";
import AuthInput from "../../AuthInput/AuthInput";
import * as s from "./styles";

type Props = {
  form: SignupPayload; // ts 파일 내 signupPayload 타입
  errors: SignupErrors; // Optional인 위 타입의 에러
  onChange: (name: keyof SignupPayload, value: string) => void; // 키 명과 값으로 즉각적으로 값을 비교
  onSubmit: () => void; // 제출 시
};

function SignupForm({ form, errors, onChange, onSubmit }: Props) {
  return (
    <div css={s.formWrap}>
      <form
        css={s.form}
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <AuthInput
          label="이메일"
          name="email"
          value={form.email}
          placeholder="이메일을 입력해주세요"
          autoComplete="email"
          error={errors.email}
          onChange={(value) => onChange("email", value)}
        />

        <AuthInput
          label="비밀번호"
          name="password"
          type="password"
          value={form.password}
          placeholder="비밀번호를 입력해주세요"
          autoComplete="new-password"
          error={errors.password}
          onChange={(value) => onChange("password", value)}
        />

        <AuthInput
          label="비밀번호 확인"
          name="passwordConfirm"
          type="password"
          value={form.passwordConfirm}
          placeholder="비밀번호를 한 번 더 입력해주세요"
          autoComplete="new-password"
          error={errors.passwordConfirm}
          onChange={(value) => onChange("passwordConfirm", value)}
        />

        <button css={s.submitButton} type="submit">
          회원가입
        </button>
      </form>
    </div>
  );
}

export default SignupForm;
