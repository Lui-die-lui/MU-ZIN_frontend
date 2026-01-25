import { useMemo, useState } from "react";
import SingleTimeslotInput from "../SingleTimeslotInput";
import RecurrenceTimeSlotInput from "../RecurrenceTimeSlotInput";

type Mode = "single" | "recurrence";

type Props = {
  durationMin: number;
  onAdd: (dtLocal: string) => void;
  onAddMany: (dts: string[]) => void;
};

export default function TimeSlotCreatePanel({
  durationMin,
  onAdd,
  onAddMany,
}: Props) {
  const [mode, setMode] = useState<Mode>("single");

  const title = useMemo(() => {
    return mode === "single" ? "단일 타임슬롯 추가" : "반복 일정 타임슬롯 생성";
  }, [mode]);

  return (
    <section style={{ display: "grid", gap: 12 }}>
      {/* 헤더 */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <h3 style={{ margin: 0 }}>타임슬롯 추가</h3>

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
      </div>

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
          <RecurrenceTimeSlotInput
            durationMin={durationMin}
            onAddMany={onAddMany}
          />
        )}
      </div>
    </section>
  );
}
