import type { ApiRespDto } from "../../Types/responseType";
import { instance } from "../instance/instance";

// 유저명 변경
export const patchMyUsernameReq = (username: string) =>
  instance.patch<ApiRespDto<null | { username: string }>>(
    "/users/me/username",
    { username }
  );

// 비밀번호 변경
export type ChangePasswordReq = {
  currentPassword: string;
  newPassword: string;
};
export const patchMyPasswordReq = (body: ChangePasswordReq) => 
  instance.patch("/users/me/password", body);
