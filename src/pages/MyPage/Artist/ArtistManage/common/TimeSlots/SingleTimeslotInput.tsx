/** @jsxImportSource @emotion/react */
import { useState } from "react";
import { addDaysYmd, MAX_DAYS_AHEAD, normalizeLocalDateTime, todayYmd } from "../../../../../../utils/timeSlotUtils";
import * as s from "./slotStyles";

// 날짜 + 시작 시간으로 한 개씩 추가
type Props = {
  onAdd: (dtLocal: string) => void; // "YYYY-MM-DDTHH:mm:ss"
  checkConflict?: (dt: string) => string | null;
};

function SingleTimeslotInput({ onAdd, checkConflict }: Props) {
  const today = todayYmd();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState<string | null>(null);

  const handleAdd = () => {
    setAdded(null);
    if (!date || !time) {
      setError("날짜와 시작 시간을 모두 선택해주세요.");
      return;
    }
    const dt = normalizeLocalDateTime(`${date}T${time}`);
    if (new Date(dt.slice(0, 16)).getTime() <= Date.now()) {
      setError("지금 이후의 시간만 추가할 수 있어요.");
      return;
    }
    const conflict = checkConflict?.(dt);
    if (conflict) {
      setError(conflict);
      return;
    }
    onAdd(dt);
    setError(null);
    setAdded(`${date.slice(5).replace("-", "/")} ${time} 추가됨`);
    setTime(""); // 같은 날 다른 시간을 연달아 넣기 쉽게 날짜는 유지
  };

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div css={s.inlineRow}>
        <label css={s.miniField}>
          <span css={s.miniLabel}>날짜</span>
          <input
            type="date"
            css={s.control}
            value={date}
            min={today}
            max={addDaysYmd(today, MAX_DAYS_AHEAD)}
            onChange={(e) => { setDate(e.target.value); setError(null); }}
          />
        </label>
        <label css={s.miniField}>
          <span css={s.miniLabel}>시작 시간</span>
          <input
            type="time"
            css={s.control}
            value={time}
            step={600}
            onChange={(e) => { setTime(e.target.value); setError(null); }}
            onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
          />
        </label>
        <button type="button" css={s.btn("primary")} onClick={handleAdd}>
          추가
        </button>
      </div>
      {error ? <p css={s.message("error")} role="alert">{error}</p>
        : added ? <p css={s.message("info")}>{added} · 저장하면 반영돼요.</p>
        : <p css={s.message("info")}>오늘부터 {MAX_DAYS_AHEAD}일 이내 시간을 추가할 수 있어요.</p>}
    </div>
  );
}

export default SingleTimeslotInput;
