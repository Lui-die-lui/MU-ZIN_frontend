import { instance } from "../instance/instance";
import type { ReportReason, ReportTargetType } from "../../Types/adminTypes";

// 신고하기 (로그인 필요). 같은 대상은 한 번만 (409 ALREADY_REPORTED), 하루 10건까지 (429)
//  targetId: ARTIST=아티스트 프로필 ID / CHAT_ROOM=대화방 ID / REVIEW=리뷰 ID / INQUIRY=문의 ID
export const createReportReq = async (body: {
  targetType: ReportTargetType;
  targetId: number;
  reason: ReportReason;
  detail?: string;
}) => {
  await instance.post("/reports", body);
};
