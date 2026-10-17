import { Route, Routes } from "react-router-dom";
import MyPageLayout from "../pages/MyPage/MyPageLayout";
import HomePage from "../pages/MyPage/Home/HomePage";
import ReservationsPage from "../pages/MyPage/Reservations/ArtistRequest/ArtistReservationPage";
import AccountPage from "../pages/MyPage/Account/AccountPage";
import ArtistPage from "../pages/MyPage/Artist/ArtistPage";
import ArtistApplyPage from "../pages/MyPage/Artist/ArtistApply/ArtistApplyPage";
import ArtistPendingPage from "../pages/MyPage/Artist/ArtistPending/ArtistPendingPage";
import ArtistManagePage from "../pages/MyPage/Artist/ArtistManage/ArtistManagePage";
import AccountLayout from "../pages/MyPage/Account/AccountLayout/AccountLayout";
import ApprovdeArtistGuard from "../pages/MyPage/Account/ApprovdeArtistGuard";
import ArtistAccountPage from "../pages/MyPage/Account/ArtistAccountPage";
import CreateLessonPage from "../pages/MyPage/Artist/ArtistManage/CreateLesson/CreateLessonPage";
import EditLessonPage from "../pages/MyPage/Artist/ArtistManage/EditLesson/EditLessonPage";

import MyReservationsPage from "../pages/MyPage/Reservations/MyReservation/MyReservationsPage";
import ProtectedRoute from "../components/auth/ProtectedRoute";

function MyPageRouter() {
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute>
            <MyPageLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<HomePage />} />
        {/* 내 예약 */}
        <Route path="reservations" element={<MyReservationsPage />} />

        {/* 요청 관리 - 아티스트만 접근 가능 */}
        <Route
          path="reservations/requests"
          element={
            <ApprovdeArtistGuard>
              <ReservationsPage />
            </ApprovdeArtistGuard>
          }
        />

        {/* account 중첩 라우트 - 아티스트만 접근 가능한 탭으로 만듦 */}
        <Route path="account" element={<AccountLayout />}>
          <Route index element={<AccountPage />} />
          <Route
            path="artist"
            element={
              <ApprovdeArtistGuard>
                <ArtistAccountPage />
              </ApprovdeArtistGuard>
            }
          />
        </Route>

        {/* mypage/artist 도메인 */}
        <Route path="artist">
          <Route index element={<ArtistPage />} />
          <Route path="apply" element={<ArtistApplyPage />} />
          <Route path="pending" element={<ArtistPendingPage />} />
          {/* 레슨 관리 - 승인된 아티스트만 (아니면 상태별 분기 페이지로) */}
          <Route
            path="manage"
            element={
              <ApprovdeArtistGuard redirectTo="/mypage/artist">
                <ArtistManagePage />
              </ApprovdeArtistGuard>
            }
          />
          <Route
            path="manage/:lessonId"
            element={
              <ApprovdeArtistGuard redirectTo="/mypage/artist">
                <EditLessonPage />
              </ApprovdeArtistGuard>
            }
          />
          <Route
            path="new"
            element={
              <ApprovdeArtistGuard redirectTo="/mypage/artist">
                <CreateLessonPage />
              </ApprovdeArtistGuard>
            }
          />
        </Route>
      </Route>
    </Routes>
  );
}

export default MyPageRouter;
