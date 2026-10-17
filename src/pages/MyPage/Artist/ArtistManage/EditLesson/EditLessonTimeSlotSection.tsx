/** @jsxImportSource @emotion/react */
import { useCallback, useMemo } from "react";
import type { TimeSlotResp, TimeSlotStatus } from "../../../../../Types/lessonTypes";
import TimeSlotCreatePanel from "../common/TimeSlots/TimeSlotCreatePanel/TimeSlotCreatePanel";
import {
  findOverlappingStart,
  formatSlotLabel,
  formatSlotRange,
} from "../../../../../utils/timeSlotUtils";
import SlotStatusBadge from "./SlotStatusBadge";
import * as s from "./styles";
import * as f from "../common/formStyles";

export type SlotAction = "close" | "open" | "delete";

type Props = {
  durationMin: number; // 폼에 입력 중인 수업 시간 (추가할 시간 계산용)
  savedDurationMin: number; // 서버에 저장된 수업 시간 (등록된 시간 표시용)
  serverSlots: TimeSlotResp[];
  draftStartDts: string[]; // 저장 전 추가 예정

  onAdd: (dt: string) => void;
  onAddMany: (dts: string[]) => void;
  onRemoveDraft: (dt: string) => void;
  onClearDraft: () => void;
  // 등록된 시간 닫기/열기/삭제 (바로 서버 반영)
  onSlotAction: (slot: TimeSlotResp, action: SlotAction) => void;
  busySlotId?: number | null;
};

const STATUS_ORDER: TimeSlotStatus[] = ["OPEN", "PENDING", "BOOKED", "CLOSED"];

const dayKey = (dt: string) => dt.slice(0, 10);

function EditLessonTimeSlotSection({
  durationMin,
  savedDurationMin,
  serverSlots,
  draftStartDts,
  onAdd,
  onAddMany,
  onRemoveDraft,
  onClearDraft,
  onSlotAction,
  busySlotId,
}: Props) {
  // 지금 이후 시간만 관리 대상 (지난 시간은 숨김)
  const nowIso = useMemo(() => {
    const d = new Date();
    const p = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
  }, [serverSlots]); // eslint-disable-line react-hooks/exhaustive-deps

  const upcoming = useMemo(
    () => serverSlots.filter((sl) => sl.startDt.slice(0, 16) > nowIso).sort((a, b) => a.startDt.localeCompare(b.startDt)),
    [serverSlots, nowIso],
  );
  const pastCount = serverSlots.length - upcoming.length;

  const counts = useMemo(() => {
    const c: Record<TimeSlotStatus, number> = { OPEN: 0, PENDING: 0, BOOKED: 0, CLOSED: 0 };
    upcoming.forEach((sl) => { c[sl.status] += 1; });
    return c;
  }, [upcoming]);

  const byDay = useMemo(() => {
    const m = new Map<string, TimeSlotResp[]>();
    upcoming.forEach((sl) => m.set(dayKey(sl.startDt), [...(m.get(dayKey(sl.startDt)) ?? []), sl]));
    return [...m.entries()];
  }, [upcoming]);

  // 추가하려는 시간이 문제인지 (이미 있는 시간 / 겹치는 시간) - 서버와 같은 규칙
  const checkConflict = useCallback(
    (dt: string) => {
      const others = [...serverSlots.map((sl) => sl.startDt), ...draftStartDts];
      const hit = findOverlappingStart(dt, others, durationMin > 0 ? durationMin : savedDurationMin);
      if (!hit) return null;
      return hit.slice(0, 16) === dt.slice(0, 16)
        ? `${formatSlotLabel(dt)}은 이미 추가된 시간이에요.`
        : `${formatSlotLabel(hit)} 수업과 시간이 겹쳐요. (수업 ${durationMin}분)`;
    },
    [serverSlots, draftStartDts, durationMin, savedDurationMin],
  );

  return (
    <div>
      <TimeSlotCreatePanel durationMin={durationMin} onAdd={onAdd} onAddMany={onAddMany} checkConflict={checkConflict} />

      {/* 저장 전 추가 예정 */}
      {draftStartDts.length > 0 && (
        <>
          <div css={s.sectionLabel}>
            <span>추가 예정 {draftStartDts.length}개 <small>· 저장하면 반영돼요</small></span>
            <button type="button" css={s.textBtn} onClick={onClearDraft}>모두 빼기</button>
          </div>
          <div css={s.draftList}>
            {draftStartDts.map((dt) => (
              <span key={dt} css={s.draftChip}>
                {formatSlotLabel(dt)}
                <button type="button" aria-label={`${formatSlotLabel(dt)} 빼기`} onClick={() => onRemoveDraft(dt)}>×</button>
              </span>
            ))}
          </div>
        </>
      )}

      {/* 등록된 시간 */}
      <div css={s.sectionLabel}>
        <span>등록된 시간 {upcoming.length}개 <small>· 닫기·삭제는 바로 반영돼요</small></span>
      </div>
      {upcoming.length > 0 && (
        <div css={s.summary} style={{ marginBottom: 10 }}>
          {STATUS_ORDER.filter((st) => counts[st] > 0).map((st) => <SlotStatusBadge key={st} status={st} count={counts[st]} />)}
        </div>
      )}

      {upcoming.length === 0 ? (
        <div css={s.empty}>앞으로 예정된 시간이 없어요. 위에서 시간을 추가해주세요.</div>
      ) : (
        byDay.map(([day, slots]) => (
          <div key={day} css={s.dayGroup}>
            <div css={s.dayHeader}>{formatSlotLabel(`${day}T00:00`).replace(/ 00:00$/, "")}</div>
            {slots.map((sl) => {
              const busy = busySlotId === sl.timeSlotId;
              return (
                <div key={sl.timeSlotId} css={s.slotRow}>
                  <span css={s.slotTime}>{formatSlotRange(sl.startDt, savedDurationMin)}</span>
                  <SlotStatusBadge status={sl.status} />
                  {sl.status === "OPEN" && (
                    <div css={s.slotActions}>
                      <button type="button" css={s.smallBtn()} disabled={busy} onClick={() => onSlotAction(sl, "close")}>닫기</button>
                      <button type="button" css={s.smallBtn("danger")} disabled={busy} onClick={() => onSlotAction(sl, "delete")}>삭제</button>
                    </div>
                  )}
                  {sl.status === "CLOSED" && (
                    <div css={s.slotActions}>
                      <button type="button" css={s.smallBtn()} disabled={busy} onClick={() => onSlotAction(sl, "open")}>다시 열기</button>
                      <button type="button" css={s.smallBtn("danger")} disabled={busy} onClick={() => onSlotAction(sl, "delete")}>삭제</button>
                    </div>
                  )}
                  {sl.status === "PENDING" && <span css={s.slotNote}>요청을 확정하거나 거절해주세요</span>}
                  {sl.status === "BOOKED" && <span css={s.slotNote}>수강생과 확정된 시간이에요</span>}
                </div>
              );
            })}
          </div>
        ))
      )}

      {pastCount > 0 && <p css={f.helper} style={{ marginTop: 10 }}>이미 지난 시간 {pastCount}개는 목록에서 숨겼어요.</p>}
    </div>
  );
}

export default EditLessonTimeSlotSection;
