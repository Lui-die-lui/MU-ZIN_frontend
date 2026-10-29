import styled from "@emotion/styled";
import { css } from "@emotion/react";

// 아이콘 자리: 글자 기준선 때문에 아래로 밀리지 않게 블록으로
export const mark = css`
  display: grid;
  place-items: center;
  line-height: 0;

  svg {
    display: block;
  }
`;


export const OAuthButton = styled.a<{ provider: "google" | "naver" | "kakao" }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius:50px;
  box-sizing: border-box; /* 구글 버튼 테두리까지 44px 로 (다른 버튼과 같은 크기) */


  /* 공통 */
  text-decoration: none;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  @media (hover: hover) {
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 10px rgba(17, 24, 39, 0.12);
    }
  }
  &:active {
    transform: translateY(-1px);
    box-shadow: 0 4px 10px rgba(17, 24, 39, 0.12);
  }

  &:focus-visible {
    outline: 3px solid rgba(17, 24, 39, 0.25);
    outline-offset: 2px;
  }

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
      color: #191919;
    `}
`;
