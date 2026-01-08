import {
  type Principal,
  type SigninPayload,
  type SignupPayload,
} from "./../../Types/auth";

import { instance } from "../instance/instance";
import type { ApiRespDto } from "../../Types/responseType";

// Principal
// export const getPrincipalReq = async () => {
//   try {
//     const response = await instance.get("/auth/principal");
//     return response.data;
//   } catch (error) {
//     console.error("principal 요청 실패 : ", error);
//     throw error;
//   }
// };

// ApiRespDto 사용한 Principal
export type PrincipalResp = ApiRespDto<Principal>;
// 여기서 중괄호 쓰면 return 적어줘야함. 아니면 안적어도 됨
export const getPrincipalReq = () =>
  instance.get<PrincipalResp>("/auth/principal");

// 로그인
export type SigninResp = ApiRespDto<string | null>;
export const signinReq = (payload: SigninPayload) =>
  instance.post<SigninResp>("/auth/signin", payload);

// 회원가입
export type SignupResp = ApiRespDto<string | null>;
export const signupReq = (payload: SignupPayload) =>
  instance.post<SignupResp>("/auth/signup", payload);

// 이메일 인증
export const sendEmailCodeReq = (email: string) => 
  instance.post("/mail/send", {email});