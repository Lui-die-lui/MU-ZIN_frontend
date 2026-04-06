import qs from "qs";
import { type InstrumentCategory } from "../../Types/instrumentTypes";
import type {
  LessonDetail,
  LessonMode,
  LessonSummary,
} from "../../Types/lessonTypes";
import type { ApiRespDto } from "../../Types/responseType";
import type { TimePart, Weekday } from "../../Types/searchForTimeTypes";
import { instance } from "../instance/instance";

export type LessonSearchParams = {
  keyword?: string;
  mode?: LessonMode;
  styleTagIds?: number[];
  instIds?: number[];
  instCategory?: InstrumentCategory;
  from?: string;
  to?: string;

  daysOfWeek?: Weekday[]; // 1~ 7(월~일)
  timeParts?: TimePart[];
};


export const searchLessonReq = async (
  params: LessonSearchParams,
): Promise<ApiRespDto<LessonSummary[]>> => {
  const normalizedParams: LessonSearchParams = {
    ...params,
    keyword: params.keyword?.trim() || undefined,
  };

  const resp = await instance.get("/lessons", {
    params: normalizedParams,
    paramsSerializer: (params) =>
      qs.stringify(params, {
        arrayFormat: "repeat",
        skipNulls: true,
      }),
  });

  return resp.data;
};

export const getPublicLessonDetailReq = async (
  lessonId: number,
): Promise<ApiRespDto<LessonDetail>> => {
  const resp = await instance.get(`/lessons/${lessonId}`);
  return resp.data;
};
