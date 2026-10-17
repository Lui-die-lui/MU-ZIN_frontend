import { useCallback, useSyncExternalStore } from "react";
import { BREAKPOINTS } from "../constants/breakpoints";

// 768px 이하인지 체크
// 브라우저 상태(matchMedia)를 구독하는 용도라 useEffect + setState 대신 useSyncExternalStore 사용
export const useIsMobile = (maxWidth = BREAKPOINTS.mobile) => {
  const query = `(max-width: ${maxWidth}px)`;

  // 창 크기가 바뀌어서 조건이 바뀌면 change 이벤트 발생 -> 다시 읽음
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches, // 브라우저
    () => false, // SSR 에서는 window가 없음
  );
};
