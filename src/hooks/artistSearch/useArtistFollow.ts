import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { artistKeys } from "./artistKeys";
import { followArtistReq, getArtistFollowReq, getMyFollowingsReq, unfollowArtistReq } from "../../apis/artist/followApi";
import type { ArtistFollowResp } from "../../Types/artistSearchTypes";

export const useArtistFollow = (artistProfileId: number | null) =>
  useQuery({
    queryKey: artistKeys.follow(artistProfileId ?? 0),
    queryFn: () => getArtistFollowReq(artistProfileId!),
    enabled: !!artistProfileId,
  });

export const useMyFollowings = () =>
  useQuery({ queryKey: artistKeys.myFollowings(), queryFn: getMyFollowingsReq });

type Vars = { artistProfileId: number; follow: boolean };

// 팔로우/취소
// - 아티스트 페이지 숫자(팔로워)는 누르는 즉시 바꾸고(실패하면 되돌림) 서버 응답으로 맞춤
// - 검색 카드, 내 팔로잉 목록은 다시 불러옴
export const useToggleFollow = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ artistProfileId, follow }: Vars) =>
      follow ? followArtistReq(artistProfileId) : unfollowArtistReq(artistProfileId),
    onMutate: async ({ artistProfileId, follow }: Vars) => {
      const key = artistKeys.follow(artistProfileId);
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<ArtistFollowResp>(key);
      if (prev && prev.following !== follow) {
        qc.setQueryData<ArtistFollowResp>(key, {
          ...prev,
          following: follow,
          followerCount: Math.max(0, prev.followerCount + (follow ? 1 : -1)),
        });
      }
      return { prev, key };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(ctx.key, ctx.prev);
    },
    onSuccess: (data) => {
      qc.setQueryData(artistKeys.follow(data.artistProfileId), data);
      qc.invalidateQueries({ queryKey: [...artistKeys.all, "search"] });
      qc.invalidateQueries({ queryKey: artistKeys.myFollowings() });
    },
  });
};
