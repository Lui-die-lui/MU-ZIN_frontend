// 채팅 날짜 표시
const p2 = (n: number) => String(n).padStart(2, "0");

// 같은 날 묶기용 "2026-10-18"
export const formatDateKey = (v: string) => {
  const d = new Date(v);
  return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
};

// 목록: 오늘이면 "14:05", 아니면 "10/16"
export const formatChatListTime = (v: string | null) => {
  if (!v) return "";
  const d = new Date(v);
  const now = new Date();
  if (formatDateKey(v) === formatDateKey(now.toISOString())) return `${p2(d.getHours())}:${p2(d.getMinutes())}`;
  return `${d.getMonth() + 1}/${d.getDate()}`;
};
