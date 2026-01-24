/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import type { LessonSummary } from "../../../../../Types/lessonTypes";

type Props = {
  lesson: LessonSummary;
  onClick: () => void;
};

function MyLessonCard({ lesson, onClick }: Props) {
  return (
    <button type="button" css={s.card} onClick={onClick}>
      <div css={s.cardTop}>
        <div css={s.cardTitleRow}>
          <strong css={s.cardTitle}>{lesson.title}</strong>
          <span css={s.badge(lesson.status)}>
            {lesson.status === "ACTIVE" ? "활성" : "비활성"}
          </span>
        </div>

        <div css={s.cardMeta}>
          <span>{lesson.mode}</span>
          <span>|</span>
          <span>{lesson.durationMin}분</span>
          <span>
            {lesson.price ? `${lesson.price.toLocaleString()}원` : "가격 미정"}
          </span>
        </div>
      </div>
    </button>
  );
}

export default MyLessonCard;
