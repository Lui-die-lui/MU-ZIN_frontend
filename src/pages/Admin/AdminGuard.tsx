import { type ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useIsAdmin } from "../../hooks/admin/useAdmin";

// 관리자(ROLE_ADMIN)만 접근 (백엔드도 /admin/** 를 hasRole('ADMIN') 으로 막음)
function AdminGuard({ children }: { children: ReactNode }) {
  const isAdmin = useIsAdmin();
  if (!isAdmin) return <Navigate to="/mypage" replace />;
  return <>{children}</>;
}

export default AdminGuard;
