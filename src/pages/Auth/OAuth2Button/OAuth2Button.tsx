/** @jsxImportSource @emotion/react */
import { IoLogoGoogle } from "react-icons/io5";
import { RiKakaoTalkFill } from "react-icons/ri";
import { SiNaver } from "react-icons/si";
import {
  buildOAuth2AuthUrl,
  type OAuthFlow,
  type OAuthProvider,
} from "../buildOAuth2AuthUrl";
import * as s from "./styles";

// 해당 값들을 전달할때 전달 받는 값들의 타입을 미리 선언
type Props = {
  provider: OAuthProvider;
  flow: OAuthFlow;
  redirectPath?: string;
};
function OAuth2Button({ provider, flow, redirectPath = "/" }: Props) {
  const href = buildOAuth2AuthUrl({ provider, flow, redirectPath });
  return (
    <s.OAuthButton provider={provider} href={href}>
      <span>
        {provider === "google" ? (
          <IoLogoGoogle />
        ) : provider === "naver" ? (
          <SiNaver />
        ) : (
          <RiKakaoTalkFill />
        )}
      </span>
    </s.OAuthButton>
  );
}

export default OAuth2Button;
