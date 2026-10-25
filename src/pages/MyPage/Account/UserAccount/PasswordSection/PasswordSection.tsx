/** @jsxImportSource @emotion/react */
import * as s from "../../styles";
import { useState } from "react";
import { usePrincipalState } from "../../../../../stores/usePrincipalState";
import { RiLockPasswordFill } from "react-icons/ri";
import ChangePasswordModal from "./ChangePasswordModal/ChangePasswordModal";
import { patchMyPasswordReq } from "../../../../../apis/user/userApis";
import AccountInfoRow from "../../AccountInfoRow/AccountInfoRow";

function PasswordSection() {
  const { principal } = usePrincipalState();
  const [open, setOpen] = useState(false);
  const canChange = principal?.canChangePassword ?? false;
  return (
    <AccountInfoRow
      label={
        <div css={s.labelWithIcon}>
          <RiLockPasswordFill size={18} />
          <span>비밀번호 변경</span>
        </div>
      }
      action={
        <button
          type="button"
          disabled={!canChange}
          css={s.reserveBtn}
          onClick={() => setOpen(true)}
        >
          변경
        </button>
      }
    >
      {!canChange && (
        <p css={[s.helperText, { margin: 0 }]}>
          소셜 로그인 계정은 비밀번호 변경이 불가해요.
        </p>
      )}

      <ChangePasswordModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={async ({ currentPassword, newPassword }) => {
          await patchMyPasswordReq({ currentPassword, newPassword });
          setOpen(false);
        }}
      />
    </AccountInfoRow>
  );
}

export default PasswordSection;
