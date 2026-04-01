import type { EventInput } from "@fullcalendar/core";
import type { ArtistReservationSummaryResp, CalendarReservationItem } from "../Types/reservationType";
import { RESERVATION_STATUS_META } from "../pages/MyPage/Reservations/ReservationCard/StatusBadge/badgeUi";
import { toneVars } from "../pages/MyPage/Reservations/ReservationCard/StatusBadge/styles";
// reservation DTO -> FullCalendar event 변환

export const reservationCalendarUtils = (
  reservations: CalendarReservationItem[],
): EventInput[] => {
  return reservations
    .filter((reservation) => reservation.timeSlot?.startDt)
    .map((reservation) => {
      const meta = RESERVATION_STATUS_META[reservation.status];
      const tone = toneVars[meta.tone];

      return {
        id: String(reservation.reservationId),
        title: `${meta.label} · ${reservation.lessonTitle}`,
        start: reservation.timeSlot.startDt,
        end: reservation.timeSlot.endDt,
        allDay: false,
        backgroundColor: tone.bg,
        borderColor: tone.bd,
        textColor: tone.fg,
        extendedProps: {
          reservationId: reservation.reservationId,
          lessonId: reservation.lessonId,
          status: reservation.status,
        },
      };
    });
};
