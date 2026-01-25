import type {
  LessonFormValues,
  LessonMode,
} from "../../../../../Types/lessonTypes";
import type { InstrumentResponse } from "../../../../../Types/instrumentTypes";

type Props = {
  value: LessonFormValues;
  onChange: <K extends keyof LessonFormValues>(
    key: K,
    v: LessonFormValues[K],
  ) => void;

  myInstruments: InstrumentResponse[];
  disabled?: Partial<Record<keyof LessonFormValues, boolean>>; // 타입 맞춰줘야함(Map으로)
};
function LessonFormSection({
  value,
  onChange,
  myInstruments,
  disabled,
}: Props) {
  return (
    <section style={{ display: "grid", gap: 12 }}>
      <label style={{ display: "grid", gap: 6 }}>
        <span>레슨 제목</span>
        <input
          value={value.title}
          disabled={!!disabled?.title}
          onChange={(e) => onChange("title", e.target.value)}
          placeholder="예: 플루트 입문 수업(1)"
        />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span>레슨 악기</span>
        <select
          value={value.instrumentId ?? 0}
          disabled={!!disabled?.instrumentId}
          onChange={(e) => onChange("instrumentId", Number(e.target.value))}
        >
          <option value={0} disabled>
            내 악기 중 선택
          </option>

          {myInstruments.map((inst) => (
            <option key={inst.instId} value={inst.instId}>
              {inst.instName}
            </option>
          ))}
        </select>
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span>레슨 방식</span>
        <select
          value={value.mode}
          disabled={!!disabled?.mode}
          onChange={(e) => onChange("mode", e.target.value as LessonMode)}
        >
          <option value="ONLINE">화상 및 온라인</option>
          <option value="OFFLINE">학원 및 스튜디오(개인 공간)</option>
          <option value="VISIT">방문</option>
          <option value="REQUEST_ONLY">레슨 방식 협의</option>
        </select>
      </label>
      <label style={{ display: "grid", gap: 6 }}>
        <span>수업 시간(분)</span>
        <input
          type="number"
          min={1}
          value={value.durationMin}
          disabled={!!disabled?.durationMin}
          onChange={(e) => onChange("durationMin", e.target.value)}
        />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span>가격(원)</span>
        <input
          type="number"
          min={0}
          value={value.price ?? ""}
          disabled={!!disabled?.price}
          onChange={(e) => onChange("price", e.target.value)}
        />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span>레슨 설명</span>
        <textarea
          rows={3}
          value={value.description ?? ""}
          disabled={!!disabled?.description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="레슨 소개 입력"
        />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span>준비물/요구사항</span>
        <textarea
          rows={2}
          value={value.requirementText ?? ""}
          disabled={!!disabled?.requirementText}
          onChange={(e) => onChange("requirementText", e.target.value)}
          placeholder="예: 악기 지참 필수"
        />
      </label>
    </section>
  );
}

export default LessonFormSection;
