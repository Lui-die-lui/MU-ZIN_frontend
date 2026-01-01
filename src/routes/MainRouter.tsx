import React from "react";
import { Route, Routes } from "react-router-dom";
import AppLayout from "../components/layout/Layout/AppLayout";
import Home from "../pages/Home/Home";
import LessonMain from "../pages/Lesson/LessonMain";
import MyPage from "../pages/MyPage/MyPage";
import Signin from "../pages/Auth/Signin/Signin";
import Signup from "../pages/Auth/Signup/Signup";

function MainRouter() {
  return (
    <div>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/lessons" element={<LessonMain />} />
          <Route path="/profile" element={<MyPage />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
      </Routes>
    </div>
  );
}

export default MainRouter;
