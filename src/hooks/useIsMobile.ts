import { useEffect, useState } from "react";
import { BREAKPOINTS } from "../constants/breakpoints";

// 768px 이하인지 체크
export const useIsMobile = (maxWidth = BREAKPOINTS.mobile) => {
  const getMaches = () =>
    typeof window !== "undefined" // SSR 에서는 window가 없기때문에 터짐
      ? window.matchMedia(`(max-width: ${maxWidth}px)`).matches
      : // @media 랑 같은 역할 - 조건 만족을 판별해주는 브라우저 기능
        false;

  const [isMobile, setIsMobile] = useState(getMaches);

  useEffect(() => {
    // 화면 크기가 바뀔때 자동 업데이트
    const mq = window.matchMedia(`(max-width: ${maxWidth}px)`);

    // 창 크기가 바뀌어서 조건이 바뀌면 event 발생
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);

    // 초기값 동기화(첫 렌더 이후 값이 바뀔 가능성 있어서)
    setIsMobile(mq.matches);

    // change 이벤트 리스너를 등록해서 리사이즈 시 자동감지
    mq.addEventListener("change", handler);
    // 컴포넌트 사라질 때 (cleanup)
    return () => mq.removeEventListener("change", handler);
  }, [maxWidth]); // maxWidth가 바뀌면 새 기준으로 다시 감시하도록 재실행(의존성 배열)

  return isMobile;
};
