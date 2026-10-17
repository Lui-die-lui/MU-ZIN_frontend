import { type ReactNode } from "react";
import { usePrincipalState } from "../../../stores/usePrincipalState";
import { Navigate } from "react-router-dom";

// 확실하게 승인된 아티스트만 접근 가능 (백엔드도 같은 경로를 ARTIST_APPROVED 권한으로 막음)
function ApprovdeArtistGuard({
  children,
  redirectTo = "/mypage/account",
}: {
  children: ReactNode;
  redirectTo?: string;
}) {
  const principal = usePrincipalState((s) => s.principal);
  if (principal?.artistStatus !== "APPROVED")
    return <Navigate to={redirectTo} replace />;
  return <>{children}</>;
}

export default ApprovdeArtistGuard;
