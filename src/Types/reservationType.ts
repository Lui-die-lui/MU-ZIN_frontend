import { label } from "./../pages/MyPage/Account/UserAccount/PasswordSection/ChangePasswordModal/styles";
import type { TimeSlotResp } from "./lessonTypes";
export type ReservationStatus =
  | "REQUESTED"
  | "CONFIRMED"
  | "CANCELED"
  | "REJECTED"
  | "COMPLETED";

// 예약 관리 상단 탭
export type ArtistReservationTab =
  | "all"
  | "requested"
  | "confirmed"
  | "canceled"
  | "today";

export function tabToStatus(
  tab: ArtistReservationTab,
): ReservationStatus | undefined {
  switch (tab) {
    case "requested":
      return "REQUESTED";
    case "confirmed":
      return "CONFIRMED";
    case "canceled":
      return "CANCELED"; // REJECTED까지 묶고 싶으면 백엔드에서 statusIn으로 확장 필요
    case "today":
      return undefined; // today는 기간 필터가 필요(백엔드 from/to 없으면 임시로 all)
    case "all":
    default:
      return undefined;
  }
}

// ===============================
//  유저
// ===============================
export type ReservationCreateReq = {
  timeSlotId: number;
  requestMsg: string | null;
};

export type ReservationResp = {
  reservationId: number;
  status: ReservationStatus;
  priceAtBooking: number;
  requestedDt: string;
  confirmedDt: string | null;
  canceledDt: string | null;
  lessonId: number;
  timeSlot: TimeSlotResp;
};

// ===============================
//  아티스트
// ===============================

// 기간 지정
export type ArtistReservationListFilter = {
  tab: ArtistReservationTab; // 탭 기반으로 받아줌
  from?: string;
  to?: string;
};

// 아티스트 예약 리스트(카드) 타입
export type ArtistReservationSummaryResp = {
  reservationId: number;
  status: ReservationStatus;
  priceAtBooking: number;
  requestedDt: string;
  confirmedDt: string | null;
  canceledDt: string | null;

  lessonId: number;
  lessonTitle: string;

  timeSlot: TimeSlotResp;

  requesterUserId: number;
  requesterUsername: string;

  hasMessage: boolean;
};

// 아티스트 예약 상세(추후 모달 등) 타입
export type ArtistReservationDetailResp = {
  reservationId: number;
  status: ReservationStatus;
  priceAtBooking: number;
  requestedDt: string;
  confirmedDt: string | null;
  canceledDt: string | null;

  lessonId: number;
  lessonTitle: string;

  timeSlot: TimeSlotResp;

  requesterUserId: number;
  requesterUsername: string;

  requestedMsg: string | null;
};

// 아티스트가 레슨 취소 시 타임슬롯 다시 열지 말지
export type ArtistCancelReq = {
  reason: string;
  reopenSlot: boolean;
};
