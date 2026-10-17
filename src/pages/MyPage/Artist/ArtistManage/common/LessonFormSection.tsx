/** @jsxImportSource @emotion/react */
import type {
  LessonFormValues,
  LessonMode,
} from "../../../../../Types/lessonTypes";
import type { InstrumentResponse } from "../../../../../Types/instrumentTypes";
import { css } from "@emotion/react";
import SelectDropdown, { type SelectOption } from "../../../../../components/common/SelectDropdown/SelectDropdown";
import * as f from "./formStyles";

const fullWidth = css`width: 100%;`;

const LESSON_MODE_OPTIONS: SelectOption<LessonMode>[] = [
  { value: "ONLINE", label: "화상 및 온라인" },
  { value: "OFFLINE", label: "학원 및 스튜디오(개인 공간)" },
  { value: "VISIT", label: "방문" },
  { value: "REQUEST_ONLY", label: "레슨 방식 협의" },
];

export const TITLE_MAX = 100;
export const DESCRIPTION_MAX = 2000;
export const REQUIREMENT_MAX = 500;

export type LessonFormErrors = Partial<Record<keyof LessonFormValues, string>>;

type Props = {
  value: LessonFormValues;
  onChange: <K extends keyof LessonFormValues>(
    key: K,
    v: LessonFormValues[K],
  ) => void;

  myInstruments: InstrumentResponse[];
  disabled?: Partial<Record<keyof LessonFormValues, boolean>>; // 잠긴 항목 (예약 진행 중 등)
  errors?: LessonFormErrors;
  // 현재 레슨 악기가 내 악기 목록에서 빠졌을 때도 이름을 보여주기 위함
  currentInstName?: string;
};

// 숫자만 입력 (소수점·음수·e 방지)
const digitsOnly = (v: string) => v.replace(/[^\d]/g, "");

const FieldError = ({ msg }: { msg?: string }) => (msg ? <p css={f.error} role="alert">{msg}</p> : null);

/** 기본 정보: 제목, 악기, 방식, 수업 시간, 가격 */
export function LessonBasicFields({ value, onChange, myInstruments, disabled, errors, currentInstName }: Props) {
  const instOptions = myInstruments.map((inst) => ({ value: String(inst.instId), label: inst.instName }));
  // 내 악기 목록에서 빠진 악기를 쓰고 있으면 선택지에 함께 보여줌
  if (value.instId && !instOptions.some((o) => o.value === String(value.instId)) && currentInstName) {
    instOptions.unshift({ value: String(value.instId), label: `${currentInstName} (등록 해제된 악기)` });
  }

  const priceNum = Number(value.price);
  const priceHint = value.price !== "" && Number.isFinite(priceNum)
    ? priceNum === 0 ? "무료 레슨으로 표시돼요." : `${priceNum.toLocaleString()}원`
    : "무료라면 0을 입력해주세요.";

  return (
    <div css={f.fields}>
      <div css={f.field}>
        <div css={f.labelRow}>
          <label css={f.label} htmlFor="lesson-title">레슨 제목<span css={f.required}>*</span></label>
          <span css={f.counter}>{value.title.length}/{TITLE_MAX}</span>
        </div>
        <input
          id="lesson-title"
          css={f.input(!!errors?.title)}
          value={value.title}
          maxLength={TITLE_MAX}
          disabled={!!disabled?.title}
          onChange={(e) => onChange("title", e.target.value)}
          placeholder="예: 처음 시작하는 플루트 입문 레슨"
        />
        <FieldError msg={errors?.title} />
      </div>

      <div css={f.row2}>
        <div css={f.field}>
          <span css={f.label}>악기<span css={f.required}>*</span></span>
          <SelectDropdown
            css={fullWidth}
            ariaLabel="레슨 악기"
            placeholder={myInstruments.length ? "내 악기 중 선택" : "등록된 악기가 없어요"}
            value={value.instId ? String(value.instId) : ""}
            disabled={!!disabled?.instId}
            onChange={(v) => onChange("instId", Number(v))}
            options={instOptions}
          />
          <FieldError msg={errors?.instId} />
        </div>

        <div css={f.field}>
          <span css={f.label}>레슨 방식<span css={f.required}>*</span></span>
          <SelectDropdown<LessonMode>
            css={fullWidth}
            ariaLabel="레슨 방식"
            value={value.mode}
            disabled={!!disabled?.mode}
            onChange={(v) => onChange("mode", v)}
            options={LESSON_MODE_OPTIONS}
          />
        </div>
      </div>

      <div css={f.row2}>
        <div css={f.field}>
          <label css={f.label} htmlFor="lesson-duration">수업 시간<span css={f.required}>*</span></label>
          <div css={f.suffixWrap}>
            <input
              id="lesson-duration"
              css={f.input(!!errors?.durationMin)}
              inputMode="numeric"
              value={value.durationMin}
              disabled={!!disabled?.durationMin}
              onChange={(e) => onChange("durationMin", digitsOnly(e.target.value).slice(0, 4))}
              placeholder="60"
            />
            <span css={f.suffix}>분</span>
          </div>
          {errors?.durationMin ? <FieldError msg={errors.durationMin} /> : <p css={f.helper}>한 번 수업에 걸리는 시간이에요.</p>}
        </div>

        <div css={f.field}>
          <label css={f.label} htmlFor="lesson-price">가격<span css={f.required}>*</span></label>
          <div css={f.suffixWrap}>
            <input
              id="lesson-price"
              css={f.input(!!errors?.price)}
              inputMode="numeric"
              value={value.price}
              disabled={!!disabled?.price}
              onChange={(e) => onChange("price", digitsOnly(e.target.value).slice(0, 8))}
              placeholder="30000"
            />
            <span css={f.suffix}>원</span>
          </div>
          {errors?.price ? <FieldError msg={errors.price} /> : <p css={f.helper}>{priceHint}</p>}
        </div>
      </div>
    </div>
  );
}

/** 레슨 소개: 설명, 준비물 */
export function LessonIntroFields({ value, onChange, disabled, errors }: Omit<Props, "myInstruments">) {
  return (
    <div css={f.fields}>
      <div css={f.field}>
        <div css={f.labelRow}>
          <label css={f.label} htmlFor="lesson-description">레슨 소개</label>
          <span css={f.counter}>{value.description.length}/{DESCRIPTION_MAX}</span>
        </div>
        <textarea
          id="lesson-description"
          css={f.textarea(!!errors?.description)}
          rows={5}
          maxLength={DESCRIPTION_MAX}
          value={value.description}
          disabled={!!disabled?.description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="어떤 분께 맞는 레슨인지, 어떻게 진행되는지 알려주세요."
        />
        <FieldError msg={errors?.description} />
      </div>

      <div css={f.field}>
        <div css={f.labelRow}>
          <label css={f.label} htmlFor="lesson-requirement">준비물·요청사항</label>
          <span css={f.counter}>{value.requirementText.length}/{REQUIREMENT_MAX}</span>
        </div>
        <textarea
          id="lesson-requirement"
          css={f.textarea(!!errors?.requirementText)}
          rows={3}
          maxLength={REQUIREMENT_MAX}
          value={value.requirementText}
          disabled={!!disabled?.requirementText}
          onChange={(e) => onChange("requirementText", e.target.value)}
          placeholder="예: 개인 악기 지참, 악보 필기용 연필"
        />
        <FieldError msg={errors?.requirementText} />
      </div>
    </div>
  );
}

/** 생성 화면용: 기본 정보 + 소개를 한 번에 */
function LessonFormSection(props: Props) {
  return (
    <section css={f.fields}>
      <LessonBasicFields {...props} />
      <LessonIntroFields {...props} />
    </section>
  );
}

export default LessonFormSection;
