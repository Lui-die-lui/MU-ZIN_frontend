// 아티스트 예약 관리쪽 탭 -> API 필터 파라미터 변환 함수

import type {
  ArtistReservationListFilter,
  ReservationStatus,
} from "../../Types/reservationType";

type Params = {
  status?: ReservationStatus;
};

/*
filter
tab = all/requested/confirmed/canceled/today
from/to = (선택) YYYY-MM-DD 형태
*/

export function buildArtistReservationParams(
  filter: ArtistReservationListFilter,
): Params {
  const { tab } = filter;

  let status: ReservationStatus | undefined;
  switch (tab) {
    case "requested":
      status = "REQUESTED";
      break;
    case "confirmed":
      status = "CONFIRMED";
      break;
    default:
      status = undefined;
  }

  // from/to
  // if (tab === "today") {
  //   const ymd = todayYmd();
  //   return {
  //     status,
  //     from: ymdToStartOfDay(ymd),
  //     to: ymdToEndOfDay(ymd),
  //   };
  // }

  // 현재 정책이랑 부딪히는 부분이 있어서 수정
  // 요청/전체만 요청일 기준 기간 필터를 서버로 보냄 
  // const allowRequestDateRange = tab === "requested" || tab === "all";

  // // from/to 둘 다 있을때만 기간 필터 적용
  // if (allowRequestDateRange && from && to) {
  //   return {
  //     // status,
  //     // from: ymdToStartOfDay(from),
  //     // to: ymdToStartOfDay(to),
  //     status,
  //     from,
  //     to,
  //   };
  // }

  return { status };
}
