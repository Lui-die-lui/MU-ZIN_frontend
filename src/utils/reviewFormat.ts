// 리뷰 날짜 "2026.10.15"
const p2 = (n: number) => String(n).padStart(2, "0");

export const formatReviewDate = (v: string) => {
  const d = new Date(v);
  return `${d.getFullYear()}.${p2(d.getMonth() + 1)}.${p2(d.getDate())}`;
};
