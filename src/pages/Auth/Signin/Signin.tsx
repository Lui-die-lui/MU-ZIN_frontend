/** @jsxImportSource @emotion/react */
import SigninForm from "./SigninForm/SigninForm";

function Signin() {
  return (
    <div>
      <SigninForm />
      {/* <div>
        <OAuth2Button
          provider="google"
          flow="signup"
          redirectPath="/redirect"
        />
        <OAuth2Button
          provider="naver"
          flow="signup"
            redirectPath="/redirect"
        />
        <OAuth2Button
          provider="kakao"
          flow="signup"
            redirectPath="/redirect"
        />
      </div> */}
    </div>
  );
}

export default Signin;
