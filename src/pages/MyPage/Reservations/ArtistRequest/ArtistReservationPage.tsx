/** @jsxImportSource @emotion/react */
import { useMemo, useState } from "react";
import type {
  ArtistReservationListFilter,
  DateBasis,
  ReservationTab,
  SearchApplied,
  SearchDraft,
} from "../../../../Types/reservationType";
import * as s from "../pageStyles";
import {
  useArtistReservationList,
  useConfirmReservation,
  useRejectReservation,
} from "../../../../hooks/reservation/useArtistReservations";
import ReservationCard from "../ReservationCard/ReservationCard";
import MypageTabBar from "../../../../components/common/MypageTabBar/MypageTabBar";
import { todayYmd } from "../../../../utils/timeSlotUtils";
import { pickYmdFromLocalDateTime } from "../../../../utils/searchForTimeUtils";
import { makeReservationSearchApplied, makeSortComparator } from "../../../../utils/reservationUtils";
import {
  ARTIST_TAB_ITEMS,
  DATE_BASIS_OPTIONS,
  DEFAULT_SEARCH_DRAFT,
  SORT_OPTIONS,

} from "../../../../constants/reservations";
import DateRangeSearchBar from "../DateSearchBar/DateRangeSearchBar";


function ArtistReservationPage() {

  // 탭은 즉시 반영(탭 누르면 refetch)
  const [tab, setTab] = useState<ReservationTab>("requested");

  // 입력중인 값(draft) - 요청x
  const [draft, setDraft] = useState<SearchDraft>(DEFAULT_SEARCH_DRAFT);

  // 검색 버튼 누른 값(applied) - 요청o
  const [applied, setApplied] = useState<SearchApplied>(
    makeReservationSearchApplied(DEFAULT_SEARCH_DRAFT),
  );

  // 탭 누르면 검색 상태 초기화 + refetch
  const onChangeTab = (next: ReservationTab) => {
    setTab(next);

    // 탭 변경 시 초기화
    setDraft(DEFAULT_SEARCH_DRAFT);
    setApplied(makeReservationSearchApplied(DEFAULT_SEARCH_DRAFT));
  };

  // 검색 버튼: draft -> applied 확정
  const onClickSearch = () => {
    setApplied(makeReservationSearchApplied(draft));
  };

  // useQuery가 실제 제출 된 값만 볼 수 있도록
  const filter: ArtistReservationListFilter = { tab };
  const { data = [], isLoading, isFetching } = useArtistReservationList(filter);

  const confirmMut = useConfirmReservation();
  const rejectMut = useRejectReservation();

  const viewItems = useMemo(() => {
    let items = [...data];

    if (tab === "today") {
      const ymd = todayYmd();
      items = items.filter(
        (r) =>
          r.status === "CONFIRMED" &&
          pickYmdFromLocalDateTime(r.timeSlot.startDt) === ymd,
      );
    }

    if (tab === "canceled") {
      items = items.filter(
        (r) => r.status === "CANCELED" || r.status === "REJECTED",
      );
    }

    const getYmd = (r: (typeof data)[number]) =>
      applied.basis === "REQUESTED_DT"
        ? pickYmdFromLocalDateTime(r.requestedDt)
        : pickYmdFromLocalDateTime(r.timeSlot.startDt);

    const { from, to } = applied.range;
    if (from && to) {
      items = items.filter((r) => {
        const ymd = getYmd(r);
        return from <= ymd && ymd <= to;
      });
    }

    const getDate = (r: (typeof data)[number], basis: DateBasis) =>
      basis === "REQUESTED_DT" ? r.requestedDt : r.timeSlot.startDt;

    items.sort(makeSortComparator(applied.basis, applied.sort, getDate));

    return items;
  }, [
    tab,
    data,
    applied.basis,
    applied.sort,
    applied.range.from,
    applied.range.to,
    applied.stamp,
  ]);
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
      {/*  Tabs: 탭 바꾸면 refetch + 검색 초기화 */}
      <MypageTabBar value={tab} items={ARTIST_TAB_ITEMS} onChange={onChangeTab} />

      {/* (추가) 요청일/레슨일 드롭다운 */}
      <DateRangeSearchBar
        draft={draft}
        onDraftChange={setDraft}
        onSearch={onClickSearch}
        basisOptions={DATE_BASIS_OPTIONS}
        sortOptions={SORT_OPTIONS}
        disabled={tab === "today"}
        isSearching={isFetching}
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
