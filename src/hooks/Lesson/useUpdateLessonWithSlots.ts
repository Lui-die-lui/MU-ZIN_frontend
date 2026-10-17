import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  LessonRecurrenceUpsertReq,
  LessonUpdateReq,
  TimeSlotCreateReq,
} from "../../Types/lessonTypes";
import {
  createMyTimeSlotsReq,
  updateMyLessonReq,
  upsertMyLessonRecurrenceReq,
} from "../../apis/lesson/lessonApis";
import { lessonKeys } from "./useLessonEdit";
import { artistKeys } from "../artistSearch/artistKeys";

export function useUpdateLessonWithSlots(
  lessonId: number,
  from: string,
  to: string,
) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      lesson?: LessonUpdateReq;
      recurrence?: LessonRecurrenceUpsertReq;
      addStartDts?: string[];
      // 정책상 셋 중 뭐가 와도 됨
    }) => {
      // 레슨 수정
      if (params.lesson) {
        await updateMyLessonReq(lessonId, params.lesson);
      }

      // 반복 규칙 저장 + materialize
      if (params.recurrence) {
        await upsertMyLessonRecurrenceReq(lessonId, params.recurrence);
      }

      // 슬롯 추가(단일/반복 계산 결과)
      const add = params.addStartDts ?? [];
      if (add.length > 0) {
        const body: TimeSlotCreateReq = { startDts: add };
        await createMyTimeSlotsReq(lessonId, body);
      }

      return true;
    },

    // 레슨 정보는 저장되고 시간 추가만 실패해도 화면이 최신 상태를 다시 읽도록 성공/실패 모두 갱신
    onSettled: async () => {
      await qc.invalidateQueries({ queryKey: artistKeys.all }); // 공개 아티스트 화면도 최신으로
      await qc.invalidateQueries({ queryKey: lessonKeys.myDetail(lessonId) });
      await qc.invalidateQueries({ queryKey: lessonKeys.myList() });
      await qc.invalidateQueries({
        queryKey: lessonKeys.myRecurrence(lessonId),
      });
      await qc.invalidateQueries({
        queryKey: lessonKeys.myTimeSlots(lessonId, from, to),
      });
    },
  });
}
