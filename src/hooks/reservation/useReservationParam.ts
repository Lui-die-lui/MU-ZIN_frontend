import { useState } from "react";
import { useSearchParams } from "react-router-dom";

// 주소의 ?r=예약id 로 들어오면 (메인 > 내 레슨 일정 카드) 그 예약 상세를 바로 엶
// 닫을 때 주소의 r 도 지워서 새로고침·뒤로 가기에 다시 열리지 않게
export function useReservationParam() {
  const [params, setParams] = useSearchParams();
  const [selectedId, setSelectedId] = useState<number | null>(() => Number(params.get("r")) || null);

  const select = (id: number | null) => {
    setSelectedId(id);
    if (id == null && params.has("r")) {
      const next = new URLSearchParams(params);
      next.delete("r");
      setParams(next, { replace: true });
    }
  };

  return [selectedId, select] as const;
}
