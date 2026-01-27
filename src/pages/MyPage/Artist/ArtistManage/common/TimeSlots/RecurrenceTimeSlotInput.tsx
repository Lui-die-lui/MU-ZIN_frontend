// from/to + 요일 + start/end + interval로 여러개 startDts를 미리 계산해서 추가
// 미리보기 개수 보여주기, 추가 누르면 onAdd

import { useMemo, useState } from "react";
import {
  addDaysYmd,
  generateRecurrenceStartDts,
  MAX_DAYS_AHEAD,
  todayYmd,
} from "../../../../../../utils/timeSlotUtils";
import { getErrorMessage } from "../../../../../../utils/errorUtils";

type Props = {
  durationMin: number; // createLesson에서 온 값
  onAddMany: (dts: string[]) => void;
};

const DOW_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

function RecurrenceTimeSlotInput({ durationMin, onAddMany }: Props) {
  const today = todayYmd();
  // 오늘 날짜 + 최대 90일까지 생성
  const maxTo = useMemo(() => addDaysYmd(today, MAX_DAYS_AHEAD), [today]);

  const [fromYmd, setFromYmd] = useState(today);
  const [toYmd, setToYmd] = useState(maxTo);

  const [daysOfWeek, setDaysOfWeek] = useState<boolean[]>([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("18:00");
  const [intervalMin, setIntervalMin] = useState(90);

  // lessonForm에서 입력된 진행 시간
  const durationOk = Number.isFinite(durationMin) && durationMin > 0;

  // 미리보기 - 계산된 startDts
  const preview = useMemo(() => {
    if (!durationOk) {
      return {
        dts: [] as string[],
        error: "수업 시간(분)을 먼저 입력해주세요.",
      };
    }
    try {
      const dts = generateRecurrenceStartDts({
        fromYmd,
        toYmd,
        daysOfWeek,
        startTime,
        endTime,
        intervalMin,
        durationMin,
      });
      return { dts, error: "" };
    } catch (e: unknown) {
      return { dts: [] as string[], error: getErrorMessage(e) };
    }
  }, [
    durationOk,
    fromYmd,
    toYmd,
    daysOfWeek,
    startTime,
    endTime,
    intervalMin,
    durationMin,
  ]);

  // 미리보기 계산이 실패했는지(throw) 사용자에게 보여줄 메시지

  const toggleDow = (idx: number) => {
    setDaysOfWeek((prev) => prev.map((v, i) => (i === idx ? !v : v)));
  };

//   const handleAdd = () => {
//     if (!durationOk) return;
//     if (preview.dts.length === 0) {
//       alert(preview.error || "생성할 슬롯이 없습니다.");
//       return;
//     }
//   };
const handleAdd = () => {
  if (!durationOk) return;
  if (preview.dts.length === 0) {
    alert(preview.error || "생성할 슬롯이 없습니다.");
    return;
  }
  const normalized = preview.dts.map((s) =>
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(s) ? `${s}:00` : s,
  ); // "YYYY-MM-DDTHH:mm:ss" 로 비교 전송 되어야하는데 아니어서 터졌었음

  onAddMany(normalized);
};

  return (
    <section style={{ display: "grid", gap: 10 }}>
      <h4 style={{ margin: 0 }}>반복으로 여러 슬롯 생성</h4>

      {!durationOk && (
        <p style={{ margin: 0, opacity: 0.7 }}>
          수업시간(분)을 먼저 입력하면 반복 생성이 활성화 됩니다.
        </p>
      )}

      <div style={{ display: "grid", gap: 8 }}>
        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ width: 70 }}>시작일</span>
          <input
            type="date"
            value={fromYmd}
            min={today}
            onChange={(e) => setFromYmd(e.target.value)}
          />
        </label>

        <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ width: 70 }}>종료일</span>
          <input
            type="date"
            value={toYmd}
            min={fromYmd}
            max={maxTo}
            onChange={(e) => setToYmd(e.target.value)}
          />
          <span style={{ opacity: 0.7, fontSize: 12 }}>
            (최대 {MAX_DAYS_AHEAD}일)
          </span>
        </label>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {DOW_LABELS.map((label, idx) => (
            <button
              key={label}
              type="button"
              onClick={() => toggleDow(idx)}
              style={{
                padding: "6px 10px",
                borderRadius: 999,
                border: "1px solid #444",
                opacity: daysOfWeek[idx] ? 1 : 0.4,
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span>전체 수업 시작 시간</span>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />
          </label>

          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span>전체 수업 종료 시간</span>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />
          </label>

          <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <span>수업 사이 간격(분)</span>
            <input
              type="number"
              min={1}
              value={intervalMin}
              onChange={(e) => setIntervalMin(Number(e.target.value) || 0)}
              style={{ width: 90 }}
            />
          </label>
        </div>
      </div>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <div style={{ opacity: 0.8 }}>
          미리보기: <b>{preview.dts.length}</b> 개
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!durationOk || preview.dts.length === 0}
        >
          추가
        </button>

        {preview.error && (
          <span style={{ color: "#ff6b6b", fontSize: 12 }}>
            {preview.error}
          </span>
        )}
      </div>

      {/* (선택) 너무 많으면 10개만 보여주는 미리보기 */}
      {preview.dts.length > 0 && (
        <ul style={{ margin: 0, paddingLeft: 18, opacity: 0.85 }}>
          {preview.dts.slice(0, 10).map((dt) => (
            <li key={dt}>{dt}</li>
          ))}
          {preview.dts.length > 10 && <li>... (총 {preview.dts.length}개)</li>}
        </ul>
      )}
    </section>
  );
}

export default RecurrenceTimeSlotInput;
