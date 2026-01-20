import { useState } from "react";
import type { LessonCreateReq, LessonMode } from "../../Types/lessonTypes";

// 레슨 폼 제출됐을 때 처리 훅

const defaultDraft: LessonCreateReq = {
  // 레슨 생성할때 기본으로 넣어주는 값
  title: "", // 레슨 명
  mode: "OFFLINE", // 레슨 형식
  durationMin: 60, // 진행 시간
  price: null, // 레슨 가격
  description: null, // 레슨 소개
  requirementText: null, // 레슨 필수사항 안내
  instrumentId: 0,
};

// initial = 호출하는 쪽의 로컬 디폴트
// Partial<T> = 모든 필드가 선택적이 되어서 필요한 속성만 골라서 전달 가능
export function useLessonForm(initial?: Partial<LessonCreateReq>) {
  const [lessonDraft, setLessonDraft] = useState<LessonCreateReq>({
    ...defaultDraft,
    ...initial,
  }); // 기본적인 값과 내가 바꾼값들

  const setField = <K extends keyof LessonCreateReq>(
    key: K,
    value: LessonCreateReq[K],
  ) => {
    setLessonDraft((prev) => ({ ...prev, [key]: value }));
  }; // 필드 채울때 해당 키와 값에 현재 입력된 값을 set 해줌

  const setTitle = (v: string) => setField("title", v);
  const setMode = (v: LessonMode) => setField("mode", v);

  const setDurationMin = (v: string) =>
    setField("durationMin", v === "" ? 0 : Number(v)); // 입력 안되면 0분, 아니면 정수로 만들어줌

  const setPrice = (v: string) =>
    setField("price", v === "" ? null : Number(v));

  const setInstrumentId = (v: number) => setField("instrumentId", v);

  const reset = () => setLessonDraft({ ...defaultDraft, ...initial });
  // 기본값으로 되돌리되, 지정한 값은 유지한 채로 초기화한다

  return {
    lessonDraft,
    setField,
    setTitle,
    setMode,
    setDurationMin,
    setPrice,
    setInstrumentId,
    reset,
  };
}
