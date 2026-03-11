/** @jsxImportSource @emotion/react */
import * as s from "../../styles";
import { usePrincipalState } from "../../../../../stores/usePrincipalState";
import { useMutation } from "@tanstack/react-query";
import { sendEmailCodeReq } from "../../../../../apis/auth/authApi";
import { MdEmail } from "react-icons/md";
import AccountInfoRow from "../../AccountInfoRow/AccountInfoRow";

function EmailVerifySection() {
  const { principal } = usePrincipalState();
  const email = principal?.email ?? "";
  const isVerified = principal?.emailVerified === true;

  const sendMut = useMutation({
    mutationFn: () => sendEmailCodeReq(email),
  });
  return (
    <AccountInfoRow
      label={
        <div css={s.labelWithIcon}>
          <MdEmail size={18}/>
          <span>이메일 인증</span>
        </div>
      }
      action={
        <button
          onClick={() => sendMut.mutate()}
          css={s.reserveBtn}
          disabled={!email || sendMut.isPending || isVerified}
        >
          {isVerified
            ? "인증 완료"
            : sendMut.isPending
              ? "전송 중"
              : "전송"}
        </button>
      }
    >
      <input value={email} css={s.input} disabled />
    </AccountInfoRow>
  );
}

export default EmailVerifySection;
