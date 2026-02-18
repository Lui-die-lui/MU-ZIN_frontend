import { useQuery } from "@tanstack/react-query";
import type { ReservationTab } from "../../Types/reservationType";
import { reservationKeys } from "./reservationKeys";
import { getMyReservationListReq } from "../../apis/reservation/reservationApis";

export function useMyReservationList(tab: ReservationTab) {
  return useQuery({
    queryKey: reservationKeys.myList({ tab }),
    queryFn: async () => (await getMyReservationListReq()).data.data,
  });
}
