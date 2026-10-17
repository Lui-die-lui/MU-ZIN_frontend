import type { InstrumentResponse } from "./instrumentTypes";
import type { ArtistStatus } from "./auth";
import type {
  ArtistProfileRegion,
  ArtistProfileRegionRequest,
  ArtistServiceRegion,
  ArtistServiceRegionRequest,
} from "./artistRegionTypes";

// 저장 / 제출되는 아티스트 정보
export type ArtistProfileUpsertRequest = {
  bio: string;
  career: string;
  majorName: string;
  mainRegion: ArtistProfileRegionRequest | null;
  serviceRegions: ArtistServiceRegionRequest[];
};

// 제출 / 수정되는 아티스트 악기
export type SetMyInstrumentRequest = {
  instrumentIds: number[];
};

// 아티스트 정보 전체
export type ArtistProfileResponse = {
  artistProfileId: number;
  userId: number;
  username: string;
  profileImgUrl: string | null;
  bio: string;
  career: string;
  majorName: string;
  status: ArtistStatus;
  instruments: InstrumentResponse[];
  mainRegion: ArtistProfileRegion | null;
  serviceRegions: ArtistServiceRegion[];
  // 신청자 본인 화면용 (반려됐을 때 사유 / 마지막 제출 시각)
  rejectReasonTitle?: string | null;
  rejectedReason?: string | null;
  submittedDt?: string | null;
};

// 아티스트 제출 정보(+ 악기) - 현재 api가 분리되어있으므로
export type ApplyArtistPayload = ArtistProfileUpsertRequest & {
  instrumentIds: number[];
};
