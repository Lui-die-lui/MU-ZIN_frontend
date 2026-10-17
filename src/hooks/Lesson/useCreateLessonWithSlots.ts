import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  LessonCreateReq,
  LessonRecurrenceUpsertReq,
} from "../../Types/lessonTypes";
import {
  createMyLessonReq,
  createMyTimeSlotsReq,
  upsertMyLessonRecurrenceReq,
} from "../../apis/lesson/lessonApis";
import { getErrorMessage } from "../../utils/errorUtils";
import { lessonKeys } from "./useLessonEdit";
import { artistKeys } from "../artistSearch/artistKeys";

// 레슨 생성이랑 타임슬롯 생성 도메인이 한번에 일어날 수 있도록 합쳐줌
// 레슨은 만들어졌는데 슬롯 생성만 실패한 경우 warnings 로 알려줌 (예전엔 콘솔에만 찍혀서 사용자가 몰랐음)
export function useCreateLessonWithSlots() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      lesson: LessonCreateReq;
      startDts?: string[];
      recurrence?: LessonRecurrenceUpsertReq;
      // 정책 상 둘 다 보내도 됨(혼합). 하나만 보내도 됨.
    }) => {
      // 레슨 생성 (실패하면 그대로 throw -> 전역 토스트)
      const res = await createMyLessonReq(params.lesson);
      const lessonId = res.data.data.lessonId;
      const warnings: string[] = [];

      // 반복 규칙 저장 + materialize
      if (params.recurrence) {
        try {
          await upsertMyLessonRecurrenceReq(lessonId, params.recurrence);
        } catch (e) {
          warnings.push(`반복 시간 저장 실패: ${getErrorMessage(e)}`);
        }
      }

      const startDts = params.startDts ?? [];
      if (startDts.length > 0) {
        try {
          await createMyTimeSlotsReq(lessonId, { startDts });
        } catch (e) {
          warnings.push(`시간 추가 실패: ${getErrorMessage(e)}`);
        }
      }

      return { lessonId, warnings };
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: lessonKeys.myList() });
      await qc.invalidateQueries({ queryKey: artistKeys.all }); // 공개 아티스트 화면도 최신으로

      await qc.invalidateQueries({ queryKey: ["lessonTimeSlots"] });
    },
  });
}
