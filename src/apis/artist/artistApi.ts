import qs from "qs";
import type {
  ArtistProfileResponse,
  ArtistProfileUpsertRequest,
  SetMyInstrumentRequest,
} from "../../Types/artistApplyTypes";
import type {
  ArtistSearchReq,
  ArtistSearchResp,
} from "../../Types/artistSearchTypes";
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
    body,
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
    body,
  );

// 내 레슨 스타일 태그 조회
export const getMyArtistStyleTagsReq = () =>
  instance.get<ApiRespDto<LessonStyleTagResponse[]>>(
    "/artist/profile/me/style-tags",
  );

// 내 스타일 태그 저장(교체)
export type ArtistStyleSetRequest = {
  styleTagIds: number[];
};
export const setMyArtistStyleTagsReq = (body: ArtistStyleSetRequest) =>
  instance.put<ApiRespDto<LessonStyleTagResponse[]>>(
    "/artist/profile/me/style-tags",
    body,
  );

// qs 도입 아티스트 검색
export const searchArtistsReq = async (
  params: ArtistSearchReq, // 검색 조건 객체 타입
): Promise<ArtistSearchResp[]> => {
  // 최종적으로 해당 배열을 담은 Promise 를 반환(ex. 아티스트 카드 리스트) 
  const resp = await instance.get("/artists", {
    // get 요청 보내고 끝날 때까지 기다린 뒤 결과를 resp에 저장
    params,
    paramsSerializer: (params) =>
      qs.stringify(params, { arrayFormat: "repeat" }),
    // params 객체를 쿼리스트링으로 변환하는 규칙
  });

  return resp.data; // 실제 데이터 반환
};
