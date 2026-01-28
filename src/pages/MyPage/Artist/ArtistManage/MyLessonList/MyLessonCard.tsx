/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import type {
  LessonStatus,
  LessonSummary,
} from "../../../../../Types/lessonTypes";
import { IOSSwitch } from "../../../../../components/common/StatusToggleSwitch/IOSSwitch";

type Props = {
  lesson: LessonSummary;
  status?: LessonStatus;
  onClick: () => void; // 상세 진입
  onToggleStatus?: (next: LessonStatus) => void; // 목록에서 토글가능
  isToggling: boolean;
};

function MyLessonCard({ lesson, status, onClick, onToggleStatus, isToggling }: Props) {
  const effectiveStatus = status ?? lesson.status;
  const checked = effectiveStatus === "ACTIVE";

  return (
    <div
      css={s.card}
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
    >
      <div css={s.cardTop}>
        <div css={s.cardTitleRow}>
          <strong css={s.cardTitle}>{lesson.title}</strong>

          <div css={s.rightActions}>
            {onToggleStatus && (
              <div
                css={s.statusControl}
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <IOSSwitch
                  checked={checked}
                  disabled={isToggling}
                  onChange={(_e, nextChecked) => {
                    onToggleStatus(nextChecked ? "ACTIVE" : "INACTIVE");
                  }}
                />
                <span css={s.badge(checked)}>
                  {checked ? "활성" : "비활성"}
                </span>
              </div>
            )}
          </div>
        </div>

        <div css={s.cardMeta}>
          <span>{lesson.mode}</span>
          <span>|</span>
          <span>{lesson.durationMin}분</span>
          <span>
            {lesson.price ? `${lesson.price.toLocaleString()}원` : "가격 미정"}
          </span>
        </div>
      </div>
    </div>
  );
}

export default MyLessonCard;
