import { css, keyframes } from "@emotion/react";

// 둥근모꼴 (라벨 글꼴) - 메인에서 Global 로 등록, 받기 전엔 고정폭 기본 글꼴
export const labelFontFace = css`
  @font-face {
    font-family: "RoundedFixedsys";
    src: url("https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_six@1.2/DungGeunMo.woff") format("woff");
    font-weight: normal;
    font-display: swap;
  }
`;

// 비닐 포장 악기 - 투명 필름 + 얇은 실링 + 부드러운 반사광, 천천히 떠 있는 움직임
// 장난감 포장처럼 보이지 않게 테두리·광택은 옅게

// 살짝 기운 채(-2°)로 위아래로만 - 각도까지 움직이면 라벨 글자가 미세하게 떨려 보임
const floatY = keyframes`
  0%, 100% { transform: translateY(0) rotate(-2deg); }
  50% { transform: translateY(-10px) rotate(-2deg); }
`;

// 떠오를 때 그림자는 작고 옅게
const shadowPulse = keyframes`
  0%, 100% { transform: scaleX(1); opacity: 0.5; }
  50% { transform: scaleX(0.86); opacity: 0.34; }
`;

const reduceMotion = `@media (prefers-reduced-motion: reduce) { animation: none; }`;

export const stage = css`
  position: relative;
  display: grid;
  justify-items: center;
  padding: 8px 0 18px;
`;

export const float = css`
  transform: rotate(-2deg);
  animation: ${floatY} 6s ease-in-out infinite;
  ${reduceMotion}
`;

export const pack = css`
  position: relative;
  display: grid;
  place-items: center;
  width: 300px;
  height: 352px;
  border-radius: 26px 26px 30px 30px;
  /* 투명 필름: 아주 옅은 흰빛 + 가장자리만 살짝 진하게 */
  background:
    radial-gradient(120% 80% at 50% 45%, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.3) 100%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.34) 0%, rgba(255, 255, 255, 0.08) 100%);
  border: 1px solid rgba(255, 255, 255, 0.9);
  box-shadow:
    inset 0 0 0 1px rgba(174, 180, 184, 0.35),
    inset 0 18px 30px -18px rgba(255, 255, 255, 0.95),
    inset 0 -16px 28px -20px rgba(120, 128, 133, 0.35),
    0 18px 40px -26px rgba(17, 19, 21, 0.35);
  backdrop-filter: blur(1.5px);

  @media (max-width: 600px) {
    width: 212px;
    height: 248px;
    border-radius: 22px 22px 26px 26px;
  }
`;

// 위쪽 열접착 실링: 촘촘한 세로 결 + 아래 톱니 가장자리
export const seal = css`
  position: absolute;
  left: 10px;
  right: 10px;
  top: 10px;
  height: 30px;
  border-radius: 10px 10px 4px 4px;
  background:
    repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.75) 0 2px, rgba(201, 205, 208, 0.35) 2px 4px);
  box-shadow: inset 0 -1px 0 rgba(174, 180, 184, 0.6);
  -webkit-mask: linear-gradient(#000 0 0) top / 100% calc(100% - 4px) no-repeat,
    conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) bottom / 8px 4px repeat-x;
  mask: linear-gradient(#000 0 0) top / 100% calc(100% - 4px) no-repeat,
    conic-gradient(from -45deg at bottom, #0000, #000 1deg 89deg, #0000 90deg) bottom / 8px 4px repeat-x;
  z-index: 3;

  @media (max-width: 600px) {
    height: 24px;
  }
`;

// 걸이 구멍 (상품 진열용 타원 구멍)
export const hole = css`
  position: absolute;
  left: 50%;
  top: 8px;
  width: 34px;
  height: 9px;
  margin-left: -17px;
  border-radius: 999px;
  background: #F2F0EB;
  box-shadow: inset 0 1px 2px rgba(17, 19, 21, 0.25), 0 0 0 1px rgba(174, 180, 184, 0.55);

  @media (max-width: 600px) {
    top: 6px;
  }
`;

export const sealBottom = css`
  position: absolute;
  left: 12px;
  right: 12px;
  bottom: 10px;
  height: 12px;
  border-radius: 3px 3px 12px 12px;
  background: repeating-linear-gradient(90deg, rgba(255, 255, 255, 0.6) 0 2px, rgba(201, 205, 208, 0.3) 2px 4px);
  box-shadow: inset 0 1px 0 rgba(174, 180, 184, 0.5);
  z-index: 3;
`;

export const instrument = (loaded: boolean) => css`
  position: relative;
  z-index: 1;
  width: 226px;
  height: 226px;
  margin-top: 10px;
  object-fit: contain;
  /* 필름 안에 눌려 있는 느낌: 살짝 기울이고 아래로 그림자 */
  transform: rotate(-6deg);
  filter: drop-shadow(0 14px 14px rgba(17, 19, 21, 0.18));
  opacity: ${loaded ? 1 : 0};
  transition: opacity 0.35s ease;

  @media (max-width: 600px) {
    width: 160px;
    height: 160px;
  }
`;

// 비닐 반사광 - 왼쪽 위 길게 한 줄 + 오른쪽 아래 짧게 (옅게)
export const gloss = css`
  position: absolute;
  inset: 0;
  z-index: 2;
  border-radius: inherit;
  pointer-events: none;
  background:
    linear-gradient(115deg, transparent 18%, rgba(255, 255, 255, 0.55) 24%, rgba(255, 255, 255, 0.08) 31%, transparent 36%),
    linear-gradient(115deg, transparent 62%, rgba(255, 255, 255, 0.35) 66%, transparent 71%),
    radial-gradient(60% 18% at 50% 6%, rgba(255, 255, 255, 0.6), transparent 70%);
`;

// 상품 라벨 스티커 - 마트 가격표처럼: 미색 종이 + 안쪽 점선, 이름은 픽셀 글꼴, 아래 바코드·숫자
const ink = "#1B1D20";
const labelFont = `'RoundedFixedsys', ui-monospace, monospace`;

// 종이 결: 아주 옅은 노이즈 (SVG 난수 무늬, 외부 파일 없음)
const paperGrain = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.45  0 0 0 0 0.42  0 0 0 0 0.36  0 0 0 0.16 0'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)'/%3E%3C/svg%3E")`;

export const label = css`
  position: absolute;
  right: 22px;
  bottom: 34px;
  z-index: 2;
  display: grid;
  justify-items: start;
  gap: 4px;
  padding: 7px 8px 6px;
  border-radius: 3px;
  /* 미색 종이 + 결 + 가장자리로 갈수록 살짝 어두운 음영 */
  background:
    ${paperGrain},
    radial-gradient(120% 140% at 30% 20%, #FDFBF6 0%, #F7F3EA 70%, #EFEADF 100%);
  box-shadow:
    0 0 0 0.5px rgba(120, 112, 98, 0.45),
    inset 0 1px 0 rgba(255, 255, 255, 0.7),
    0 4px 8px -5px rgba(17, 19, 21, 0.35);
  outline: 1px dashed rgba(27, 29, 32, 0.18);
  outline-offset: -3px;
  /* 살짝 기울여 붙인 느낌 - 바코드는 SVG 라서 기울여도 막대가 깨지지 않음 */
  transform: rotate(4deg);
  font-family: ${labelFont};
  color: ${ink};

  @media (max-width: 600px) {
    right: 16px;
    bottom: 26px;
    padding: 6px 7px 5px;
    gap: 3px;
  }
`;

// 픽셀 글꼴은 12px 에서 가장 또렷함
export const labelName = css`
  font-size: 12px;
  font-weight: normal;
  line-height: 1;
`;

// 바코드 (SVG): 기울여도 막대 가장자리가 부드럽게 처리됨 - CSS 그라디언트는 기울이면 계단처럼 깨짐
// 폭은 막대 합계(px) 그대로 - 늘리지 않아야 막대가 또렷함
export const barcode = css`
  display: block;
  height: 12px;
  fill: #1B1D20;
  opacity: 0.88;

  @media (max-width: 600px) {
    height: 10px;
  }
`;

export const labelCode = css`
  font-size: 7px;
  line-height: 1;
  letter-spacing: 0.08em;
  color: rgba(27, 29, 32, 0.65);
`;

// 바닥 그림자
export const shadow = css`
  width: 210px;
  height: 22px;
  /* 떠 있는 느낌이 나도록 포장과 간격을 둠 */
  margin-top: 26px;
  border-radius: 50%;
  background: radial-gradient(closest-side, rgba(17, 19, 21, 0.32), rgba(17, 19, 21, 0));
  animation: ${shadowPulse} 6s ease-in-out infinite;
  ${reduceMotion}

  @media (max-width: 600px) {
    width: 150px;
    height: 14px;
    margin-top: 18px;
  }
`;
