import {
  cancelMyReservationReq,
  getMyReservationReq,
} from "./../../apis/reservation/reservationApis";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ReservationTab } from "../../Types/reservationType";
import { reservationKeys } from "./reservationKeys";
import { getMyReservationListReq } from "../../apis/reservation/reservationApis";

export function useMyReservationList(tab: ReservationTab) {
  return useQuery({
    queryKey: reservationKeys.myList({ tab }),
    queryFn: async () => (await getMyReservationListReq()).data.data,
  });
}

export function useMyReservationDetail(reservationId: number | null) {
  return useQuery({
    queryKey: reservationKeys.myDetail(reservationId ?? 0),
    queryFn: async () => {
      const resp = await getMyReservationReq(reservationId!);
      return resp.data.data;
    },
    enabled: !!reservationId,
  });
}

export function useCancelMyReservation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (reservationId: number) => {
      const res = await cancelMyReservationReq(reservationId);
      const { status, message } = res.data;
      if (status !== "success") throw new Error(message || "예약 취소 실패");
      return res.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: reservationKeys.me() });
    },
  });
}
