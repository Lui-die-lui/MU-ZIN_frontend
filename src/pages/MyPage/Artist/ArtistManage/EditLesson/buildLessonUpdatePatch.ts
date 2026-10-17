import type {
  LessonFormValues,
  LessonUpdateReq,
  MyLessonDetail,
} from "../../../../../Types/lessonTypes";
import type { LessonFormErrors } from "../common/LessonFormSection";
import { DESCRIPTION_MAX, REQUIREMENT_MAX, TITLE_MAX } from "../common/LessonFormSection";

export const MAX_PRICE = 10_000_000;
export const MAX_DURATION = 1440; // 서버 검증(@Max 1440)과 동일

// 서버 레슨 상세 -> 폼 값
export const toFormValues = (d: MyLessonDetail): LessonFormValues => ({
  title: d.title ?? "",
  instId: d.instId ?? 0,
  mode: d.mode,
  durationMin: String(d.durationMin ?? ""),
  price: d.price == null ? "" : String(d.price),
  description: d.description ?? "",
  requirementText: d.requirementText ?? "",
  closingPolicy: d.closingPolicy,
});

// 저장 전 검증 (서버 검증과 같은 기준 + 화면 안내용 메시지)
export function validateLessonForm(draft: LessonFormValues): LessonFormErrors {
  const errors: LessonFormErrors = {};
  const title = draft.title.trim();
  if (!title) errors.title = "레슨 제목을 입력해주세요.";
  else if (title.length > TITLE_MAX) errors.title = `레슨 제목은 ${TITLE_MAX}자 이하로 입력해주세요.`;

  if (!draft.instId) errors.instId = "레슨 악기를 선택해주세요.";

  const duration = Number(draft.durationMin);
  if (draft.durationMin === "" || !Number.isInteger(duration) || duration <= 0) {
    errors.durationMin = "수업 시간을 1분 이상으로 입력해주세요.";
  } else if (duration > MAX_DURATION) {
    errors.durationMin = `수업 시간은 ${MAX_DURATION}분 이하로 입력해주세요.`;
  }

  const price = Number(draft.price);
  if (draft.price === "") errors.price = "가격을 입력해주세요. 무료라면 0을 입력해주세요.";
  else if (!Number.isInteger(price) || price < 0) errors.price = "가격은 0원 이상 숫자로 입력해주세요.";
  else if (price > MAX_PRICE) errors.price = `가격은 ${MAX_PRICE.toLocaleString()}원 이하로 입력해주세요.`;

  if (draft.description.length > DESCRIPTION_MAX) errors.description = `레슨 소개는 ${DESCRIPTION_MAX}자 이하로 입력해주세요.`;
  if (draft.requirementText.length > REQUIREMENT_MAX) errors.requirementText = `준비물·요청사항은 ${REQUIREMENT_MAX}자 이하로 입력해주세요.`;
  return errors;
}

// 폼 값 -> 레슨 patch (바뀐 것만). 진행 중인 예약이 있으면 핵심 항목은 보내지 않음
export function buildLessonUpdatePatch(params: {
  original: MyLessonDetail; // 서버 기존 값
  draft: LessonFormValues; // 사용자가 폼에서 수정중인 값
  coreEditable: boolean; // 진행 중인 예약이 없으면 true
}): LessonUpdateReq {
  const { original, draft, coreEditable } = params;
  const patch: LessonUpdateReq = {};

  if (coreEditable) {
    const nextTitle = draft.title.trim();
    if (nextTitle !== original.title) patch.title = nextTitle;

    if (draft.mode !== original.mode) patch.mode = draft.mode;

    const nextDuration = Number(draft.durationMin);
    if (Number.isInteger(nextDuration) && nextDuration > 0 && nextDuration !== original.durationMin) {
      patch.durationMin = nextDuration;
    }

    // 가격은 비울 수 없음 (검증에서 막음). 서버는 null 을 "변경 없음"으로 처리함
    const nextPrice = Number(draft.price);
    if (draft.price !== "" && Number.isInteger(nextPrice) && nextPrice !== original.price) {
      patch.price = nextPrice;
    }

    if (draft.instId && draft.instId !== original.instId) patch.instId = draft.instId;
  }

  if (draft.closingPolicy !== original.closingPolicy) {
    patch.closingPolicy = draft.closingPolicy;
  }

  // 소개/준비물은 지우는 것도 반영되도록 빈 문자열로 보냄
  // (예전엔 null 을 보내서 서버가 "변경 없음"으로 처리 -> 지워도 그대로 남았음)
  const nextDesc = draft.description.trim() === "" ? "" : draft.description;
  if (nextDesc !== (original.description ?? "")) patch.description = nextDesc;

  const nextReq = draft.requirementText.trim() === "" ? "" : draft.requirementText;
  if (nextReq !== (original.requirementText ?? "")) patch.requirementText = nextReq;

  return patch;
}
