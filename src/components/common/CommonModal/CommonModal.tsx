/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import type { ReactNode } from "react";

type CommonModalProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  width?: number;
};
function CommonModal({
  open,
  title,
  onClose,
  children,
  footer,
  width = 420,
}: CommonModalProps) {
  if (!open) return null;

  return (
    <s.Overlay onClick={onClose}>
      <s.Modal width={width} onClick={(e) => e.stopPropagation()}>
        <s.Header>
          <s.Title>{title}</s.Title>
          <s.CloseBtn onClick={onClose}>×</s.CloseBtn>
        </s.Header>
        <s.Body>{children}</s.Body>
        {footer && <s.Footer>{footer}</s.Footer>}
      </s.Modal>
    </s.Overlay>
  );
}

export default CommonModal;
