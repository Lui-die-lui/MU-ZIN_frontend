// 채팅 날짜 표시
const p2 = (n: number) => String(n).padStart(2, "0");

// 같은 날 묶기용 "2026-10-18"
export const formatDateKey = (v: string) => {
  const d = new Date(v);
  return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
};

// 목록: 오늘이면 "14:05", 어제면 "어제", 아니면 "10/16"
export const formatChatListTime = (v: string | null) => {
  if (!v) return "";
  const d = new Date(v);
  const now = new Date();
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  if (formatDateKey(v) === formatDateKey(now.toISOString())) return `${p2(d.getHours())}:${p2(d.getMinutes())}`;
  if (formatDateKey(v) === formatDateKey(yesterday.toISOString())) return "어제";
  return `${d.getMonth() + 1}/${d.getDate()}`;
};

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

// 대화 안 날짜 구분: "오늘" / "어제" / "10월 16일 (금)" (올해가 아니면 연도 붙임)
export const formatDaySep = (v: string) => {
  const d = new Date(v);
  const now = new Date();
  const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const key = formatDateKey(v);
  if (key === formatDateKey(now.toISOString())) return "오늘";
  if (key === formatDateKey(yesterday.toISOString())) return "어제";
  const md = `${d.getMonth() + 1}월 ${d.getDate()}일 (${WEEKDAYS[d.getDay()]})`;
  return d.getFullYear() === now.getFullYear() ? md : `${d.getFullYear()}년 ${md}`;
};
