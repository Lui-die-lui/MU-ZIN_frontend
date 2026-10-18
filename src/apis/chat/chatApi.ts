import type { ApiRespDto } from "../../Types/responseType";
import type { ChatMessage, ChatRoom, Inquiry } from "../../Types/chatTypes";
import { instance } from "../instance/instance";

// 채팅 (로그인 필요, 참여자만). 보내기는 REST, 받기는 WebSocket(realtime/chatSocket)

export const getChatRoomsReq = async () => (await instance.get<ApiRespDto<ChatRoom[]>>("/chats")).data.data;

export const getChatRoomReq = async (roomId: number) => (await instance.get<ApiRespDto<ChatRoom>>(`/chats/${roomId}`)).data.data;

export const getChatUnreadCountReq = async () =>
  (await instance.get<ApiRespDto<{ unreadCount: number }>>("/chats/unread-count")).data.data.unreadCount;

export const getChatRoomIdByReservationReq = async (reservationId: number) =>
  (await instance.get<ApiRespDto<{ chatRoomId: number }>>(`/chats/by-reservation/${reservationId}`)).data.data.chatRoomId;

// 최신 30개 / beforeId 이전 30개 (시간순)
export const getChatMessagesReq = async (roomId: number, beforeId?: number) =>
  (await instance.get<ApiRespDto<ChatMessage[]>>(`/chats/${roomId}/messages`, { params: beforeId ? { beforeId } : {} })).data.data;

export const sendChatMessageReq = async ({ roomId, content }: { roomId: number; content: string }) =>
  (await instance.post<ApiRespDto<ChatMessage>>(`/chats/${roomId}/messages`, { content })).data.data;

// 내 메시지 수정 (보낸 지 24시간 안) / 삭제 (언제든). 응답은 바뀐 메시지
export const editChatMessageReq = async ({ roomId, messageId, content }: { roomId: number; messageId: number; content: string }) =>
  (await instance.patch<ApiRespDto<ChatMessage>>(`/chats/${roomId}/messages/${messageId}`, { content })).data.data;

export const deleteChatMessageReq = async ({ roomId, messageId }: { roomId: number; messageId: number }) =>
  (await instance.delete<ApiRespDto<ChatMessage>>(`/chats/${roomId}/messages/${messageId}`)).data.data;

export const markChatReadReq = async ({ roomId, lastMessageId }: { roomId: number; lastMessageId: number }) => {
  await instance.post(`/chats/${roomId}/read`, { lastMessageId });
};

// 나가기: 내 화면에서 메시지가 지워지고 복원되지 않음 (둘 다 나가면 방 삭제)
export const leaveChatRoomReq = async (roomId: number) => {
  await instance.post(`/chats/${roomId}/leave`);
};

// ---------- 레슨 문의 ----------
export const createInquiryReq = async (body: { artistProfileId: number; content: string }) =>
  (await instance.post<ApiRespDto<Inquiry>>("/inquiries", body)).data.data;

export const getSentInquiriesReq = async () => (await instance.get<ApiRespDto<Inquiry[]>>("/inquiries/sent")).data.data;

export const getReceivedInquiriesReq = async () => (await instance.get<ApiRespDto<Inquiry[]>>("/inquiries/received")).data.data;

export const replyInquiryReq = async ({ inquiryId, content }: { inquiryId: number; content: string }) =>
  (await instance.post<ApiRespDto<Inquiry>>(`/inquiries/${inquiryId}/reply`, { content })).data.data;

export const inquiryToChatReq = async (inquiryId: number) =>
  (await instance.post<ApiRespDto<Inquiry>>(`/inquiries/${inquiryId}/to-chat`)).data.data;
