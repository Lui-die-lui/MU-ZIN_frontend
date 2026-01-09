import React from 'react'
import EmailVerifySection from './EmailVerifySection/EmailVerifySection'
import ChangeUserSection from './ChangeUsernameSection/ChangeUsernameSection'
import EditProfileImgSection from './EditProfileImgSection/EditProfileImgSection'
import PasswordSection from './PasswordSection/PasswordSection'

function AccountPage() {
  return (
    <div>
      <EditProfileImgSection/>
      <ChangeUserSection/>
      <EmailVerifySection/>
      <PasswordSection />
      
    </div>
  )
}

export default AccountPage
