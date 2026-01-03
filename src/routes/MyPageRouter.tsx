import React from "react";
import { Route, Routes } from "react-router-dom";
import MyPageLayout from "../pages/MyPage/MyPageLayout";
import HomePage from "../pages/MyPage/Home/HomePage";
import ReservationsPage from "../pages/MyPage/Reservations/ReservationsPage";
import AccountPage from "../pages/MyPage/Account/AccountPage";
import ArtistPage from "../pages/MyPage/Artist/ArtistPage";

function MyPageRouter() {
  return (
    <Routes>
      <Route element={<MyPageLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/reservations" element={<ReservationsPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/artist" element={<ArtistPage />} />
      </Route>
    </Routes>
  );
}

export default MyPageRouter;
