/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import * as cs from "../ReservationCard/styles";
import { useMemo, useState, type ReactNode } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { DateBasis, ReservationResp, ReservationStatus, ReservationTab } from "../../../../Types/reservationType";
import type { SortOrder } from "../../../../Types/commonTypes";
import type { ViewerMode } from "../../../../Types/myPageTypes";
import type { TimeSlotResp } from "../../../../Types/lessonTypes";
import MypageTabBar from "../../../../components/common/MypageTabBar/MypageTabBar";
import SelectDropdown from "../../../../components/common/SelectDropdown/SelectDropdown";
import ReservationCard from "../ReservationCard/ReservationCard";
import ReservationDetailModal from "../ReservationDetailModal/ReservationDetailModal";
import ReservationCalendarSection from "../ReservationCalendar/ReservationCalendarSection";
import { reservationCalendarUtils } from "../../../../utils/reservationCalendarUtils";
import { pickYmdFromLocalDateTime } from "../../../../utils/searchForTimeUtils";
import { todayYmd } from "../../../../utils/timeSlotUtils";
import { formatMonthDay } from "../../../../utils/reservationFormat";
import { useConfirmReservation, useRejectReservation } from "../../../../hooks/reservation/useArtistReservations";
import { toast } from "../../../../stores/useToastStore";

// 목록 한 줄 (내 예약 / 요청 관리 응답의 공통 부분)
export type BoardItem = {
  reservationId: number;
  status: ReservationStatus;
  priceAtBooking: number;
  requestedDt: string;
  timeSlot: TimeSlotResp;
  lessonId: number;
  lessonTitle: string;
  hasMessage?: boolean;
  requesterUsername?: string;
  artistDisplayName?: string;
};

type TabDef = { key: ReservationTab; label: string; empty: string };

const TABS: Record<ViewerMode, TabDef[]> = {
  USER: [
    { key: "all", label: "전체", empty: "아직 예약한 레슨이 없어요." },
    { key: "requested", label: "확인 대기", empty: "아티스트 확인을 기다리는 요청이 없어요." },
    { key: "inProgress", label: "확정", empty: "확정된 레슨이 없어요." },
    { key: "today", label: "오늘", empty: "오늘 예정된 레슨이 없어요." },
    { key: "completed", label: "완료", empty: "완료된 레슨이 없어요." },
    { key: "canceled", label: "취소·거절·만료", empty: "취소되거나 거절·만료된 예약이 없어요." },
  ],
  ARTIST: [
    { key: "requested", label: "새 요청", empty: "확인할 예약 요청이 없어요." },
    { key: "today", label: "오늘 레슨", empty: "오늘 예정된 레슨이 없어요." },
    { key: "inProgress", label: "확정", empty: "확정된 레슨이 없어요." },
    { key: "completed", label: "완료", empty: "완료된 레슨이 없어요." },
    { key: "canceled", label: "취소·거절·만료", empty: "취소되거나 거절·만료된 예약이 없어요." },
    { key: "all", label: "전체", empty: "아직 받은 예약이 없어요." },
  ],
};

const matchTab = (tab: ReservationTab, r: BoardItem) => {
  switch (tab) {
    case "requested":
      return r.status === "REQUESTED";
    case "inProgress":
      return r.status === "CONFIRMED" || r.status === "COMPLETION_PENDING";
    case "completed":
      return r.status === "COMPLETED";
    case "canceled":
      return r.status === "CANCELED" || r.status === "REJECTED" || r.status === "EXPIRED";
    case "today":
      return (
        (r.status === "CONFIRMED" || r.status === "COMPLETION_PENDING") &&
        pickYmdFromLocalDateTime(r.timeSlot.startDt) === todayYmd()
      );
    default:
      return true;
  }
};

type Props = {
  mode: ViewerMode;
  title: string;
  desc: string;
  items: BoardItem[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  detail: ReservationResp | null;
  emptyAction?: ReactNode;
};

// 내 예약 / 예약 요청 관리 공용 화면
// 예전: 두 페이지가 거의 같은 코드를 따로 가지고 있었고, 주소의 ?tab= 값이 이상하면 빈 목록, 뒤로 가기로 탭이 안 바뀜,
//       기간은 시작·종료를 둘 다 넣고 '검색'을 눌러야만 적용, 큰 달력이 항상 목록 위를 차지
function ReservationBoard({ mode, title, desc, items, isLoading, isError, onRetry, selectedId, onSelect, detail, emptyAction }: Props) {
  const tabs = TABS[mode];
  const [params, setParams] = useSearchParams();
  const rawTab = params.get("tab");
  // 주소에서 바로 읽어서 뒤로/앞으로 가기에도 탭이 따라감. 모르는 값이면 기본 탭
  const tab: ReservationTab = tabs.some((t) => t.key === rawTab) ? (rawTab as ReservationTab) : tabs[0].key;

  const [basis, setBasis] = useState<DateBasis>("LESSON_DT");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [sort, setSort] = useState<SortOrder>(mode === "ARTIST" ? "OLDIST" : "NEWEST");
  const [showCalendar, setShowCalendar] = useState(false);
  const [pickedDate, setPickedDate] = useState<string | null>(null);
  const [rejectAskId, setRejectAskId] = useState<number | null>(null);
  // 지난 레슨 판단 기준 시각 (렌더 중 Date.now() 를 부르지 않도록 화면을 열 때 한 번)
  const [now] = useState(() => Date.now());

  const confirmMut = useConfirmReservation();
  const rejectMut = useRejectReservation();

  const counts = useMemo(() => {
    const m = {} as Record<ReservationTab, number>;
    for (const t of tabs) m[t.key] = items.filter((r) => matchTab(t.key, r)).length;
    return m;
  }, [items, tabs]);

  const rangeInvalid = !!from && !!to && from > to;
  const filtering = !!from || !!to;

  const viewItems = useMemo(() => {
    const ymdOf = (r: BoardItem) =>
      pickYmdFromLocalDateTime(basis === "REQUESTED_DT" ? r.requestedDt : r.timeSlot.startDt);
    const timeOf = (r: BoardItem) => new Date(basis === "REQUESTED_DT" ? r.requestedDt : r.timeSlot.startDt).getTime();
    return items
      .filter((r) => matchTab(tab, r))
      .filter((r) => {
        if (rangeInvalid) return true;
        const ymd = ymdOf(r);
        return (!from || from <= ymd) && (!to || ymd <= to);
      })
      .sort((a, b) => (timeOf(a) - timeOf(b)) * (sort === "NEWEST" ? -1 : 1));
  }, [items, tab, basis, from, to, sort, rangeInvalid]);

  const calendarEvents = useMemo(() => reservationCalendarUtils(viewItems), [viewItems]);
  const listItems = pickedDate
    ? viewItems.filter((r) => pickYmdFromLocalDateTime(r.timeSlot.startDt) === pickedDate)
    : viewItems;

  const changeTab = (next: ReservationTab) => {
    setParams({ tab: next });
    setPickedDate(null);
    setRejectAskId(null);
  };

  const resetFilters = () => {
    setFrom("");
    setTo("");
    setBasis("LESSON_DT");
    setPickedDate(null);
  };

  const accept = (id: number) =>
    confirmMut.mutate(id, { onSuccess: () => toast.success("예약을 확정했어요. 수강생에게 알림이 가요.") });
  const reject = (id: number) =>
    rejectMut.mutate(id, {
      onSuccess: () => toast.success("요청을 거절했어요."),
      onSettled: () => setRejectAskId(null),
    });
  const cardBusy = confirmMut.isPending || rejectMut.isPending;

  // 아티스트: 새 요청은 카드에서 바로 수락/거절 (거절은 한 번 더 확인)
  const cardActions = (r: BoardItem): ReactNode => {
    if (mode !== "ARTIST" || r.status !== "REQUESTED") return null;
    if (new Date(r.timeSlot.startDt).getTime() <= now) return null;
    if (rejectAskId === r.reservationId) {
      return (
        <>
          <span css={s.askText}>거절할까요?</span>
          <button type="button" css={cs.actionBtn("ghost")} disabled={cardBusy} onClick={() => setRejectAskId(null)}>
            아니요
          </button>
          <button type="button" css={cs.actionBtn("danger")} disabled={cardBusy} onClick={() => reject(r.reservationId)}>
            거절
          </button>
        </>
      );
    }
    return (
      <>
        <button type="button" css={cs.actionBtn("ghost")} disabled={cardBusy} onClick={() => setRejectAskId(r.reservationId)}>
          거절
        </button>
        <button type="button" css={cs.actionBtn("primary")} disabled={cardBusy} onClick={() => accept(r.reservationId)}>
          수락
        </button>
      </>
    );
  };

  const tabDef = tabs.find((t) => t.key === tab)!;

  return (
    <div css={s.page}>
      <div css={s.header}>
        <h1 css={s.title}>{title}</h1>
        <p css={s.desc}>{desc}</p>
      </div>

      <MypageTabBar
        value={tab}
        items={tabs.map((t) => ({ key: t.key, label: counts[t.key] ? `${t.label} ${counts[t.key]}` : t.label }))}
        onChange={changeTab}
      />

      <div css={s.toolbar}>
        <SelectDropdown<DateBasis>
          css={s.basisSelect}
          ariaLabel="기간 기준"
          value={basis}
          onChange={setBasis}
          options={[
            { value: "LESSON_DT", label: "레슨일 기준" },
            { value: "REQUESTED_DT", label: "요청일 기준" },
          ]}
        />
        <div css={s.range}>
          <input type="date" aria-label="시작일" css={s.dateInput(rangeInvalid)} value={from} onChange={(e) => setFrom(e.target.value)} />
          <span aria-hidden="true">~</span>
          <input type="date" aria-label="종료일" css={s.dateInput(rangeInvalid)} value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <SelectDropdown<SortOrder>
          css={s.sortSelect}
          ariaLabel="정렬"
          value={sort}
          onChange={setSort}
          options={[
            { value: "NEWEST", label: "최신순" },
            { value: "OLDIST", label: "오래된순" },
          ]}
        />
        {(filtering || pickedDate) && (
          <button type="button" css={s.textBtn} onClick={resetFilters}>
            조건 초기화
          </button>
        )}
        <button
          type="button"
          css={s.calendarToggle(showCalendar)}
          aria-pressed={showCalendar}
          onClick={() => {
            setShowCalendar((v) => !v);
            setPickedDate(null);
          }}
        >
          {showCalendar ? "달력 닫기" : "달력으로 보기"}
        </button>
      </div>
      {rangeInvalid && <p css={s.warn}>시작일이 종료일보다 늦어요. 날짜를 확인해주세요.</p>}

      {showCalendar && (
        <ReservationCalendarSection
          isOpen
          onToggle={() => setShowCalendar(false)}
          events={calendarEvents}
          selectedDate={pickedDate}
          onSelectDate={setPickedDate}
          onClickEvent={(id) => onSelect(id)}
        />
      )}

      {pickedDate && (
        <div css={s.pickedChip}>
          {formatMonthDay(`${pickedDate}T00:00:00`)} 예약만 보는 중
          <button type="button" aria-label="날짜 선택 해제" onClick={() => setPickedDate(null)}>
            ×
          </button>
        </div>
      )}

      {isLoading ? (
        <div css={s.list} aria-busy="true">
          <div css={s.skeleton} />
          <div css={s.skeleton} />
          <div css={s.skeleton} />
        </div>
      ) : isError ? (
        <div css={s.empty} role="alert">
          <strong>예약 목록을 불러오지 못했어요</strong>
          <button type="button" css={cs.actionBtn("ghost")} onClick={onRetry}>
            다시 불러오기
          </button>
        </div>
      ) : listItems.length === 0 ? (
        <div css={s.empty}>
          <strong>{filtering || pickedDate ? "조건에 맞는 예약이 없어요." : tabDef.empty}</strong>
          {filtering || pickedDate ? (
            <button type="button" css={cs.actionBtn("ghost")} onClick={resetFilters}>
              조건 초기화
            </button>
          ) : (
            tab === "all" && emptyAction
          )}
        </div>
      ) : (
        <>
          <p css={s.count}>{listItems.length}건</p>
          <div css={s.list}>
            {listItems.map((r) => (
              <ReservationCard
                key={r.reservationId}
                item={r}
                counterpartLabel={mode === "ARTIST" ? "수강생" : "아티스트"}
                counterpartName={mode === "ARTIST" ? r.requesterUsername : r.artistDisplayName}
                onClick={() => onSelect(r.reservationId)}
                actions={cardActions(r)}
                now={now}
              />
            ))}
          </div>
        </>
      )}

      <ReservationDetailModal
        open={selectedId != null}
        onClose={() => onSelect(null)}
        reservation={detail}
        viewerMode={mode}
        now={now}
      />
    </div>
  );
}

export default ReservationBoard;

// 빈 목록에서 쓰는 링크 버튼
export function EmptyLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} css={cs.actionBtn("primary")} style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>
      {children}
    </Link>
  );
}
