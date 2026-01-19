import React from "react";
import { useNavigate } from "react-router-dom";
import { useLessonForm } from "../../../../../hooks/Lesson/useLessonForm";
import { useStartDts } from "../../../../../hooks/Lesson/useStartDts";
import { useCreateLessonWithSlots } from "../../../../../hooks/Lesson/useCreateLessonWithSlots";
import LessonFormSection from "./LessonFormSection";
import TimeSlotSection from "./TimeSlotSection";

function CreateLessonPage() {
  const navigate = useNavigate();

  const {
    lessonDraft,
    setTitle,
    setMode,
    setDurationMin,
    setPrice,
    setField,
    reset,
  } = useLessonForm();

  const { startDts, add, remove, clear } = useStartDts();

  const { mutate, isPending } = useCreateLessonWithSlots();

  // textarea는 빈 값이면 null로 정리
  const setDescription = (v: string) =>
    setField("description", v.trim() === "" ? null : v);

  const setRequirementText = (v: string) =>
    setField("requirementText", v.trim() === "" ? null : v);

  const onSubmit = () => {
    if (!lessonDraft.title.trim()) return alert("레슨명을 입력하세요.");
    if (!lessonDraft.durationMin || lessonDraft.durationMin <= 0)
      // 수업 시간이 입력되어있지 않으면
      return alert("수업 시간(분)을 입력하세요.");

    mutate(
      { lesson: lessonDraft, startDts },
      {
        onSuccess: () => {
          reset();
          clear();
          navigate("/mypage/artist/manage");
        },
      },
    );
  };
  return (
    <div style={{ padding: 16, maxWidth: 720 }}>
      <h2>레슨 만들기</h2>
      <LessonFormSection
        lessonDraft={lessonDraft}
        setTitle={setTitle}
        setMode={setMode}
        setDurationMin={setDurationMin}
        setPrice={setPrice}
        setDescription={setDescription}
        setRequirementText={setRequirementText}
      />
      <hr style={{ margin: "20px 0" }} />
      <TimeSlotSection
        startDts={startDts}
        onAdd={add}
        onRemove={remove}
        onClear={clear}
      />
      
      <div style={{ marginTop: 16 }}>
        <button type="button" disabled={isPending} onClick={onSubmit}>
          {isPending ? "생성 중..." : "레슨 생성"}
        </button>
      </div>
    </div>
  );
}

export default CreateLessonPage;
