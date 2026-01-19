import { useState } from "react";
import { addStartDtPure, removeStartDtPure } from "../../utils/timeSlotUtils";

export function useStartDts() {
  const [startDts, setStartDts] = useState<string[]>([]); // 여러개 일 가능성 = 배열로 넣어주기

  const add = (dtLocal: string) =>
    setStartDts((prev) => addStartDtPure(prev, dtLocal)); // prev = 이때까지 쌓인 배열 + dtLocal = 지금 입력된 배열

  const remove = (dt: string) =>
    setStartDts((prev) => removeStartDtPure(prev, dt));

  const clear = () => setStartDts([]); // 전체 지우기

  return { startDts, add, remove, clear };
}
