import { useNavigate, useParams } from "react-router-dom";
import type {
  LessonFormValues,
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

// 서버 MyLessonDetail -> 폼값
const toFormValues = (d: MyLessonDetail): LessonFormValues => ({
  title: d.title ?? "",
  instrumentId: d.instrumentId ?? null,
  mode: d.mode,
  durationMin: String(d.durationMin ?? ""),
  price: d.price == null ? "" : String(d.price),
  description: d.description ?? "",
  requirementText: d.requirementText ?? "",
});

function EditLessonPage() {
  const navigate = useNavigate();
  const { lessonId: lessonIdParam } = useParams();
  const lessonId = Number(lessonIdParam);

  // 슬롯 조회
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

  // 폼 상태 (setAll로 초기값 주입)
  const { lessonDraft, setField, setAll, reset } = useLessonForm();

  // detail -> form 주입 한번
  useEffect(() => {
    if (!detailQ.data) return;
    setAll(toFormValues(detailQ.data));
  }, [detailQ.data, setAll]);

  // 서버 타임슬롯 조회 + booked 판단
  const slotsQ = useMyTimeSlots(lessonId, from, to);

  const hasBooked = useMemo(() => {
    const slots = slotsQ.data ?? [];
    return slots.some((s) => s.status === "BOOKED"); // booked 상태인 타임슬롯이 있는지 체크
  }, [slotsQ.data]);

  // 추가할 startDts 로컬 상태
  const { startDts, add, addMany, remove, clear } = useStartDts();

  // recurrence 읽기
  const recurrenceQ = useMyRecurrence(lessonId);

  // 저장 (patch + recurrence upsert + slots add 한번에)
  const { mutate, isPending } = useUpdateLessonWithSlots(lessonId, from, to);

  // duration 숫자 파싱(타임슬롯 반복 생성 등에 필요)
  

  return <div></div>;
}

export default EditLessonPage;
