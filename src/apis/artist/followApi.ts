import type { ArtistFollowResp, ArtistSearchResp } from "../../Types/artistSearchTypes";
import type { ApiRespDto } from "../../Types/responseType";
import { instance } from "../instance/instance";

// 아티스트 팔로우 (즐겨찾기처럼 사용)

// 팔로워 수 + 내가 팔로우 중인지 (로그인 없이도 수는 보임)
export const getArtistFollowReq = async (artistProfileId: number) =>
  (await instance.get<ApiRespDto<ArtistFollowResp>>(`/artists/${artistProfileId}/follow`)).data.data;

export const followArtistReq = async (artistProfileId: number) =>
  (await instance.put<ApiRespDto<ArtistFollowResp>>(`/artists/${artistProfileId}/follow`)).data.data;

export const unfollowArtistReq = async (artistProfileId: number) =>
  (await instance.delete<ApiRespDto<ArtistFollowResp>>(`/artists/${artistProfileId}/follow`)).data.data;

// 내가 팔로우한 아티스트 (나만 볼 수 있음)
export const getMyFollowingsReq = async () =>
  (await instance.get<ApiRespDto<ArtistSearchResp[]>>("/follows/me")).data.data;
