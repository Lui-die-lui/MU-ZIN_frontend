/** @jsxImportSource @emotion/react */
import { useEffect, useRef, type ReactNode } from "react";
import * as s from "./styles";
import { createPortal } from "react-dom";

type SideDrawerProps = {
  open: boolean;
  onClose: () => void;
  width?: number;
  anchor?: "right" | "left";
  title?: string;
  children: ReactNode; // 리액트가 화면에 구성할 수 있는 모든 요소
  footer?: ReactNode; // 아래에 고정되는 영역 (주요 버튼) - 내용이 길어도 항상 보임

  variant?: "modal" | "persistent";
};

function SideDrawer({
  open,
  onClose,
  width = 420,
  anchor = "right",
  title,
  children,
  footer,
}: SideDrawerProps) {
  const panelRef = useRef<HTMLElement>(null);

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

  // 열리면 창 안으로 초점 이동, 닫히면 열기 전에 누르던 곳으로 되돌림 (키보드·스크린리더 사용자가 흐름을 잃지 않게)
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();
    return () => prev?.focus?.();
  }, [open]);

  if (!open) return null;
  return createPortal(
    <div
      css={s.root}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <aside
        ref={panelRef}
        tabIndex={-1}
        css={s.panel(open, width, anchor)}
        role="dialog"
        aria-modal="true"
        aria-label={title ?? "상세 정보"}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div css={s.header}>
          <div css={s.headerTitle}>{title ?? ""}</div>
          <button type="button" css={s.closeBtn} onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>

        <div css={s.content}>{children}</div>
        {footer && <div css={s.footer}>{footer}</div>}
      </aside>
    </div>,
    document.body,
  );
}

export default SideDrawer;
