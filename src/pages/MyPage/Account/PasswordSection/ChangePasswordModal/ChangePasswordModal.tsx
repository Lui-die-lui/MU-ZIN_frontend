/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import * as s from "./styles";
import CommonModal from "../../../../../components/common/CommonModal/CommonModal";
import { usePrincipalState } from "../../../../../stores/usePrincipalState";
import { useNavigate } from "react-router-dom";
type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (v: {
    currentPassword: string;
    newPassword: string;
  }) => Promise<void>;
};

function ChangePasswordModal({ open, onClose, onSubmit }: Props) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { logout } = usePrincipalState();
  const navigate = useNavigate();

  const pwRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/;

  // 모달 닫힐 때 초기화
  useEffect(() => {
    if (!open) {
      setCurrentPassword(""),
        setNewPassword(""),
        setConfirm(""),
        setError(""),
        setIsLoading(false);
    }
  }, [open]);

  // 검증 - if문에 걸리면 아래에서 에러 띄워줌
  const validate = () => {
    if (!currentPassword || !newPassword || !confirm)
      return "모든 칸을 입력해주세요.";
    if (newPassword !== confirm) return "새 비밀번호가 일치하지 않습니다.";
    if (!pwRegex.test(newPassword))
      return "비밀번호는 영문/숫자/특수문자 포함 8~15자여야 합니다.";

    return null;
  };

  const handleSubmit = async () => {
    const msg = validate();
    if (msg) {
      setError(msg);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await onSubmit({ currentPassword, newPassword });
      onClose();

      alert("비밀번호가 변경되었습니다. 다시 로그인 해주세요.");
      logout();
      navigate("/signin");
    } catch (e) {
      setError("변경 실패");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CommonModal
      open={open}
      title="비밀번호 변경"
      onClose={onClose}
      width={420}
      footer={
        <div css={s.footerRow}>
          <button css={s.ghostBtn} onClick={onClose} disabled={isLoading}>
            취소
          </button>
          <button
            css={s.primaryBtn}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            변경
          </button>
        </div>
      }
    >
      <div css={s.form}>
        <label css={s.label}>
          현재 비밀번호
          <input
            css={s.input}
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </label>

        <label css={s.label}>
          새 비밀번호
          <input
            css={s.input}
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>

        <label css={s.label}>
          새 비밀번호 확인
          <input
            css={s.input}
            type="password"
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
          />
        </label>

        {error && <div css={s.error}>{error}</div>}
      </div>
    </CommonModal>
  );
}

export default ChangePasswordModal;
