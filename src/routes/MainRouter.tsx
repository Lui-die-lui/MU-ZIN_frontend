import React from "react";
import { Route, Routes } from "react-router-dom";
import AppLayout from "../components/layout/Layout/AppLayout";
import Home from "../pages/Home/Home";
import LessonMain from "../pages/Lesson/LessonMain";
import Signin from "../pages/Auth/Signin/Signin";
import Signup from "../pages/Auth/Signup/Signup";
import MyPageRouter from "./MyPageRouter";

function MainRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/lessons" element={<LessonMain />} />
        <Route path="/mypage/*" element={<MyPageRouter />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/signup" element={<Signup />} />
      </Route>
    </Routes>
  );
}

export default MainRouter;
