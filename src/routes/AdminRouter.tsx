import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import AdminGuard from "../pages/Admin/AdminGuard";
import AdminLayout from "../pages/Admin/AdminLayout";
import AdminArtistApplicationsPage from "../pages/Admin/ArtistApplications/AdminArtistApplicationsPage";
import AdminUsersPage from "../pages/Admin/Users/AdminUsersPage";
import AdminDashboardPage from "../pages/Admin/Dashboard/AdminDashboardPage";
import AdminModerationPage from "../pages/Admin/Moderation/AdminModerationPage";

// 관리자 페이지 (ROLE_ADMIN) - 마이페이지와 분리된 화면. 처음 들어오면 대시보드로
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
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="moderation" element={<AdminModerationPage />} />
        <Route path="artist-applications" element={<AdminArtistApplicationsPage />} />
        <Route path="users" element={<AdminUsersPage />} />
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
}

export default AdminRouter;
