/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import { useNavigate } from "react-router-dom";
import { useMyLessonUiStore } from "../../../../stores/myLessonUiState";
import { useQuery } from "@tanstack/react-query";
import { getMyLessonsReq } from "../../../../apis/lesson/lessonApis";
import MyLessonList from "./MyLessonList/MyLessonList";

function ArtistManagePage() {
  const navigate = useNavigate();
  const sort = useMyLessonUiStore((st) => st.sort);
  const setSort = useMyLessonUiStore((st) => st.setSort);

  const {
    data: lessons = [],
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["myLessons", sort],
    queryFn: async () => (await getMyLessonsReq()).data.data,
    staleTime: 10_000,
  });

  return (
    <div css={s.page}>
      <div css={s.headerRow}>
        <div>
          <h2 css={s.title}>내 레슨 관리</h2>
          <p css={s.sub}>레슨 생성, 수정, 타임슬롯 관리가 가능합니다.</p>
        </div>

        <div css={s.headerActions}>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as "LATEST" | "OLDEST")}
            css={s.sortSelect}
          >
            <option value={"LATEST"}>최신순</option>
            <option value={"OLDEST"}>오래된순</option>
          </select>

          <button css={s.primaryBtn} onClick={() => navigate("/mypage/artist/new")}>
            레슨 만들기
          </button>
        </div>
      </div>
      {isFetching && isLoading && <div css={s.hint}>업데이트 중...</div>}

      <MyLessonList
        loading={isLoading}
        lesson={lessons}
        onClickLesson={(lessonId) =>
          navigate(`/mypage/lessons/${lessonId}/edit`)
        }
      />
    </div>
  );
}

export default ArtistManagePage;
