import type { ArtistSearchReq } from "../../Types/artistSearchTypes";

export const artistKeys = {
  all: ["artist"] as const,

  search: (params: ArtistSearchReq) =>
    [...artistKeys.all, "search", params] as const,

  profileDetail: (artistProfileId: number) =>
    [...artistKeys.all, "profileDetail", artistProfileId] as const,

  lessonCards: (artistProfileId: number) =>
    [...artistKeys.all, "lessonCards", artistProfileId] as const,

  lessonDetail: (artistProfileId: number, lessonId: number | null) =>
    [...artistKeys.all, "lessonDetail", artistProfileId, lessonId] as const,

  // 팔로우 (팔로워 수 + 내가 팔로우 중인지), 내 팔로잉 목록
  follow: (artistProfileId: number) => [...artistKeys.all, "follow", artistProfileId] as const,
  myFollowings: () => [...artistKeys.all, "myFollowings"] as const,
};
