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

// 아이콘만 있는 버튼이라 스크린리더/툴팁용 이름 (가입 여부와 관계없이 같은 흐름이라 "계속하기")
const LABEL: Record<OAuthProvider, string> = {
  google: "Google로 계속하기",
  naver: "네이버로 계속하기",
  kakao: "카카오로 계속하기",
};

function OAuth2Button({ provider, flow, redirectPath = "/" }: Props) {
  const href = buildOAuth2AuthUrl({ provider, flow, redirectPath });
  return (
    <s.OAuthButton provider={provider} href={href} aria-label={LABEL[provider]} title={LABEL[provider]}>
      <span aria-hidden="true">
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
