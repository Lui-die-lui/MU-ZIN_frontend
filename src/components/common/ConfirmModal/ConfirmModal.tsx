/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import CommonModal from "../CommonModal/CommonModal";

type ConfirmModlaProps = {
  open: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
  width?: number;
};

function ConfirmModal({
  open,
  title = "확인",
  message,
  confirmText = "예",
  cancelText = "아니오",
  loading = false,
  onConfirm,
  onClose,
  width,
}: ConfirmModlaProps) {
  if (!open) return null;
  return (
    <CommonModal
      open={open}
      title={title}
      onClose={onClose}
      width={width}
      footer={
        <>
          <button css={s.ghostBtn} onClick={onClose} disabled={loading}>
            {cancelText}
          </button>
          <button css={s.primaryBtn} onClick={onConfirm} disabled={loading}>
            {loading ? "처리중..." : confirmText}
          </button>
        </>
      }
    >
      <p>{message}</p>
    </CommonModal>
  );
}

export default ConfirmModal;
