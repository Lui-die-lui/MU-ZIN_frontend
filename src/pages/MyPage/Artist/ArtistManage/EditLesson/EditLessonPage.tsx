import { useNavigate, useParams } from "react-router-dom";
import type {
  LessonFormValues,
  LessonRecurrenceUpsertReq,
  LessonUpdateReq,
  MyLessonDetail,
} from "../../../../../Types/lessonTypes";
import {
  addDaysYmd,
  MAX_DAYS_AHEAD,
  todayYmd,
  toLocalDateTimeString,
} from "../../../../../utils/timeSlotUtils";
import { useQuery } from "@tanstack/react-query";
import { getMyArtistProfileReq } from "../../../../../apis/artist/artistApi";
import type { InstrumentResponse } from "../../../../../Types/instrumentTypes";
import {
  useMyLessonDetail,
  useMyRecurrence,
  useMyTimeSlots,
} from "../../../../../hooks/Lesson/useLessonEdit";
import { useLessonForm } from "../../../../../hooks/Lesson/useLessonForm";
import { useEffect, useMemo } from "react";
import { useStartDts } from "../../../../../hooks/Lesson/useStartDts";
import { useUpdateLessonWithSlots } from "../../../../../hooks/Lesson/useUpdateLessonWithSlots";
import { buildLessonUpdatePatch } from "./buildLessonUpdatePatch";
import EditLessonFormSection from "./EditLessonFormSection";
import EditLessonTimeSlotSection from "./EditLessonTimeSlotSection";

function EditLessonPage() {
  const navigate = useNavigate();
  const { lessonId: lessonIdParam } = useParams();
  const lessonId = Number(lessonIdParam);

  // 슬롯 조회(time range 90일)
  const fromYmd = todayYmd();
  const toYmd = addDaysYmd(fromYmd, MAX_DAYS_AHEAD);
  const from = toLocalDateTimeString(fromYmd, "00:00");
  const to = toLocalDateTimeString(toYmd, "23:59");

  // 내 프로필(악기 목록)
  const { data: profile } = useQuery({
    queryKey: ["artistProfile", "me"],
    queryFn: async () => (await getMyArtistProfileReq()).data.data,
  });
  const myInstruments = (profile?.instruments ?? []) as InstrumentResponse[];

  // 서버에서 가져온 내 관리용 레슨 상세
  const detailQ = useMyLessonDetail(lessonId);
  // 서버 타임슬롯 조회 + booked 판단
  const slotsQ = useMyTimeSlots(lessonId, from, to);
  // recurrence 읽기
  const recurrenceQ = useMyRecurrence(lessonId);

  const hasBooked = useMemo(() => {
    const slots = slotsQ.data ?? [];
    return slots.some((s) => s.status === "BOOKED"); // booked 상태인 타임슬롯이 있는지 체크
  }, [slotsQ.data]);

  // 폼, 추가슬롯 로컬 상태
  const { lessonDraft, setField, setAll } = useLessonForm();
  const { startDts, add, addMany, remove, clear } = useStartDts();

  // 저장 (patch + recurrence upsert + slots add 한번에)
  const { mutate, isPending } = useUpdateLessonWithSlots(lessonId, from, to);

  // duration 숫자 파싱(타임슬롯 반복 생성 등에 필요)
  const durationMinNum = useMemo(() => {
    const n = Number(lessonDraft.durationMin);
    return Number.isFinite(n) ? n : NaN;
  }, [lessonDraft.durationMin]);

  // submit
  const onSubmit = () => {
    if (!detailQ.data) return;
    if (!lessonDraft.title.trim()) return alert("레슨명을 입력하세요.");

    const dm = Number(lessonDraft.durationMin);
    if (!Number.isFinite(dm) || dm <= 0)
      return alert("수업 시간(분)을 입력하세요.");
    if (!lessonDraft.instrumentId) return alert("악기를 선택하세요.");

    const patch: LessonUpdateReq = buildLessonUpdatePatch({
      original: detailQ.data,
      draft: lessonDraft,
      coreEditable: !hasBooked,
    });

    const recurrencePatch: LessonRecurrenceUpsertReq | undefined = undefined;


    mutate(
      {
        lesson: patch,
        recurrence: recurrencePatch,
        addStartDts: startDts,
      },
      {
        onSuccess: () => {
          clear();
          navigate("/mypage/artist/manage");
        },
      },
    );
  };

  // guard / loading
  if (!Number.isFinite(lessonId) || lessonId <= 0) {
    return <div style={{ padding: 16 }}>잘못된 lessonId 입니다.</div>;
  }
  if (detailQ.isLoading || !detailQ.data)
    return <div style={{ padding: 16 }}>불러오는 중...</div>;
  if (detailQ.isError) return <div style={{ padding: 16 }}>레슨 조회 실패</div>;

  return (
    <div style={{ padding: 16, maxWidth: 720 }}>
      <h2>레슨 수정</h2>

      {/* 입력 폼 섹션 */}
      <EditLessonFormSection
        detail={detailQ.data}
        lessonDraft={lessonDraft}
        setField={setField}
        setAll={setAll}
        myInstruments={myInstruments}
        hasBooked={hasBooked}
      />

      <hr style={{ margin: "20px 0" }} />

      {/* 타임슬롯 섹션(추가 예정분만 관리) */}
      <EditLessonTimeSlotSection
        durationMin={durationMinNum}
        startDts={startDts}
        onAdd={add}
        onAddMany={addMany}
        onRemove={remove}
        onClear={clear}
      />

      <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
        <button type="button" disabled={isPending} onClick={onSubmit}>
          {isPending ? "저장 중..." : "저장"}
        </button>
        <button
          type="button"
          onClick={() => navigate("/mypage/artist/manage")}
          disabled={isPending}
        >
          취소
        </button>
      </div>

      <div style={{ marginTop: 12, opacity: 0.8, fontSize: 13 }}>
        booked 슬롯 존재: <b>{hasBooked ? "YES" : "NO"}</b>
      </div>
    </div>
  );
}

export default EditLessonPage;
