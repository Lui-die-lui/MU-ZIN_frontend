import { css } from "@emotion/react";
import { faint, focusRing, ink, sub } from "../../../../constants/uiTone";

// 메인 "내 레슨 일정" 달력과 같은 톤 (Home/scheduleStyles 의 판·타일·화살표 값과 맞춤)

export const panel = css`
  display: grid;
  gap: 14px;
  margin-bottom: 16px;
  padding: 20px 18px 18px;
  border-radius: 24px;
  background: linear-gradient(165deg, rgba(236, 235, 231, 0.72) 0%, rgba(245, 244, 240, 0.45) 100%);
  color: ${ink};

  @media (max-width: 600px) {
    padding: 16px 12px 12px;
    border-radius: 20px;
  }
`;

export const navRow = css`
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr) 36px;
  align-items: center;
`;

export const navTitle = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.02em;
`;

// 이전 = 흰 원, 다음 = 차콜 원
export const navBtn = (dark: boolean) => css`
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: ${dark ? ink : "rgba(255, 255, 255, 0.7)"};
  color: ${dark ? "#FFFFFF" : ink};
  box-shadow: ${dark ? "0 6px 14px -8px rgba(23, 25, 28, 0.7)" : "none"};
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: ${dark ? "#000000" : "#FFFFFF"};
  }
  ${focusRing}
`;

export const todayBtn = css`
  height: 26px;
  padding: 0 10px;
  border: 0;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
  color: ${sub};
  font: inherit;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #ffffff;
    color: ${ink};
  }
  ${focusRing}
`;

// FullCalendar 기본 표 모양을 지우고 타일로
export const calendarBox = css`
  .fc {
    font-size: 13px;
  }

  /* 표 테두리 없음 */
  .fc-theme-standard .fc-scrollgrid,
  .fc-theme-standard td,
  .fc-theme-standard th {
    border: 0;
  }

  .fc .fc-scrollgrid-section > *,
  .fc .fc-col-header-cell {
    background: transparent;
  }

  .fc .fc-col-header-cell-cushion {
    padding: 0 0 8px;
    color: ${faint};
    font-size: 12px;
    font-weight: 600;
    text-decoration: none;
  }

  /* 날짜 칸 = 둥근 반투명 흰 타일 */
  .fc .fc-daygrid-day {
    background: transparent;
  }
  .fc .fc-daygrid-day-frame {
    min-height: 88px;
    margin: 3px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.62);
    cursor: pointer;
    transition: background 0.15s ease, box-shadow 0.15s ease;
  }
  .fc .fc-daygrid-day-frame:hover {
    background: #ffffff;
  }

  .fc .fc-daygrid-day-top {
    flex-direction: row;
  }
  .fc .fc-daygrid-day-number {
    padding: 8px 10px 2px;
    color: ${ink};
    font-size: 13px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    text-decoration: none;
  }

  /* 다른 달 날짜 = 흐리게 */
  .fc .fc-day-other .fc-daygrid-day-frame {
    background: transparent;
  }
  .fc .fc-day-other .fc-daygrid-day-top {
    opacity: 0.35;
  }

  /* 오늘 = 불투명 흰 + 그림자 */
  .fc .fc-daygrid-day.fc-day-today {
    background: transparent;
  }
  .fc .fc-day-today .fc-daygrid-day-frame {
    background: #ffffff;
    box-shadow: 0 6px 14px -8px rgba(23, 25, 28, 0.35);
  }
  .fc .fc-day-today .fc-daygrid-day-number {
    font-weight: 700;
  }

  /* 고른 날 = 차콜 판 */
  .fc .is-picked .fc-daygrid-day-frame {
    background: ${ink};
    box-shadow: 0 8px 16px -10px rgba(23, 25, 28, 0.8);
  }
  .fc .is-picked .fc-daygrid-day-number,
  .fc .is-picked .fc-daygrid-more-link {
    color: #ffffff;
  }

  /* 예약 = 작은 칩 */
  .fc .fc-daygrid-day-events {
    margin: 2px 6px 6px;
  }
  .fc .fc-daygrid-event {
    margin: 2px 0 0;
    padding: 2px 6px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 500;
    cursor: pointer;
  }
  .fc .fc-event-main-frame {
    min-width: 0;
  }
  .fc .fc-event-time {
    flex-shrink: 0;
    overflow: visible;
    margin-right: 4px;
    font-weight: 600;
  }
  .fc .fc-event-title-container {
    min-width: 0;
  }
  .fc .fc-event-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .fc .fc-daygrid-more-link {
    margin-top: 2px;
    color: ${sub};
    font-size: 11px;
    font-weight: 600;
  }

  /* 좁은 화면: 칩 대신 점 (메인 달력처럼) - 눌러서 그날 예약을 아래 목록으로 */
  @media (max-width: 600px) {
    .fc .fc-daygrid-day-frame {
      min-height: 58px;
      margin: 2px;
      border-radius: 10px;
    }
    .fc .fc-daygrid-day-number {
      padding: 6px 7px 0;
      font-size: 12px;
    }
    .fc .fc-daygrid-day-events {
      display: flex;
      flex-wrap: wrap;
      gap: 3px;
      margin: 4px 7px 6px;
    }
    .fc .fc-daygrid-event-harness {
      margin: 0 !important;
    }
    .fc .fc-daygrid-event {
      width: 6px;
      height: 6px;
      margin: 0;
      padding: 0;
      border: 0;
      border-radius: 50%;
      background: ${ink} !important; /* 상태 색(옅은 회색)은 점으로 보기 어려워 차콜로 */
      overflow: hidden;
    }
    .fc .is-picked .fc-daygrid-event {
      background: #ffffff !important;
    }
    .fc .fc-daygrid-event .fc-event-main {
      display: none;
    }
    .fc .fc-daygrid-more-link {
      font-size: 10px;
    }
  }
`;
