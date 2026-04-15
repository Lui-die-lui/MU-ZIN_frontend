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
};

export type SearchMainRegionSummary = {
    region1DepthName: string | null;
    region2DepthName: string | null;
    region3DepthName: string | null;
    addressLabel: string | null;
}

export type SearchServiceRegionResp = {
    region1DepthName: string | null;
    region2DepthName: string | null;
    region3DepthName: string | null;
}

export type ArtistInstrumentSummary = {
  instId: number;
  instName: string;
};

export type ArtistSearchResp = {
  artistProfileId: number;
  username: string;
  majorName: string;
  email: string;
  profileImgUrl: string;
  mainRegion: SearchMainRegionSummary | null;
  serviceRegions: SearchServiceRegionResp[];
  instruments: ArtistInstrumentSummary[];
};

// 검색 상태
export type ArtistSearchDraft = {
  keyword: string;
  instCategory: InstrumentCategory | "ALL";
  instIds: number[];
  styleTagIds: number[];
  region1DepthName: string;
  region2DepthName: string;
  region3DepthName: string;
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
