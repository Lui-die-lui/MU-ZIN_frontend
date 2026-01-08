import React from "react";
import { usePrincipalState } from "../../../../stores/usePrincipalState";
import { useMutation } from "@tanstack/react-query";
import { sendEmailCodeReq } from "../../../../apis/auth/authApi";

function EmailVerifySection() {
  const { principal } = usePrincipalState();
  const email = principal?.email ?? "";
  const isVerified = principal?.emailVerified === true;

  const sendMut = useMutation({
    mutationFn: () => sendEmailCodeReq(email),
  });
  return (
    <div>
      <p>이메일</p>
      <input value={email} disabled />
      <button
        onClick={() => sendMut.mutate()}
        disabled={!email || sendMut.isPending || isVerified}
      >
        {isVerified
          ? "인증 완료"
          : sendMut.isPending
          ? "전송 중"
          : "인증 메일 보내기"}
      </button>
    </div>
  );
}

export default EmailVerifySection;
