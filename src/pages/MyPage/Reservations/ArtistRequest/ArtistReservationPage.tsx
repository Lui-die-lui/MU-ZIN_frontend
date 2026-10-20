/** @jsxImportSource @emotion/react */
import { useReservationParam } from "../../../../hooks/reservation/useReservationParam";
import {
  useArtistReservationDetail,
  useArtistReservationList,
} from "../../../../hooks/reservation/useArtistReservations";
import ReservationBoard, { EmptyLink } from "../ReservationBoard/ReservationBoard";

// 마이페이지 > 레슨/예약 관리 > 요청 관리 (아티스트)
function ArtistReservationPage() {
  // ?r=예약id 로 들어오면 (메인 > 내 레슨 일정 카드) 그 예약 상세를 바로 엶
  const [selectedId, setSelectedId] = useReservationParam();
  // 탭마다 상태별로 따로 받지 않고 전체를 받아 화면에서 나눔 (탭 옆 개수 표시 + 탭 전환 시 깜빡임 없음)
  const list = useArtistReservationList({ tab: "all" });
  const detail = useArtistReservationDetail(selectedId);

  return (
    <ReservationBoard
      mode="ARTIST"
      title="예약 요청 관리"
      desc="수강생의 예약 요청을 수락하거나 거절하고, 확정된 레슨 일정을 관리해요."
      items={list.data ?? []}
      isLoading={list.isLoading}
      isError={list.isError}
      onRetry={() => list.refetch()}
      selectedId={selectedId}
      onSelect={setSelectedId}
      detail={selectedId ? (detail.data ?? null) : null}
      emptyAction={<EmptyLink to="/mypage/artist/manage">내 레슨 관리</EmptyLink>}
    />
  );
}

export default ArtistReservationPage;
