import type {
  ArtistProfileResponse,
  ArtistProfileUpsertRequest,
  SetMyInstrumentRequest,
} from "../../Types/artistApplyTypes";
import type { LessonStyleTagResponse } from "../../Types/lessonTypes";
import type { ApiRespDto } from "../../Types/responseType";
import { instance } from "../instance/instance";

// 임시저장한 신청서
export const getMyArtistProfileReq = () =>
  instance.get<ApiRespDto<ArtistProfileResponse | null>>("/artist/profile/me");

// 임시저장(소개/경력/전공)
export const saveDraftArtistProfileReq = (body: ArtistProfileUpsertRequest) =>
  instance.put<ApiRespDto<ArtistProfileResponse>>(
    "/artist/profile/me/draft",
    body
  );

// 제출 -> data null
export const submitArtistApplicationReq = () =>
  instance.post<ApiRespDto<null>>("/artist/profile/me/submit");

// 승인된 아티스트 프로필 수정
export const updateApprovedProfileReq = (body: ArtistProfileUpsertRequest) =>
  instance.put<ApiRespDto<ArtistProfileResponse>>("/artist/profile/me", body);

// 악기 저장(교체) -> ArtistProfileResponse 내려줌
export const setMyInstrumentReq = (body: SetMyInstrumentRequest) =>
  instance.put<ApiRespDto<ArtistProfileResponse>>(
    "/artist/profile/me/instruments",
    body
  );

// 내 레슨 스타일 태그 조회
export const getMyArtistStyleTagsReq = () =>
  instance.get<ApiRespDto<LessonStyleTagResponse[]>>("/artist/profile/me/style-tags");

// 내 스타일 태그 저장(교체)
export type ArtistStyleSetRequest = {
  styleTagIds: number[];
};
export const setMyArtistStyleTagsReq = (body: ArtistStyleSetRequest) =>
  instance.put<ApiRespDto<LessonStyleTagResponse[]>>(
    "/artist/profile/me/style-tags",
    body
  );
