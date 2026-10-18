import { useEffect } from "react";
import { Client } from "@stomp/stompjs";
import { useQueryClient } from "@tanstack/react-query";
import { usePrincipalState } from "../stores/usePrincipalState";
import { appendMessage, applyCounterpartRead, chatKeys } from "../hooks/chat/useChat";
import type { ChatMessage, ChatReadSignal } from "../Types/chatTypes";

// 실시간 채팅 연결 (앱에 하나, 로그인했을 때만)
// - ws://<API>/ws 에 STOMP 로 연결, CONNECT 헤더에 JWT
// - /user/queue/chat 으로 오는 새 메시지·수정·삭제를 캐시에 바로 반영 (열린 방 메시지, 방 목록, 안 읽은 수)
// - /user/queue/chat-read 로 상대가 읽은 위치가 오면 "읽음" 표시를 바로 갱신
// - 끊기면 5초 뒤 자동 재연결, 다시 연결되면 방 목록·안 읽은 수를 새로 불러와 빠진 메시지를 맞춤
const chatSocketUrl = () => `${String(import.meta.env.VITE_API_BASE_URL).replace(/^http/, "ws").replace(/\/$/, "")}/ws`;

function ChatRealtime() {
  const userId = usePrincipalState((st) => st.principal?.userId ?? null);
  const qc = useQueryClient();

  useEffect(() => {
    if (!userId) return;
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const client = new Client({
      brokerURL: chatSocketUrl(),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      heartbeatIncoming: 20000,
      heartbeatOutgoing: 20000,
    });

    client.onConnect = () => {
      client.subscribe("/user/queue/chat", (frame) => {
        const msg = JSON.parse(frame.body) as ChatMessage;
        appendMessage(qc, msg);
        qc.invalidateQueries({ queryKey: chatKeys.rooms() });
        qc.invalidateQueries({ queryKey: chatKeys.room(msg.chatRoomId) });
        if (msg.senderUserId !== userId) qc.invalidateQueries({ queryKey: chatKeys.unread() });
      });
      client.subscribe("/user/queue/chat-read", (frame) => {
        const r = JSON.parse(frame.body) as ChatReadSignal;
        applyCounterpartRead(qc, r.chatRoomId, r.lastReadId);
      });
      // 끊겨 있던 동안 온 메시지 반영
      qc.invalidateQueries({ queryKey: chatKeys.all });
    };

    client.activate();
    return () => {
      void client.deactivate();
    };
  }, [userId, qc]);

  return null;
}

export default ChatRealtime;
