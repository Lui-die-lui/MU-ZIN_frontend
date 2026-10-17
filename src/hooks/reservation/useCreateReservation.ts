import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  ReservationCreateReq,
  ReservationResp,
} from "../../Types/reservationType";
import { createReservationReq } from "../../apis/reservation/reservationApis";
import { timeSlotKeys } from "../Lesson/timeSlotKeys";
import type { OpenTimeSlotsParams } from "../../apis/lesson/timeSlotApis";
import { reservationKeys } from "./reservationKeys";
import { invalidateReservationRelated } from "./invalidateReservationRelated";
import { ApiError } from "../../utils/errorUtils";

export function useCreateReservation(
  lessonId: number,
  params?: OpenTimeSlotsParams,
) {
  const qc = useQueryClient();

  return useMutation({
    // 예약 요청 화면에서 에러를 직접 보여주므로 전역 토스트는 생략
    meta: { skipGlobalError: true },
    mutationFn: async (
      body: ReservationCreateReq,
    ): Promise<ReservationResp> => {
      // 실패 시 인터셉터가 ApiError(백엔드 메시지)로 던짐
      const resp = await createReservationReq(body);
      return resp.data.data;
    },

    onSuccess: () => {
      invalidateReservationRelated(qc); // 시간이 PENDING 으로 바뀌므로 레슨/공개 화면도
      // 요청 성공시 슬롯이 OPEN -> PENDING 으로 바뀌니까
      // 슬롯 관련 쿼리 + 내 예약 목록 쿼리 갱신
      qc.invalidateQueries({
        queryKey: timeSlotKeys.openSlots(lessonId, params),
      });
      qc.invalidateQueries({ queryKey: reservationKeys.me() });
    },

    onError: (error) => {
      // 다른 사람이 먼저 예약했거나 지난 시간이면 슬롯 목록을 최신으로
      if (error instanceof ApiError && error.httpStatus === 409) {
        qc.invalidateQueries({
          queryKey: timeSlotKeys.openSlots(lessonId, params),
        });
      }
    },
  });
}
