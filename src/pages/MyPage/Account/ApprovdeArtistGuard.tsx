import React, { type ReactNode } from "react";
import { usePrincipalState } from "../../../stores/usePrincipalState";
import { Navigate } from "react-router-dom";

// 확실하게 승인된 아티스트만 아티스트 프로필 수정에 접근 가능함
function ApprovdeArtistGuard({ children }: { children: ReactNode }) {
  const { principal } = usePrincipalState();
  if (principal?.artistStatus !== "APPROVED")
    return <Navigate to="/mypage/account" replace />;
  return <>{children}</>;
}

export default ApprovdeArtistGuard;
