/** @jsxImportSource @emotion/react */
import * as s from "../pageStyles";
import React, { useMemo, useState } from "react";
import type {
  DateBasis,
  ReservationTab,
  SearchApplied,
  SearchDraft,
} from "../../../../Types/reservationType";
import { DATE_BASIS_OPTIONS, DEFAULT_SEARCH_DRAFT, MY_TAB_ITEMS, SORT_OPTIONS } from "../../../../constants/reservations";
import {
  makeReservationSearchApplied,
  makeSortComparator,
} from "../../../../utils/reservationUtils";
import { useMyReservationList } from "../../../../hooks/reservation/useMyReservation";
import { pickYmdFromLocalDateTime } from "../../../../utils/searchForTimeUtils";
import ReservationCard from "../ReservationCard/ReservationCard";
import DateRangeSearchBar from "../DateSearchBar/DateRangeSearchBar";
import MypageTabBar from "../../../../components/common/MypageTabBar/MypageTabBar";

function MyReservationsPage() {
  const [tab, setTab] = useState<ReservationTab>("today");

  const [draft, setDraft] = useState<SearchDraft>(DEFAULT_SEARCH_DRAFT);
  const [applied, setApplied] = useState<SearchApplied>(
    makeReservationSearchApplied(DEFAULT_SEARCH_DRAFT),
  );

  // tab 바꿀 시 기본 상태로 set 해줌
  const onChangeTab = (next: ReservationTab) => {
    setTab(next);
    setDraft(DEFAULT_SEARCH_DRAFT);
    setApplied(makeReservationSearchApplied(DEFAULT_SEARCH_DRAFT));
  };

  const onClickSearch = () => {
    setApplied(makeReservationSearchApplied(draft));
  };

  // 유저 예약 목록 가져오기
  const { data = [], isLoading, isFetching } = useMyReservationList(tab);

  const viewItems = useMemo(() => {
    let items = [...data];

    // 유저 기준 tab 필터
    if (tab === "today") {
      items = items.filter((r) => r.status === "REQUESTED");
    }
    if (tab === "confirmed") {
      items = items.filter((r) => r.status === "CONFIRMED");
    }

    if (tab === "canceled") {
      items = items.filter(
        (r) => r.status === "CANCELED" || r.status === "REJECTED",
      );
    }

    // 날짜 범위 필터
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

    // 정렬
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
      <MypageTabBar value={tab} items={MY_TAB_ITEMS} onChange={onChangeTab} />

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
          {viewItems.map((item) => (
            <ReservationCard
              key={item.reservationId}
              item={item}
              // 유저 페이지 액션: 예) 취소 버튼(REQUESTED/CONFIRMED에서 가능) 등
              rightActions={null}
            />
          ))}
        </div>
      )}
    </div>
  );;
}

export default MyReservationsPage;
