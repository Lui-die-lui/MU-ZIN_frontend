// 알림 타입
export type NotificationRefType = "RESERVATION" | "CHAT_ROOM" | "REVIEW" | "INQUIRY";


// 예약 알림 타입
export type NotificationType =
  | "RESERVATION_REQUESTED"
  | "RESERVATION_CONFIRMED"
  | "RESERVATION_REJECTED"
  | "RESERVATION_CANCELED_BY_USER"
  | "RESERVATION_CANCELED_BY_ARTIST"
  | "RESERVATION_COMPLETION_PENDING"
  | "RESERVATION_COMPLETED"
  | "RESERVATION_EXPIRED"
  | "REVIEW_CREATED" // 내 레슨에 리뷰가 달림 (아티스트)
  | "REVIEW_REPLIED" // 내 리뷰에 아티스트 답글
  | "INQUIRY_CREATED" // 새 레슨 문의 (아티스트)
  | "INQUIRY_REPLIED" // 문의 답변
  | "INQUIRY_TO_CHAT" // 문의가 채팅으로 이어짐
  | "ARTIST_APPROVED" // 아티스트 신청 승인
  | "ARTIST_REJECTED"; // 아티스트 신청 반려


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