// 비밀번호 규칙 (회원가입 / 비밀번호 변경 공용)
// 길이는 백엔드 @Size(min = 8, max = 64) 와 맞춤. 특수문자는 영문·숫자·공백이 아닌 모든 문자
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 64;

export type PasswordRule = { key: string; label: string; test: (pw: string) => boolean };

export const PASSWORD_RULES: PasswordRule[] = [
  { key: "length", label: `${PASSWORD_MIN}~${PASSWORD_MAX}자`, test: (pw) => pw.length >= PASSWORD_MIN && pw.length <= PASSWORD_MAX },
  { key: "letter", label: "영문", test: (pw) => /[a-zA-Z]/.test(pw) },
  { key: "number", label: "숫자", test: (pw) => /[0-9]/.test(pw) },
  { key: "special", label: "특수문자", test: (pw) => /[^a-zA-Z0-9\s]/.test(pw) },
];

export const PASSWORD_RULE_TEXT = `영문, 숫자, 특수문자를 모두 넣어 ${PASSWORD_MIN}~${PASSWORD_MAX}자로 입력해주세요.`;

export const isValidPassword = (pw: string) => PASSWORD_RULES.every((r) => r.test(pw));
