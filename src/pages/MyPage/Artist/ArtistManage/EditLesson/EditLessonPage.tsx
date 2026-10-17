/** @jsxImportSource @emotion/react */
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { LessonFormValues, TimeSlotResp } from "../../../../../Types/lessonTypes";
import type { InstrumentResponse } from "../../../../../Types/instrumentTypes";
import {
  addDaysYmd,
  formatSlotLabel,
  MAX_DAYS_AHEAD,
  MAX_SLOTS_PER_SAVE,
  todayYmd,
  toLocalDateTimeString,
} from "../../../../../utils/timeSlotUtils";
import { getMyArtistProfileReq } from "../../../../../apis/artist/artistApi";
import {
  useDeleteMyLesson,
  useDeleteMyTimeSlot,
  useMyLessonDetail,
  useMyTimeSlots,
  useToggleMyTimeSlot,
} from "../../../../../hooks/Lesson/useLessonEdit";
import { useLessonForm } from "../../../../../hooks/Lesson/useLessonForm";
import { useStartDts } from "../../../../../hooks/Lesson/useStartDts";
import { useUpdateLessonWithSlots } from "../../../../../hooks/Lesson/useUpdateLessonWithSlots";
import { toast } from "../../../../../stores/useToastStore";
import ConfirmModal from "../../../../../components/common/ConfirmModal/ConfirmModal";
import { LessonBasicFields, LessonIntroFields, type LessonFormErrors } from "../common/LessonFormSection";
import ClosingPolicyRadio from "../common/ClosingPolicyRadio/ClosingPolicyRadio";
import { buildLessonUpdatePatch, toFormValues, validateLessonForm } from "./buildLessonUpdatePatch";
import EditLessonTimeSlotSection, { type SlotAction } from "./EditLessonTimeSlotSection";
import * as f from "../common/formStyles";
import * as s from "./styles";
import * as sl from "../common/TimeSlots/slotStyles";

// 진행 중인 예약이 있으면 잠기는 항목
const CORE_FIELDS: (keyof LessonFormValues)[] = ["title", "instId", "mode", "durationMin", "price"];

type PendingConfirm =
  | { kind: "leave" }
  | { kind: "deleteLesson" }
  | { kind: "deleteSlot"; slot: TimeSlotResp };

function EditLessonPage() {
  const navigate = useNavigate();
  const { lessonId: lessonIdParam } = useParams();
  const lessonId = Number(lessonIdParam);
  const validId = Number.isInteger(lessonId) && lessonId > 0;

  // 시간 조회 범위: 오늘 ~ 90일 (화면에선 지금 이후만 보여줌)
  const fromYmd = todayYmd();
  const from = toLocalDateTimeString(fromYmd, "00:00");
  const to = toLocalDateTimeString(addDaysYmd(fromYmd, MAX_DAYS_AHEAD), "23:59");

  // 내 악기 목록
  const { data: profile } = useQuery({
    queryKey: ["artistProfile", "me"],
    queryFn: async () => (await getMyArtistProfileReq()).data.data,
  });
  const myInstruments = (profile?.instruments ?? []) as InstrumentResponse[];

  const detailQ = useMyLessonDetail(lessonId);
  const slotsQ = useMyTimeSlots(lessonId, from, to);
  const detail = detailQ.data;

  const { lessonDraft, setField, setAll } = useLessonForm();
  const { startDts, add, addMany, remove, clear } = useStartDts();
  const [errors, setErrors] = useState<LessonFormErrors>({});
  const [confirm, setConfirm] = useState<PendingConfirm | null>(null);
  const [busySlotId, setBusySlotId] = useState<number | null>(null);
  const [hydratedId, setHydratedId] = useState<number | null>(null);

  const saveMut = useUpdateLessonWithSlots(lessonId, from, to);
  const deleteLessonMut = useDeleteMyLesson(lessonId);
  const toggleSlotMut = useToggleMyTimeSlot(lessonId, from, to);
  const deleteSlotMut = useDeleteMyTimeSlot(lessonId, from, to);

  // 서버 값으로 폼 채우기 (레슨이 바뀔 때 1회) - 렌더 중 이전 값과 비교해서 조정
  if (detail && hydratedId !== detail.lessonId) {
    setHydratedId(detail.lessonId);
    setAll(toFormValues(detail));
  }

  const locked = (detail?.activeReservationCount ?? 0) > 0;
  const lockedMap = useMemo(
    () => (locked ? Object.fromEntries(CORE_FIELDS.map((k) => [k, true])) : {}),
    [locked],
  );

  // 바뀐 내용 (저장 버튼 활성화, 나가기 확인)
  const patch = useMemo(
    () => (detail && hydratedId === detail.lessonId
      ? buildLessonUpdatePatch({ original: detail, draft: lessonDraft, coreEditable: !locked })
      : {}),
    [detail, lessonDraft, locked, hydratedId],
  );
  const changedFieldCount = Object.keys(patch).length;
  const dirty = changedFieldCount > 0 || startDts.length > 0;

  // 새로고침/탭 닫기 시 경고
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);

  const goList = () => navigate("/mypage/artist/manage");
  const onLeave = () => (dirty ? setConfirm({ kind: "leave" }) : goList());

  const onFieldChange = <K extends keyof LessonFormValues>(key: K, v: LessonFormValues[K]) => {
    setField(key, v);
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const onSave = () => {
    if (!detail || !dirty) return;
    const all = validateLessonForm(lessonDraft);
    // 잠긴 항목은 사용자가 고칠 수 없으니 검증에서 제외
    const nextErrors = Object.fromEntries(
      Object.entries(all).filter(([k]) => !(locked && CORE_FIELDS.includes(k as keyof LessonFormValues))),
    ) as LessonFormErrors;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("입력 내용을 확인해주세요.");
      requestAnimationFrame(() =>
        document.querySelector('[role="alert"]')?.scrollIntoView({ behavior: "smooth", block: "center" }),
      );
      return;
    }

    const addedCount = startDts.length;
    if (addedCount > MAX_SLOTS_PER_SAVE) {
      toast.error(`시간은 한 번에 ${MAX_SLOTS_PER_SAVE}개까지 저장할 수 있어요. 지금 ${addedCount}개가 추가 예정이에요.`);
      return;
    }
    saveMut.mutate(
      { lesson: changedFieldCount > 0 ? patch : undefined, addStartDts: startDts },
      {
        onSuccess: async () => {
          clear();
          // 서버에 저장된 값으로 폼을 다시 맞춤 (공백 정리 등)
          const fresh = await detailQ.refetch();
          if (fresh.data) setAll(toFormValues(fresh.data));
          toast.success(addedCount > 0 ? `저장했어요. 시간 ${addedCount}개를 추가했어요.` : "저장했어요.");
        },
      },
    );
  };

  // 등록된 시간 닫기/열기는 바로, 삭제는 확인 후
  const onSlotAction = (slot: TimeSlotResp, action: SlotAction) => {
    if (action === "delete") {
      setConfirm({ kind: "deleteSlot", slot });
      return;
    }
    setBusySlotId(slot.timeSlotId);
    toggleSlotMut.mutate(
      { timeSlotId: slot.timeSlotId, next: action === "close" ? "CLOSED" : "OPEN" },
      {
        onSuccess: () =>
          toast.success(`${formatSlotLabel(slot.startDt)} 시간을 ${action === "close" ? "닫았어요" : "다시 열었어요"}.`),
        onSettled: () => {
          setBusySlotId(null);
          slotsQ.refetch();
        },
      },
    );
  };

  const onConfirm = () => {
    if (!confirm) return;
    if (confirm.kind === "leave") {
      clear();
      setConfirm(null);
      goList();
      return;
    }
    if (confirm.kind === "deleteSlot") {
      const { slot } = confirm;
      setBusySlotId(slot.timeSlotId);
      deleteSlotMut.mutate(slot.timeSlotId, {
        onSuccess: () => toast.success(`${formatSlotLabel(slot.startDt)} 시간을 삭제했어요.`),
        onSettled: () => {
          setBusySlotId(null);
          setConfirm(null);
          slotsQ.refetch();
        },
      });
      return;
    }
    deleteLessonMut.mutate(undefined, {
      onSuccess: () => {
        toast.success("레슨을 삭제했어요.");
        goList();
      },
      onSettled: () => setConfirm(null),
    });
  };

  // ---------- 상태별 화면 ----------
  if (!validId) {
    return (
      <div css={s.centerState}>
        <h2>잘못된 주소예요</h2>
        <button type="button" css={sl.btn()} onClick={goList}>내 레슨 관리로</button>
      </div>
    );
  }
  if (detailQ.isError) {
    return (
      <div css={s.centerState}>
        <h2>레슨을 불러오지 못했어요</h2>
        <p>없는 레슨이거나 접근 권한이 없어요.</p>
        <button type="button" css={sl.btn()} onClick={goList}>내 레슨 관리로</button>
      </div>
    );
  }
  if (!detail) return <div css={s.centerState}>불러오는 중...</div>;
  if (detail.deleted) {
    return (
      <div css={s.centerState}>
        <h2>삭제된 레슨이에요</h2>
        <button type="button" css={sl.btn()} onClick={goList}>내 레슨 관리로</button>
      </div>
    );
  }

  const durationNum = Number(lessonDraft.durationMin);
  const saving = saveMut.isPending;

  const dirtyLabel = [
    changedFieldCount > 0 ? `${changedFieldCount}개 항목` : null,
    startDts.length > 0 ? `시간 ${startDts.length}개` : null,
  ].filter(Boolean).join(" · ");

  return (
    <div css={s.page}>
      <button type="button" css={s.backLink} onClick={onLeave}>← 내 레슨 관리</button>

      <div css={s.header}>
        <div>
          <h1 css={s.title}>레슨 수정</h1>
          <p css={s.subtitle}>{detail.title}</p>
        </div>
        <span css={s.statusBadge(detail.status === "ACTIVE")}>
          {detail.status === "ACTIVE" ? "공개 중" : "비공개"}
        </span>
      </div>

      <div css={s.stack}>
        {locked && (
          <div css={s.banner} role="note">
            <div>
              <strong>진행 중인 예약이 {detail.activeReservationCount}건 있어요</strong>
              예약한 수강생을 위해 제목·악기·레슨 방식·수업 시간·가격은 예약이 모두 끝난 뒤에 바꿀 수 있어요.
              소개, 준비물, 운영 방식, 시간 추가·닫기는 지금도 바꿀 수 있어요.
            </div>
            <button type="button" css={s.bannerLink} onClick={() => navigate("/mypage/reservations/requests")}>
              예약 관리 →
            </button>
          </div>
        )}

        <section css={f.card}>
          <div css={f.cardHeader}>
            <div>
              <h2 css={f.cardTitle}>기본 정보</h2>
              <p css={f.cardDesc}>레슨 검색과 상세 화면에 보여지는 정보예요.</p>
            </div>
          </div>
          <LessonBasicFields
            value={lessonDraft}
            onChange={onFieldChange}
            myInstruments={myInstruments}
            disabled={lockedMap}
            errors={errors}
            currentInstName={detail.instName}
          />
          {locked && <p css={f.lockNote} style={{ marginTop: 12 }}>🔒 진행 중인 예약이 있어 잠긴 항목이에요.</p>}
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
              <p css={f.cardDesc}>수강생이 예약할 수 있는 시간이에요. 한 번에 {detail.durationMin}분씩 진행돼요.</p>
            </div>
          </div>
          {slotsQ.isLoading ? (
            <p css={f.helper}>시간을 불러오는 중...</p>
          ) : (
            <EditLessonTimeSlotSection
              durationMin={Number.isInteger(durationNum) && durationNum > 0 ? durationNum : detail.durationMin}
              savedDurationMin={detail.durationMin}
              serverSlots={slotsQ.data ?? []}
              draftStartDts={startDts}
              onAdd={add}
              onAddMany={addMany}
              onRemoveDraft={remove}
              onClearDraft={clear}
              onSlotAction={onSlotAction}
              busySlotId={busySlotId}
            />
          )}
        </section>
      </div>

      {/* 하단 고정 바 */}
      <div css={s.actionBar}>
        <button
          type="button"
          css={sl.btn("danger")}
          disabled={locked || saving}
          title={locked ? "진행 중인 예약이 있어 삭제할 수 없어요. 비공개로 전환하면 새 예약을 막을 수 있어요." : undefined}
          onClick={() => setConfirm({ kind: "deleteLesson" })}
        >
          레슨 삭제
        </button>
        <span css={s.dirtyText(dirty)}>
          {dirty ? `저장하지 않은 변경: ${dirtyLabel}` : "변경 사항 없음"}
        </span>
        <button type="button" css={sl.btn()} onClick={onLeave} disabled={saving}>취소</button>
        <button type="button" css={sl.btn("primary")} onClick={onSave} disabled={!dirty || saving}>
          {saving ? "저장 중..." : "저장하기"}
        </button>
      </div>

      <ConfirmModal
        open={!!confirm}
        title={
          confirm?.kind === "leave" ? "저장하지 않고 나갈까요?"
            : confirm?.kind === "deleteSlot" ? "이 시간을 삭제할까요?"
            : "레슨을 삭제할까요?"
        }
        message={
          confirm?.kind === "leave" ? "변경한 내용과 추가 예정인 시간이 사라져요."
            : confirm?.kind === "deleteSlot" ? `${formatSlotLabel(confirm.slot.startDt)} 시간이 삭제돼요. 잠시 예약만 막으려면 '닫기'를 이용해주세요.`
            : `'${detail.title}' 레슨과 예정된 시간이 모두 사라지고 되돌릴 수 없어요.`
        }
        confirmText={confirm?.kind === "leave" ? "나가기" : "삭제"}
        cancelText="취소"
        loading={deleteLessonMut.isPending || deleteSlotMut.isPending}
        onConfirm={onConfirm}
        onClose={() => setConfirm(null)}
      />
    </div>
  );
}

export default EditLessonPage;
