import { useState } from "react";
import { usePrincipalState } from "../../../../../stores/usePrincipalState";
import { ContentItem } from "../../styles";
import ChangePasswordModal from "./ChangePasswordModal/ChangePasswordModal";
import { patchMyPasswordReq } from "../../../../../apis/user/userApis";

function PasswordSection() {
  const { principal } = usePrincipalState();
  const [open, setOpen] = useState(false);
  const canChange = principal?.canChangePassword ?? false;
  return (
    <ContentItem>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <p style={{ fontWeight: 700 }}>비밀번호 변경</p>
          {!canChange && (
            <p style={{ fontSize: 12, color: "#64748b" }}>
              소셜 로그인 계정은 비밀번호 변경이 불가해요.
            </p>
          )}
        </div>

        <button
          type="button"
          disabled={!canChange}
          onClick={() => setOpen(true)}
        >
          변경
        </button>
      </div>

      <ChangePasswordModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={async ({ currentPassword, newPassword }) => {
          await patchMyPasswordReq({ currentPassword, newPassword });
          setOpen(false);
        }}
      />
    </ContentItem>
  );
}

export default PasswordSection;
