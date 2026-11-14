import type React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { usePrincipalState } from "../../stores/usePrincipalState";
import PageLoader from "../common/PageLoader/PageLoader";

// 로그인 복구(App의 bootstrap)가 끝난 뒤 판단. 여기서 다시 bootstrap 하지 않음
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const loc = useLocation();
  const hydrated = usePrincipalState((s) => s.hydrated);
  const isAuthenticated = usePrincipalState((s) => s.isAuthenticated);

  if (!hydrated) return <PageLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ from: loc }} />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
