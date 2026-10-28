/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RiUserUnfollowLine } from "react-icons/ri";
import AccountInfoRow from "../../AccountInfoRow/AccountInfoRow";
import CommonModal from "../../../../../components/common/CommonModal/CommonModal";
import { modalBtn } from "../../../../../components/common/CommonModal/modalButtons";
import { withdrawReq } from "../../../../../apis/auth/authApi";
import { usePrincipalState } from "../../../../../stores/usePrincipalState";
import { getErrorMessage } from "../../../../../utils/errorUtils";
import { toast } from "../../../../../stores/useToastStore";
import * as accountStyles from "../../styles";
import * as s from "./styles";

const CONFIRMATION = "탈퇴합니다";

function WithdrawalSection() {
  const principal = usePrincipalState((state) => state.principal);
  const logout = usePrincipalState((state) => state.logout);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const needsPassword = principal?.canChangePassword ?? true;

  useEffect(() => {
    if (open) return;
    setPassword("");
    setConfirmation("");
    setError(null);
    setLoading(false);
  }, [open]);

  const close = () => {
    if (!loading) setOpen(false);
  };

  const withdraw = async () => {
    if (needsPassword && !password) {
      setError("현재 비밀번호를 입력해 주세요.");
      return;
    }
    if (confirmation !== CONFIRMATION) {
      setError(`확인 문구로 ‘${CONFIRMATION}’를 입력해 주세요.`);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await withdrawReq({ password: needsPassword ? password : undefined, confirmation });
      logout();
      toast.success("회원 탈퇴가 완료되었습니다.");
      navigate("/", { replace: true });
    } catch (e) {
      setError(getErrorMessage(e, "회원 탈퇴를 처리하지 못했습니다."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AccountInfoRow
        label={
          <div css={accountStyles.labelWithIcon}>
            <RiUserUnfollowLine size={18} />
            <span>회원 탈퇴</span>
          </div>
        }
        action={
          <button type="button" css={s.openButton} onClick={() => setOpen(true)}>
            탈퇴
          </button>
        }
      >
        <p css={[accountStyles.helperText, { margin: 0 }]}>계정과 개인 정보를 삭제하며 되돌릴 수 없어요.</p>
      </AccountInfoRow>

      <CommonModal
        open={open}
        title="회원 탈퇴"
        onClose={close}
        width={480}
        footer={
          <div css={s.footer}>
            <button type="button" css={modalBtn("secondary")} onClick={close} disabled={loading}>취소</button>
            <button type="button" css={modalBtn("danger")} onClick={withdraw} disabled={loading || confirmation !== CONFIRMATION || (needsPassword && !password)}>
              {loading ? "처리 중..." : "탈퇴하기"}
            </button>
          </div>
        }
      >
        <div css={s.body}>
          <div css={s.warning}>
            <strong>탈퇴 후에는 계정을 복구할 수 없어요.</strong>
            <ul>
              <li>진행 중인 예약이 있으면 먼저 취소하거나 마무리해야 해요.</li>
              <li>채팅·리뷰·예약·문의 같은 공유 기록은 상대방을 위해 남고 작성자는 ‘탈퇴한 회원’으로 표시돼요.</li>
              <li>아티스트의 레슨과 프로필은 더 이상 공개되지 않아요.</li>
            </ul>
          </div>
          {needsPassword && (
            <label css={s.field}>
              현재 비밀번호
              <input type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
          )}
          <label css={s.field}>
            확인을 위해 <strong>{CONFIRMATION}</strong> 입력
            <input autoComplete="off" value={confirmation} onChange={(e) => setConfirmation(e.target.value)} placeholder={CONFIRMATION} />
          </label>
          {error && <p css={s.error} role="alert">{error}</p>}
        </div>
      </CommonModal>
    </>
  );
}

export default WithdrawalSection;
