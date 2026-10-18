/** @jsxImportSource @emotion/react */
import { useLocation, useNavigate } from "react-router-dom";
import type { SignupErrors, SignupPayload } from "../../../Types/auth";
import type { AuthRedirectState } from "../../../Types/routerState";
import { useEffect, useState } from "react";
import SignupForm from "./SignupForm/SignupForm";
import { signupReq } from "../../../apis/auth/authApi";
import { toApiError } from "../../../utils/errorUtils";
import { toast } from "../../../stores/useToastStore";
import { usePrincipalState } from "../../../stores/usePrincipalState";
import { isValidPassword, PASSWORD_RULE_TEXT } from "../../../utils/passwordRules";

// 별칭(name+tag@...)과 4자 넘는 도메인(.design 등)도 허용 (백엔드 @Email 과 맞춤)
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const validateField = (name: keyof SignupPayload, f: SignupPayload): string | undefined => {
  switch (name) {
    case "email":
      if (!f.email.trim()) return "이메일을 입력해주세요.";
      if (!emailRegex.test(f.email.trim())) return "이메일 형식이 올바르지 않아요. (예: name@email.com)";
      return undefined;
    case "password":
      if (!f.password) return "비밀번호를 입력해주세요.";
      if (!isValidPassword(f.password)) return PASSWORD_RULE_TEXT;
      return undefined;
    case "passwordConfirm":
      if (!f.passwordConfirm) return "비밀번호를 한 번 더 입력해주세요.";
      if (f.password !== f.passwordConfirm) return "비밀번호가 일치하지 않아요.";
      return undefined;
  }
};

const FIELDS: (keyof SignupPayload)[] = ["email", "password", "passwordConfirm"];

function Signup() {
  const navigate = useNavigate();
  const loc = useLocation();
  const from = (loc.state as AuthRedirectState | null)?.from;
  const isAuthenticated = usePrincipalState((st) => st.isAuthenticated);

  const [form, setForm] = useState<SignupPayload>({ email: "", password: "", passwordConfirm: "" });
  const [errors, setErrors] = useState<SignupErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 로그인 상태면 가입 화면 대신 원래 가려던 곳으로
  useEffect(() => {
    if (isAuthenticated) navigate(from?.pathname ?? "/", { replace: true });
  }, [isAuthenticated, navigate, from]);

  const onChange = (name: keyof SignupPayload, value: string) => {
    const next = { ...form, [name]: value };
    setForm(next);
    // 이미 오류가 표시된 칸은 고치는 즉시 다시 검사 (맞게 고치면 바로 사라짐)
    setErrors((prev) => {
      const updated = { ...prev };
      if (prev[name]) updated[name] = validateField(name, next);
      // 비밀번호를 바꾸면 확인 칸 오류도 다시 판단
      if (name === "password" && prev.passwordConfirm) updated.passwordConfirm = validateField("passwordConfirm", next);
      return updated;
    });
  };

  // 칸을 벗어날 때 검사 (입력 중에는 방해하지 않음, 빈 칸은 제출 때 안내)
  const onBlur = (name: keyof SignupPayload) => {
    if (!form[name]) return;
    setErrors((prev) => ({ ...prev, [name]: validateField(name, form) }));
  };

  // 오류를 돌려주면 폼이 첫 오류 칸으로 초점을 옮김
  const onSubmit = async (): Promise<SignupErrors> => {
    if (isSubmitting) return {};
    const e: SignupErrors = {};
    for (const name of FIELDS) {
      const msg = validateField(name, form);
      if (msg) e[name] = msg;
    }
    setErrors(e);
    if (Object.keys(e).length > 0) return e;

    setIsSubmitting(true);
    try {
      const email = form.email.trim();
      await signupReq({ ...form, email });
      toast.success("가입이 완료됐어요. 로그인해주세요.");
      const state: AuthRedirectState = { email, from };
      navigate("/signin", { replace: true, state });
      return {};
    } catch (err) {
      const apiErr = toApiError(err);
      let serverErrors: SignupErrors;
      if (apiErr.code === "EMAIL_ALREADY_REGISTERED") {
        // 이메일 중복 (소셜 가입 이메일이면 어떤 소셜인지 백엔드 메시지에 포함)
        serverErrors = { email: apiErr.message };
      } else if (apiErr.fieldErrors) {
        serverErrors = apiErr.fieldErrors;
      } else {
        serverErrors = { email: apiErr.message || "회원가입에 실패했어요. 잠시 후 다시 시도해주세요." };
      }
      setErrors(serverErrors);
      return serverErrors;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SignupForm
      form={form}
      errors={errors}
      isSubmitting={isSubmitting}
      from={from}
      onChange={onChange}
      onBlur={onBlur}
      onSubmit={onSubmit}
    />
  );
}

export default Signup;
