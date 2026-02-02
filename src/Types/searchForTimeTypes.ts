// 6 - 11 / 12 - 17 / 18 - 23 / 00 - 05
export type TimePart = "MORNING" | "AFTERNOON" | "EVENING" | "DAWN";

export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export type OpenSlotFilter = {
  from?: string;
  to?: string;
  timeParts: TimePart[];
  daysOfWeek: Weekday[];
};

export const TIME_PART_LABEL: Record<TimePart, string> = {
  MORNING: "오전",
  AFTERNOON: "오후",
  EVENING: "저녁",
  DAWN: "새벽",
};

export const WEEKDAY_LABEL: Record<Weekday, string> = {
  1: "월",
  2: "화",
  3: "수",
  4: "목",
  5: "금",
  6: "토",
  7: "일",
};

// 필터 초기값 (useState 같은곳에 쓸거)
export const EMPTY_OPEN_SLOT_FILTER: OpenSlotFilter = {
  from: undefined,
  to: undefined,
  timeParts: [],
  daysOfWeek: [],
};

// 객체로 들어와도 지원되는 MnD -> 예약 타임슬롯시 필요함
export type MonthDayGrouped<T> = Record<string, Record<string, T[]>>;

// 타임슬롯 상태 타입
export type SlotItem = {
  timeSlotId: number;
  startDt: string;
  state?: "OPEN" | "CLOSED" | "BOOKED";
  active?: boolean;
};

