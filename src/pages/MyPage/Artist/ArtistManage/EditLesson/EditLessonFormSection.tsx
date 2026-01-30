import { useEffect, useMemo, useRef } from "react";
import type { InstrumentResponse } from "../../../../../Types/instrumentTypes";
import type {
  LessonFormValues,
  MyLessonDetail,
} from "../../../../../Types/lessonTypes";
import LessonFormSection from "../common/LessonFormSection";

type DisabledMap = Partial<Record<keyof LessonFormValues, boolean>>;

// 서버 MyLessonDetail -> 폼값
const toFormValues = (d: MyLessonDetail): LessonFormValues => ({
  title: d.title ?? "",
  instId: d.instId ?? 0, 
  mode: d.mode,
  durationMin: String(d.durationMin ?? ""),
  price: d.price == null ? "" : String(d.price),
  description: d.description ?? "",
  requirementText: d.requirementText ?? "",
});

type Props = {
  detail: MyLessonDetail;
  lessonDraft: LessonFormValues;
  setField: <K extends keyof LessonFormValues>(
    key: K,
    value: LessonFormValues[K],
  ) => void;
  setAll: (next: Partial<LessonFormValues>) => void;
  myInstruments: InstrumentResponse[];
  hasBooked: boolean;
};

function EditLessonFormSection({
  detail,
  lessonDraft,
  setField,
  setAll,
  myInstruments,
  hasBooked,
}: Props) {
  // detail -> setAll을 "최초 1회만"
  const hydratedRef = useRef(false);

  useEffect(() => {
    if (hydratedRef.current) return;
    // setAll(toFormValues(detail));

    const next = toFormValues(detail);
   
    setAll(next);

    hydratedRef.current = true;
  }, [detail, setAll]);

  const disabledMap: DisabledMap = useMemo(() => {
    if (!hasBooked) return {};
    return {
      title: true,
      mode: true,
      durationMin: true,
      price: true,
      instId: true,
    };
  }, [hasBooked]);

  return (
    <LessonFormSection
      value={lessonDraft}
      onChange={setField}
      myInstruments={myInstruments}
      // TODO: booked 있으면 title/mode/duration/price/instrument 잠그고 싶으면
      // LessonFormSection에 coreDisabled 같은 prop을 추가해서 내부에서 disabled 처리
      disabled={disabledMap}
    />
  );
}

export default EditLessonFormSection;
