/** @jsxImportSource @emotion/react */
import { Link, useNavigate, useParams } from "react-router-dom";
import * as s from "./styles";
import ProfileAvatar from "../../../components/common/ProfileAvatar/ProfileAvatar";
import { useChatRooms } from "../../../hooks/chat/useChat";
import ChatRoomView from "./ChatRoomView";
import { formatChatListTime } from "../../../utils/chatFormat";

// 마이페이지 > 채팅 (/mypage/chats, /mypage/chats/:roomId)
// 넓은 화면: 왼쪽 목록 + 오른쪽 대화 / 좁은 화면: 목록 -> 대화 (한 번에 하나)
function ChatsPage() {
  const { roomId } = useParams();
  const currentId = Number(roomId) || null;
  const navigate = useNavigate();
  const roomsQ = useChatRooms();

  return (
    <div css={s.page}>
      <div css={s.header(!!currentId)}>
        <h1 css={s.title}>채팅</h1>
        <p css={s.desc}>아티스트가 레슨을 수락하거나 문의를 채팅으로 이어가면 대화할 수 있어요. 마지막 레슨(또는 문의로 열린 날)부터 14일이 지나면 읽기 전용이 돼요.</p>
      </div>

      <div css={s.layout}>
        <aside css={s.listPane(!!currentId)} aria-label="채팅 목록">
          {roomsQ.isLoading ? (
            <div css={s.stateBox}>불러오는 중...</div>
          ) : roomsQ.isError ? (
            <div css={s.stateBox}>
              목록을 불러오지 못했어요.
              <button type="button" css={s.textBtn} onClick={() => roomsQ.refetch()}>
                다시 불러오기
              </button>
            </div>
          ) : !roomsQ.data?.length ? (
            <div css={s.stateBox}>
              아직 대화방이 없어요.
              <span>레슨을 요청하고 아티스트가 수락하면 여기에서 대화할 수 있어요.</span>
              <Link to="/lessons" css={s.textBtn}>
                레슨 찾아보기
              </Link>
            </div>
          ) : (
            <ul css={s.roomList}>
              {roomsQ.data.map((r) => (
                <li key={r.chatRoomId}>
                  <button
                    type="button"
                    css={s.roomItem(r.chatRoomId === currentId)}
                    aria-current={r.chatRoomId === currentId ? "page" : undefined}
                    onClick={() => navigate(`/mypage/chats/${r.chatRoomId}`)}
                  >
                    <ProfileAvatar src={r.counterpartProfileImgUrl} name={r.counterpartName} size={44} />
                    <span css={s.roomText}>
                      <span css={s.roomTop}>
                        <strong>{r.counterpartName}</strong>
                        <span css={s.roleTag}>{r.myRole === "STUDENT" ? "아티스트" : "수강생"}</span>
                        <time>{formatChatListTime(r.lastMessageDt)}</time>
                      </span>
                      <span css={s.roomBottom}>
                        <span css={s.preview}>{r.lastMessage ?? (r.writable ? "첫 메시지를 보내보세요" : "대화 내용이 없어요")}</span>
                        {!r.writable && <span css={s.readOnlyTag}>{r.counterpartLeft ? "상대가 나감" : "읽기 전용"}</span>}
                        {r.unreadCount > 0 && (
                          <span css={s.unread} aria-label={`안 읽은 메시지 ${r.unreadCount}개`}>
                            {r.unreadCount > 99 ? "99+" : r.unreadCount}
                          </span>
                        )}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>

        <section css={s.roomPane(!!currentId)} aria-label="대화">
          {currentId ? (
            <ChatRoomView key={currentId} roomId={currentId} onBack={() => navigate("/mypage/chats")} />
          ) : (
            <div css={s.emptyRoom}>왼쪽에서 대화방을 골라주세요.</div>
          )}
        </section>
      </div>
    </div>
  );
}

export default ChatsPage;
