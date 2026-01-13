import React from "react";
import EmailVerifySection from "./UserAccount/EmailVerifySection/EmailVerifySection";
import ChangeUserSection from "./UserAccount/ChangeUsernameSection/ChangeUsernameSection";

import PasswordSection from "./UserAccount/PasswordSection/PasswordSection";
import EditProfileImgSection from "./UserAccount/EditProfileImgSection/EditProfileImgSection";

function AccountPage() {
  return (
    <div>
      <EditProfileImgSection />
      <ChangeUserSection />
      <EmailVerifySection />
      <PasswordSection />
    </div>
  );
}

export default AccountPage;
