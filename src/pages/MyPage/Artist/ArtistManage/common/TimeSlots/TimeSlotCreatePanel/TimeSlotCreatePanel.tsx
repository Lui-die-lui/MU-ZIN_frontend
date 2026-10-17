/** @jsxImportSource @emotion/react */
import { useState } from "react";
import SingleTimeslotInput from "../SingleTimeslotInput";
import RecurrenceTimeSlotInput from "../RecurrenceTimeSlotInput";
import * as s from "../slotStyles";

type Mode = "single" | "recurrence";

type Props = {
  durationMin: number;
  onAdd: (dtLocal: string) => void;
  onAddMany: (dts: string[]) => void;
  // 추가하려는 시각이 문제면 이유를 반환 (이미 있는 시간, 겹치는 시간 등). 없으면 null
  checkConflict?: (dt: string) => string | null;
};

export default function TimeSlotCreatePanel({ durationMin, onAdd, onAddMany, checkConflict }: Props) {
  const [mode, setMode] = useState<Mode>("single");

  return (
    <section css={s.panel}>
      <div css={s.segment} role="tablist" aria-label="시간 추가 방식">
        <button type="button" role="tab" aria-selected={mode === "single"} css={s.segmentBtn(mode === "single")} onClick={() => setMode("single")}>
          하루씩 추가
        </button>
        <button type="button" role="tab" aria-selected={mode === "recurrence"} css={s.segmentBtn(mode === "recurrence")} onClick={() => setMode("recurrence")}>
          반복으로 추가
        </button>
      </div>

      {mode === "single" ? (
        <SingleTimeslotInput onAdd={onAdd} checkConflict={checkConflict} />
      ) : (
        <RecurrenceTimeSlotInput durationMin={durationMin} onAddMany={onAddMany} checkConflict={checkConflict} />
      )}
    </section>
  );
}
