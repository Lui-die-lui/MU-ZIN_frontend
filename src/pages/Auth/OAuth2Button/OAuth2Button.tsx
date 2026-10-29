/** @jsxImportSource @emotion/react */
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

// 구글: 공식 4색 G
const GoogleMark = () => (
  <svg width="18" height="18" viewBox="0 0 48 48">
    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
  </svg>
);

// 카카오: 말풍선
const KakaoMark = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3.6c-5.1 0-9.2 3.2-9.2 7.2 0 2.6 1.7 4.8 4.3 6.1l-.9 3.3c-.1.3.3.6.5.4l3.9-2.6c.5.1 1 .1 1.4.1 5.1 0 9.2-3.2 9.2-7.2s-4.1-7.3-9.2-7.3z" />
  </svg>
);

// 세 아이콘이 원 안에서 비슷한 크기로 보이게 각각 크기를 맞춤 (네이버 N 은 꽉 찬 글자라 작게)
function OAuth2Button({ provider, flow, redirectPath = "/" }: Props) {
  const href = buildOAuth2AuthUrl({ provider, flow, redirectPath });
  return (
    <s.OAuthButton provider={provider} href={href} aria-label={LABEL[provider]} title={LABEL[provider]}>
      <span css={s.mark} aria-hidden="true">
        {provider === "google" ? <GoogleMark /> : provider === "naver" ? <SiNaver size={14} /> : <KakaoMark />}
      </span>
    </s.OAuthButton>
  );
}

export default OAuth2Button;
