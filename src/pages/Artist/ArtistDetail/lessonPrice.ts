// 레슨 가격 표시 (아티스트 프로필 - 레슨 카드 · 예약 카드 공용)
export const formatPrice = (price: number | null | undefined) => {
  if (price == null) return "가격 문의";
  if (price === 0) return "무료";
  return `${price.toLocaleString("ko-KR")}원`;
};
