import { useState } from "react";
import { getMinLocalDateTime } from "../../../../../../utils/timeSlotUtils";

// 한 개씩 추가
type Props = {
  onAdd: (dtLocal: string) => void; // "YYYY-MM-DDTHH:mm"
};

function SingleTimeslotInput({ onAdd }: Props) {
  const [dtInput, setDtInput] = useState("");

  const handleAdd = () => {
    if (!dtInput) return;
    const chosen = new Date(dtInput);
    if (chosen.getTime() <= Date.now()) {
      alert("현재 및 과거 시간은 추가할 수 없습니다.");
      return;
    }
    onAdd(dtInput);
    setDtInput("");
  };
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <input
        type="datetime-local"
        value={dtInput}
        min={getMinLocalDateTime(1)}
        onChange={(e) => setDtInput(e.target.value)}
      />
      <button type="button" onClick={handleAdd}>
        추가
      </button>
    </div>
  );
}

export default SingleTimeslotInput;
