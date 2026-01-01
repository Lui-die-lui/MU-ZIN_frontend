import React, { useState } from "react";
import { replace, useNavigate } from "react-router-dom";
import { usePrincipalState } from "../../../../stores/usePrincipalState";

function SigninForm() {
  const navigate = useNavigate();
  const signin = usePrincipalState((s) => s.signin);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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
      navigate("/", { replace: true });
    } catch (e) {
      setErrorMsg(e instanceof Error ? e.message : "로그인에 실패했습니다.");
      setPassword(""); // 비번만 지워줌
    } finally {
      setIsloading(false);
    }
  };


  return (
    <div
      onKeyDown={(e) => {
        if (e.key === "Enter") onSubmit();
      }}
    >
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="이메일"
        autoComplete="email"
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호"
        autoComplete="current-password"
      />

      {errorMsg && <p style={{ marginTop: 8 }}>{errorMsg}</p>}

      <button onClick={onSubmit} disabled={isLoading}>
        {isLoading ? "로그인 중..." : "로그인"}
      </button>
    </div>
  );
}

export default SigninForm;
