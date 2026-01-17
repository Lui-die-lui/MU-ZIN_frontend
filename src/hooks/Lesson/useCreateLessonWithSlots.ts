import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { LessonCreateReq } from "../../Types/lessonTypes";
import {
  createMyLessonReq,
  createMyTimeSlotsReq,
} from "../../apis/lesson/lessonApis";

// 레슨 생성이랑 타임슬롯 생성 도메인이 한번에 일어날 수 있도록 합쳐줌
export function useCreateLessonWithSlots() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      lesson: LessonCreateReq;
      startDts?: string[];
    }) => {
      const res = await createMyLessonReq(params.lesson);
      const lessonId = res.data.data.lessonId;

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
    },
  });
}
