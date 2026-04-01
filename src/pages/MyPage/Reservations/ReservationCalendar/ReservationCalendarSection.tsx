/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, {
  type DateClickArg,
} from "@fullcalendar/interaction";
import koLocale from "@fullcalendar/core/locales/ko";
import type { EventClickArg, EventInput } from "@fullcalendar/core";

type Props = {
  isOpen: boolean;
  onToggle: () => void;
  events: EventInput[];
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
  onClickEvent: (reservationId: number) => void;
};

function ReservationCalendarSection({
  isOpen,
  onToggle,
  events,
  selectedDate,
  onSelectDate,
  onClickEvent,
}: Props) {
  const handleDateClick = (arg: DateClickArg) => {
    const clickedDate = arg.dateStr;
    onSelectDate(selectedDate === clickedDate ? null : clickedDate);
  };

  const handleEventClick = (arg: EventClickArg) => {
    const reservationId = Number(arg.event.extendedProps.reservationId);

    // TODO: 모달을 띄우던지 토스트를 띄우던지 처리하기
    if (Number.isNaN(reservationId)) return;

    onClickEvent(reservationId);
  };
  return (
    <section css={s.wrapper}>
      <div css={s.header}>
        <button type="button" css={s.toggleButton} onClick={onToggle}>
          {isOpen ? "달력 숨기기" : "달력 보기"}
        </button>

        {selectedDate && (
          <div css={s.selectedDateRow}>
            <span css={s.selectedDateText}>선택 날짜: {selectedDate}</span>
            <button
              type="button"
              css={s.clearButton}
              onClick={() => onSelectDate(null)}
            >
              선택 해제
            </button>
          </div>
        )}
      </div>

      {isOpen && (
        <div css={s.calendarBox}>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            locales={[koLocale]}
            locale="ko"
            initialView="dayGridMonth"
            height="auto"
            events={events}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "",
            }}
            buttonText={{
              today: "오늘",
            }}
            dayMaxEvents={2}
            fixedWeekCount={false}
            displayEventTime={true}
            eventTimeFormat={{
              hour: "2-digit",
              minute: "2-digit",
              hour12: false,
            }}
          />
        </div>
      )}
    </section>
  );
}

export default ReservationCalendarSection;
