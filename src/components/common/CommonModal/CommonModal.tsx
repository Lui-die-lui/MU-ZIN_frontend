/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import { useEffect, useId, useRef, type ReactNode } from "react";

type CommonModalProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
};

// 공용 모달 - Esc 로 닫기, 열리면 창 안으로 초점, 닫히면 누르던 곳으로 초점 복귀, 뒤 화면 스크롤 잠금
function CommonModal({ open, title, onClose, children, footer, width = 420 }: CommonModalProps) {
  const titleId = useId();
  const modalRef = useRef<HTMLDivElement>(null);
  // 최신 onClose 를 기억 (Esc 처리 effect 를 매 렌더마다 다시 걸지 않게)
  const closeRef = useRef(onClose);
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    if (!open) return;
    const prevFocus = document.activeElement as HTMLElement | null;
    // 안쪽 입력칸이 이미 초점을 가졌으면 그대로 둠
    if (!modalRef.current?.contains(document.activeElement)) modalRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus?.();
    };
  }, [open]);

  if (!open) return null;

  return (
    <s.Overlay onClick={onClose}>
      <s.Modal
        ref={modalRef}
        width={width}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
      >
        <s.Header>
          <s.Title id={titleId}>{title}</s.Title>
          <s.CloseBtn type="button" onClick={onClose} aria-label="닫기">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </s.CloseBtn>
        </s.Header>
        <s.Body>{children}</s.Body>
        {footer && <s.Footer>{footer}</s.Footer>}
      </s.Modal>
    </s.Overlay>
  );
}

export default CommonModal;
