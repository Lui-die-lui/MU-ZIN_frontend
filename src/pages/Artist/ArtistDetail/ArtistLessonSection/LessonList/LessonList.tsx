/** @jsxImportSource @emotion/react */
import type { ArtistLessonCardResp } from "../../../../../Types/artistSearchTypes";
import LessonCard from "./LessonCard/LessonCard";
import * as s from "./styles";

type Props = {
  lessons: ArtistLessonCardResp[];
  selectedLessonId: number | null;
  onSelectLesson: (lessonId: number) => void;
};

function LessonList({ lessons, selectedLessonId, onSelectLesson }: Props) {
  return (
    <div>
      {lessons.map((lesson) => (
        <LessonCard
          key={lesson.lessonId}
          lesson={lesson}
          selected={selectedLessonId === lesson.lessonId}
          onClick={() => onSelectLesson(lesson.lessonId)}
        />
      ))}
    </div>
  );
}

export default LessonList;
