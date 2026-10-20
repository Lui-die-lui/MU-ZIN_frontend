/** @jsxImportSource @emotion/react */
import { useMyReservationDetail, useMyReservationList } from "../../../../hooks/reservation/useMyReservation";
import { useReservationParam } from "../../../../hooks/reservation/useReservationParam";
import ReservationBoard, { EmptyLink } from "../ReservationBoard/ReservationBoard";

// 마이페이지 > 레슨/예약 관리 > 내 예약 (수강생)
function MyReservationsPage() {
  // ?r=예약id 로 들어오면 그 예약 상세를 바로 엶
  const [selectedId, select] = useReservationParam();
  // 서버는 내 예약 전체를 주고, 탭·기간·정렬은 화면에서 나눔 (탭마다 다시 요청하지 않음)
  const list = useMyReservationList("all");
  const detail = useMyReservationDetail(selectedId);

  return (
    <ReservationBoard
      mode="USER"
      title="내 예약"
      desc="요청한 레슨과 확정된 일정을 확인하고, 필요하면 취소할 수 있어요."
      items={list.data ?? []}
      isLoading={list.isLoading}
      isError={list.isError}
      onRetry={() => list.refetch()}
      selectedId={selectedId}
      onSelect={select}
      detail={selectedId ? (detail.data ?? null) : null}
      emptyAction={<EmptyLink to="/lessons">레슨 찾아보기</EmptyLink>}
    />
  );
}

export default MyReservationsPage;
