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
};
