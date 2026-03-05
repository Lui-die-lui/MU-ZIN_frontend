import { Route, Routes } from "react-router-dom";
import LessonMain from "../pages/Lesson/LessonMain";
import LessonSearchPage from "../pages/Lesson/LessonSearch/LessonSearchPage";

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
