import {
  getArtistLessonCardReq,
  getArtistLessonDetailReq,
} from "./../../apis/artist/artistApi";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
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
  followedOnly = false, // 내가 팔로우한 아티스트만
  viewerUserId: number | null = null, // 로그인한 사람마다 팔로우 표시가 달라서 캐시를 나눔
) => {
  const params = { ...makeArtistSearchParams(applied), ...(followedOnly ? { followedOnly: true } : {}) };
  const pageSize = 12;

  return useInfiniteQuery({
    queryKey: [...artistKeys.search(params), viewerUserId],
    queryFn: ({ pageParam }) =>
      searchArtistsReq({ ...params, page: pageParam, size: pageSize }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _pages, lastPageParam) =>
      lastPage.length === pageSize ? lastPageParam + 1 : undefined,
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

export const useArtistLessonCards = (artistProfileId: number) => {
  return useQuery({
    queryKey: artistKeys.lessonCards(artistProfileId),
    queryFn: async () => {
      const resp = await getArtistLessonCardReq(artistProfileId);
      return resp.data;
    },
    enabled: !!artistProfileId,
  });
};

export const useArtistLessonDetail = (
  artistProfileId: number,
  lessonId: number | null,
) => {
  return useQuery({
    queryKey: artistKeys.lessonDetail(artistProfileId, lessonId),
    queryFn: async () => {
      const resp = await getArtistLessonDetailReq(artistProfileId, lessonId!);
      return resp.data;
    },
    enabled: !!artistProfileId && !!lessonId,
  });
};
