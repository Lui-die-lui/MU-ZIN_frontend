// 드롭다운 재사용
// 전체 ui를 재사용 하는것보다 그냥 드롭다운 상태를 재사용하는 방식으로
import { useCallback, useRef, useState } from "react";

export function useMenuAnchor<T extends HTMLElement = HTMLElement>() {
  // 버튼에 ref 로 붙여둠 -> 버튼이 다시 그려져도(스타일 변경·개발 서버 갱신 등) 항상 지금 화면의 버튼을 가리킴
  const anchorRef = useRef<T | null>(null);
  const [open, setOpen] = useState(false);

  const onOpen = (e: React.MouseEvent<T>) => {
    anchorRef.current = e.currentTarget;
    setOpen(true);
  };
  const onClose = () => setOpen(false);

  // MUI Menu 에 요소 대신 함수로 넘기면 위치를 계산할 때마다 지금 버튼을 읽음
  // (요소를 저장해두면 그 버튼이 화면에서 빠졌을 때 메뉴가 화면 왼쪽 위로 튐)
  const getAnchor = useCallback(() => anchorRef.current as T, []);

  return { anchorEl: open ? getAnchor : null, anchorRef, open, onOpen, onClose };
}
