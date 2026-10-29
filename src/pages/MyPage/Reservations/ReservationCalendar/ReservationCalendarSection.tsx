/** @jsxImportSource @emotion/react */
import { useRef, useState } from "react";
import * as s from "./styles";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, {
  type DateClickArg,
} from "@fullcalendar/interaction";
import koLocale from "@fullcalendar/core/locales/ko";
import type { DatesSetArg, DayCellContentArg, EventClickArg, EventInput } from "@fullcalendar/core";

type Props = {
  events: EventInput[];
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
  onClickEvent: (reservationId: number) => void;
};

const ymd = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

const Chevron = ({ dir }: { dir: "left" | "right" }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={dir === "left" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"} />
  </svg>
);

// 내 예약 달력 - 메인 "내 레슨 일정" 달력과 같은 톤 (반투명 판, 둥근 타일, 이전 흰 원 / 다음 차콜 원, 선택한 날 차콜)
function ReservationCalendarSection({ events, selectedDate, onSelectDate, onClickEvent }: Props) {
  const calRef = useRef<FullCalendar>(null);
  const [title, setTitle] = useState("");

  const handleDateClick = (arg: DateClickArg) => {
    const clickedDate = arg.dateStr;
    onSelectDate(selectedDate === clickedDate ? null : clickedDate);
  };

  const handleEventClick = (arg: EventClickArg) => {
    const reservationId = Number(arg.event.extendedProps.reservationId);
    if (Number.isNaN(reservationId)) return;
    onClickEvent(reservationId);
  };

  const api = () => calRef.current?.getApi();

  return (
    <section css={s.panel}>
      <div css={s.navRow}>
        <button type="button" css={s.navBtn(false)} aria-label="이전 달" onClick={() => api()?.prev()}>
          <Chevron dir="left" />
        </button>
        <div css={s.navTitle}>
          <span>{title}</span>
          <button type="button" css={s.todayBtn} onClick={() => api()?.today()}>
            오늘
          </button>
        </div>
        <button type="button" css={s.navBtn(true)} aria-label="다음 달" onClick={() => api()?.next()}>
          <Chevron dir="right" />
        </button>
      </div>

      <div css={s.calendarBox}>
        <FullCalendar
          ref={calRef}
          plugins={[dayGridPlugin, interactionPlugin]}
          locales={[koLocale]}
          locale="ko"
          initialView="dayGridMonth"
          headerToolbar={false}
          height="auto"
          events={events}
          eventDisplay="block"
          dateClick={handleDateClick}
          eventClick={handleEventClick}
          datesSet={(arg: DatesSetArg) => {
            const mid = new Date((arg.start.getTime() + arg.end.getTime()) / 2);
            setTitle(`${mid.getFullYear()}년 ${mid.getMonth() + 1}월`);
          }}
          // "1일" 대신 숫자만
          dayCellContent={(arg: DayCellContentArg) => String(arg.date.getDate())}
          dayCellClassNames={(arg) => (selectedDate && ymd(arg.date) === selectedDate ? ["is-picked"] : [])}
          dayMaxEvents={2}
          moreLinkContent={(arg) => `+${arg.num}`}
          fixedWeekCount={false}
          displayEventTime={true}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
        />
      </div>
    </section>
  );
}

export default ReservationCalendarSection;
