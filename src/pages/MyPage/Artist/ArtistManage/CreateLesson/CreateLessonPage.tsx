import React from "react";
import { useNavigate } from "react-router-dom";
import { useLessonForm } from "../../../../../hooks/Lesson/useLessonForm";
import { useStartDts } from "../../../../../hooks/Lesson/useStartDts";
import { useCreateLessonWithSlots } from "../../../../../hooks/Lesson/useCreateLessonWithSlots";
import LessonFormSection from "./LessonFormSection";
import TimeSlotSection from "./TimeSlotSection";
import { useQuery } from "@tanstack/react-query";
import { getMyArtistProfileReq } from "../../../../../apis/artist/artistApi";
import type { InstrumentResponse } from "../../../../../Types/instrumentTypes";

function CreateLessonPage() {
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ["artistProfile", "me"],
    queryFn: async () => (await getMyArtistProfileReq()).data.data,
  });

  const myInstruments = (profile?.instruments ?? []) as InstrumentResponse[];

  const {
    lessonDraft,
    setTitle,
    setMode,
    setDurationMin,
    setPrice,
    setField,
    setInstrumentId,
    reset,
  } = useLessonForm();

  const { startDts, add, addMany, remove, clear } = useStartDts();

  const { mutate, isPending } = useCreateLessonWithSlots();

  // textarea는 빈 값이면 null로 정리
  const setDescription = (v: string) =>
    setField("description", v.trim() === "" ? null : v);

  const setRequirementText = (v: string) =>
    setField("requirementText", v.trim() === "" ? null : v);

  const durationMinNum = Number(lessonDraft.durationMin);
  const durationOk = Number(durationMinNum) && durationMinNum > 0;

  const onSubmit = () => {
    if (!lessonDraft.title.trim()) return alert("레슨명을 입력하세요.");
    if (!lessonDraft.durationMin || lessonDraft.durationMin <= 0)
      // 수업 시간이 입력되어있지 않으면
      return alert("수업 시간(분)을 입력하세요.");

    if (!lessonDraft.instrumentId) return alert("악기를 선택하세요.");

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
        myInstruments={myInstruments}
        setInstrumentId={setInstrumentId}
      />

      <hr style={{ margin: "20px 0" }} />
      <TimeSlotSection
        durationMin={durationOk ? durationMinNum : NaN}
        startDts={startDts}
        onAdd={add}
        onAddMany={addMany}
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
