// MU:ZIN 메탈 톤 디자인 값 (메인 · 인증 및 개인정보)
// 차콜 · 오프화이트 · 스틸 실버 + 라임 포인트(주요 버튼·포커스·완료 표시에만, 보라 계열 없음)
// 금속 느낌은 브러시드 스틸 줄무늬 · 얇은 실버 테두리 · 작은 크롬 나사 정도로만

export const c = {
  ink: "#111315", // 차콜 블랙
  paper: "#F2F0EB", // 오프화이트
  steel: "#AEB4B8", // 스틸 실버
  steelDeep: "#7D8488", // 실버 위 글자 (보조 문구)
  hairline: "rgba(17, 19, 21, 0.12)",
  white: "#FFFFFF",
  lime: "#D7FF3F",
  danger: "#B3261E",
};

export const font = {
  // 숫자 카운터는 장비 표시창처럼 고정폭
  mono: `ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace`,
};

// 브러시드 스틸 - 아주 옅은 가로 결 + 위쪽 반사광
export const brushed = `
  repeating-linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.05) 0px,
    rgba(255, 255, 255, 0.05) 1px,
    rgba(0, 0, 0, 0.035) 1px,
    rgba(0, 0, 0, 0.035) 2px
  ),
  linear-gradient(180deg, #E9ECED 0%, #C9CED1 55%, #B5BBBF 100%)
`;

// 어두운 판(헤더)용 브러시드 결
export const brushedDark = `
  repeating-linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.025) 0px,
    rgba(255, 255, 255, 0.025) 1px,
    rgba(0, 0, 0, 0) 1px,
    rgba(0, 0, 0, 0) 3px
  ),
  linear-gradient(160deg, #1B1E21 0%, #111315 60%, #0B0C0D 100%)
`;

// 크롬 나사 (패널 모서리 장식)
export const chromeDot = `radial-gradient(circle at 35% 30%, #FFFFFF 0%, #D9DDDF 35%, #8F969A 75%, #5E6468 100%)`;
