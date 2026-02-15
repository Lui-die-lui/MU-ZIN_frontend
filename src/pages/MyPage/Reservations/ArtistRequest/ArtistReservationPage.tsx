/** @jsxImportSource @emotion/react */
import { useMemo, useState } from "react";
import type {
  ArtistReservationListFilter,
  ArtistReservationTab,
} from "../../../../Types/reservationType";
import * as s from "../pageStyles";
import {
  useArtistReservationList,
  useConfirmReservation,
  useRejectReservation,
} from "../../../../hooks/reservation/useArtistReservations";
import ReservationCard from "../ReservationCard/ReservationCard";
import DateRangeInputs from "../../../../components/common/DateRangeInputs/DateRangeInputs";
import MypageTabBar from "../../../../components/common/MypageTabBar/MypageTabBar";
import { todayYmd } from "../../../../utils/timeSlotUtils";
import { pickYmdFromLocalDateTime } from "../../../../utils/searchForTimeUtils";

const TAB_ITEMS = [
  { key: "requested", label: "요청" },
  { key: "confirmed", label: "확정" },
  { key: "canceled", label: "취소/거절" },
  { key: "today", label: "오늘" },
  { key: "all", label: "전체" },
] as const;

function ArtistReservationPage() {
  const [filter, setFilter] = useState<ArtistReservationListFilter>({
    tab: "requested",
    from: undefined,
    to: undefined,
  });
  const { data = [], isLoading } = useArtistReservationList(filter);

  const confirmMut = useConfirmReservation();
  const rejectMut = useRejectReservation();

  // canseled 탭 통합(+REJECTED) 나중에 백엔드로 처리하기 고민
  const viewItems = useMemo(() => {
    // 오늘 수업 기준
    if (filter.tab === "today") {
      const ymd = todayYmd();
      return (
        [...data]
          .filter((r) => pickYmdFromLocalDateTime(r.timeSlot.startDt) === ymd)
          // 시간 기준 오름차순 정렬
          .sort(
            (a, b) =>
              new Date(a.timeSlot.startDt).getTime() -
              new Date(b.timeSlot.startDt).getTime(),
          )
      );
    }
    if (filter.tab === "canceled") {
      return data.filter(
        (r) => r.status === "CANCELED" || r.status === "REJECTED",
      );
    }

    return data;
  }, [filter.tab, data]);

  if (isLoading) {
    return (
      <div css={s.list}>
        <div css={s.skeleton} />
        <div css={s.skeleton} />
        <div css={s.skeleton} />
      </div>
    );
  }

  return (
    <div css={s.page}>
      {/* 공용 Tabs 사용 */}
      <MypageTabBar
        value={filter.tab}
        items={TAB_ITEMS}
        onChange={(next) =>
          setFilter((prev) => {
            // today(오늘 시작하는 레슨)은 date range 의미 없음
            if (next === "today") {
              return { ...prev, tab: next, from: undefined, to: undefined };
            }
            return { ...prev, tab: next };
          })
        }
      />

      {/* DateRangeInputs 그대로 사용 */}
      <DateRangeInputs
        from={filter.from}
        to={filter.to}
        disabled={filter.tab === "today"}
        onChange={(next) => setFilter((prev) => ({ ...prev, ...next }))}
      />

      {!viewItems.length ? (
        <div css={s.empty}>
          <div css={s.emptyTitle}>예약이 없습니다.</div>
        </div>
      ) : (
        <div css={s.list}>
          {viewItems.map((item) => {
            const isPendingAction = confirmMut.isPending || rejectMut.isPending;

            const rightActions =
              item.status === "REQUESTED" ? (
                <>
                  <button
                    css={s.actionBtn("primary")}
                    disabled={isPendingAction}
                    onClick={() => confirmMut.mutate(item.reservationId)}
                  >
                    수락
                  </button>
                  <button
                    css={s.actionBtn("danger")}
                    disabled={isPendingAction}
                    onClick={() => rejectMut.mutate(item.reservationId)}
                  >
                    거절
                  </button>
                </>
              ) : null;

            return (
              <ReservationCard
                key={item.reservationId}
                item={item}
                rightActions={rightActions}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ArtistReservationPage;
