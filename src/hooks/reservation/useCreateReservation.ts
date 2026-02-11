import { useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  ReservationCreateReq,
  ReservationResp,
} from "../../Types/reservationType";
import { createReservationReq } from "../../apis/reservation/reservationApis";
import { timeSlotKeys } from "../Lesson/timeSlotKyes";
import type { OpenTimeSlotsParams } from "../../apis/lesson/timeSlotApis";

export function useCreateReservation(
  lessonId: number,
  params?: OpenTimeSlotsParams,
) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (
      body: ReservationCreateReq,
    ): Promise<ReservationResp> => {
      const resp = await createReservationReq(body);

      if (resp.data.status === "failed") {
        throw new Error(resp.data.message || "예약 요청 실패");
      }

      return resp.data.data;
    },

    onSuccess: () => {
      // 요청 성공시 슬롯이 OPEN -> PENDING 으로 바뀌니까
      // 슬롯 관련 쿼리 + 내 예약 목록 쿼리 갱신
      qc.invalidateQueries({
        queryKey: timeSlotKeys.openSlots(lessonId, params),
      });
    },
  });
}
