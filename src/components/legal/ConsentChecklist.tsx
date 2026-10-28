/** @jsxImportSource @emotion/react */
import * as s from "./consentStyles";

import { allAgreed, type Consent } from "../../legal/consent";

const ITEMS: { key: keyof Consent; label: string; to: string }[] = [
  { key: "agreeTerms", label: "이용약관에 동의해요", to: "/terms" },
  { key: "agreePrivacy", label: "개인정보 수집·이용에 동의해요", to: "/privacy#collect" },
  { key: "ageOver14", label: "만 14세 이상이에요", to: "/terms#article-5" },
];

type Props = { value: Consent; onChange: (next: Consent) => void; disabled?: boolean };

// 가입 동의 (필수 3개). "내용 보기"는 새 탭으로 열어 입력하던 내용이 사라지지 않게
function ConsentChecklist({ value, onChange, disabled }: Props) {
  const every = allAgreed(value);
  return (
    <fieldset css={s.box} disabled={disabled}>
      <legend css={s.legend}>약관 동의</legend>
      <label css={s.all}>
        <input
          type="checkbox"
          checked={every}
          onChange={(e) => onChange({ agreeTerms: e.target.checked, agreePrivacy: e.target.checked, ageOver14: e.target.checked })}
        />
        모두 동의해요
      </label>
      <ul css={s.list}>
        {ITEMS.map((it) => (
          <li key={it.key} css={s.item}>
            <label css={s.label}>
              <input type="checkbox" checked={value[it.key]} onChange={(e) => onChange({ ...value, [it.key]: e.target.checked })} />
              <span>
                <span css={s.required}>[필수]</span> {it.label}
              </span>
            </label>
            <a href={it.to} target="_blank" rel="noopener" css={s.view}>
              내용 보기
            </a>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}

export default ConsentChecklist;
