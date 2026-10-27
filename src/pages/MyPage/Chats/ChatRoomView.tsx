/** @jsxImportSource @emotion/react */
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as s from "./styles";
import ProfileAvatar from "../../../components/common/ProfileAvatar/ProfileAvatar";
import {
  useChatMessages,
  useChatRoom,
  useDeleteChatMessage,
  useEditChatMessage,
  useLeaveChatRoom,
  useMarkChatRead,
  useSendChatMessage,
} from "../../../hooks/chat/useChat";
import CommonModal from "../../../components/common/CommonModal/CommonModal";
import { toast } from "../../../stores/useToastStore";
import { getChatMessagesReq } from "../../../apis/chat/chatApi";
import { CHAT_EDITABLE_HOURS, CHAT_MESSAGE_MAX, type ChatMessage } from "../../../Types/chatTypes";
import { usePrincipalState } from "../../../stores/usePrincipalState";
import { RESERVATION_STATUS_META } from "../Reservations/ReservationCard/StatusBadge/badgeUi";
import { formatMonthDay, formatTime } from "../../../utils/reservationFormat";
import { formatDateKey, formatDaySep } from "../../../utils/chatFormat";
import { getErrorMessage } from "../../../utils/errorUtils";
import type { ReservationStatus } from "../../../Types/reservationType";
import { modalBtn } from "../../../components/common/CommonModal/modalButtons";
import ReportButton from "../../../components/report/ReportButton";

const sameGroup = (a?: ChatMessage, b?: ChatMessage) =>
  !!a &&
  !!b &&
  a.senderUserId === b.senderUserId &&
  formatDateKey(a.createDt) === formatDateKey(b.createDt) &&
  formatTime(a.createDt) === formatTime(b.createDt);

const canEdit = (m: ChatMessage) => Date.now() - new Date(m.createDt).getTime() < CHAT_EDITABLE_HOURS * 3600_000;

// 내 메시지 오른쪽 클릭(또는 메뉴 키·Shift+F10, 모바일 길게 누르기) 메뉴: 수정 / 삭제
function MessageMenu({
  x,
  y,
  editable,
  onEdit,
  onDelete,
  onClose,
}: {
  x: number;
  y: number;
  editable: boolean;
  onEdit: () => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ left: x, top: y });

  // 화면 밖으로 나가지 않게
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const { width, height } = el.getBoundingClientRect();
    setPos({ left: Math.min(x, window.innerWidth - width - 8), top: Math.min(y, window.innerHeight - height - 8) });
    el.querySelector<HTMLButtonElement>("button:not(:disabled)")?.focus();
  }, [x, y]);

  useEffect(() => {
    const close = (e: Event) => {
      if (e.type === "keydown" && (e as KeyboardEvent).key !== "Escape") return;
      if (e.type === "mousedown" && ref.current?.contains(e.target as Node)) return;
      onClose();
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    window.addEventListener("resize", close);
    document.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", close);
      window.removeEventListener("resize", close);
      document.removeEventListener("scroll", close, true);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      role="menu"
      aria-label="메시지 메뉴"
      css={s.msgMenu}
      style={{ left: pos.left, top: pos.top }}
      onContextMenu={(e) => e.preventDefault()}
      onKeyDown={(e) => {
        if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
        e.preventDefault();
        const items = [...(ref.current?.querySelectorAll<HTMLButtonElement>("button:not(:disabled)") ?? [])];
        const i = items.indexOf(document.activeElement as HTMLButtonElement);
        items[(i + (e.key === "ArrowDown" ? 1 : items.length - 1)) % items.length]?.focus();
      }}
    >
      <button type="button" role="menuitem" css={s.msgMenuItem(false)} onClick={onEdit} disabled={!editable}>
        수정
        {!editable && <small>{CHAT_EDITABLE_HOURS}시간 지남</small>}
      </button>
      <button type="button" role="menuitem" css={s.msgMenuItem(true)} onClick={onDelete}>
        삭제
      </button>
    </div>
  );
}

// 대화방: 위 상대·예약 맥락 / 가운데 메시지(날짜별) / 아래 입력 (읽기 전용이면 안내)
function ChatRoomView({ roomId, onBack }: { roomId: number; onBack: () => void }) {
  const me = usePrincipalState((st) => st.principal?.userId ?? null);
  const roomQ = useChatRoom(roomId);
  const latestQ = useChatMessages(roomId);
  const sendM = useSendChatMessage();
  const readM = useMarkChatRead();
  const leaveM = useLeaveChatRoom();
  const [confirmLeave, setConfirmLeave] = useState(false);
  const editM = useEditChatMessage();
  const deleteM = useDeleteChatMessage();
  const [menu, setMenu] = useState<{ msg: ChatMessage; x: number; y: number } | null>(null);
  const [editing, setEditing] = useState<{ id: number; text: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<ChatMessage | null>(null);
  const closeMenu = useCallback(() => setMenu(null), []);

  const saveEdit = async () => {
    if (!editing || editM.isPending) return;
    const content = editing.text.trim();
    const orig = messages.find((m) => m.chatMessageId === editing.id);
    if (!content) return;
    if (content === orig?.content) {
      setEditing(null);
      return;
    }
    try {
      await editM.mutateAsync({ roomId, messageId: editing.id, content });
      setEditing(null);
    } catch (e) {
      toast.error(getErrorMessage(e, "메시지를 수정하지 못했어요."));
    }
  };

  const doDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteM.mutateAsync({ roomId, messageId: confirmDelete.chatMessageId });
      setConfirmDelete(null);
    } catch (e) {
      toast.error(getErrorMessage(e, "메시지를 삭제하지 못했어요."));
    }
  };

  const leave = async () => {
    try {
      await leaveM.mutateAsync(roomId);
      toast.success("대화방을 나갔어요.");
      onBack();
    } catch (e) {
      toast.error(getErrorMessage(e, "대화방을 나가지 못했어요."));
    }
  };

  const [older, setOlder] = useState<ChatMessage[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const nearBottom = useRef(true);
  const lastMarked = useRef(0);
  // 위쪽을 읽는 중에 새 메시지가 오면 "새 메시지" 버튼으로 알림
  const [newBelow, setNewBelow] = useState(false);

  const messages = useMemo(() => {
    const map = new Map<number, ChatMessage>();
    [...older, ...(latestQ.data ?? [])].forEach((m) => map.set(m.chatMessageId, m));
    return [...map.values()].sort((a, b) => a.chatMessageId - b.chatMessageId);
  }, [older, latestQ.data]);
  const lastId = messages.at(-1)?.chatMessageId ?? 0;
  const firstPageFull = (latestQ.data?.length ?? 0) >= 30;

  // 새 메시지: 아래쪽을 보고 있었거나 내가 보낸 거면 맨 아래로
  useLayoutEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const mine = messages.at(-1)?.senderUserId === me;
    if (nearBottom.current || mine) el.scrollTop = el.scrollHeight;
    else if (lastId) setNewBelow(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 마지막 메시지가 바뀔 때만
  }, [lastId, me]);

  const scrollToBottom = () => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    setNewBelow(false);
  };

  // 내 메시지 메뉴 열기 (오른쪽 클릭 · 메뉴 키 · "⋯" 버튼 공용)
  const openMenu = (msg: ChatMessage, x: number, y: number) => setMenu({ msg, x, y });

  // 열려 있는 방에 상대 메시지가 오면 읽음 처리
  useEffect(() => {
    if (!lastId || lastId <= lastMarked.current) return;
    lastMarked.current = lastId;
    readM.mutate({ roomId, lastMessageId: lastId });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 마지막 메시지가 바뀔 때만
  }, [lastId, roomId]);

  const loadOlder = async () => {
    if (!messages.length || loadingOlder) return;
    const el = scrollRef.current;
    const prevHeight = el?.scrollHeight ?? 0;
    setLoadingOlder(true);
    try {
      const page = await getChatMessagesReq(roomId, messages[0].chatMessageId);
      setOlder((prev) => [...page, ...prev]);
      if (page.length < 30) setHasMore(false);
      // 읽던 위치 유지
      requestAnimationFrame(() => {
        if (el) el.scrollTop = el.scrollHeight - prevHeight;
      });
    } catch (e) {
      setError(getErrorMessage(e, "이전 메시지를 불러오지 못했어요."));
    } finally {
      setLoadingOlder(false);
    }
  };

  const send = async () => {
    const content = text.trim();
    if (!content || sendM.isPending) return;
    setError(null);
    try {
      await sendM.mutateAsync({ roomId, content });
      setText("");
    } catch (e) {
      setError(getErrorMessage(e, "메시지를 보내지 못했어요."));
      roomQ.refetch(); // 읽기 전용으로 바뀌었을 수 있음
    }
  };

  if (roomQ.isError) {
    return (
      <div css={s.stateBox}>
        채팅방을 찾을 수 없어요.
        <button type="button" css={s.textBtn} onClick={onBack}>
          목록으로
        </button>
      </div>
    );
  }
  const room = roomQ.data;
  const upcoming = room?.reservations.find((r) => r.status === "CONFIRMED" || r.status === "COMPLETION_PENDING");
  const myLastSent = [...messages].reverse().find((m) => m.senderUserId === me);
  const seen = !!myLastSent && !!room?.lastReadIdOfCounterpart && room.lastReadIdOfCounterpart >= myLastSent.chatMessageId;

  return (
    <div css={s.room}>
      <header css={s.roomHeader}>
        <button type="button" css={s.backBtn} onClick={onBack} aria-label="채팅 목록으로">
          ←
        </button>
        {room && (
          <>
            <ProfileAvatar src={room.counterpartProfileImgUrl} name={room.counterpartName} size={36} />
            <div css={s.roomWho}>
              {room.counterpartArtistProfileId ? (
                <Link to={`/artists/${room.counterpartArtistProfileId}`}>{room.counterpartName}</Link>
              ) : (
                <strong>{room.counterpartName}</strong>
              )}
              <span>
                {upcoming
                  ? `${upcoming.status === "CONFIRMED" ? "확정된 레슨" : "완료 확인 중인 레슨"} · ${formatMonthDay(upcoming.startDt)} ${formatTime(upcoming.startDt)} ${upcoming.lessonTitle}`
                  : room.myRole === "STUDENT"
                    ? "아티스트"
                    : "수강생"}
              </span>
            </div>
            <ReportButton
              targetType="CHAT_ROOM"
              targetId={room.chatRoomId}
              targetName={room.counterpartName}
              targetUserId={room.counterpartUserId}
              buttonCss={s.headerBtn}
            />
            <button type="button" css={s.headerBtn} onClick={() => setConfirmLeave(true)}>
              나가기
            </button>
          </>
        )}
      </header>

      <CommonModal
        open={confirmLeave}
        title="대화방을 나갈까요?"
        onClose={() => setConfirmLeave(false)}
        footer={
          <>
            <button type="button" css={modalBtn("secondary")} onClick={() => setConfirmLeave(false)} disabled={leaveM.isPending}>
              취소
            </button>
            <button type="button" css={modalBtn("danger")} onClick={leave} disabled={leaveM.isPending}>
              {leaveM.isPending ? "나가는 중..." : "나가기"}
            </button>
          </>
        }
      >
        <p css={s.leaveText}>
          나가면 이 대화방의 메시지가 <strong>내 화면에서 모두 삭제되고 복원할 수 없어요.</strong> 상대에게는 대화방을 나갔다고 표시돼요.
          아티스트가 새 레슨을 수락하면 대화방이 다시 열리지만, 지금까지의 메시지는 보이지 않아요.
        </p>
      </CommonModal>

      {menu && (
        <MessageMenu
          x={menu.x}
          y={menu.y}
          editable={canEdit(menu.msg)}
          onClose={closeMenu}
          onEdit={() => {
            setEditing({ id: menu.msg.chatMessageId, text: menu.msg.content });
            setMenu(null);
          }}
          onDelete={() => {
            setConfirmDelete(menu.msg);
            setMenu(null);
          }}
        />
      )}

      <CommonModal
        open={!!confirmDelete}
        title="메시지를 삭제할까요?"
        onClose={() => setConfirmDelete(null)}
        footer={
          <>
            <button type="button" css={modalBtn("secondary")} onClick={() => setConfirmDelete(null)} disabled={deleteM.isPending}>
              취소
            </button>
            <button type="button" css={modalBtn("danger")} onClick={doDelete} disabled={deleteM.isPending}>
              {deleteM.isPending ? "삭제 중..." : "삭제"}
            </button>
          </>
        }
      >
        <p css={s.leaveText}>상대 화면에서도 "삭제된 메시지예요"로 바뀌고, 내용은 복원할 수 없어요.</p>
      </CommonModal>

      {room && room.reservations.length > 0 && (
        <ul css={s.contextRow} aria-label="이 상대와의 최근 예약">
          {room.reservations.map((r) => (
            <li key={r.reservationId}>
              {formatMonthDay(r.startDt)} · {r.lessonTitle} · {RESERVATION_STATUS_META[r.status as ReservationStatus]?.label ?? r.status}
            </li>
          ))}
        </ul>
      )}

      <div
        ref={scrollRef}
        css={s.messages}
        onScroll={(e) => {
          const el = e.currentTarget;
          nearBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
          if (nearBottom.current && newBelow) setNewBelow(false);
        }}
        aria-live="polite"
      >
        {latestQ.isLoading ? (
          <div css={s.stateBox}>메시지를 불러오는 중...</div>
        ) : latestQ.isError ? (
          <div css={s.stateBox}>
            메시지를 불러오지 못했어요.
            <button type="button" css={s.textBtn} onClick={() => latestQ.refetch()}>
              다시 불러오기
            </button>
          </div>
        ) : (
          <>
            {firstPageFull && hasMore && (
              <button type="button" css={s.olderBtn} onClick={loadOlder} disabled={loadingOlder}>
                {loadingOlder ? "불러오는 중..." : "이전 메시지 더 보기"}
              </button>
            )}
            {messages.length === 0 && <div css={s.emptyMessages}>아직 메시지가 없어요. 레슨 일정이나 준비물을 편하게 물어보세요.</div>}
            {messages.map((m, i) => {
              const mine = m.senderUserId === me;
              const prev = messages[i - 1];
              const next = messages[i + 1];
              const newDay = !prev || formatDateKey(prev.createDt) !== formatDateKey(m.createDt);
              // 같은 사람이 같은 분에 연달아 보낸 메시지는 한 묶음 (간격 좁게, 시간은 마지막에만)
              const groupStart = newDay || !sameGroup(prev, m);
              const groupEnd = !sameGroup(m, next);
              const isLastMine = mine && m.chatMessageId === myLastSent?.chatMessageId;
              const edited = !!m.editedDt && !m.deleted;
              const showMeta = groupEnd || (isLastMine && seen) || edited;
              return (
                <div key={m.chatMessageId}>
                  {newDay && (
                    <div css={s.daySep}>
                      <span>{formatDaySep(m.createDt)}</span>
                    </div>
                  )}
                  <div css={s.msgRow(mine, groupStart)}>
                    {editing?.id === m.chatMessageId ? (
                      <div css={s.editBox}>
                        <label htmlFor="chat-edit" css={s.srOnly}>
                          메시지 수정
                        </label>
                        <textarea
                          id="chat-edit"
                          css={s.input}
                          autoFocus
                          rows={2}
                          maxLength={CHAT_MESSAGE_MAX}
                          value={editing.text}
                          onChange={(e) => setEditing({ id: m.chatMessageId, text: e.target.value })}
                          onFocus={(e) => e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length)}
                          onKeyDown={(e) => {
                            if (e.key === "Escape") setEditing(null);
                            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                              e.preventDefault();
                              void saveEdit();
                            }
                          }}
                        />
                        <div css={s.editActions}>
                          <span>Esc 취소 · Enter 저장</span>
                          <button type="button" css={s.headerBtn} onClick={() => setEditing(null)} disabled={editM.isPending}>
                            취소
                          </button>
                          <button type="button" css={s.sendBtn} onClick={saveEdit} disabled={!editing.text.trim() || editM.isPending}>
                            {editM.isPending ? "저장 중..." : "저장"}
                          </button>
                        </div>
                      </div>
                    ) : m.deleted ? (
                      <p css={s.deletedBubble}>삭제된 메시지예요.</p>
                    ) : (
                      <p
                        css={s.bubble(mine, groupStart)}
                        tabIndex={mine ? 0 : undefined}
                        aria-haspopup={mine ? "menu" : undefined}
                        title={mine ? "오른쪽 클릭해서 수정·삭제" : undefined}
                        onContextMenu={
                          mine
                            ? (e) => {
                                e.preventDefault();
                                // 키보드(메뉴 키·Shift+F10)로 열면 좌표가 0 -> 말풍선 옆에
                                const r = e.currentTarget.getBoundingClientRect();
                                const byKey = e.clientX === 0 && e.clientY === 0;
                                openMenu(m, byKey ? r.left : e.clientX, byKey ? r.bottom + 4 : e.clientY);
                              }
                            : undefined
                        }
                      >
                        {m.content}
                      </p>
                    )}
                    {editing?.id !== m.chatMessageId && (
                      <span css={s.msgSide(mine)}>
                        {/* 오른쪽 클릭을 모르거나 터치 화면이어도 수정·삭제할 수 있게 */}
                        {mine && !m.deleted && room?.writable && (
                          <button
                            type="button"
                            css={s.moreBtn}
                            data-more
                            aria-label="메시지 메뉴"
                            aria-haspopup="menu"
                            onClick={(e) => {
                              const r = e.currentTarget.getBoundingClientRect();
                              openMenu(m, r.left, r.bottom + 4);
                            }}
                          >
                            ⋯
                          </button>
                        )}
                        {showMeta && (
                          <span css={s.msgMeta}>
                            {isLastMine && seen && <b>읽음</b>}
                            {edited && <span>수정됨</span>}
                            {groupEnd && <time>{formatTime(m.createDt)}</time>}
                          </span>
                        )}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>

      {newBelow && (
        <div css={s.newBelowWrap}>
          <button type="button" css={s.newBelowBtn} onClick={scrollToBottom}>
            새 메시지 ↓
          </button>
        </div>
      )}

      {room && !room.writable ? (
        <div css={s.readOnly} role="status">
          <strong>읽기 전용</strong>
          {room.counterpartLeft
            ? "상대가 대화방을 나갔어요. 메시지를 보낼 수 없어요."
            : "대화할 수 있는 기간이 지났어요. 아티스트가 새 레슨을 수락하면 다시 대화할 수 있어요."}
        </div>
      ) : (
        <div css={s.composer}>
          {room?.writableUntil && (
            <p css={s.untilNote}>
              {formatMonthDay(room.writableUntil)} {formatTime(room.writableUntil)}까지 대화할 수 있어요
            </p>
          )}
          {error && (
            <p css={s.error} role="alert">
              {error}
            </p>
          )}
          <div css={s.inputRow}>
            <label htmlFor="chat-input" css={s.srOnly}>
              메시지
            </label>
            <textarea
              id="chat-input"
              css={s.input}
              rows={1}
              maxLength={CHAT_MESSAGE_MAX}
              placeholder="메시지 입력 (Shift+Enter 줄바꿈)"
              value={text}
              disabled={!room}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  void send();
                }
              }}
            />
            <button type="button" css={s.sendBtn} onClick={send} disabled={!text.trim() || sendM.isPending || !room}>
              보내기
            </button>
          </div>
          {text.length > CHAT_MESSAGE_MAX - 100 && (
            <span css={s.counter}>
              {text.length}/{CHAT_MESSAGE_MAX}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

export default ChatRoomView;
