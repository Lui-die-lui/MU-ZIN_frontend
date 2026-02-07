import type { NotificationResponse } from "../../Types/notificationTypes";
import type { ApiRespDto } from "../../Types/responseType";
import { instance } from "../instance/instance";

// 안읽은 알림 갯수
export const getMyUnreadCountReq = () =>
  instance.get<ApiRespDto<number>>("/notifications/me/unread-count");

// 알림 받기
export const getMyNotificationsReq = () =>
  instance.get<ApiRespDto<NotificationResponse[]>>("/notifications/me");

// 알림 읽음 처리
export const markReadReq = (notificationId: number) =>
  instance.patch<ApiRespDto<null>>(`/notifications/me/${notificationId}/read`);

// 알림 읽음 전체 처리
export const markAllReadReq = () =>
  instance.patch<ApiRespDto<null>>("/notifications/me/read-all");
