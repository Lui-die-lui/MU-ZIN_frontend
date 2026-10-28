// 가입 동의 세 가지 (서버 ConsentRequest 와 같은 이름)
export type Consent = { agreeTerms: boolean; agreePrivacy: boolean; ageOver14: boolean };
export const EMPTY_CONSENT: Consent = { agreeTerms: false, agreePrivacy: false, ageOver14: false };
export const allAgreed = (c: Consent) => c.agreeTerms && c.agreePrivacy && c.ageOver14;
