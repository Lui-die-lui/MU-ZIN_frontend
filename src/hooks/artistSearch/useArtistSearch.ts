import { useQuery } from "@tanstack/react-query";
import type { ArtistSearchDraft } from "../../Types/artistSearchTypes";
import { makeArtistSearchParams } from "../../utils/artistSearchUtils";
import { artistKeys } from "./artistKeys";
import { searchArtistsReq } from "../../apis/artist/artistApi";


export const useArtistSearch = (applied: ArtistSearchDraft, enabled: boolean) => {
  const params = makeArtistSearchParams(applied);

  return useQuery({
    queryKey: artistKeys.search(params),
    queryFn: () => searchArtistsReq(params),
    enabled
  });
};
