import styled from "@emotion/styled";

export const OAuthButton = styled.a<{ provider: "google" | "naver" | "kakao" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius:50px;


  /* 공통 */
  text-decoration: none;

  /* provider별 */
  ${({ provider }) =>
    provider === "google" &&
    `
      background: #fff;
      border: 1px solid #e5e5e5;
    `}
  ${({ provider }) =>
    provider === "naver" &&
    `
      background: #03c75a;
      color: #fff;
    `}
  ${({ provider }) =>
    provider === "kakao" &&
    `
      background: #fee500;
      color: #000;
    `}
`;
