import {
  confirmReservationReq,
  getArtistReservationReq,
  rejectReservationReq,
} from "../../apis/reservation/reservationApis";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ArtistReservationListFilter, ReservationStatus } from "../../Types/reservationType";
import { reservationKeys } from "./reservationKeys";
import { getArtistReservationListReq } from "../../apis/reservation/reservationApis";
import { buildArtistReservationParams } from "../../utils/filters/buildArtistReservationParams";

// 아티스트가 가진 예약 리스트 불러옴
export function useArtistReservationList(filter: ArtistReservationListFilter) {
  const params = buildArtistReservationParams(filter);
  return useQuery({
    queryKey: reservationKeys.artistList({tab: filter.tab, ...params}),
    queryFn: async () => (await getArtistReservationListReq(params)).data.data,
//     queryFn: async () => {
//   const res = await getArtistReservationListReq(params);
//   console.log("artist list raw axios:", res);
//   console.log("artist list res.data:", res.data);
//   console.log("artist list res.data.data:", (res.data as any)?.data);
//   return (res.data as any).data; // 일단 임시
// },
  });
}

// 아티스트 예약 상세
export function useArtistReservationDetail(reservationId: number) {
  return useQuery({
    queryKey: reservationKeys.artistDetail(reservationId ?? 0),
    queryFn: async () => (await getArtistReservationReq(reservationId!)).data,
    enabled: !!reservationId, // 예약 아이디 무조건 있을것
  });
}

export function useConfirmReservation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (reservationId: number) => confirmReservationReq(reservationId),
    onSuccess: (_res, reservationId) => {
      // qc.invalidateQueries({ queryKey: reservationKeys.artistList(status) }); // 리스트 내 상태 변경
      qc.invalidateQueries({
        queryKey: reservationKeys.artistDetail(reservationId),
      }); // 상세 상태 변경
      qc.invalidateQueries({ queryKey: reservationKeys.artist() }); // 탭 전체 동기화
    },
  });
}

export function useRejectReservation() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (reservationId: number) => rejectReservationReq(reservationId),
    onSuccess: (_res, reservationId) => {
      qc.invalidateQueries({ queryKey: reservationKeys.artist() });
      qc.invalidateQueries({
        queryKey: reservationKeys.artistDetail(reservationId),
      });
    },
  });
}
