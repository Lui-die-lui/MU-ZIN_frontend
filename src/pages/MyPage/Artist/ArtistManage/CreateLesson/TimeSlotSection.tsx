import { useMemo, useState } from "react";
import SingleTimeslotInput from "./TimeSlots/SingleTimeslotInput";
import RecurrenceTimeSlotInput from "./TimeSlots/RecurrenceTimeSlotInput";
import SelectedChips from "../../../../../components/common/SelectedChips/SelectedChips";

type Mode = "single" | "recurrence";

type Props = {
  durationMin: number;
  startDts: string[];
  onAdd: (dtLocal: string) => void;
  onAddMany: (dts: string[]) => void;
  onRemove: (dt: string) => void;
  onClear: () => void;
};

export default function TimeSlotSection({
  durationMin,
  startDts,
  onAdd,
  onAddMany,
  onRemove,
  onClear,
}: Props) {
  const [mode, setMode] = useState<Mode>("single");

  const title = useMemo(() => {
    return mode === "single" ? "단일 타임슬롯 추가" : "반복 일정 타임슬롯 생성";
  }, [mode]);

  const grouped = useMemo(() => groupByMonthDay(startDts), [startDts]);

 return (
    <section style={{ display: "grid", gap: 12 }}>
      {/* 헤더 */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <h3 style={{ margin: 0 }}>타임슬롯</h3>

        <div style={{ display: "flex", gap: 6 }}>
          <button
            type="button"
            onClick={() => setMode("single")}
            style={{
              padding: "6px 10px",
              borderRadius: 999,
              border: "1px solid #444",
              opacity: mode === "single" ? 1 : 0.5,
            }}
          >
            단일
          </button>
          <button
            type="button"
            onClick={() => setMode("recurrence")}
            style={{
              padding: "6px 10px",
              borderRadius: 999,
              border: "1px solid #444",
              opacity: mode === "recurrence" ? 1 : 0.5,
            }}
          >
            반복
          </button>
        </div>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <span style={{ opacity: 0.8 }}>
            선택: <b>{startDts.length}</b>개
          </span>
          <button type="button" onClick={onClear} disabled={startDts.length === 0}>
            전체 삭제
          </button>
        </div>
      </div>

      {/* 바디: 세로 스택(패널 -> 칩리스트) */}
      <div style={{ display: "grid", gap: 12 }}>
        {/* 입력 패널 */}
        <div
          style={{
            padding: 12,
            border: "1px solid #333",
            borderRadius: 12,
          }}
        >
          <h4 style={{ margin: 0, marginBottom: 10 }}>{title}</h4>

          {mode === "single" ? (
            <SingleTimeslotInput onAdd={onAdd} />
          ) : (
            <RecurrenceTimeSlotInput durationMin={durationMin} onAddMany={onAddMany} />
          )}
        </div>

        {/* 선택된 칩 리스트(세로) */}
        <div
          style={{
            padding: 12,
            border: "1px solid #333",
            borderRadius: 12,
          }}
        >
          {startDts.length === 0 ? (
            <p style={{ margin: 0, opacity: 0.7 }}>아직 추가된 타임슬롯이 없습니다.</p>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              {Object.entries(grouped).map(([ym, days]) => (
                <div
                  key={ym}
                  style={{
                    padding: 12,
                    border: "1px solid #eee",
                    borderRadius: 16,
                  }}
                >
                  {/* 월 타이틀 */}
                  <div style={{ fontWeight: 700, marginBottom: 10 }}>
                    {ym.slice(0, 4)}년 {ym.slice(5, 7)}월
                  </div>

                  {/* 날짜 라인들 */}
                  <div style={{ display: "grid", gap: 10 }}>
                    {Object.entries(days).map(([day, dts]) => (
                      <div
                        key={`${ym}-${day}`}
                        style={{
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 10,
                        }}
                      >
                        <div style={{ width: 42, opacity: 0.75 }}>{Number(day)}일</div>

                        {/* 재사용 칩 */}
                        <SelectedChips
                          items={dts}
                          getKey={(dt) => dt}
                          getLabel={(dt) => dt.slice(11, 16)} // HH:mm
                          onRemove={(dt) => onRemove(dt)}
                          title="클릭 시 삭제"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

/** "YYYY-MM" -> "DD" -> [dt...] 로 그룹핑 + 정렬 */
function groupByMonthDay(startDts: string[]) {
  const out: Record<string, Record<string, string[]>> = {};

  for (const dt of startDts) {
    const ymd = dt.slice(0, 10); // YYYY-MM-DD
    const ym = ymd.slice(0, 7); // YYYY-MM
    const day = ymd.slice(8, 10); // DD

    out[ym] ??= {};
    out[ym][day] ??= [];
    out[ym][day].push(dt);
  }

  const sorted: Record<string, Record<string, string[]>> = {};
  Object.keys(out)
    .sort()
    .forEach((ym) => {
      sorted[ym] = {};
      Object.keys(out[ym])
        .sort()
        .forEach((day) => {
          sorted[ym][day] = out[ym][day].slice().sort();
        });
    });

  return sorted;
}
