// 수강생 <-> 아티스트 1:1 채팅

export type ChatReservationSummary = {
  reservationId: number;
  lessonTitle: string;
  startDt: string;
  endDt: string;
  status: string;
};

export type ChatRoom = {
  chatRoomId: number;
  myRole: "STUDENT" | "ARTIST";
  counterpartUserId: number;
  counterpartName: string;
  counterpartProfileImgUrl: string | null;
  counterpartArtistProfileId: number | null; // 상대가 아티스트일 때
  lastMessage: string | null;
  lastMessageDt: string | null;
  unreadCount: number;
  writable: boolean; // 아무도 안 나감 + (진행 중 확정 예약 / 마지막 완료 레슨 후 14일 / 아티스트가 문의를 채팅으로 넘긴 뒤 14일)
  counterpartLeft: boolean; // 상대가 대화방을 나감
  writableUntil: string | null; // 진행 중 예약이 없을 때 대화 가능 마감
  lastReadIdOfCounterpart: number | null; // 상대가 읽은 마지막 메시지 (읽음 표시)
  reservations: ChatReservationSummary[]; // 방 상세에서만
};

export type ChatMessage = {
  chatMessageId: number;
  chatRoomId: number;
  senderUserId: number;
  content: string; // 삭제된 메시지는 ""
  createDt: string;
  editedDt: string | null; // 수정했으면 "수정됨"
  deleted: boolean; // "삭제된 메시지예요"
};

export const CHAT_MESSAGE_MAX = 1000;
export const CHAT_EDITABLE_HOURS = 24; // 보낸 지 24시간 안에만 수정 (삭제는 언제든)

// 실시간 읽음 알림 (/user/queue/chat-read)
export type ChatReadSignal = { chatRoomId: number; lastReadId: number };
export const CHAT_WRITABLE_DAYS = 14;

// 레슨 문의 (질문 1개 + 답변 1개, 아티스트가 원하면 채팅으로)
export type Inquiry = {
  inquiryId: number;
  myRole: "SENDER" | "ARTIST";
  artistProfileId: number;
  artistName: string;
  artistProfileImgUrl: string | null;
  userId: number;
  userName: string;
  userProfileImgUrl: string | null;
  content: string;
  replyContent: string | null;
  repliedDt: string | null;
  status: "OPEN" | "REPLIED" | "CHAT";
  chatRoomId: number | null;
  createDt: string;
};

export const INQUIRY_MAX = 1000;
