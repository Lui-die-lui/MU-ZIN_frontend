/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import type { ArtistLessonCardResp } from "../../../../../../Types/artistSearchTypes";

type Props = {
  lesson: ArtistLessonCardResp;
  selected: boolean;
  onClick: () => void;
};

function LessonCard({ lesson, selected, onClick }: Props) {
  return (
    <button type="button" css={s.card(selected)} onClick={onClick}>
      <div>{selected ? "선택됨" : ""}</div>
      <div>{lesson.title}</div>
      <div>{lesson.mode}</div>
      <div>{lesson.price.toLocaleString()}원</div>
      <div>{lesson.instrument.instName}</div>
      <div>{lesson.durationMin}분</div>
    </button>
  );
}

export default LessonCard;
