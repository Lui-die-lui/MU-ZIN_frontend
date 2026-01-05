/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import SigninForm from "./SigninForm/SigninForm";
import OAuth2Button from "../OAuth2Button/OAuth2Button";

function Signin() {
  return (
    <div>
      <SigninForm />
      <div>
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
      </div>
    </div>
  );
}

export default Signin;
