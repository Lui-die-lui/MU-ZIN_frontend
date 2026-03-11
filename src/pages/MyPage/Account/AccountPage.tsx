/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import EmailVerifySection from "./UserAccount/EmailVerifySection/EmailVerifySection";
import ChangeUserSection from "./UserAccount/ChangeUsernameSection/ChangeUsernameSection";

import PasswordSection from "./UserAccount/PasswordSection/PasswordSection";
import EditProfileImgSection from "./UserAccount/EditProfileImgSection/EditProfileImgSection";

function AccountPage() {
  return (
     <div css={s.page}>
      <div css={s.header}>
        <h1 css={s.title}>개인 정보</h1>
        <p css={s.desc}>
          내 계정 정보와 공개 범위를 관리하세요.
        </p>
      </div>

      <div css={s.card}>
        <EditProfileImgSection />
        <ChangeUserSection />
        <EmailVerifySection />
        <PasswordSection />
      </div>
    </div>
  );
}

export default AccountPage;
