import type { TimeSlotResp } from "../../Types/lessonTypes";
import type { ApiRespDto } from "../../Types/responseType";
import { instance } from "../instance/instance";

// 타임슬롯 상태 및 조회 관련 api

// 유저용 타임슬롯 조회
export const getOpenTimeSlotsReq = (
  lessonId: number,
  params: { from: string; to: string },
) =>
  instance.get<ApiRespDto<TimeSlotResp[]>>(`/lessons/${lessonId}/time-slots`, {
    params,
  });

// 아티스트용 타임슬롯 전체 조회
export const getMyTimeSlotsReq = (
  lessonId: number,
  params: { from: string; to: string },
) =>
  instance.get<ApiRespDto<TimeSlotResp[]>>(
    `/lessons/me/${lessonId}/time-slots`,
    { params },
  );

// 타임 슬롯 삭제
export const deleteMyTimeSlotsReq = (timeSlotId: number) =>
  instance.delete<ApiRespDto<null>>(`/lessons/me/time-slots/${timeSlotId}`);

// 레슨 타임슬롯 open/close
export const openMyTimeSlotsReq = (timeSlotId: number) =>
  instance.patch<ApiRespDto<null>>(`/lessons/me/time-slots/${timeSlotId}/open`);

export const closeMyTimeSlotsReq = (timeSlotId: number) =>
  instance.patch<ApiRespDto<null>>(`/lessons/me/time-slots/${timeSlotId}/close`);