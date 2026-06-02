/** @jsxImportSource @emotion/react */
import * as s from "./styles";

type Props = {
  label?: string;
  name: string;
  value: string;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  error?: string;
  onChange: (value: string) => void;
};

function AuthInput({
  label,
  name,
  value,
  type = "text",
  placeholder,
  autoComplete,
  error,
  onChange,
}: Props) {
  return (
    <div css={s.inputGroup}>
      {label && <label css={s.label}>{label}</label>}

      <input
        css={s.input(error)}
        name={name}
        value={value}
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
      />

      {error && <p css={s.errorText}>{error}</p>}
    </div>
  );
}

export default AuthInput;