import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { setSessionEndHandler } from "../../apis/instance/instance";
import { usePrincipalState } from "../../stores/usePrincipalState";
import { toast } from "../../stores/useToastStore";

// 요청 도중 토큰 만료/위조/계정 정지가 감지되면 로그아웃 처리 + 안내
// (axios 인터셉터는 라우터 밖이라 이동이 필요한 처리는 여기서 등록)
function SessionWatcher() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    setSessionEndHandler((error) => {
      const { isAuthenticated, logout } = usePrincipalState.getState();
      if (!isAuthenticated && !localStorage.getItem("accessToken")) return; // 이미 처리됨

      logout();
      toast.warning(error.message);

      // 로그인이 필요한 화면에 있었으면 로그인 페이지로
      if (pathname.startsWith("/mypage")) {
        navigate("/signin", { replace: true, state: { from: { pathname } } });
      }
    });
    return () => setSessionEndHandler(null);
  }, [navigate, pathname]);

  return null;
}

export default SessionWatcher;
