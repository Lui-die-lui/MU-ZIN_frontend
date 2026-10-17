// 예약 화면 날짜·가격 표시 (내 예약 / 요청 관리 공용)
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const p2 = (n: number) => String(n).padStart(2, "0");

const toDate = (v?: string | null) => (v ? new Date(v) : null);

// "10월 20일 (화)"
export const formatMonthDay = (v?: string | null) => {
  const d = toDate(v);
  return d ? `${d.getMonth() + 1}월 ${d.getDate()}일 (${WEEKDAYS[d.getDay()]})` : "-";
};

// "10:00"
export const formatTime = (v?: string | null) => {
  const d = toDate(v);
  return d ? `${p2(d.getHours())}:${p2(d.getMinutes())}` : "-";
};

// "10월 20일 (화) 10:00 – 11:00"
export const formatSlotRange = (start?: string | null, end?: string | null) =>
  start ? `${formatMonthDay(start)} ${formatTime(start)}${end ? ` – ${formatTime(end)}` : ""}` : "-";

// "2026.10.17 14:05"
export const formatDateTime = (v?: string | null) => {
  const d = toDate(v);
  return d ? `${d.getFullYear()}.${p2(d.getMonth() + 1)}.${p2(d.getDate())} ${p2(d.getHours())}:${p2(d.getMinutes())}` : "-";
};

export const formatPrice = (price?: number | null) =>
  price == null ? "-" : price === 0 ? "무료" : `${price.toLocaleString("ko-KR")}원`;

// 레슨 시작 N시간 전 시각 (취소 마감)
export const deadlineBefore = (start: string, hours: number) =>
  new Date(new Date(start).getTime() - hours * 3600_000).toISOString();
