export function getInitials(name: string) {
  const t = (name ?? "").trim();
  if (!t) return "유저";
  if (/[가-힣]/.test(t)) return t.length >= 2 ? t.slice(-2) : t; // 이름이 두 글자 이상이면 뒤에서 두번째까지 보여주는건데... 지금 이메일을 유저명으로 받아서 필요없을듯
  return t.slice(0, 2).toUpperCase();
}

// 가격 포맷 유틸 
export const formatKRW = (v?: number | null) =>
  typeof v === "number" && Number.isFinite(v)
    ? v.toLocaleString("ko-KR") + "원"
    : "-";
