// 알림 타입
export type NotificationRefType = "RESERVATION" | "CHAT_ROOM";


// 예약 알림 타입
export type NotificationType =
  | "RESERVATION_REQUESTED"
  | "RESERVATION_CONFIRMED"
  | "RESERVATION_REJECTED"
  | "RESERVATION_CANCELED_BY_USER"
  | "RESERVATION_CANCELED_BY_ARTIST";


// 알림 resp 타입
export type NotificationResponse = {
    notificationId: number;
    type: NotificationType;
    title: string;
    content: string;
    refType: NotificationRefType | null;
    refId: number | null;
    isRead: boolean;
    createDt: string;
}