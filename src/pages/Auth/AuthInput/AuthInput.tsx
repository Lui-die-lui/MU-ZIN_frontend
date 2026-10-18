/** @jsxImportSource @emotion/react */
import * as s from "./styles";
import { useId, useState, type Ref } from "react";
import { IoCloseCircle, IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";

type Props = {
  label: string;
  name: string;
  value: string;
  type?: "text" | "email" | "password";
  autoComplete?: string;
  autoFocus?: boolean;
  invalid?: boolean;
  // 칸 아래 안내 문구 영역 id
  describedBy?: string;
  inputRef?: Ref<HTMLInputElement>;
  onChange: (value: string) => void;
  onBlur?: () => void;
};

// 로그인 / 회원가입 입력칸 (요즘 네이버 로그인 모양)
// - 밑줄 입력칸, 비어 있으면 라벨이 칸 안에 있다가 입력/초점 시 위로 작게 올라감
// - 값이 있으면 지우기(×), 비밀번호 칸은 보기/숨기기, Caps Lock 표시
function AuthInput({
  label,
  name,
  value,
  type = "text",
  autoComplete,
  autoFocus,
  invalid = false,
  describedBy,
  inputRef,
  onChange,
  onBlur,
}: Props) {
  const id = useId();
  const isPassword = type === "password";
  const [revealed, setRevealed] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const checkCapsLock = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (isPassword) setCapsLock(e.getModifierState("CapsLock"));
  };

  return (
    <div css={s.field(invalid)} data-field={name}>
      <div css={s.control}>
        {/* placeholder=" " : 비어 있는지 CSS(:placeholder-shown)로 알아내 라벨 위치를 정함 */}
        <input
          id={id}
          ref={inputRef}
          css={s.input}
          name={name}
          value={value}
          type={isPassword && revealed ? "text" : type}
          placeholder=" "
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          spellCheck={false}
          autoCapitalize="off"
          aria-invalid={invalid}
          aria-describedby={describedBy}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => {
            setCapsLock(false);
            onBlur?.();
          }}
          onKeyDown={checkCapsLock}
          onKeyUp={checkCapsLock}
        />
        <label css={s.label} htmlFor={id}>
          {label}
        </label>
      </div>

      <div css={s.actions}>
        {capsLock && (
          <span css={s.capsBadge} role="status">
            Caps Lock
          </span>
        )}
        {isPassword && (
          <button
            type="button"
            css={s.iconButton}
            aria-label={revealed ? "비밀번호 숨기기" : "비밀번호 보기"}
            aria-pressed={revealed}
            onClick={() => setRevealed((v) => !v)}
          >
            {revealed ? <IoEyeOffOutline /> : <IoEyeOutline />}
          </button>
        )}
        {value && (
          <button
            type="button"
            css={s.clearButton}
            aria-label={`${label} 지우기`}
            onClick={(e) => {
              onChange("");
              // 지운 뒤 바로 다시 입력할 수 있게 같은 칸에 초점
              e.currentTarget.closest("[data-field]")?.querySelector("input")?.focus();
            }}
          >
            <IoCloseCircle />
          </button>
        )}
      </div>
    </div>
  );
}

export default AuthInput;
