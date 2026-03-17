/** @jsxImportSource @emotion/react */
import {
  LESSON_CLOSING_POLICY_LABEL,
  type LessonClosingPolicy,
} from "../../../../../../Types/lessonTypes";
import * as s from "./styles";

type Props = {
  value: LessonClosingPolicy;
  onChange: (value: LessonClosingPolicy) => void;
  disabled?: boolean;
};

const POLICY_OPTIONS: LessonClosingPolicy[] = [
  "KEEP_OPEN_FOR_REQUEST",
  "AUTO_CLOSE_WHEN_NO_SLOTS",
];

function ClosingPolicyRadio({ value, onChange, disabled = false }: Props) {
  return (
    <div css={s.wrap}>
      <div css={s.label}>타임슬롯 종료 후 운영 방식</div>
      <div css={s.helperText}>
        타임슬롯이 모두 끝난 뒤 레슨을 어떻게 운영할지 선택해주세요.
      </div>

      <div css={s.optionGroup}>
        {POLICY_OPTIONS.map((policy) => (
          <label
            key={policy}
            css={[s.optionCard, value === policy && s.optionCardSelected]}
          >
            <input
              css={s.hiddenRadio}
              type="radio"
              name="closingPolicy"
              value={policy}
              checked={value === policy}
              onChange={() => onChange(policy)}
              disabled={disabled}
            />
            <div css={s.optionTitle}>{LESSON_CLOSING_POLICY_LABEL[policy]}</div>
            <div css={s.optionDescription}>
              {policy === "KEEP_OPEN_FOR_REQUEST"
                ? "타임슬롯이 없어도 레슨 요청을 계속 받을 수 있어요."
                : "미래 오픈 타임슬롯이 없으면 레슨이 자동으로 비활성화돼요."}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}

export default ClosingPolicyRadio;
