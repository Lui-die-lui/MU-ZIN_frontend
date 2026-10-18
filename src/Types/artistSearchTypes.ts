import type { InstrumentCategory } from "./instrumentTypes";
import type { LessonMode } from "./lessonTypes";

export type ArtistSearchReq = {
  keyword?: string;
  instCategory?: InstrumentCategory;
  instIds?: number[];
  styleTagIds?: number[];
  region1DepthName?: string;
  region2DepthName?: string;
  region3DepthName?: string;
  page?: number;
  size?: number;
  followedOnly?: boolean; // 내가 팔로우한 아티스트만 (로그인 필요)
};

export type SearchMainRegionSummary = {
  region1DepthName: string | null;
  region2DepthName: string | null;
  region3DepthName: string | null;
  addressLabel: string | null;
};

export type SearchServiceRegionResp = {
  region1DepthName: string | null;
  region2DepthName: string | null;
  region3DepthName: string | null;
};

export type ArtistInstrumentSummary = {
  instId: number;
  instName: string;
};

export type ArtistSearchResp = {
  artistProfileId: number;
  username: string;
  majorName: string;
  profileImgUrl: string | null;
  mainRegion: SearchMainRegionSummary | null;
  serviceRegions: SearchServiceRegionResp[];
  instruments: ArtistInstrumentSummary[];
  followerCount: number; // 팔로워 수 (누가 팔로우했는지는 공개 안 함)
  followedByMe: boolean; // 로그인한 사람이 팔로우 중인지
};

// 팔로우 버튼 상태
export type ArtistFollowResp = {
  artistProfileId: number;
  followerCount: number; // 이 아티스트를 팔로우하는 수
  following: boolean;
};

// 검색 상태
export type ArtistSearchDraft = {
  keyword: string;
  instCategory: InstrumentCategory | "ALL";
  instIds: number[];
  styleTagIds: number[];
  region1DepthName: string;
  region2DepthName: string | null;
  region3DepthName: string | null;
};

// 입력되는 기본 검색 값
export const DEFAULT_ARTIST_SEARCH_DRAFT: ArtistSearchDraft = {
  keyword: "",
  instCategory: "ALL",
  instIds: [],
  styleTagIds: [],
  region1DepthName: "",
  region2DepthName: "",
  region3DepthName: "",
};

// 아티스트 레슨 카드 타입
export type ArtistLessonCardResp = {
  lessonId: number;
  title: string;
  mode: LessonMode;
  price: number;
  durationMin: number;
  instrument: ArtistInstrumentSummary;
};

// 아티스트 카드 선택 시 상세
export type ArtistLessonDetailResp = {
  lessonId: number;
  title: string;
  description: string | null;
  requirementText: string | null;
  price: number;
  durationMin: number;
  mode: LessonMode;
  status: string;
  instrument: ArtistInstrumentSummary;
};
