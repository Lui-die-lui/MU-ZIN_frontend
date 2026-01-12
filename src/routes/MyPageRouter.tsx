import React from "react";
import { Route, Routes } from "react-router-dom";
import MyPageLayout from "../pages/MyPage/MyPageLayout";
import HomePage from "../pages/MyPage/Home/HomePage";
import ReservationsPage from "../pages/MyPage/Reservations/ReservationsPage";
import AccountPage from "../pages/MyPage/Account/AccountPage";
import ArtistPage from "../pages/MyPage/Artist/ArtistPage";
import ArtistApplyPage from "../pages/MyPage/Artist/ArtistApply/ArtistApplyPage";
import ArtistPendingPage from "../pages/MyPage/Artist/ArtistPending/ArtistPendingPage";
import ArtistManagePage from "../pages/MyPage/Artist/ArtistManage/ArtistManagePage";

function MyPageRouter() {
  return (
    <Routes>
      <Route element={<MyPageLayout />}>
        <Route index element={<HomePage />} />
        <Route path="reservations" element={<ReservationsPage />} />
        <Route path="account" element={<AccountPage />} />

        <Route path="artist">
          <Route index element={<ArtistPage />} />

          <Route path="apply" element={<ArtistApplyPage />} />
          <Route path="pending" element={<ArtistPendingPage />} />

          <Route path="manage" element={<ArtistManagePage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default MyPageRouter;
