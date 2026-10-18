import qs from "qs";
import type { ApiRespDto } from "../../Types/responseType";
import type { LessonMode } from "../../Types/lessonTypes";
import type { SearchMainRegionSummary } from "../../Types/artistSearchTypes";
import { instance } from "../instance/instance";

// 내 음악 스타일 찾기 -> 선택 지역의 실제 레슨 (로그인 없이)
// 필수: instIds + region1DepthName / 선호(정렬만): preferTagIds, preferModes
export type LessonRecommendReq = {
  instIds: number[];
  region1DepthName: string;
  region2DepthName?: string;
  region3DepthName?: string;
  preferTagIds?: number[];
  preferModes?: LessonMode[];
  size?: number;
};

export type RecommendedLesson = {
  lessonId: number;
  title: string;
  description: string | null;
  price: number | null;
  durationMin: number;
  mode: LessonMode;
  instId: number;
  instName: string;
  artistProfileId: number;
  artistName: string;
  artistProfileImgUrl: string | null;
  artistMainRegion: SearchMainRegionSummary | null;
  regionMatch: "MAIN" | "SERVICE";
  styleTags: { lessonStyleTagId: number; styleName: string }[];
  matchedTagIds: number[];
  modeMatched: boolean;
  preferenceScore: number;
  sample: boolean; // 샘플(시연용) 계정 레슨 - 개발 환경에서만 내려옴
};

export const getRecommendedLessonsReq = async (params: LessonRecommendReq) =>
  (
    await instance.get<ApiRespDto<RecommendedLesson[]>>("/lessons/recommend", {
      params,
      paramsSerializer: (p) => qs.stringify(p, { arrayFormat: "repeat", skipNulls: true }),
    })
  ).data.data;
