import type { OpenTimeSlotsParams } from "../../apis/lesson/timeSlotApis";

export const timeSlotKeys = {
  all: ["timeSlots"] as const,

  // 유저가 보는 예약 가능한 슬롯 목록
  openSlots: (lessonId: number, params?: OpenTimeSlotsParams) =>
    ["lessonOpenSlots", lessonId, params ?? "ALL"] as const,
};
