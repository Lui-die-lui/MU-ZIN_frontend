import type { ApiRespDto } from "../../Types/responseType";
import { instance } from "../instance/instance";

// 유저명 변경
export const patchMyUsernameReq = (username: string) =>
  instance.patch<ApiRespDto<null | { username: string }>>(
    "/users/me/username",
    { username }
  );
