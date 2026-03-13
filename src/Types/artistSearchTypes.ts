import type { InstrumentCategory } from "./instrumentTypes";

export type ArtistSearchReq = {
    keyword?: string;
    instCategory?: InstrumentCategory;
    instIds?: number[];
    styleTagIds?: number[];
}

export type ArtistInstrumentSummary = {
    instId: number;
    instName: string;
}

export type ArtistSearchResp = {
    artistProfileId: number;
    username: string;
    majorName: string;
    email: string;
    profileImgUrl: string;
    instruments: ArtistInstrumentSummary[];
}

// 검색 상태
export type ArtistSearchDraft = {
    keyword: string;
    instCategory: InstrumentCategory | "ALL";
    instIds: number[];
    styleTagIds: number[];
}

// 입력되는 기본 검색 값
export const DEFAULT_ARTIST_SEARCH_DRAFT: ArtistSearchDraft = {
  keyword: "",
  instCategory: "ALL",
  instIds: [],
  styleTagIds: [],
};