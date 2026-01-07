/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import React from "react";
import type { LessonSummary } from "../../../../../Types/lessonTypes";
import MyLessonCard from "./MyLessonCard";

type Props = {
  loading: boolean;
  lesson: LessonSummary[];
  onClickLesson: (lessonId: number) => void;
};
function MyLessonList({ loading, lesson, onClickLesson }: Props) {
  if (loading) {
    return (
      <div css={s.list}>
        <div css={s.skeleton} />
        <div css={s.skeleton} />
        <div css={s.skeleton} />
      </div>
    );
  }

  if (!lesson.length) {
    return (
      <div css={s.empty}>
        <div css={s.emptyTitle}>아직 레슨이 없습니다.</div>
      </div>
    );
  }
  return (
    <div css={s.list}>
      {lesson.map((l) => (
        <MyLessonCard
          key={l.lessonId}
          lesson={l}
          onClick={() => onClickLesson(l.lessonId)}
        />
      ))}
    </div>
  );
}

export default MyLessonList;
