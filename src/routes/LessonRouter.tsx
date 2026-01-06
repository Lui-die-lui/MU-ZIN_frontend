import React from "react";
import { Route, Routes } from "react-router-dom";
import LessonMain from "../pages/Lesson/LessonMain";
import LessonSearchPage from "../pages/Lesson/LessonSearch/LessonSearchPage";
import LessonDetailDrawer from "../pages/Lesson/LessonDetailDrawer/LessonDetailDrawer";

function LessonRouter() {
  return (
    <Routes>
      <Route index element={<LessonMain />} />
      <Route index element={<LessonSearchPage />} />
      {/* <Route path=":lessonId" element={<LessonDetailDrawer />} /> */}
    </Routes>
  );
}

export default LessonRouter;
