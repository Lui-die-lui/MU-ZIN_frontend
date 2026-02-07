// 드롭다운 재사용
// 전체 ui를 재사용 하는것보다 그냥 드롭다운 상태를 재사용하는 방식으로
import { useState } from "react";

export function useMenuAnchor<T extends HTMLElement = HTMLElement>() {
  const [anchorEl, setAnchorEl] = useState<T | null>(null);
  const open = Boolean(anchorEl);

  const onOpen = (e: React.MouseEvent<T>) => setAnchorEl(e.currentTarget);
  const onClose = () => setAnchorEl(null);

  return { anchorEl, open, onOpen, onClose };
}
