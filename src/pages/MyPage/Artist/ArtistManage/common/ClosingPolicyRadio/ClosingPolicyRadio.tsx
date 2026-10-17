/** @jsxImportSource @emotion/react */
import type { LessonClosingPolicy } from "../../../../../../Types/lessonTypes";
import * as s from "./styles";

type Props = {
  value: LessonClosingPolicy;
  onChange: (value: LessonClosingPolicy) => void;
  disabled?: boolean;
  showHeader?: boolean; // 카드 안에 넣을 때는 제목을 카드에서 보여주므로 false
};

const POLICY_OPTIONS: { value: LessonClosingPolicy; title: string; description: string }[] = [
  {
    value: "KEEP_OPEN_FOR_REQUEST",
    title: "시간이 없어도 계속 공개",
    description: "열린 시간이 모두 지나도 레슨은 공개돼요. 수강생이 일정 협의를 요청할 수 있어요.",
  },
  {
    value: "AUTO_CLOSE_WHEN_NO_SLOTS",
    title: "시간이 없으면 자동 비공개",
    description: "예약 가능한 시간이 하나도 남지 않으면 레슨이 자동으로 비공개돼요.",
  },
];

function ClosingPolicyRadio({ value, onChange, disabled = false, showHeader = true }: Props) {
  return (
    <div css={s.wrap}>
      {showHeader && (
        <>
          <div css={s.label}>예약 가능한 시간이 없을 때</div>
          <div css={s.helperText}>열어둔 시간이 모두 지나거나 마감됐을 때 레슨을 어떻게 보여줄지 정해요.</div>
        </>
      )}

      <div css={s.optionGroup} role="radiogroup" aria-label="예약 가능한 시간이 없을 때">
        {POLICY_OPTIONS.map((opt) => {
          const selected = value === opt.value;
          return (
            <label
              key={opt.value}
              css={[s.optionCard, selected && s.optionCardSelected, disabled && s.optionCardDisabled]}
            >
              <input
                css={s.hiddenRadio}
                type="radio"
                name="closingPolicy"
                value={opt.value}
                checked={selected}
                onChange={() => onChange(opt.value)}
                disabled={disabled}
              />
              <span css={s.dot(selected)} aria-hidden="true" />
              <span css={s.optionTitle}>{opt.title}</span>
              <span css={s.optionDescription}>{opt.description}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default ClosingPolicyRadio;
