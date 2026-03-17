import {
  LESSON_CLOSING_POLICY_LABEL,
  type LessonCreateReq,
  type LessonCreateResp,
  type LessonDetail,
  type LessonRecurrenceResp,
  type LessonRecurrenceUpsertReq,
  type LessonStyleTagResponse,
  type LessonUpdateReq,
  type MyLessonDetail,
  type SetLessonStylesReq,
  type TimeSlotCreateReq,
} from "../../Types/lessonTypes";
import type { ApiRespDto } from "../../Types/responseType";
import { instance } from "../instance/instance";

// 레슨 생성
export const createMyLessonReq = (body: LessonCreateReq) =>
  instance.post<ApiRespDto<LessonCreateResp>>("/lessons/me", body);

// 타임슬롯 생성
export const createMyTimeSlotsReq = (
  lessonId: number,
  body: TimeSlotCreateReq,
) =>
  instance.post<ApiRespDto<null>>(`/lessons/me/${lessonId}/time-slots`, body);
  closingPolicy: Object.keys(LESSON_CLOSING_POLICY_LABEL)

// 내 레슨 수정
export const updateMyLessonReq = (lessonId: number, body: LessonUpdateReq) =>
  instance.patch<ApiRespDto<MyLessonDetail>>(`/lessons/me/${lessonId}`, body);

// 삭제
export const deleteLessonReq = (lessonId: number) =>
  instance.delete<ApiRespDto<null>>(`/lessons/me/${lessonId}`);

// 내 레슨 리스트
export const getMyLessonsReq = () =>
  instance.get<ApiRespDto<LessonDetail[]>>("/lessons/me");

// 내 레슨 상세 (단일 조회)
export const getMyLessonDetailReq = (lessonId: number) =>
  instance.get<ApiRespDto<MyLessonDetail>>(`/lessons/me/${lessonId}`);

// 레슨 방식 스타일 태그 목록
export const getLessonStyleTagsReq = async() =>
  instance.get<ApiRespDto<LessonStyleTagResponse[]>>("/lessons/style-tags");

// 스타일 배열 문제 때문에 가공 함수 추가
export const getLessonStyleTags = async (): Promise<LessonStyleTagResponse[]> => {
  const resp = await getLessonStyleTagsReq();
  const arr = resp.data.data;
  return Array.isArray(arr) ? arr : [];
}

// 스타일 태그(전체 교체)
export const setMyLessonStyleTagsReq = (
  lessonId: number,
  body: SetLessonStylesReq,
) =>
  instance.put<ApiRespDto<LessonDetail>>(
    `/lessons/me/${lessonId}/style-tag`,
    body,
  );

// 반복 규칙 조회
export const getMyLessonRecurrenceReq = (lessonId: number) =>
  instance.get<ApiRespDto<LessonRecurrenceResp>>(
    `/lessons/me/${lessonId}/recurrence`,
  );

// 반복 규칙 upsert + materialize
export const upsertMyLessonRecurrenceReq = (
  lessonId: number,
  body: LessonRecurrenceUpsertReq,
) =>
  instance.put<ApiRespDto<LessonRecurrenceResp>>(
    `/lessons/me/${lessonId}/recurrence`,
    body,
  );
