/** @jsxImportSource @emotion/react */
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import * as s from "./scheduleStyles";
import Chevron from "../../components/common/Chevron";
import { useMyReservationList } from "../../hooks/reservation/useMyReservation";
import { useArtistReservationList } from "../../hooks/reservation/useArtistReservations";
import { useIsMobile } from "../../hooks/useIsMobile";
import { usePrincipalState } from "../../stores/usePrincipalState";
import type { ReservationStatus } from "../../Types/reservationType";
import type { TimeSlotResp } from "../../Types/lessonTypes";
import { formatMonthDay, formatTime } from "../../utils/reservationFormat";

// 메인 > 로그인 회원의 내 레슨 일정
// - 일반 회원: 내가 받는 레슨(수강생으로 예약한 것)
// - 승인된 아티스트: 내가 하는 레슨이 기본, 위 전환 버튼으로 내가 받는 레슨도 그 자리에서 봄
// 데스크톱: 월 달력 + 다음 레슨 카드 + 이후 일정 / 모바일: 한 주 날짜 띠 + 간추린 카드
// 날짜를 누르면 그날 레슨만, 다시 누르면 다가오는 레슨으로. 카드는 마이페이지 예약 상세로 이동

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

type Mode = "teach" | "learn";

// 두 목록(내 예약 / 받은 예약)을 같은 모양으로
type Item = {
  reservationId: number;
  status: ReservationStatus;
  lessonTitle: string;
  timeSlot: TimeSlotResp;
  person: string; // 받는 레슨 = 아티스트, 하는 레슨 = 수강생
};

const MODES: Record<
  Mode,
  {
    label: string;
    morePath: string;
    next: string;
    empty: string;
    emptyAction: { to: string; label: string };
    status: Partial<Record<ReservationStatus, string>>;
  }
> = {
  learn: {
    label: "내가 받는 레슨",
    morePath: "/mypage/reservations",
    next: "다음 레슨",
    empty: "다가오는 레슨이 없어요.",
    emptyAction: { to: "/lessons", label: "레슨 찾기" },
    status: { REQUESTED: "확인 대기", CONFIRMED: "확정", COMPLETION_PENDING: "완료 확인 중", COMPLETED: "완료" },
  },
  teach: {
    label: "내가 하는 레슨",
    // 요청 관리는 기본 탭이 '새 요청'이라 일정 전체가 보이도록 전체 탭으로
    morePath: "/mypage/reservations/requests?tab=all",
    next: "다음 수업",
    empty: "다가오는 수업이 없어요.",
    emptyAction: { to: "/mypage/artist/manage", label: "내 레슨 관리" },
    status: { REQUESTED: "새 요청", CONFIRMED: "확정", COMPLETION_PENDING: "완료 확인 중", COMPLETED: "완료" },
  },
};

// 달력·목록에 올리는 상태 (취소·거절·만료는 일정이 아니라서 뺌)
const SCHEDULED: ReservationStatus[] = ["REQUESTED", "CONFIRMED", "COMPLETION_PENDING", "COMPLETED"];
// 다가오는 레슨: 아직 끝나지 않은 요청·확정
const UPCOMING: ReservationStatus[] = ["REQUESTED", "CONFIRMED"];

const p2 = (n: number) => String(n).padStart(2, "0");
const ymdOf = (d: Date) => `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
const ymdOfDt = (dt: string) => dt.slice(0, 10);
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

// "오늘" / "내일" / "D-3"
const dDay = (start: string, today: Date) => {
  const diff = Math.round((startOfDay(new Date(start)).getTime() - today.getTime()) / 86_400_000);
  return diff <= 0 ? "오늘" : diff === 1 ? "내일" : `D-${diff}`;
};

const timeRange = (r: Item) => `${formatTime(r.timeSlot.startDt)} – ${formatTime(r.timeSlot.endDt)}`;

const toSchedule = (items: Item[]) =>
  items
    .filter((r) => SCHEDULED.includes(r.status))
    .sort((a, b) => a.timeSlot.startDt.localeCompare(b.timeSlot.startDt));

const upcomingOf = (items: Item[], now: Date) =>
  items.filter((r) => UPCOMING.includes(r.status) && new Date(r.timeSlot.endDt) > now);

function MySchedule() {
  const isArtist = usePrincipalState((st) => st.principal?.artistStatus === "APPROVED");
  const learnList = useMyReservationList("all");
  const teachList = useArtistReservationList({ tab: "all" }, { enabled: isArtist });
  const compact = useIsMobile();
  // 오늘·지금 기준 (렌더 중 Date.now() 를 부르지 않도록 화면을 열 때 한 번)
  const [now] = useState(() => new Date());
  const today = startOfDay(now);

  // 아티스트는 내가 하는 레슨이 기본 (아티스트가 아니면 전환 버튼 없이 받는 레슨만)
  const [chosen, setChosen] = useState<Mode>("teach");
  const mode: Mode = isArtist ? chosen : "learn";
  const conf = MODES[mode];
  const list = mode === "teach" ? teachList : learnList;

  const [picked, setPicked] = useState<string | null>(null);
  const [month, setMonth] = useState(() => new Date(now.getFullYear(), now.getMonth(), 1));
  const [weekStart, setWeekStart] = useState(() => addDays(today, -today.getDay()));

  const learnItems = useMemo(
    () =>
      toSchedule(
        (learnList.data ?? []).map((r) => ({
          reservationId: r.reservationId,
          status: r.status,
          lessonTitle: r.lessonTitle,
          timeSlot: r.timeSlot,
          person: r.artistDisplayName,
        })),
      ),
    [learnList.data],
  );
  const teachItems = useMemo(
    () =>
      toSchedule(
        (teachList.data ?? []).map((r) => ({
          reservationId: r.reservationId,
          status: r.status,
          lessonTitle: r.lessonTitle,
          timeSlot: r.timeSlot,
          person: r.requesterUsername,
        })),
      ),
    [teachList.data],
  );
  const scheduled = mode === "teach" ? teachItems : learnItems;

  const upcoming = useMemo(() => upcomingOf(scheduled, now), [scheduled, now]);
  // 전환 버튼 옆 개수 (다가오는 것만)
  const counts = useMemo(
    () => ({ teach: upcomingOf(teachItems, now).length, learn: upcomingOf(learnItems, now).length }),
    [teachItems, learnItems, now],
  );
  // 날짜별 레슨 (점 표시: 확정이 하나라도 있으면 채운 점, 요청만 있으면 빈 점)
  const byDay = useMemo(() => {
    const m = new Map<string, Item[]>();
    for (const r of scheduled) {
      const k = ymdOfDt(r.timeSlot.startDt);
      m.set(k, [...(m.get(k) ?? []), r]);
    }
    return m;
  }, [scheduled]);

  const detailPath = (r: Item) =>
    `${conf.morePath}${conf.morePath.includes("?") ? "&" : "?"}r=${r.reservationId}`;

  const switchMode = (next: Mode) => {
    setChosen(next);
    setPicked(null);
  };

  const pick = (ymd: string) => setPicked((cur) => (cur === ymd ? null : ymd));
  const todayYmd = ymdOf(today);

  const dayButton = (d: Date, variant: "tile" | "pill") => {
    const ymd = ymdOf(d);
    const items = byDay.get(ymd) ?? [];
    const mark = items.length === 0 ? "none" : items.some((r) => r.status !== "REQUESTED") ? "solid" : "hollow";
    const label = `${d.getMonth() + 1}월 ${d.getDate()}일 ${WEEKDAYS[d.getDay()]}요일${items.length ? `, 레슨 ${items.length}개` : ""}`;
    const state = {
      selected: picked === ymd,
      today: ymd === todayYmd,
      past: ymd < todayYmd,
      mark,
    } as const;
    return (
      <button
        key={ymd}
        type="button"
        css={variant === "tile" ? s.dayTile(state) : s.dayPill(state)}
        aria-pressed={picked === ymd}
        aria-label={label}
        onClick={() => pick(ymd)}
      >
        {variant === "pill" && <small>{WEEKDAYS[d.getDay()]}</small>}
        <span>{d.getDate()}</span>
        <i aria-hidden="true" />
      </button>
    );
  };

  // ---------- 달력 (데스크톱·태블릿) ----------
  const monthCells = () => {
    const first = month.getDay();
    const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const cells: (Date | null)[] = [
      ...Array.from({ length: first }, () => null),
      ...Array.from({ length: days }, (_, i) => new Date(month.getFullYear(), month.getMonth(), i + 1)),
    ];
    while (cells.length % 7) cells.push(null);
    return cells;
  };
  const shiftMonth = (n: number) => setMonth((m) => new Date(m.getFullYear(), m.getMonth() + n, 1));

  const calendar = (
    <div css={s.calendar}>
      <div css={s.navRow}>
        <button type="button" css={s.navBtn(false)} onClick={() => shiftMonth(-1)} aria-label="이전 달">
          <Chevron dir="left" />
        </button>
        <strong css={s.navTitle} aria-live="polite">
          {month.getFullYear() !== today.getFullYear() && <small>{month.getFullYear()}년 </small>}
          {month.getMonth() + 1}월
        </strong>
        <button type="button" css={s.navBtn(true)} onClick={() => shiftMonth(1)} aria-label="다음 달">
          <Chevron />
        </button>
      </div>
      <div css={s.weekHead} aria-hidden="true">
        {WEEKDAYS.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>
      <div css={s.monthGrid}>
        {monthCells().map((d, i) => (d ? dayButton(d, "tile") : <span key={`e${i}`} css={s.emptyCell} />))}
      </div>
    </div>
  );

  // ---------- 한 주 띠 (모바일) ----------
  const week = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const weekLabel = (() => {
    const a = week[0];
    const b = week[6];
    return a.getMonth() === b.getMonth() ? `${a.getMonth() + 1}월` : `${a.getMonth() + 1}월 – ${b.getMonth() + 1}월`;
  })();
  const weekStrip = (
    <div css={s.weekStrip}>
      <div css={s.navRow}>
        <button type="button" css={s.navBtn(false)} onClick={() => setWeekStart((w) => addDays(w, -7))} aria-label="이전 주">
          <Chevron dir="left" />
        </button>
        <strong css={s.navTitle} aria-live="polite">
          {weekLabel}
        </strong>
        <button type="button" css={s.navBtn(true)} onClick={() => setWeekStart((w) => addDays(w, 7))} aria-label="다음 주">
          <Chevron />
        </button>
      </div>
      <div css={s.pills}>{week.map((d) => dayButton(d, "pill"))}</div>
    </div>
  );

  // ---------- 목록 ----------
  const badge = (r: Item) => (
    <span css={s.badge(r.status === "CONFIRMED" ? "solid" : r.status === "REQUESTED" ? "wait" : "muted")}>
      {conf.status[r.status]}
    </span>
  );

  const nextCard = (r: Item) => (
    <Link to={detailPath(r)} css={s.nextCard}>
      <span css={s.nextTop}>
        <span css={s.avatar} aria-hidden="true">
          {r.person?.trim().charAt(0).toUpperCase() || "M"}
        </span>
        <span css={s.nextText}>
          <strong>{r.person}</strong>
          <span>{r.lessonTitle}</span>
        </span>
        {badge(r)}
      </span>
      <span css={s.nextBar}>
        <span>{timeRange(r)}</span>
        <span>{formatMonthDay(r.timeSlot.startDt)}</span>
      </span>
    </Link>
  );

  const row = (r: Item) => {
    const d = new Date(r.timeSlot.startDt);
    return (
      <li key={r.reservationId}>
        <Link to={detailPath(r)} css={s.row}>
          <span css={s.rowDate} aria-hidden="true">
            <strong>{d.getDate()}</strong>
            <small>{WEEKDAYS[d.getDay()]}</small>
          </span>
          <span css={s.rowText}>
            <strong>{r.lessonTitle}</strong>
            <span>
              {r.person} · {timeRange(r)}
            </span>
          </span>
          {badge(r)}
        </Link>
      </li>
    );
  };

  const limit = compact ? 2 : 3;

  const body = () => {
    if (list.isLoading) {
      return (
        <div css={s.skeletonWrap} aria-busy="true" aria-label="일정을 불러오는 중">
          <span css={s.skeleton(112)} />
          <span css={s.skeleton(64)} />
        </div>
      );
    }
    if (list.isError) {
      return (
        <div css={s.empty}>
          <p>일정을 불러오지 못했어요.</p>
          <button type="button" css={s.emptyAction} onClick={() => list.refetch()}>
            다시 시도
          </button>
        </div>
      );
    }

    // 날짜를 고른 경우: 그날 레슨
    if (picked) {
      const items = byDay.get(picked) ?? [];
      return (
        <>
          <div css={s.listHead}>
            <span>{formatMonthDay(`${picked}T00:00:00`)}</span>
            <button type="button" css={s.clearBtn} onClick={() => setPicked(null)}>
              다가오는 레슨 보기
            </button>
          </div>
          {items.length === 0 ? (
            <div css={s.empty}>
              <p>이날은 예정된 레슨이 없어요.</p>
            </div>
          ) : (
            <ul css={s.rows}>
              {items.slice(0, limit).map(row)}
              {items.length > limit && (
                <li css={s.moreNote}>
                  <Link to={conf.morePath}>외 {items.length - limit}개 더 보기</Link>
                </li>
              )}
            </ul>
          )}
        </>
      );
    }

    if (upcoming.length === 0) {
      return (
        <div css={s.empty}>
          <p>{conf.empty}</p>
          <Link to={conf.emptyAction.to} css={s.emptyAction}>
            {conf.emptyAction.label}
          </Link>
        </div>
      );
    }

    const [next, ...rest] = upcoming;
    return (
      <>
        <div css={s.listHead}>
          <span>{conf.next}</span>
          <span css={s.dday}>{dDay(next.timeSlot.startDt, today)}</span>
        </div>
        {nextCard(next)}
        {rest.length > 0 && <ul css={s.rows}>{rest.slice(0, limit - 1).map(row)}</ul>}
      </>
    );
  };

  return (
    <section css={s.panel} aria-labelledby="my-schedule-title">
      <div css={s.head}>
        <div css={s.headText}>
          <span css={s.eyebrow}>MY SCHEDULE</span>
          <h2 id="my-schedule-title" css={s.title}>
            내 레슨 일정
          </h2>
        </div>
        <Link to={conf.morePath} css={s.more} aria-label="내 레슨 일정 더보기">
          MORE
          <span css={s.moreIcon} aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M6 1.5v9M1.5 6h9" />
            </svg>
          </span>
        </Link>
      </div>

      {/* 아티스트: 하는 레슨 / 받는 레슨 전환 (검정 손잡이가 미끄러짐) */}
      {isArtist && (
        <div css={s.segment(mode === "teach" ? 0 : 1)} role="group" aria-label="볼 일정">
          {(["teach", "learn"] as const).map((m) => (
            <button key={m} type="button" css={s.segBtn(mode === m)} aria-pressed={mode === m} onClick={() => switchMode(m)}>
              {MODES[m].label}
              {counts[m] > 0 && <span css={s.segCount(mode === m)}>{counts[m]}</span>}
            </button>
          ))}
        </div>
      )}

      <div css={s.bodyGrid}>
        {compact ? weekStrip : calendar}
        <div css={s.list}>{body()}</div>
      </div>
    </section>
  );
}

export default MySchedule;
