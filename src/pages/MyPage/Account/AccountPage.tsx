import React from 'react'
import EmailVerifySection from './EmailVerifySection/EmailVerifySection'
import ChangeUserSection from './ChangeUsernameSection/ChangeUsernameSection'

function AccountPage() {
  return (
    <div>
      <ChangeUserSection/>
      <EmailVerifySection/>
      
    </div>
  )
}

export default AccountPage
