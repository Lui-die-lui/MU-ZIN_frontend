import type {
  ArtistCancelReq,
  ArtistReservationDetailResp,
  ArtistReservationSummaryResp,
  ReservationCreateReq,
  ReservationResp,
  ReservationStatus,
} from "../../Types/reservationType";
import type { ApiRespDto } from "../../Types/responseType";
import { instance } from "../instance/instance";

// 유저가 요청하는 예약
export const createReservationReq = (body: ReservationCreateReq) =>
  instance.post<ApiRespDto<ReservationResp>>("/reservations", body);

// 유저 본인 예약 목록
export const getMyReservationListReq = () =>
  instance.get<ApiRespDto<ReservationResp[]>>("/reservations/me");

// 유저 본인 예약 단일 조회
export const getMyReservationReq = (reservationId: number) =>
  instance.get<ApiRespDto<ReservationResp>>(
    `/reservations/me/${reservationId}`,
  );

// 유저 본인 예약 취소
export const cancelMyReservationReq = (reservationId: number) =>
  instance.patch<ApiRespDto<null>>(`/reservations/me/${reservationId}/cancel`);

// 아티스트 예약 목록(status 없으면 전체 반환)
export const getArtistReservationListReq = (params: {
  status?: ReservationStatus;
  from?: string;
  to?: string;
}) =>
  instance.get<ApiRespDto<ArtistReservationSummaryResp[]>>(
    "/reservations/artist",
    {
      params,
    },
  );

// 아티스트 예약 단일 조회
export const getArtistReservationReq = (reservationId: number) =>
  instance.get<ApiRespDto<ArtistReservationDetailResp>>(
    `/reservations/artist/${reservationId}`,
  );

// 아티스트 예약 확정
export const confirmReservationReq = (reservationId: number) =>
  instance.patch<ApiRespDto<null>>(
    `/reservations/artist/${reservationId}/confirm`,
  );

// 아티스트 예약 거절
export const rejectReservationReq = (reservationId: number) =>
  instance.patch<ApiRespDto<null>>(
    `/reservations/artist/${reservationId}/reject`,
  );

// 아티스트 확정된 예약 취소 (바디 없이도 호출 가능)
export const cancelByArtistReq = (
  reservationId: number,
  body: ArtistCancelReq,
) =>
  instance.patch<ApiRespDto<null>>(
    `/reservations/artist/${reservationId}/cancel-by-artist`,
    body,
  );
