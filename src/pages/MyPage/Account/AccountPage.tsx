import React from 'react'
import EmailVerifySection from './EmailVerifySection/EmailVerifySection'
import ChangeUserSection from './ChangeUsernameSection/ChangeUsernameSection'
import EditProfileImgSection from './EditProfileImgSection/EditProfileImgSection'

function AccountPage() {
  return (
    <div>
      <EditProfileImgSection/>
      <ChangeUserSection/>
      <EmailVerifySection/>
      
    </div>
  )
}

export default AccountPage
