import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import AdminGuard from "../pages/Admin/AdminGuard";
import AdminLayout from "../pages/Admin/AdminLayout";
import AdminArtistApplicationsPage from "../pages/Admin/ArtistApplications/AdminArtistApplicationsPage";
import AdminUsersPage from "../pages/Admin/Users/AdminUsersPage";

// 관리자 페이지 (ROLE_ADMIN) - 마이페이지와 분리된 화면. 처음 들어오면 아티스트 심사로
function AdminRouter() {
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute>
            <AdminGuard>
              <AdminLayout />
            </AdminGuard>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="artist-applications" replace />} />
        <Route path="artist-applications" element={<AdminArtistApplicationsPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="*" element={<Navigate to="artist-applications" replace />} />
      </Route>
    </Routes>
  );
}

export default AdminRouter;
