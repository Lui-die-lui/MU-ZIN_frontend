/** @jsxImportSource @emotion/react */
import { useNavigate } from "react-router-dom";
import type { SignupErrors, SignupPayload } from "../../../Types/auth";
import * as s from "./styles";
import { useState } from "react";
import SignupForm from "./SignupForm/SignupForm";
import { signupReq } from "../../../apis/auth/authApi";
import axios from "axios";

function Signup() {
  const [form, setForm] = useState<SignupPayload>({
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const navigate = useNavigate();

  const [errors, setErrors] = useState<SignupErrors>({});

  const [emailTaken, setEmailTaken] = useState(false);

  // 정규식: 기본 이메일 형식, 비밀번호는 영문/숫자/특수문자 포함 8~15자
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const pwRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;

  const validate = (f: SignupPayload): SignupErrors => {
    const e: SignupErrors = {}; // 설명이 필요할 것 같음

    if (!f.email.trim()) e.email = "이메일을 입력해주세요.";
    else if (!emailRegex.test(f.email))
      e.email = "이메일 형식이 올바르지 않습니다.";

    if (!f.password.trim()) e.password = "비밀번호를 입력해주세요";
    else if (!pwRegex.test(f.password))
      e.password = "비밀번호는 영문/숫자/특수문자 포함 8~15자여야 합니다.";

    if (!f.passwordConfirm.trim())
      e.passwordConfirm = "비밀번호 확인을 입력해주세요.";
    else if (f.password !== f.passwordConfirm)
      e.passwordConfirm = "비밀번호가 일치하지 않습니다.";

    return e;
  };

  const onChange = (name: keyof SignupPayload, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "email") setEmailTaken(false);
  };

  const onSubmit = async () => {
    const e = validate(form); // 입력된 폼 내부 검증
    setErrors(e);

    if (Object.keys(e).length > 0) return; // 에러 메시지가 있으면 리턴?

    try {
      await signupReq(form);
      navigate("/signin", { replace: true });
    } catch (e) {
      if (axios.isAxiosError(e)) {
        if (e.response?.status === 409) {
          setEmailTaken(true);
          setErrors((prev) => ({
            ...prev,
            email: "이미 사용중인 이메일입니다.",
          }));
          return;
        }
        setErrors((prev) => ({ ...prev, email: "회원가입에 실패했습니다." }));
      }
    }
  };
  return (
    <SignupForm
      form={form}
      errors={errors}
      onChange={onChange}
      onSubmit={onSubmit}
    />
  );
}

export default Signup;
