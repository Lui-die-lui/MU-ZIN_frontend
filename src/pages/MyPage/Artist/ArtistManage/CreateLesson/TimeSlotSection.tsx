import { useState } from "react";

type Props = {
  startDts: string[];
  onAdd: (dtLocal: string) => void; // "YYYY-MM-DDTHH:mm"
  onRemove: (dt: string) => void; // normalize된 값(유틸 결과)
  onClear: () => void;
};
function TimeSlotSection({ startDts, onAdd, onRemove, onClear }: Props) {
  const [dtInput, setDtInput] = useState("");

  const handleAdd = () => {
    if (!dtInput) return;
    onAdd(dtInput);
    setDtInput(""); // 추가되고나면 input창 reset
  };
  return (
    <section style={{ display: "grid", gap: 10 }}>
      <h3 style={{ margin: 0 }}>타임슬롯 추가</h3>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          type="datetime-local"
          value={dtInput}
          onChange={(e) => setDtInput(e.target.value)}
        />
        <button type="button" onClick={handleAdd}>
          추가
        </button>
        <button type="button" onClick={onClear}>
          전체 삭제
        </button>
      </div>

      {startDts.length === 0 ? (
        <p style={{ margin: 0, opacity: 0.7 }}>
          아직 추가된 타임슬롯이 없습니다.
        </p>
      ) : (
        <ul style={{ margin: 0, paddingLeft: 18 }}>
          {startDts.map((dt) => (
            <li
              key={dt} //삭제 가능
              style={{ display: "flex", gap: 8, alignItems: "center" }}
            >
              <span>{dt}</span>
              <button type="button" onClick={() => onRemove(dt)}>
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default TimeSlotSection;
