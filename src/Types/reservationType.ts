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

// 예약 관리 날짜 기준 정의(드롭다운 사용) - 요청일 기준 or 레슨일(요청된 타임슬롯) 기준
export type ArtistReservationDateBasis = "REQUESTED_DT" | "LESSON_DT";

export const DATE_BASIS_LABEL: Record<ArtistReservationDateBasis, string> = {
  REQUESTED_DT: "요청일",
  LESSON_DT: "레슨일",
};

export type DateRange = { from: string; to: string };
// draft: 사용자가 UI에서 만지고 있는 값
// applied = 검색버튼 누른 후 서버에 보내길 값
export type ReservationSerchDraft = {
  basis: ArtistReservationDateBasis;
  range: DateRange;
};

export type ReservationSearchApplied = ReservationSerchDraft & {
  //  검색 버튼이 눌렸다 표시용
  stamp: number;
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
  from?: string; // LocalDateTime string (YYYY-MM-DDTHH:mm:ss)
  to?: string; // LocalDateTime string
  stamp?: number; // queryKey 트리거용
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

// 아티스트 예약 관리 탭 queryKey 파라미터
export type ArtistReservationKeyParams = {
  tab: ArtistReservationTab;
  status?: ReservationStatus;
  from?: string;
  to?: string;
};
