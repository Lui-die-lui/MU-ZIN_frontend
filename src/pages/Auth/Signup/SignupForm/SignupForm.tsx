/** @jsxImportSource @emotion/react */
import type { SignupErrors, SignupPayload } from "../../../../Types/auth";
import * as s from "./styles";

type Props = {
  form: SignupPayload; // ts 파일 내 signupPayload 타입
  errors: SignupErrors; // Optional인 위 타입의 에러
  onChange: (name: keyof SignupPayload, value: string) => void; // 키 명과 값으로 즉각적으로 값을 비교
  onSubmit: () => void; // 제출 시
};

function SignupForm({ form, errors, onChange, onSubmit }: Props) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div>
        <input
          value={form.email}
          onChange={(e) => onChange("email", e.target.value)}
        />
        {errors.email && <s.ErrorText>{errors.email}</s.ErrorText>}
      </div>

      <div>
        <input
          value={form.password}
          onChange={(e) => onChange("password", e.target.value)}
        />
        {errors.password && <s.ErrorText>{errors.password}</s.ErrorText>}
      </div>

      <div>
        <input
          value={form.passwordConfirm}
          onChange={(e) => onChange("passwordConfirm", e.target.value)}
        />
        {errors.passwordConfirm && (
          <s.ErrorText>{errors.passwordConfirm}</s.ErrorText>
        )}
      </div>

      <button type="submit">회원가입</button>
    </form>
  );
}

export default SignupForm;
