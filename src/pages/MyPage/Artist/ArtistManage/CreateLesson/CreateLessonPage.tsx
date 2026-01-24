import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLessonForm } from "../../../../../hooks/Lesson/useLessonForm";
import { useStartDts } from "../../../../../hooks/Lesson/useStartDts";
import { useCreateLessonWithSlots } from "../../../../../hooks/Lesson/useCreateLessonWithSlots";
import LessonFormSection from "./LessonFormSection";
import TimeSlotSection from "./TimeSlotSection";
import { useQuery } from "@tanstack/react-query";
import { getMyArtistProfileReq } from "../../../../../apis/artist/artistApi";
import type { InstrumentResponse } from "../../../../../Types/instrumentTypes";
import type {
  LessonCreateReq,
  LessonFormValues,
} from "../../../../../Types/lessonTypes";
import TimeSlotCreatePanel from "./TimeSlots/TimeSlotCreatePanel/TimeSlotCreatePanel";
import TimeSlotSelectedList from "./TimeSlots/TimeSlotSelectedList/TimeSlotSelectedList";

// 변환 함수 - form 재사용을 위해서
const toCreateReq = (v: LessonFormValues): LessonCreateReq => ({
  title: v.title.trim(),
  mode: v.mode,
  durationMin: Number(v.durationMin),
  price: v.price.trim() === "" ? null : Number(v.price),
  description: v.description.trim() === "" ? null : v.description,
  requirementText: v.requirementText.trim() === "" ? null : v.requirementText,
  instrumentId: v.instrumentId,
});

function CreateLessonPage() {
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ["artistProfile", "me"],
    queryFn: async () => (await getMyArtistProfileReq()).data.data,
  });

  const myInstruments = (profile?.instruments ?? []) as InstrumentResponse[];

  const {
    lessonDraft, // lessonFormValues
    setField,
    reset,
  } = useLessonForm();

  const { startDts, add, addMany, remove, clear } = useStartDts();

  const { mutate, isPending } = useCreateLessonWithSlots();

  const durationMinNum = useMemo(() => {
    const n = Number(lessonDraft.durationMin);
    return Number.isFinite(n) ? n : NaN;
  }, [lessonDraft.durationMin]);

  const onSubmit = () => {
    if (!lessonDraft.title.trim()) return alert("레슨명을 입력하세요.");

    const dm = Number(lessonDraft.durationMin);
    if (!Number.isFinite(dm) || dm <= 0)
      // 수업 시간이 입력되어있지 않으면
      return alert("수업 시간(분)을 입력하세요.");

    if (!lessonDraft.instrumentId) return alert("악기를 선택하세요.");

    mutate(
      { lesson: toCreateReq(lessonDraft), startDts },
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
      {/* 재사용 + onChange로 받고있어서  */}
      <LessonFormSection
        value={lessonDraft}
        onChange={setField}
        myInstruments={myInstruments}
      />

      <hr style={{ margin: "20px 0" }} />
      {/* <TimeSlotSection
        durationMin={durationMinNum}
        startDts={startDts}
        onAdd={add}
        onAddMany={addMany}
        onRemove={remove}
        onClear={clear}
      /> */}
      <TimeSlotCreatePanel
        durationMin={durationMinNum}
        onAdd={add}
        onAddMany={addMany}
      />

      <hr style={{ margin: "20px 0" }} />

      <TimeSlotSelectedList
        startDts={startDts}
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
