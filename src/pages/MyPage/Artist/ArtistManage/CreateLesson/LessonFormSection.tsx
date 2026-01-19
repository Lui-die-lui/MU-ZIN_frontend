import React from "react";
import type {
  LessonCreateReq,
  LessonMode,
} from "../../../../../Types/lessonTypes";
import { section } from "../../../../Lesson/LessonDetailDrawer/styles";

type Props = {
  lessonDraft: LessonCreateReq;
  setTitle: (v: string) => void;
  setMode: (v: LessonMode) => void;
  setDurationMin: (v: string) => void;
  setPrice: (v: string) => void;
  setDescription: (v: string) => void;
  setRequirementText: (v: string) => void;
};
function LessonFormSection({
  lessonDraft,
  setTitle,
  setMode,
  setDurationMin,
  setPrice,
  setDescription,
  setRequirementText,
}: Props) {
  return (
    <section style={{ display: "grid", gap: 12 }}>
      <label style={{ display: "grid", gap: 6 }}>
        <span>레슨 제목</span>
        <input
          value={lessonDraft.title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="예: 플루트 입문 수업(1)"
        />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span>레슨 방식</span>
        <select
          value={lessonDraft.mode}
          onChange={(e) => setMode(e.target.value as LessonMode)}
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
          value={lessonDraft.durationMin}
          onChange={(e) => setDurationMin(e.target.value)}
        />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span>가격(원)</span>
        <input
          type="number"
          min={0}
          value={lessonDraft.price ?? ""}
          onChange={(e) => setPrice(e.target.value)}
        />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span>레슨 설명</span>
        <textarea
          rows={3}
          value={lessonDraft.description ?? ""}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="레슨 소개 입력"
        />
      </label>

      
      <label style={{ display: "grid", gap: 6 }}>
        <span>준비물/요구사항</span>
        <textarea
          rows={2}
          value={lessonDraft.requirementText ?? ""}
          onChange={(e) => setRequirementText(e.target.value)}
          placeholder="예: 악기 지참 필수"
        />
      </label>
    </section>
  );
}

export default LessonFormSection;
