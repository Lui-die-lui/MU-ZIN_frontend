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

// 레슨 생성이랑 타임슬롯 생성 도메인이 한번에 일어날 수 있도록 합쳐줌
export function useCreateLessonWithSlots() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      lesson: LessonCreateReq;
      startDts?: string[];
      recurrence?: LessonRecurrenceUpsertReq;
      // 정책 상 둘 다 보내도 됨(혼합). 하나만 보내도 됨.
    }) => {
      // 레슨 생성
      const res = await createMyLessonReq(params.lesson);
      const lessonId = res.data.data.lessonId;

      // 반복 규칙 저장 + materialize
      if (params.recurrence) {
        try {
          await upsertMyLessonRecurrenceReq(lessonId, params.recurrence);
        } catch (e) {
          console.error("반복 타임 슬롯 저장 실패", e);
        }
      }

      const startDts = params.startDts ?? [];
      if (startDts.length > 0) {
        try {
          await createMyTimeSlotsReq(lessonId, { startDts });
        } catch (e) {
          console.error("타임슬롯 생성 실패", e);
        }
      }

      return lessonId;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["myLessons"] });

      await qc.invalidateQueries({ queryKey: ["lessonTimeSlots"] });
    },
  });
}
