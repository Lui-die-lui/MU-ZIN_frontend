import type { TimeSlotResp } from "../../Types/lessonTypes";
import type { ApiRespDto } from "../../Types/responseType";
import type { TimePart } from "../../Types/searchForTimeTypes";
import { instance } from "../instance/instance";

export type OpenTimeSlotsParams = {
  from?: string;
  to?: string;
  daysOfWeek?: number[]; // 1~7
  timeParts?: TimePart[]; // "MORNING" | ...
};

// 타임슬롯 상태 및 조회 관련 api

// 유저용 타임슬롯 조회
// export const getOpenTimeSlotsReq = (
//   lessonId: number,
//   params: OpenTimeSlotsParams,
// ) => 
//   instance.get<ApiRespDto<TimeSlotResp[]>>(`/lessons/${lessonId}/time-slots`, {
//     params,
//   });
export const getOpenTimeSlotsReq = (lessonId: number, params: OpenTimeSlotsParams = {}) => {
  const sp = new URLSearchParams();
  // url 직렬화 문제 터질수도 있어서 해당 로직 사용

  if (params.from) sp.append("from", params.from);
  if (params.to) sp.append("to", params.to);

  params.daysOfWeek?.forEach((d) => sp.append("daysOfWeek", String(d)));
  params.timeParts?.forEach((tp) => sp.append("timeParts", tp));

  return instance.get<ApiRespDto<TimeSlotResp[]>>(`/lessons/${lessonId}/time-slots`, {
    params: sp,
  });
};

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
  instance.patch<ApiRespDto<null>>(
    `/lessons/me/time-slots/${timeSlotId}/close`,
  );
