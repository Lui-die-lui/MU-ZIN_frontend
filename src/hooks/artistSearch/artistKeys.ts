import type { ArtistSearchReq } from "../../Types/artistSearchTypes";


export const artistKeys = {
  all: ["artist"] as const,
  search: (params: ArtistSearchReq) =>
    [...artistKeys.all, "search", params] as const,
};
