import React from "react";
import { Route, Routes } from "react-router-dom";
import AppLayout from "../components/layout/Layout/AppLayout";
import Home from "../pages/Home/Home";
import LessonMain from "../pages/Lesson/LessonMain";
import Signin from "../pages/Auth/Signin/Signin";
import Signup from "../pages/Auth/Signup/Signup";
import MyPageRouter from "./MyPageRouter";
import ArtistMain from "../pages/Artist/ArtistMain";
import OAuth2Redirect from "../pages/Auth/OAuth2Redirect/OAuth2Redirect";

function MainRouter() {
  return (
    <Routes>
      <Route path="/mypage/*" element={<MyPageRouter />} />
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/oauth2/redirect" element={<OAuth2Redirect />} />
        <Route path="/lessons" element={<LessonMain />} />
        <Route path="/artist" element={<ArtistMain />} />

        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
      </Route>
    </Routes>
  );
}

export default MainRouter;
