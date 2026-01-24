import { useState } from "react";
import type {
  LessonFormValues,
  LessonMode,
} from "../../Types/lessonTypes";

// 레슨 폼 제출됐을 때 처리 훅

const defaultDraft: LessonFormValues = {
  // 레슨 생성할때 기본으로 넣어주는 값
  title: "", // 레슨 명
  mode: "OFFLINE", // 레슨 형식
  durationMin: "", // 진행 시간
  price: "", // 레슨 가격
  description: "", // 레슨 소개
  requirementText: "", // 레슨 필수사항 안내
  instrumentId: 0,
};

// initial = 호출하는 쪽의 로컬 디폴트
// Partial<T> = 모든 필드가 선택적이 되어서 필요한 속성만 골라서 전달 가능
export function useLessonForm(initial?: Partial<LessonFormValues>) {
  const [lessonDraft, setLessonDraft] = useState<LessonFormValues>({
    ...defaultDraft,
    ...initial,
  }); // 기본적인 값과 내가 바꾼값들

  const setField = <K extends keyof LessonFormValues>(
    key: K,
    value: LessonFormValues[K],
  ) => {
    setLessonDraft((prev) => ({ ...prev, [key]: value }));
  }; // 필드 채울때 해당 키와 값에 현재 입력된 값을 set 해줌

  const setTitle = (v: string) => setField("title", v);
  const setMode = (v: LessonMode) => setField("mode", v);
  const setDurationMin = (v: string) => setField("durationMin", v);
  const setPrice = (v: string) => setField("price", v);
  const setDescription = (v: string) => setField("description", v);
  const setRequirementText = (v: string) => setField("requirementText", v);
  const setInstrumentId = (v: number) => setField("instrumentId", v);

  const reset = () => setLessonDraft({ ...defaultDraft, ...initial });

  return {
    lessonDraft,
    setField,
    setTitle, 
    setMode,
    setDurationMin,
    setPrice,
    setDescription, 
    setRequirementText,
    setInstrumentId,
    reset,
  };
}
