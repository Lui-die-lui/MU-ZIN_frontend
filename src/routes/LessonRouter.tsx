import { Route, Routes } from "react-router-dom";
import LessonMain from "../pages/Lesson/LessonMain";

// LessonMain 이 검색 페이지(LessonSearchPage)를 렌더링함
// (예전엔 index 라우트가 2개라 두 번째는 절대 매칭되지 않았음)
function LessonRouter() {
  return (
    <Routes>
      <Route index element={<LessonMain />} />
      {/* /lessons/:lessonId - 검색 화면 위에 그 레슨 상세(drawer)를 바로 열어 둠 (AI 추천 카드 등에서 링크로 이동) */}
      <Route path=":lessonId" element={<LessonMain />} />
    </Routes>
  );
}

export default LessonRouter;
