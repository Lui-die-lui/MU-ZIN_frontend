import { type Principal, type SigninPayload } from './../../Types/auth';

import { instance } from "../instance/instance";
import type { ApiRespDto } from '../../Types/responseType';

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
export const getPrincipalReq = () => 
    instance.get<PrincipalResp>("/auth/principal");

// 로그인
export type SigninResp = ApiRespDto<string | null>;
export const signinReq = (payload: SigninPayload) => 
    instance.post<SigninResp>("/auth/signin", payload);

