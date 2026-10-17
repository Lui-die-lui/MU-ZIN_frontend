import type { QueryClient } from "@tanstack/react-query";
import { reservationKeys } from "./reservationKeys";

// 예약 상태가 바뀌면(요청·수락·거절·취소·완료) 시간 상태도 같이 바뀜 (OPEN/PENDING/BOOKED/CLOSED)
// -> 예약 목록뿐 아니라 레슨 시간 목록, 내 레슨 목록(요청 수·예약 가능한 시간 수), 공개 아티스트 화면도 다시 불러옴
// (예전엔 예약 목록만 갱신해서, 요청을 거절해 시간이 다시 열려도 다른 화면은 최대 3분간 예전 상태)
export function invalidateReservationRelated(qc: QueryClient) {
  return Promise.all([
    qc.invalidateQueries({ queryKey: reservationKeys.all }),
    qc.invalidateQueries({ queryKey: ["lessonOpenSlots"] }),
    qc.invalidateQueries({ queryKey: ["lessons"] }),
    qc.invalidateQueries({ queryKey: ["artist"] }),
  ]);
}
