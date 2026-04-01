/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

export const wrapper = css`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
`;

export const header = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const toggleButton = css`
  align-self: flex-start;
  height: 40px;
  padding: 0 14px;
  border: 1px solid #d9d9de;
  border-radius: 10px;
  background: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #f7f7f8;
  }
`;

export const selectedDateRow = css`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const selectedDateText = css`
  font-size: 14px;
  color: #444;
  font-weight: 500;
`;

export const clearButton = css`
  height: 32px;
  padding: 0 10px;
  border: 1px solid #d9d9de;
  border-radius: 999px;
  background: #fff;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    background: #f7f7f8;
  }
`;

export const calendarBox = css`
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  background: #fff;
  padding: 12px;

  .fc {
    font-size: 14px;
  }

  .fc .fc-toolbar {
    margin-bottom: 12px;
    gap: 8px;
    flex-wrap: wrap;
  }

  .fc .fc-toolbar-title {
    font-size: 18px;
    font-weight: 700;
  }

  .fc .fc-button {
    height: 36px;
    padding: 0 12px;
    border: 1px solid #d9d9de;
    border-radius: 10px;
    background: #fff;
    color: #222;
    box-shadow: none;
  }

  .fc .fc-button:hover {
    background: #f7f7f8;
  }

  .fc .fc-button-primary:not(:disabled).fc-button-active,
  .fc .fc-button-primary:not(:disabled):active {
    background: #111;
    border-color: #111;
    color: #fff;
  }

  .fc .fc-col-header-cell-cushion {
    padding: 8px 0;
    color: #555;
    font-weight: 600;
    text-decoration: none;
  }

  .fc .fc-daygrid-day-number {
    padding: 8px;
    color: #222;
    text-decoration: none;
    font-weight: 600;
  }

  .fc .fc-daygrid-day.fc-day-today {
    background: rgba(0, 0, 0, 0.03);
  }

  .fc .fc-daygrid-event {
    border-radius: 8px;
    padding: 2px 6px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
  }

  .fc .fc-event-title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
