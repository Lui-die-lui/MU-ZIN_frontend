import { useEffect, useState } from "react";
import {
  useArtistLessonCards,
  useArtistLessonDetail,
} from "../../../../hooks/artistSearch/useArtistSearch";
import LessonList from "./LessonList/LessonList";
import LessonDetail from "./LessonDetail/LessonDetail";
import type { OpenSlotFilter } from "../../../../Types/searchForTimeTypes";
import LessonTimeSlotSection from "../../../Lesson/LessonDetailDrawer/LessonTimeSlotSection/LessonTimeSlotSection";
import type { Mode } from "../../../../Types/lessonTypes";
import { useCreateReservation } from "../../../../hooks/reservation/useCreateReservation";
import ReservationSuccessView from "../../../Lesson/LessonDetailDrawer/ReservationSuccessView/ReservationSuccessView";
import RequestReservationView from "../../../Lesson/LessonDetailDrawer/RequestReservationView/RequestReservationView";

type Props = {
  artistProfileId: number;
};

function ArtistLessonSection({ artistProfileId }: Props) {
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [slotFilter, setSlotFilter] = useState<OpenSlotFilter | null>(null);

  // 예약 흐름 시 사용
  const [mode, setMode] = useState<Mode>("pick");
  const [selectedTimeSlotId, setSelectedTimeSlotId] = useState<number | null>(
    null,
  );
  const [selectedSlotText, setSelectedSlotText] = useState("");
  const [requestMsg, setRequestMsg] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    data: lessons = [],
    isLoading: isLessonsLoading,
    isError: isLessonsError,
  } = useArtistLessonCards(artistProfileId);

  useEffect(() => {
    setSlotFilter(null);
    setMode("pick");
    setSelectedTimeSlotId(null);
    setSelectedSlotText("");
    setRequestMsg("");
    setSubmitError(null);
  }, [selectedLessonId]);

  // selectedLessonId = lessonId는 첫 화면 혹은 선택하지 않을 시 null일 수 있음.
  const {
    data: lessonDetail,
    isLoading: isDetailLoading,
    isError: isDetailError,
  } = useArtistLessonDetail(artistProfileId, selectedLessonId);

  // 예약 mutation hook
  const createReservation = useCreateReservation(selectedLessonId ?? 0);

  const handleClickReserve = (timeSlotId: number, slotText: string) => {
    setSelectedTimeSlotId(timeSlotId);
    setSelectedSlotText(slotText);
    setSubmitError(null);
    setMode("request");
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

      {selectedLessonId && mode === "pick" && (
        // 레슨 선택 시 타임 슬롯 컴포넌트 진입 시
        <>
          <LessonDetail
            lessonDetail={lessonDetail}
            isLoading={isDetailLoading}
            isError={isDetailError}
          />

          <LessonTimeSlotSection
            lessonId={selectedLessonId}
            filter={slotFilter}
            onClickReserve={handleClickReserve}
          />
        </>
      )}

      {selectedLessonId && mode === "request" && (
        // 예약하기 진입 시
        <RequestReservationView
          selectedSlotText={
            selectedSlotText ? `선택한 시간: ${selectedSlotText}` : ""
          }
          requestMsg={requestMsg}
          onChangeMsg={setRequestMsg}
          pending={createReservation.isPending}
          errorMsg={submitError}
          onBack={() => {
            setMode("pick");
            setSubmitError(null);
          }}
          onSubmit={async () => {
            if (!selectedTimeSlotId) return;

            try {
              setSubmitError(null);

              await createReservation.mutateAsync({
                timeSlotId: selectedTimeSlotId,
                requestMsg: requestMsg.trim() ? requestMsg : null,
              });

              setMode("success");
            } catch (e) {
              setSubmitError(
                e instanceof Error ? e.message : "예약 요청에 실패했어요.",
              );
            }
          }}
        />
      )}

      {selectedLessonId && mode === "success" && (
        // 예약 성공 진입 시
        <ReservationSuccessView
          onOk={() => {
            setMode("pick");
            setSelectedTimeSlotId(null);
            setSelectedSlotText("");
            setRequestMsg("");
            setSubmitError(null);
          }}
        />
      )}
    </div>
  );
}

export default ArtistLessonSection;
