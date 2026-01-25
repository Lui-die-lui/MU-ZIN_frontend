import React from "react";
import type {
  LessonFormValues,
  LessonUpdateReq,
  MyLessonDetail,
} from "../../../../../Types/lessonTypes";

// 폼 값 -> 레슨 patch(변경된 것만) + booked(예약 요청 및 예약)면 core 제외
export function buildLessonUpdatePatch(params: {
  original: MyLessonDetail; // 서버 기존 값
  draft: LessonFormValues; // 사용자가 폼에서 수정중인 값
  coreEditable: boolean; // booked 없으면 true
}): LessonUpdateReq {
  const { original, draft, coreEditable } = params;
  const patch: LessonUpdateReq = {}; // 변경된 값을 담을 빈 객체

  // normalize (폼 값 전처리) - 서버 타입에 맞게 정리
  const nextTitle = draft.title.trim();
  const nextDuration = Number(draft.durationMin);
  const nextPrice = draft.price.trim() === "" ? null : Number(draft.price);
  const nextDesc = draft.description.trim() === "" ? null : draft.description;
  const nextReq =
    draft.requirementText.trim() === "" ? null : draft.requirementText;

  // core fields (booked 있으면 막기)

  if (coreEditable) {
    if (nextTitle !== original.title) patch.title = nextTitle;

    if (draft.mode !== original.mode) patch.mode = draft.mode;

    if (Number.isFinite(nextDuration) && nextDuration > 0) {
      if (nextDuration !== original.durationMin)
        patch.durationMin = nextDuration;
    }

    if (Number.isFinite(nextPrice as number) || nextPrice === null) {
      if (nextPrice !== original.price) patch.price = nextPrice;
    }
  }

  if (draft.instrumentId !== original.instrumentId) {
    patch.instrumentId = draft.instrumentId;
  }

  // 예약되어있어도 바꿀 수 있는 fields
  if (nextDesc !== original.description) patch.description = nextDesc;
  if (nextReq !== original.requirementText) patch.requirementText = nextReq;

  return patch;
}
