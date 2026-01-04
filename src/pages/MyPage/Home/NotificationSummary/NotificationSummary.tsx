/** @jsxImportSource @emotion/react */
import * as s from "./styles";
type MiniItem = {
  id: string;
  title: string;
  sub?: string; // 시간/상태/날짜 등
};

type Props = {
  // 메시지
  unreadMessageCount?: number;
  messagePreview?: MiniItem[];
  onClickMessages?: () => void;

  // 예약
  reservationCount?: number; // 예: 진행/예정 예약 수
  reservationPreview?: MiniItem[];
  hasReservationAlert?: boolean; // 빨간 점 띄울지
  onClickReservations?: () => void;

  // 레슨
  lessonCount?: number; // 예: 내 레슨 개수(활성/전체 등)
  lessonPreview?: MiniItem[];
  hasLessonAlert?: boolean; // 빨간 점 띄울지
  onClickLessons?: () => void;
};

function SummaryCards({
  unreadMessageCount = 3,
  messagePreview,
  onClickMessages,

  reservationCount = 1,
  reservationPreview,
  hasReservationAlert = false,
  onClickReservations,

  lessonCount = 2,
  lessonPreview,
  hasLessonAlert = false,
  onClickLessons,
}: Props) {
  // 더미 (API 붙이면 props로 덮어쓰면 됨)
  const demoMessages: MiniItem[] = [
    { id: "m1", title: "새 메시지가 도착했어요", sub: "방금" },
    { id: "m2", title: "레슨 문의가 왔어요", sub: "2시간 전" },
  ];

  const demoReservations: MiniItem[] = [
    { id: "r1", title: "예약 확정", sub: "1/04 19:00" },
    { id: "r2", title: "예약 대기", sub: "1/05 15:30" },
  ];

  const demoLessons: MiniItem[] = [
    { id: "l1", title: "기본기 위주 레슨", sub: "활성" },
    { id: "l2", title: "곡 해석 & 테크닉", sub: "비활성" },
  ];

  const msgList = messagePreview ?? demoMessages;
  const resList = reservationPreview ?? demoReservations;
  const lesList = lessonPreview ?? demoLessons;

  const showMsgDot = unreadMessageCount > 0;
  const showResDot = hasReservationAlert;
  const showLesDot = hasLessonAlert;

  return (
    <div css={s.wrap}>
      {/* ===== 메시지 카드 ===== */}
      <button
        type="button"
        css={s.card("message")}
        onClick={onClickMessages}
        style={{ textAlign: "left" }}
      >
        {showMsgDot && <span css={s.dot} />}
        <div css={s.titleRow}>
          <div css={s.title}>메시지</div>
          <span css={s.pill} as="span" style={{ cursor: "default" }}>
            읽지 않음
          </span>
        </div>

        {msgList.length === 0 ? (
          <div css={s.empty}>새 알림이 없어요</div>
        ) : (
          <div css={s.list}>
            {msgList.slice(0, 2).map((it) => (
              <div key={it.id} css={s.row}>
                <span css={s.bullet} />
                <span css={s.text}>{it.title}</span>
                {it.sub && <span css={s.sub}>{it.sub}</span>}
              </div>
            ))}
          </div>
        )}

        <div css={s.count}>{unreadMessageCount}</div>
      </button>

      {/* ===== 예약 카드 ===== */}
      <button
        type="button"
        css={s.card("reservation")}
        onClick={onClickReservations}
        style={{ textAlign: "left" }}
      >
        {showResDot && <span css={s.dot} />}
        <div css={s.titleRow}>
          <div css={s.title}>예약</div>
          <span css={s.pill} as="span" style={{ cursor: "default" }}>
            예정
          </span>
        </div>

        {resList.length === 0 ? (
          <div css={s.empty}>예정된 예약이 없어요</div>
        ) : (
          <div css={s.list}>
            {resList.slice(0, 2).map((it) => (
              <div key={it.id} css={s.row}>
                <span css={s.bullet} />
                <span css={s.text}>{it.title}</span>
                {it.sub && <span css={s.sub}>{it.sub}</span>}
              </div>
            ))}
          </div>
        )}

        <div css={s.count}>{reservationCount}</div>
      </button>

      {/* ===== 레슨 카드 ===== */}
      <button
        type="button"
        css={s.card("lesson")}
        onClick={onClickLessons}
        style={{ textAlign: "left" }}
      >
        {showLesDot && <span css={s.dot} />}
        <div css={s.titleRow}>
          <div css={s.title}>레슨</div>
          <span css={s.pill} as="span" style={{ cursor: "default" }}>
            내 레슨
          </span>
        </div>

        {lesList.length === 0 ? (
          <div css={s.empty}>등록된 레슨이 없어요</div>
        ) : (
          <div css={s.list}>
            {lesList.slice(0, 2).map((it) => (
              <div key={it.id} css={s.row}>
                <span css={s.bullet} />
                <span css={s.text}>{it.title}</span>
                {it.sub && <span css={s.sub}>{it.sub}</span>}
              </div>
            ))}
          </div>
        )}

        <div css={s.count}>{lessonCount}</div>
      </button>
    </div>
  );
}

export default SummaryCards;
