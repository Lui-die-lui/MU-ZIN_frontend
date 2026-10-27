/** @jsxImportSource @emotion/react */
import { useState } from "react";
import { Link } from "react-router-dom";
import * as s from "./styles";
import { useChatRooms } from "../../../../hooks/chat/useChat";
import { useMyReservationList } from "../../../../hooks/reservation/useMyReservation";
import { useMyLessonList } from "../../../../hooks/Lesson/useLessonEdit";
import { useWritableReviews } from "../../../../hooks/review/useReviews";
import { usePrincipalState } from "../../../../stores/usePrincipalState";
import { formatChatListTime } from "../../../../utils/chatFormat";
import { formatMonthDay, formatTime } from "../../../../utils/reservationFormat";
import { RESERVATION_STATUS_META } from "../../Reservations/ReservationCard/StatusBadge/badgeUi";

type MiniItem = { id: string | number; title: string; sub?: string };

type CardProps = {
  to: string;
  title: string;
  tag: string;
  count: number;
  countLabel: string; // 읽는 사람용 (예: "안 읽은 메시지 3개")
  alert?: boolean;
  items: MiniItem[];
  empty: string;
  isLoading: boolean;
  isError: boolean;
};

// 카드 전체가 해당 화면으로 가는 링크
function SummaryCard({ to, title, tag, count, countLabel, alert, items, empty, isLoading, isError }: CardProps) {
  return (
    <Link to={to} css={s.card} aria-label={`${title} - ${countLabel}`}>
      {alert && <span css={s.dot} aria-hidden="true" />}
      <div css={s.titleRow}>
        <div css={s.title}>{title}</div>
        <span css={s.pill}>{tag}</span>
      </div>

      {isLoading ? (
        <div css={s.list} aria-hidden="true">
          <span css={s.skeleton} />
          <span css={s.skeleton} />
        </div>
      ) : isError ? (
        <div css={s.empty}>불러오지 못했어요</div>
      ) : items.length === 0 ? (
        <div css={s.empty}>{empty}</div>
      ) : (
        <div css={s.list}>
          {items.slice(0, 2).map((it) => (
            <div key={it.id} css={s.row}>
              <span css={s.bullet} />
              <span css={s.text}>{it.title}</span>
              {it.sub && <span css={s.sub}>{it.sub}</span>}
            </div>
          ))}
        </div>
      )}

      <div css={s.footer}>
        <span css={s.more}>바로가기 →</span>
        <span css={s.count}>{isLoading || isError ? "–" : count}</span>
      </div>
    </Link>
  );
}

// 마이페이지 홈 요약: 메시지 / 다가오는 예약 / (아티스트) 내 레슨 · (그 외) 작성할 리뷰
function SummaryCards() {
  const isArtist = usePrincipalState((st) => st.principal?.artistStatus === "APPROVED");

  // 화면을 연 시각 기준으로 "다가오는" 예약을 거름
  const [now] = useState(() => Date.now());

  const roomsQ = useChatRooms();
  const resQ = useMyReservationList("all");
  const lessonsQ = useMyLessonList(isArtist);
  const reviewsQ = useWritableReviews(!isArtist);

  // 메시지: 안 읽은 방 먼저, 그다음 최근 대화 순
  const rooms = [...(roomsQ.data ?? [])].sort(
    (a, b) =>
      Number(b.unreadCount > 0) - Number(a.unreadCount > 0) ||
      (b.lastMessageDt ?? "").localeCompare(a.lastMessageDt ?? ""),
  );
  const unreadTotal = rooms.reduce((sum, r) => sum + r.unreadCount, 0);
  const messageItems: MiniItem[] = rooms
    .filter((r) => r.lastMessage)
    .map((r) => ({
      id: r.chatRoomId,
      title: `${r.counterpartName}: ${r.lastMessage}`,
      sub: r.unreadCount > 0 ? `${r.unreadCount}개 안 읽음` : formatChatListTime(r.lastMessageDt),
    }));

  // 예약: 아직 끝나지 않은 요청·확정 예약을 가까운 순으로
  const upcoming = (resQ.data ?? [])
    .filter((r) => (r.status === "REQUESTED" || r.status === "CONFIRMED") && new Date(r.timeSlot.endDt).getTime() > now)
    .sort((a, b) => a.timeSlot.startDt.localeCompare(b.timeSlot.startDt));
  const reservationItems: MiniItem[] = upcoming.map((r) => ({
    id: r.reservationId,
    title: `${r.lessonTitle} · ${RESERVATION_STATUS_META[r.status]?.label ?? r.status}`,
    sub: `${formatMonthDay(r.timeSlot.startDt)} ${formatTime(r.timeSlot.startDt)}`,
  }));
  const hasRequested = upcoming.some((r) => r.status === "REQUESTED");

  return (
    <div css={s.wrap}>
      <SummaryCard
        to="/mypage/chats"
        title="메시지"
        tag="읽지 않음"
        count={unreadTotal}
        countLabel={`안 읽은 메시지 ${unreadTotal}개`}
        alert={unreadTotal > 0}
        items={messageItems}
        empty="아직 대화가 없어요"
        isLoading={roomsQ.isLoading}
        isError={roomsQ.isError}
      />

      <SummaryCard
        to="/mypage/reservations"
        title="예약"
        tag="다가오는"
        count={upcoming.length}
        countLabel={`다가오는 예약 ${upcoming.length}개`}
        alert={hasRequested}
        items={reservationItems}
        empty="예정된 예약이 없어요"
        isLoading={resQ.isLoading}
        isError={resQ.isError}
      />

      {isArtist ? (
        (() => {
          const lessons = (lessonsQ.data ?? []).filter((l) => !l.deleted);
          const pending = lessons.reduce((sum, l) => sum + l.pendingRequestCount, 0);
          // 요청이 쌓인 레슨 먼저
          const items: MiniItem[] = [...lessons]
            .sort((a, b) => b.pendingRequestCount - a.pendingRequestCount)
            .map((l) => ({
              id: l.lessonId,
              title: l.title,
              sub: l.pendingRequestCount > 0 ? `요청 ${l.pendingRequestCount}건` : l.status === "ACTIVE" ? "공개" : "비공개",
            }));
          return (
            <SummaryCard
              to={pending > 0 ? "/mypage/reservations/requests" : "/mypage/artist/manage"}
              title="레슨"
              tag="내 레슨"
              count={lessons.length}
              countLabel={`내 레슨 ${lessons.length}개${pending > 0 ? `, 대기 중인 요청 ${pending}건` : ""}`}
              alert={pending > 0}
              items={items}
              empty="등록된 레슨이 없어요"
              isLoading={lessonsQ.isLoading}
              isError={lessonsQ.isError}
            />
          );
        })()
      ) : (
        <SummaryCard
          to="/mypage/reviews"
          title="리뷰"
          tag="작성 가능"
          count={reviewsQ.data?.length ?? 0}
          countLabel={`작성할 수 있는 리뷰 ${reviewsQ.data?.length ?? 0}개`}
          alert={(reviewsQ.data?.length ?? 0) > 0}
          items={(reviewsQ.data ?? []).map((r) => ({
            id: r.reservationId,
            title: `${r.lessonTitle} · ${r.artistName}`,
            sub: `${formatMonthDay(r.writableUntil)}까지`,
          }))}
          empty="작성할 리뷰가 없어요"
          isLoading={reviewsQ.isLoading}
          isError={reviewsQ.isError}
        />
      )}
    </div>
  );
}

export default SummaryCards;
