import { ArtistLessonResponse } from "./../../Types/lessonTypes";
// api

import type {
  LessonCreateReq,
  LessonStyleTagResponse,
  LessonUpdateReq,
  SetLessonStylesReq,
} from "../../Types/lessonTypes";
import type { ApiRespDto } from "../../Types/responseType";
import { instance } from "../instance/instance";

// 레슨 생성
export const crateMyLessonReq = (body: LessonCreateReq) =>
  instance.post<ApiRespDto<ArtistLessonResponse>>("/lessons/me", body);

// 레슨 수정
export const updateMyLessonReq = (lessonId: number, body: LessonUpdateReq) =>
  instance.patch<ApiRespDto<ArtistLessonResponse>>(
    `/lessons/me/${lessonId}`,
    body
  );

// 삭제
export const deleteLessonReq = (lessonId: number) =>
  instance.delete<ApiRespDto<null>>(`/lessons/${lessonId}`);

// 내 레슨 리스트
export const getMyLessonReq = () =>
  instance.get<ApiRespDto<ArtistLessonResponse[]>>("/lessons/me");

// 내 레슨 상세 (단일 조회)
export const getMyLessonDetailReq = (lessonId: number) =>
  instance.get<ApiRespDto<ArtistLessonResponse>>(`/lessons/me/${lessonId}`);

// 레슨 방식 스타일 태그 목록
export const getLessonStyleTagReq = () =>
  instance.get<ApiRespDto<LessonStyleTagResponse[]>>("/lessons/style-tags");

// 스타일 태그(전체 교체)
export const setMyLessonStyleTagReq = (
  lessonId: number,
  body: SetLessonStylesReq
) =>
  instance.put<ApiRespDto<ArtistLessonResponse>>(
    `/lessons/me/${lessonId}/style-tag`,
    body
  );
