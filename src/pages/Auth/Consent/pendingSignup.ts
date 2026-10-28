// 소셜 첫 가입: 동의 화면까지 임시 가입 토큰을 이 탭에만 잠깐 보관 (10분이면 서버에서 만료)
const KEY = "muzin.oauth2Signup";

export type PendingSignup = { token: string; provider: string | null; redirect: string };

export const savePendingSignup = (p: PendingSignup) => {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    // 저장이 막힌 브라우저 - 동의 화면에서 다시 로그인하라고 안내
  }
};

export const readPendingSignup = (): PendingSignup | null => {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PendingSignup) : null;
  } catch {
    return null;
  }
};

export const clearPendingSignup = () => {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    // 무시
  }
};
