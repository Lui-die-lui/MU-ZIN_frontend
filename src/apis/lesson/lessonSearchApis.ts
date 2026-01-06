import type {
  LessonDetail,
  LessonMode,
  LessonSummary,
} from "../../Types/lessonTypes";
import type { ApiRespDto } from "../../Types/responseType";
import { instance } from "../instance/instance";

export type LessonSearchParams = {
  keyword?: string;
  mode?: LessonMode;
  styleTagIds?: number[];
  instIds?: number[];
  instCategory?: string;
};

// params로 검색 조건을 받음 - 나중에 확장될 예정
export const searchLessonReq = (params: LessonSearchParams) => {
  // 검색 조건을 쿼리 스트링으로 만들어서 get요청을 보냄
  const qs = new URLSearchParams();

  // 키워드 존재, 공백 제거 시에도 값이 있으면 쿼리에 추가
  if (params.keyword?.trim()) qs.set("keyword", params.keyword.trim());
  // 모드가 있으면 ENUM 모드 추가
  if (params.mode) qs.set("mode", params.mode);

  // 스타일 태그는 여러개 선택 가능해서 배열
  // append는 ?styleTagIds=1&styleTagIds=3&styleTagIds=5 같은 키 중복때문에...
  if (params.styleTagIds?.length) {
    params.styleTagIds.forEach((id) => qs.append("styleTagIds", String(id)));
  }

  if (params.instCategory) qs.set("instCategory", params.instCategory);

  if (params.instIds?.length) {
    params.instIds.forEach((id) => qs.append("instIds", String(id)));
  }

  //쿼리 파라미터가 하나라도 있으면 형태 만들어서 호출
  // : 없으면 그냥 전체 호출(나중에는 유저 본인 지역(부산이면 부산)붙일 예정)
  const url = qs.toString() ? `/lessons?${qs.toString()}` : "/lessons";
  return instance.get<ApiRespDto<LessonSummary[]>>(url);
};

// 레슨 단일 조회
export const getPublicLessonDetailReq = (lessonId: number) =>
  instance.get<ApiRespDto<LessonDetail>>(`/lessons/${lessonId}`);
