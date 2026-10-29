/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import {
  LESSON_MODE_LABEL,
  type LessonStatus,
  type MyLessonDetail,
} from "../../../../../Types/lessonTypes";
import { IOSSwitch } from "../../../../../components/common/StatusToggleSwitch/IOSSwitch";

type Props = {
  lesson: MyLessonDetail;
  onOpen: () => void; // 수정 화면 진입
  onOpenRequests: () => void; // 예약 요청 화면
  onToggleStatus: (next: LessonStatus) => void;
  isToggling: boolean;
};

const formatPrice = (price: number | null) => {
  if (price == null) return "가격 미정";
  if (price === 0) return "무료"; // 예전엔 0원도 "가격 미정"으로 보였음
  return `${price.toLocaleString()}원`;
};

function MyLessonCard({ lesson, onOpen, onOpenRequests, onToggleStatus, isToggling }: Props) {
  const active = lesson.status === "ACTIVE";
  const noSlots = lesson.upcomingOpenSlotCount === 0;
  const autoClose = lesson.closingPolicy === "AUTO_CLOSE_WHEN_NO_SLOTS";
  const switchId = `lesson-status-${lesson.lessonId}`;
  const otherActive = lesson.activeReservationCount - lesson.pendingRequestCount;

  // 카드 안의 버튼/스위치를 누를 때 카드 클릭(수정 화면 이동)이 같이 일어나지 않게
  const stop = (e: React.SyntheticEvent) => e.stopPropagation();

  return (
    <article
      css={s.card(isToggling)}
      tabIndex={0}
      aria-label={`${lesson.title} 관리`}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return; // 안쪽 버튼에서 누른 키는 무시
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
    >
      <div css={s.cardTop}>
        <div css={s.titleBlock}>
          <div css={s.titleRow}>
            <strong css={s.cardTitle} title={lesson.title}>{lesson.title}</strong>
            {/* 공개 중은 옆 스위치로 보이니 비공개일 때만 표시 */}
            {!active && <span css={s.statusChip(active)}>비공개</span>}
          </div>
          <div css={s.cardMeta}>
            <span>{lesson.instName}</span>
            <span>{LESSON_MODE_LABEL[lesson.mode] ?? lesson.mode}</span>
            <span>{lesson.durationMin}분</span>
            <span>{formatPrice(lesson.price)}</span>
          </div>
        </div>

        <div css={s.switchWrap} onClick={stop} onKeyDown={stop}>
          <label htmlFor={switchId}>공개</label>
          <IOSSwitch
            id={switchId}
            checked={active}
            disabled={isToggling}
            inputProps={{ "aria-label": `${lesson.title} 공개 여부` }}
            onChange={(_e, nextChecked) => onToggleStatus(nextChecked ? "ACTIVE" : "INACTIVE")}
          />
        </div>
      </div>

      <div css={s.cardBottom}>
        <div css={s.infoRow}>
          {noSlots ? (
            <span css={s.infoChip("warn")}>
              {autoClose && active ? "예약 가능한 시간 없음 · 검색에 안 보여요" : "예약 가능한 시간 없음"}
            </span>
          ) : (
            <span css={s.infoChip("good")}>예약 가능한 시간 {lesson.upcomingOpenSlotCount}개</span>
          )}
          {lesson.pendingRequestCount > 0 && (
            <button
              type="button"
              css={[s.infoChip("alert"), s.chipButton]}
              onClick={(e) => {
                stop(e);
                onOpenRequests();
              }}
            >
              예약 요청 {lesson.pendingRequestCount}건 확인하기
            </button>
          )}
          {otherActive > 0 && <span css={s.infoChip("info")}>진행 중인 예약 {otherActive}건</span>}
        </div>

        <button
          type="button"
          css={s.manageBtn}
          onClick={(e) => {
            stop(e);
            onOpen();
          }}
        >
          수정·시간 관리
        </button>
      </div>
    </article>
  );
}

export default MyLessonCard;
