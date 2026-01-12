
import type {
  ArtistProfileResponse,
  ArtistProfileUpsertRequest,
  SetMyInstrumentRequest,
} from "../../Types/artistApplyTypes";
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
