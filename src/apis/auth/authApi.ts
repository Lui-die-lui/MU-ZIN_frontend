import type { Consent } from "../../legal/consent";
import {
  type Principal,
  type SigninPayload,
  type SignupPayload,
} from "./../../Types/auth";

import { instance } from "../instance/instance";
import type { ApiRespDto } from "../../Types/responseType";


// ApiRespDto 사용한 Principal
export type PrincipalResp = ApiRespDto<Principal>;
// 여기서 중괄호 쓰면 return 적어줘야함. 아니면 안적어도 됨
export const getPrincipalReq = () =>
  instance.get<PrincipalResp>("/auth/principal");

// 로그인
export type SigninResp = ApiRespDto<string>;
export const signinReq = (payload: SigninPayload) =>
  instance.post<SigninResp>("/auth/signin", payload);

// 회원가입
export type SignupResp = ApiRespDto<string | null>;
export const signupReq = (payload: SignupPayload & Consent) =>
  instance.post<SignupResp>("/auth/signup", payload);

// 소셜 첫 가입 완료 (소셜 로그인 직후 받은 임시 가입 토큰 + 동의) -> 로그인 토큰
export const oauth2SignupReq = (payload: { signupToken: string } & Consent) =>
  instance.post<{ data: string }>("/auth/oauth2/signup", payload);

// 약관이 바뀌었거나 동의 기록이 없는 기존 회원
export const consentReq = (payload: Consent) => instance.post("/auth/consent", payload);

// 계정 탈퇴 (이메일 계정은 현재 비밀번호 필요, 소셜 계정은 확인 문구만)
export const withdrawReq = (payload: { password?: string; confirmation: string }) =>
  instance.post("/auth/withdraw", payload);

// 이메일 인증
export const sendEmailCodeReq = (email: string) => 
  instance.post("/mail/send", {email});
