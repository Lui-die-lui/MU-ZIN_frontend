/** @jsxImportSource @emotion/react */
// 기간 + 요일 + 하루 운영 시간 + 쉬는 시간으로 여러 시간을 미리 계산해서 한 번에 추가
import { useMemo, useState } from "react";
import {
  addDaysYmd,
  formatSlotLabel,
  generateRecurrenceStartDts,
  MAX_DAYS_AHEAD,
  MAX_SLOTS_PER_SAVE,
  todayYmd,
} from "../../../../../../utils/timeSlotUtils";
import { getErrorMessage } from "../../../../../../utils/errorUtils";
import * as s from "./slotStyles";

type Props = {
  durationMin: number; // 폼에 입력된 수업 시간
  onAddMany: (dts: string[]) => void;
  checkConflict?: (dt: string) => string | null;
};

// 월요일부터 (화면 표시 순서) - 값은 Date.getDay() 기준 인덱스
const DOW_ORDER = [1, 2, 3, 4, 5, 6, 0];
const DOW_LABELS = ["일", "월", "화", "수", "목", "금", "토"];
const PREVIEW_LIMIT = 12;

function RecurrenceTimeSlotInput({ durationMin, onAddMany, checkConflict }: Props) {
  const today = todayYmd();
  const maxTo = useMemo(() => addDaysYmd(today, MAX_DAYS_AHEAD), [today]);

  const [fromYmd, setFromYmd] = useState(today);
  const [toYmd, setToYmd] = useState(addDaysYmd(today, 27)); // 기본 4주
  const [daysOfWeek, setDaysOfWeek] = useState<boolean[]>(Array(7).fill(false));
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("18:00");
  const [breakMin, setBreakMin] = useState("0");
  const [added, setAdded] = useState<string | null>(null);

  const durationOk = Number.isFinite(durationMin) && durationMin > 0;
  const anyDay = daysOfWeek.some(Boolean);

  // 미리보기: 생성될 시간 + 겹쳐서 제외될 시간
  const preview = useMemo(() => {
    if (!durationOk) return { dts: [] as string[], excluded: 0, error: "기본 정보에서 수업 시간을 먼저 입력해주세요." };
    if (!anyDay) return { dts: [] as string[], excluded: 0, error: "" };
    try {
      const all = generateRecurrenceStartDts({
        fromYmd, toYmd, daysOfWeek, startTime, endTime,
        intervalMin: Number(breakMin) || 0,
        durationMin,
      });
      const dts = checkConflict ? all.filter((dt) => !checkConflict(dt)) : all;
      return { dts, excluded: all.length - dts.length, error: "" };
    } catch (e: unknown) {
      return { dts: [] as string[], excluded: 0, error: getErrorMessage(e) };
    }
  }, [durationOk, anyDay, fromYmd, toYmd, daysOfWeek, startTime, endTime, breakMin, durationMin, checkConflict]);

  const toggleDow = (idx: number) => {
    setAdded(null);
    setDaysOfWeek((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };

  const tooMany = preview.dts.length > MAX_SLOTS_PER_SAVE;

  const handleAdd = () => {
    if (preview.dts.length === 0 || tooMany) return;
    onAddMany(preview.dts);
    setAdded(`${preview.dts.length}개 시간을 추가했어요. 저장하면 반영돼요.`);
  };

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div css={s.inlineRow}>
        <label css={s.miniField}>
          <span css={s.miniLabel}>시작일</span>
          <input type="date" css={s.control} value={fromYmd} min={today} max={maxTo}
            onChange={(e) => { setFromYmd(e.target.value); setAdded(null); }} />
        </label>
        <label css={s.miniField}>
          <span css={s.miniLabel}>종료일 (최대 {MAX_DAYS_AHEAD}일 이내)</span>
          <input type="date" css={s.control} value={toYmd} min={fromYmd} max={maxTo}
            onChange={(e) => { setToYmd(e.target.value); setAdded(null); }} />
        </label>
      </div>

      <div css={s.miniField}>
        <span css={s.miniLabel}>요일</span>
        <div css={s.dowGroup} role="group" aria-label="반복 요일">
          {DOW_ORDER.map((idx) => (
            <button key={idx} type="button" css={s.dowChip(daysOfWeek[idx])} aria-pressed={daysOfWeek[idx]} onClick={() => toggleDow(idx)}>
              {DOW_LABELS[idx]}
            </button>
          ))}
        </div>
      </div>

      <div css={s.inlineRow}>
        <label css={s.miniField}>
          <span css={s.miniLabel}>하루 운영 시작</span>
          <input type="time" css={s.control} value={startTime} step={600}
            onChange={(e) => { setStartTime(e.target.value); setAdded(null); }} />
        </label>
        <label css={s.miniField}>
          <span css={s.miniLabel}>하루 운영 종료</span>
          <input type="time" css={s.control} value={endTime} step={600}
            onChange={(e) => { setEndTime(e.target.value); setAdded(null); }} />
        </label>
        <label css={s.miniField}>
          <span css={s.miniLabel}>수업 사이 쉬는 시간 (분)</span>
          <input css={s.control} inputMode="numeric" value={breakMin} style={{ width: 120 }}
            onChange={(e) => { setBreakMin(e.target.value.replace(/[^\d]/g, "").slice(0, 3)); setAdded(null); }} />
        </label>
      </div>

      {durationOk && anyDay && !preview.error && (
        <p css={s.message("info")}>
          {startTime}부터 {durationMin}분 수업{Number(breakMin) > 0 ? ` + ${breakMin}분 휴식` : ""}으로 {endTime} 전까지 이어서 만들어요.
        </p>
      )}

      {/* 미리보기 */}
      <div css={s.previewBox}>
        {preview.error ? (
          <p css={s.message("error")}>{preview.error}</p>
        ) : !anyDay ? (
          <p css={s.message("info")}>반복할 요일을 선택하면 만들어질 시간을 미리 보여드려요.</p>
        ) : (
          <>
            <p css={s.message("info")}>
              <b>{preview.dts.length}개</b> 시간이 만들어져요.
              {preview.excluded > 0 && <span css={s.message("warn")}> 이미 있거나 겹치는 {preview.excluded}개는 제외했어요.</span>}
              {tooMany && <span css={s.message("error")}> 한 번에 {MAX_SLOTS_PER_SAVE}개까지 추가할 수 있어요. 기간이나 요일을 줄여주세요.</span>}
            </p>
            {preview.dts.length > 0 && (
              <ul css={s.previewList}>
                {preview.dts.slice(0, PREVIEW_LIMIT).map((dt) => <li key={dt} css={s.previewChip}>{formatSlotLabel(dt)}</li>)}
                {preview.dts.length > PREVIEW_LIMIT && <li css={s.previewChip}>외 {preview.dts.length - PREVIEW_LIMIT}개</li>}
              </ul>
            )}
          </>
        )}
      </div>

      <div css={s.inlineRow}>
        <button type="button" css={s.btn("primary")} onClick={handleAdd} disabled={preview.dts.length === 0 || tooMany}>
          {preview.dts.length > 0 ? `${preview.dts.length}개 시간 추가` : "추가"}
        </button>
        {added && <p css={s.message("info")}>{added}</p>}
      </div>
    </div>
  );
}

export default RecurrenceTimeSlotInput;
