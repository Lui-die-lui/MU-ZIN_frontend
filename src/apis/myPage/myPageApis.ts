import { instance } from "../instance/instance";

// 프로필 이미지 변경
export const patchMyProfileImgReq = (body: {profileImgUrl: string}) =>
  instance.patch("/users/me/profile-image", body);
// 이거 나중에 유저쪽으로 옮길지 고민 해보기...
