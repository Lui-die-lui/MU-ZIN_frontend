import { useState } from "react";
import {
  addStartDtPure,
  removeStartDtPure,
  uniqSortIsoLocal,
} from "../../utils/timeSlotUtils";

// 나중에 수정 페이지/서버에 기존값 주입 대비 initial 받을 수 있게 하기
export function useStartDts(initial: string[] = []) {
  const [startDts, setStartDts] = useState<string[]>(() => initial); // 여러개 일 가능성 = 배열로 넣어주기

  const add = (dtLocal: string) =>
    setStartDts((prev) => addStartDtPure(prev, dtLocal)); // prev = 이때까지 쌓인 배열 + dtLocal = 지금 입력된 배열

  const addMany = (dts: string[]) => {
    if (!dts.length) return; // 빈  배열이면 리렌더 한번 줄이기
    setStartDts((prev) => uniqSortIsoLocal([...prev, ...dts]));
  };

  const remove = (dt: string) =>
    setStartDts((prev) => removeStartDtPure(prev, dt));

  const clear = () => setStartDts([]); // 전체 지우기

  return { startDts, add, addMany, remove, clear };
}
