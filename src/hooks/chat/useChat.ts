import { useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";
import {
  createInquiryReq,
  deleteChatMessageReq,
  editChatMessageReq,
  getChatMessagesReq,
  getReceivedInquiriesReq,
  getSentInquiriesReq,
  inquiryToChatReq,
  leaveChatRoomReq,
  replyInquiryReq,
  getChatRoomReq,
  getChatRoomsReq,
  getChatUnreadCountReq,
  markChatReadReq,
  sendChatMessageReq,
} from "../../apis/chat/chatApi";
import type { ChatMessage, ChatRoom } from "../../Types/chatTypes";

export const chatKeys = {
  all: ["chat"] as const,
  rooms: () => [...chatKeys.all, "rooms"] as const,
  room: (roomId: number) => [...chatKeys.all, "room", roomId] as const,
  messages: (roomId: number) => [...chatKeys.all, "messages", roomId] as const,
  unread: () => [...chatKeys.all, "unread"] as const,
  inquiriesSent: () => [...chatKeys.all, "inquiries", "sent"] as const,
  inquiriesReceived: () => [...chatKeys.all, "inquiries", "received"] as const,
};

export const useChatRooms = (enabled = true) => useQuery({ queryKey: chatKeys.rooms(), queryFn: getChatRoomsReq, enabled });

export const useChatRoom = (roomId: number | null) =>
  useQuery({ queryKey: chatKeys.room(roomId ?? 0), queryFn: () => getChatRoomReq(roomId!), enabled: !!roomId, retry: false });

// 새 메시지는 WebSocket 으로 바로 반영 (realtime/ChatRealtime). 2분 확인은 연결이 끊겼을 때를 위한 안전장치
export const useChatUnread = (enabled: boolean) =>
  useQuery({ queryKey: chatKeys.unread(), queryFn: getChatUnreadCountReq, enabled, refetchInterval: 120_000 });

export const useChatMessages = (roomId: number | null) =>
  useQuery({ queryKey: chatKeys.messages(roomId ?? 0), queryFn: () => getChatMessagesReq(roomId!), enabled: !!roomId });

// 메시지 하나를 캐시에 넣음 (보낸 응답·실시간 수신 둘 다 와도 한 번만)
// 같은 id 가 이미 있으면 덮어씀 -> 수정·삭제도 같은 경로로 반영
export function appendMessage(qc: QueryClient, msg: ChatMessage) {
  qc.setQueryData<ChatMessage[]>(chatKeys.messages(msg.chatRoomId), (prev) => {
    if (!prev) return prev; // 아직 안 연 방은 열 때 불러옴
    const i = prev.findIndex((m) => m.chatMessageId === msg.chatMessageId);
    if (i >= 0) {
      const next = [...prev];
      next[i] = msg;
      return next;
    }
    return [...prev, msg].sort((a, b) => a.chatMessageId - b.chatMessageId);
  });
}

// 상대가 어디까지 읽었는지 (실시간) -> 내 화면 "읽음" 표시를 바로 갱신
export function applyCounterpartRead(qc: QueryClient, roomId: number, lastReadId: number) {
  qc.setQueryData<ChatRoom>(chatKeys.room(roomId), (prev) =>
    prev && (prev.lastReadIdOfCounterpart ?? 0) < lastReadId ? { ...prev, lastReadIdOfCounterpart: lastReadId } : prev,
  );
}

// 수정·삭제: 응답을 캐시에 덮어쓰고 목록 미리보기 갱신
export const useEditChatMessage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: editChatMessageReq,
    onSuccess: (msg) => {
      appendMessage(qc, msg);
      qc.invalidateQueries({ queryKey: chatKeys.rooms() });
    },
  });
};

export const useDeleteChatMessage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteChatMessageReq,
    onSuccess: (msg) => {
      appendMessage(qc, msg);
      qc.invalidateQueries({ queryKey: chatKeys.rooms() });
    },
  });
};

export const useSendChatMessage = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: sendChatMessageReq,
    onSuccess: (msg) => {
      appendMessage(qc, msg);
      qc.invalidateQueries({ queryKey: chatKeys.rooms() });
    },
  });
};

export const useMarkChatRead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: markChatReadReq,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: chatKeys.rooms() });
      qc.invalidateQueries({ queryKey: chatKeys.unread() });
    },
  });
};

export const useLeaveChatRoom = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: leaveChatRoomReq,
    onSuccess: (_d, roomId) => {
      qc.removeQueries({ queryKey: chatKeys.messages(roomId) });
      qc.removeQueries({ queryKey: chatKeys.room(roomId) });
      qc.invalidateQueries({ queryKey: chatKeys.rooms() });
      qc.invalidateQueries({ queryKey: chatKeys.unread() });
    },
  });
};

// ---------- 레슨 문의 ----------
export const useSentInquiries = (enabled = true) =>
  useQuery({ queryKey: chatKeys.inquiriesSent(), queryFn: getSentInquiriesReq, enabled });

export const useReceivedInquiries = (enabled = true) =>
  useQuery({ queryKey: chatKeys.inquiriesReceived(), queryFn: getReceivedInquiriesReq, enabled });

const useInvalidateInquiries = () => {
  const qc = useQueryClient();
  return () =>
    Promise.all([
      qc.invalidateQueries({ queryKey: [...chatKeys.all, "inquiries"] }),
      qc.invalidateQueries({ queryKey: chatKeys.rooms() }),
    ]);
};

export const useCreateInquiry = () => {
  const invalidate = useInvalidateInquiries();
  return useMutation({ mutationFn: createInquiryReq, onSuccess: invalidate });
};

export const useReplyInquiry = () => {
  const invalidate = useInvalidateInquiries();
  return useMutation({ mutationFn: replyInquiryReq, onSuccess: invalidate });
};

export const useInquiryToChat = () => {
  const invalidate = useInvalidateInquiries();
  return useMutation({ mutationFn: inquiryToChatReq, onSuccess: invalidate });
};
