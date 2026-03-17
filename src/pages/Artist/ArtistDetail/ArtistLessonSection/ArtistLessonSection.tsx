import { useEffect, useState } from "react";
import {
  useArtistLessonCards,
  useArtistLessonDetail,
} from "../../../../hooks/artistSearch/useArtistSearch";
import LessonList from "./LessonList/LessonList";
import LessonDetail from "./LessonDetail/LessonDetail";
import type { OpenSlotFilter } from "../../../../Types/searchForTimeTypes";
import LessonTimeSlotSection from "../../../Lesson/LessonDetailDrawer/LessonTimeSlotSection/LessonTimeSlotSection";

type Props = {
  artistProfileId: number;
};

function ArtistLessonSection({ artistProfileId }: Props) {
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [slotFliter, setSlotFilter] = useState<OpenSlotFilter | null>(null);

  const {
    data: lessons = [],
    isLoading: isLessonsLoading,
    isError: isLessonsError,
  } = useArtistLessonCards(artistProfileId);

  useEffect(() => {
    if (!selectedLessonId && lessons.length > 0) {
      setSelectedLessonId(lessons[0].lessonId);
    }
  }, [lessons, selectedLessonId]);

  useEffect(() => {
    setSlotFilter(null);
  }, [selectedLessonId]);

  // selectedLessonId = lessonId는 첫 화면 혹은 선택하지 않을 시 null일 수 있음.
  const {
    data: lessonDetail,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useArtistLessonDetail(artistProfileId, selectedLessonId);

  const handleClickReserve = (timeSlotId: number) => {
    console.log("예약할 슬롯:", timeSlotId);
    // todo: 예약 흐름 생각하기
  };

  if (isLessonsLoading) return <div>레슨 불러오는 중...</div>;
  if (isLessonsError) return <div>레슨 목록을 불러오지 못했습니다.</div>;
  if (lessons.length === 0) return <div>등록된 레슨이 없습니다.</div>;

  return (
    <div>
      <LessonList
        lessons={lessons}
        selectedLessonId={selectedLessonId}
        onSelectLesson={setSelectedLessonId}
      />
      <LessonDetail
        lessonDetail={lessonDetail}
        isLoading={isDetailLoading}
        isError={isDetailError}
      />

      {selectedLessonId && (
        <LessonTimeSlotSection
          lessonId={selectedLessonId}
          filter={slotFliter}
          onClickReserve={handleClickReserve}
        />
      )}
    </div>
  );
}

export default ArtistLessonSection;
