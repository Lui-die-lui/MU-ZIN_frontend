import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePrincipalState } from "../../../../stores/usePrincipalState";
import type { AuthRedirectState } from "../../../../Types/routerState";

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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
    if (isAuthenticated) {
      navigate(fromPath, { replace: true });
    }
  }, [isAuthenticated]);

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
    <div
      onKeyDown={(e) => {
        if (e.key === "Enter") onSubmit();
      }}
    >
      <div>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일"
          autoComplete="email"
        />
      </div>

      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          autoComplete="current-password"
        />
      </div>

      {errorMsg && <p style={{ marginTop: 8 }}>{errorMsg}</p>}

      <button onClick={onSubmit} disabled={isLoading}>
        {isLoading ? "로그인 중..." : "로그인"}
      </button>

      <div>
        <p onClick={signupOnClick}>회원가입</p>
      </div>
    </div>
  );
}

export default SigninForm;
