import { useQuery } from "@tanstack/react-query";
import type { ArtistSearchDraft } from "../../Types/artistSearchTypes";
import { makeArtistSearchParams } from "../../utils/artistSearchUtils";
import { artistKeys } from "./artistKeys";
import {
  getArtistProfileDetailReq,
  searchArtistsReq,
} from "../../apis/artist/artistApi";

export const useArtistSearch = (
  applied: ArtistSearchDraft,
  enabled: boolean,
) => {
  const params = makeArtistSearchParams(applied);

  return useQuery({
    queryKey: artistKeys.search(params),
    queryFn: () => searchArtistsReq(params),
    enabled,
  });
};

export const useArtistProfileDetail = (artistProfileId: number) => {
  return useQuery({
    queryKey: artistKeys.profileDetail(artistProfileId),
    queryFn: () => getArtistProfileDetailReq(artistProfileId),
    enabled: !!artistProfileId,
  });
};
