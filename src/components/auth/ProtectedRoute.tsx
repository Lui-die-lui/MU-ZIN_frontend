import type React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { usePrincipalState } from "../../stores/usePrincipalState";
import { useEffect, useState } from "react";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const loc = useLocation();
  const { isAuthenticated, bootstrap } = usePrincipalState();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      await bootstrap(); // 토큰 존재 시 principal 복구 시도
      setReady(true);
    })();
  }, []); // 의존성 배열 없이 마운트 1회만

  if (!ready) return <div style={{ padding: 16 }}>로딩중...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: loc }} />;
  }

 return <>{children}</>;
}

export default ProtectedRoute;
