/** @jsxImportSource @emotion/react */
import { useEffect } from "react";
import * as s from "./styles";
import { createPortal } from "react-dom";

type SideDrawerProps = {
  open: boolean;
  onClose: () => void;
  width?: number;
  anchor?: "right" | "left";
  title?: string;
  children: React.ReactNode; // 리액트가 화면에 구성할 수 있는 모든 요소

  variant?: "modal" | "persistent";
};

function SideDrawer({
  open,
  onClose,
  width = 420,
  anchor = "right",
  title,
  children,
}: SideDrawerProps) {
  // ESC로 닫기 , 배경 스크롤 유지
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);

    // cleanUp
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;
  return createPortal(
    <div css={s.root}>
      <aside css={s.panel(open, width, anchor)}>
        <div css={s.header}>
          <div css={s.headerTitle}>{title ?? ""}</div>
          <button css={s.closeBtn} onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>

        <div css={s.content}>{children}</div>
      </aside>
    </div>,
    document.body
  );
}

export default SideDrawer;
