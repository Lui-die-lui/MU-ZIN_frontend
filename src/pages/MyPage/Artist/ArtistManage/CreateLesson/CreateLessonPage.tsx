/** @jsxImportSource @emotion/react */
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useLessonForm } from "../../../../../hooks/Lesson/useLessonForm";
import { useStartDts } from "../../../../../hooks/Lesson/useStartDts";
import { useCreateLessonWithSlots } from "../../../../../hooks/Lesson/useCreateLessonWithSlots";
import { getMyArtistProfileReq } from "../../../../../apis/artist/artistApi";
import type { InstrumentResponse } from "../../../../../Types/instrumentTypes";
import type { LessonCreateReq, LessonFormValues } from "../../../../../Types/lessonTypes";
import { LessonBasicFields, LessonIntroFields, type LessonFormErrors } from "../common/LessonFormSection";
import TimeSlotCreatePanel from "../common/TimeSlots/TimeSlotCreatePanel/TimeSlotCreatePanel";
import ClosingPolicyRadio from "../common/ClosingPolicyRadio/ClosingPolicyRadio";
import { validateLessonForm } from "../EditLesson/buildLessonUpdatePatch";
import { toast } from "../../../../../stores/useToastStore";
import { findOverlappingStart, formatSlotLabel, MAX_SLOTS_PER_SAVE } from "../../../../../utils/timeSlotUtils";
import * as f from "../common/formStyles";
import * as sl from "../common/TimeSlots/slotStyles";
import * as s from "./styles";

// 변환 함수 - form 재사용을 위해서
const toCreateReq = (v: LessonFormValues): LessonCreateReq => ({
  title: v.title.trim(),
  mode: v.mode,
  durationMin: Number(v.durationMin),
  price: v.price.trim() === "" ? null : Number(v.price),
  description: v.description.trim() === "" ? null : v.description,
  requirementText: v.requirementText.trim() === "" ? null : v.requirementText,
  instId: v.instId,
  closingPolicy: v.closingPolicy,
});

function CreateLessonPage() {
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ["artistProfile", "me"],
    queryFn: async () => (await getMyArtistProfileReq()).data.data,
  });
  const myInstruments = (profile?.instruments ?? []) as InstrumentResponse[];

  const { lessonDraft, setField, reset } = useLessonForm();
  const { startDts, add, addMany, remove, clear } = useStartDts();
  const [errors, setErrors] = useState<LessonFormErrors>({});
  const { mutate, isPending } = useCreateLessonWithSlots();

  const durationMinNum = useMemo(() => {
    const n = Number(lessonDraft.durationMin);
    return Number.isFinite(n) ? n : NaN;
  }, [lessonDraft.durationMin]);

  const onFieldChange = <K extends keyof LessonFormValues>(key: K, v: LessonFormValues[K]) => {
    setField(key, v);
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  // 추가 예정 시간끼리 같은 시각 / 겹치는 시각인지 (수업 시간을 아직 안 넣었으면 같은 시각만)
  const checkConflict = useCallback(
    (dt: string) => {
      const dm = durationMinNum > 0 ? durationMinNum : 1;
      const hit = findOverlappingStart(dt, startDts, dm);
      if (!hit) return null;
      return hit.slice(0, 16) === dt.slice(0, 16)
        ? `${formatSlotLabel(dt)}은 이미 추가된 시간이에요.`
        : `${formatSlotLabel(hit)} 수업과 시간이 겹쳐요. (수업 ${dm}분)`;
    },
    [startDts, durationMinNum],
  );

  const onSubmit = () => {
    const nextErrors = validateLessonForm(lessonDraft);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("입력 내용을 확인해주세요.");
      requestAnimationFrame(() =>
        document.querySelector('[role="alert"]')?.scrollIntoView({ behavior: "smooth", block: "center" }),
      );
      return;
    }
    if (startDts.length > MAX_SLOTS_PER_SAVE) {
      toast.error(`시간은 한 번에 ${MAX_SLOTS_PER_SAVE}개까지 추가할 수 있어요.`);
      return;
    }

    mutate(
      { lesson: toCreateReq(lessonDraft), startDts },
      {
        onSuccess: ({ warnings }) => {
          reset();
          clear();
          // 레슨은 만들어졌지만 시간 추가 일부가 실패한 경우 안내 (수정 화면에서 다시 추가 가능)
          if (warnings.length > 0) {
            toast.warning(`레슨이 생성되었지만 일부 작업이 실패했어요.\n${warnings.join("\n")}`);
          } else {
            toast.success("레슨이 생성되었습니다.");
          }
          navigate("/mypage/artist/manage");
        },
        // 레슨 생성 자체의 실패는 전역 토스트가 백엔드 메시지로 표시
      },
    );
  };

  const goList = () => navigate("/mypage/artist/manage");

  return (
    <div css={s.page}>
      <button type="button" css={s.backLink} onClick={goList}>← 내 레슨 관리</button>

      <div css={s.header}>
        <div>
          <h1 css={s.title}>레슨 만들기</h1>
          <p css={s.subtitle}>만든 레슨은 바로 공개되고, 열어둔 시간에 수강생이 예약할 수 있어요.</p>
        </div>
      </div>

      <div css={s.stack}>
        <section css={f.card}>
          <div css={f.cardHeader}>
            <div>
              <h2 css={f.cardTitle}>기본 정보</h2>
              <p css={f.cardDesc}>레슨 검색과 상세 화면에 보여지는 정보예요.</p>
            </div>
          </div>
          <LessonBasicFields value={lessonDraft} onChange={onFieldChange} myInstruments={myInstruments} errors={errors} />
        </section>

        <section css={f.card}>
          <div css={f.cardHeader}>
            <div>
              <h2 css={f.cardTitle}>레슨 소개</h2>
              <p css={f.cardDesc}>수강생이 예약 전에 확인하는 내용이에요.</p>
            </div>
          </div>
          <LessonIntroFields value={lessonDraft} onChange={onFieldChange} errors={errors} />
        </section>

        <section css={f.card}>
          <div css={f.cardHeader}>
            <div>
              <h2 css={f.cardTitle}>예약 가능한 시간이 없을 때</h2>
              <p css={f.cardDesc}>열어둔 시간이 모두 지나거나 마감됐을 때 레슨을 어떻게 보여줄지 정해요.</p>
            </div>
          </div>
          <ClosingPolicyRadio
            showHeader={false}
            value={lessonDraft.closingPolicy}
            onChange={(v) => onFieldChange("closingPolicy", v)}
          />
        </section>

        <section css={f.card}>
          <div css={f.cardHeader}>
            <div>
              <h2 css={f.cardTitle}>레슨 시간</h2>
              <p css={f.cardDesc}>
                수강생이 예약할 수 있는 시간이에요. 지금 넣지 않아도 레슨을 만든 뒤 수정 화면에서 추가할 수 있어요.
              </p>
            </div>
          </div>
          <TimeSlotCreatePanel durationMin={durationMinNum} onAdd={add} onAddMany={addMany} checkConflict={checkConflict} />

          <div css={s.sectionLabel}>
            <span>추가할 시간 {startDts.length}개 <small>· 레슨을 만들면 함께 등록돼요</small></span>
            {startDts.length > 0 && (
              <button type="button" css={s.textBtn} onClick={clear}>모두 빼기</button>
            )}
          </div>
          {startDts.length === 0 ? (
            <div css={s.empty}>아직 추가한 시간이 없어요.</div>
          ) : (
            <div css={s.draftList}>
              {startDts.map((dt) => (
                <span key={dt} css={s.draftChip}>
                  {formatSlotLabel(dt)}
                  <button type="button" aria-label={`${formatSlotLabel(dt)} 빼기`} onClick={() => remove(dt)}>×</button>
                </span>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* 하단 고정 바 */}
      <div css={s.actionBar}>
        <span css={s.dirtyText(startDts.length > 0)}>
          {startDts.length > 0 ? `시간 ${startDts.length}개와 함께 만들어요` : "시간 없이 만들어요"}
        </span>
        <button type="button" css={sl.btn()} onClick={goList} disabled={isPending}>취소</button>
        <button type="button" css={sl.btn("primary")} onClick={onSubmit} disabled={isPending}>
          {isPending ? "만드는 중..." : "레슨 만들기"}
        </button>
      </div>
    </div>
  );
}

export default CreateLessonPage;
