import { css, keyframes } from "@emotion/react";
import { faint, focusRing, ink, mist, silver, sub } from "./styles";

// 메인 > 내 레슨 일정 패널
// 반투명 판 위에 반투명 흰 타일·카드가 겹치는 구성. 테두리 없이 투명도와 옅은 그림자로만 층을 나눔 (선택한 날만 차콜)
// 둥근 정도: 패널 24 · 카드 18 · 타일 12 · 칩 8 (메인과 같은 단계)

export const panel = css`
  display: grid;
  align-content: start;
  gap: 18px;
  min-width: 0;
  padding: 24px 22px 22px;
  border-radius: 24px;
  background: linear-gradient(165deg, rgba(236, 235, 231, 0.72) 0%, rgba(245, 244, 240, 0.45) 100%);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  color: ${ink};
  box-sizing: border-box;

  /* 모바일: 회원에게는 내 일정이 첫 화면 (배너 문구·버튼은 바로 아래) */
  @media (max-width: 768px) {
    order: -1;
  }

  @media (max-width: 600px) {
    gap: 14px;
    padding: 20px 16px 16px;
    border-radius: 20px;
  }
`;

export const head = css`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
`;

export const headText = css`
  display: grid;
  gap: 4px;
  min-width: 0;
`;

export const eyebrow = css`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.14em;
  color: ${faint};
`;

export const title = css`
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.035em;
`;

// 더보기: 흰 알약 안에 MORE + 플러스 (제목 줄과 높이를 맞춤)
export const more = css`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 0 5px 0 13px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.7);
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.12em;
  line-height: 1;
  color: ${ink};
  text-decoration: none;
  transition: background 0.15s ease;

  &:hover {
    color: ${ink};
    background: #FFFFFF;
  }
  ${focusRing}
`;

export const moreIcon = css`
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: ${ink};
  color: #FFFFFF;
`;

// 아티스트: 하는 레슨 / 받는 레슨 전환 - 반투명 알약 안에서 검정 손잡이가 좌우로 미끄러짐
export const segment = (index: 0 | 1) => css`
  position: relative;
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  padding: 4px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.6);

  &::before {
    content: "";
    position: absolute;
    top: 4px;
    bottom: 4px;
    left: 4px;
    width: calc(50% - 4px);
    border-radius: 999px;
    background: ${ink};
    box-shadow: 0 6px 14px -8px rgba(23, 25, 28, 0.7);
    transform: translateX(${index * 100}%);
    transition: transform 0.28s cubic-bezier(0.3, 0.7, 0.2, 1);
  }

  @media (prefers-reduced-motion: reduce) {
    &::before {
      transition: none;
    }
  }
`;

export const segBtn = (active: boolean) => css`
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-width: 0;
  height: 38px;
  padding: 0 10px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: ${active ? "#FFFFFF" : sub};
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: ${active ? "#FFFFFF" : ink};
  }
  ${focusRing}
`;

export const segCount = (active: boolean) => css`
  display: grid;
  place-items: center;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  border-radius: 999px;
  background: ${active ? "rgba(255, 255, 255, 0.22)" : "rgba(23, 25, 28, 0.08)"};
  color: inherit;
  font-size: 11px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  box-sizing: border-box;
`;

// 달력 | 목록 - 배너 옆(좁은 열)에서는 위아래, 배너 아래 넓은 폭(태블릿)에서는 나란히
export const bodyGrid = css`
  display: grid;
  gap: 18px;

  @media (min-width: 769px) and (max-width: 1120px) {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: start;
    gap: 24px;
  }

  @media (max-width: 768px) {
    gap: 14px;
  }
`;

// ---------- 달력 / 주 이동 ----------

export const calendar = css`
  display: grid;
  gap: 12px;
`;

export const navRow = css`
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr) 36px;
  align-items: center;
`;

export const navTitle = css`
  text-align: center;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.02em;

  small {
    font-size: 13px;
    font-weight: 500;
    color: ${sub};
  }
`;

// 이전 = 흰 원, 다음 = 차콜 원 (레퍼런스의 좌우 화살표 대비)
export const navBtn = (dark: boolean) => css`
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: ${dark ? ink : "rgba(255, 255, 255, 0.7)"};
  color: ${dark ? "#FFFFFF" : ink};
  box-shadow: ${dark ? "0 6px 14px -8px rgba(23, 25, 28, 0.7)" : "none"};
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    background: ${dark ? "#000000" : "#FFFFFF"};
  }
  ${focusRing}
`;

export const weekHead = css`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 6px;

  span {
    text-align: center;
    font-size: 12px;
    font-weight: 600;
    color: ${faint};
  }
`;

export const monthGrid = css`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 6px;
`;

export const emptyCell = css`
  aspect-ratio: 1;
`;

type DayState = {
  selected: boolean;
  today: boolean;
  past: boolean;
  mark: "none" | "solid" | "hollow";
};

// 점: 확정 레슨 = 채운 점, 요청만 = 빈 점
const dot = (st: DayState) => css`
  i {
    display: block;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    box-sizing: border-box;
    visibility: ${st.mark === "none" ? "hidden" : "visible"};
    background: ${st.mark === "solid" ? (st.selected ? "#FFFFFF" : ink) : "transparent"};
    border: ${st.mark === "hollow" ? `1.5px solid ${st.selected ? "#FFFFFF" : ink}` : "0"};
  }
`;

const dayBase = (st: DayState) => css`
  display: grid;
  place-items: center;
  align-content: center;
  padding: 0;
  border: 0;
  cursor: pointer;
  font-family: inherit;
  font-variant-numeric: tabular-nums;
  color: ${st.selected ? "#FFFFFF" : st.past ? faint : ink};
  transition: background 0.15s ease, box-shadow 0.15s ease;
  ${dot(st)}
  ${focusRing}
`;

// 지난 날 = 빗금 바탕(레퍼런스의 지나간·막힌 날), 앞으로 = 반투명 흰 타일, 오늘 = 불투명 흰 + 그림자, 선택 = 차콜 판
const dayFill = (st: DayState) =>
  st.selected
    ? css`
        background: ${ink};
        box-shadow: 0 8px 16px -10px rgba(23, 25, 28, 0.8);
      `
    : st.past
      ? css`
          background: repeating-linear-gradient(135deg, rgba(23, 25, 28, 0.032) 0 2px, transparent 2px 6px);
          &:hover {
            background-color: rgba(255, 255, 255, 0.5);
          }
        `
      : css`
          background: ${st.today ? "#FFFFFF" : "rgba(255, 255, 255, 0.62)"};
          box-shadow: ${st.today ? "0 6px 14px -8px rgba(23, 25, 28, 0.35)" : "none"};
          &:hover {
            background: #FFFFFF;
          }
        `;

export const dayTile = (st: DayState) => css`
  ${dayBase(st)};
  ${dayFill(st)};
  gap: 3px;
  aspect-ratio: 1;
  min-width: 0;
  border-radius: 12px;
  font-size: 15px;
  font-weight: ${st.selected || st.today ? 800 : 600};
`;

export const weekStrip = css`
  display: grid;
  gap: 12px;
`;

export const pills = css`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 6px;
`;

// 모바일 한 주 띠: 위 요일, 아래 날짜를 세운 알약
export const dayPill = (st: DayState) => css`
  ${dayBase(st)};
  ${dayFill(st)};
  gap: 2px;
  min-width: 0;
  height: 64px;
  border-radius: 999px;

  small {
    font-size: 11px;
    font-weight: 500;
    color: ${st.selected ? "rgba(255, 255, 255, 0.7)" : faint};
  }
  span {
    font-size: 17px;
    font-weight: 600;
    line-height: 1.1;
  }
`;

// ---------- 목록 ----------

export const list = css`
  display: grid;
  align-content: start;
  gap: 10px;
  min-width: 0;
`;

export const listHead = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-height: 24px;
  font-size: 13px;
  font-weight: 600;
  color: ${sub};
`;

export const dday = css`
  padding: 3px 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.7);
  font-size: 12px;
  font-weight: 600;
  color: ${ink};
  font-variant-numeric: tabular-nums;
`;

export const clearBtn = css`
  padding: 4px 2px;
  border: 0;
  background: none;
  font-family: inherit;
  font-size: 12px;
  font-weight: 600;
  color: ${sub};
  text-decoration: underline;
  text-decoration-color: ${silver};
  text-underline-offset: 3px;
  cursor: pointer;

  &:hover {
    color: ${ink};
  }
  ${focusRing}
`;

// 다음 레슨: 흰 카드 + 아래 시간·날짜 띠
export const nextCard = css`
  display: grid;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.82);
  box-shadow: 0 18px 32px -26px rgba(23, 25, 28, 0.5);
  color: ${ink};
  text-decoration: none;
  overflow: hidden;
  transition: box-shadow 0.15s ease, transform 0.15s ease;

  &:hover {
    color: ${ink};
    transform: translateY(-1px);
    background: #FFFFFF;
    box-shadow: 0 20px 34px -24px rgba(23, 25, 28, 0.55);
  }
  ${focusRing}

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    &:hover {
      transform: none;
    }
  }
`;

export const nextTop = css`
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  padding: 14px 14px 12px;
`;

export const avatar = css`
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(23, 25, 28, 0.06);
  font-size: 16px;
  font-weight: 600;
  color: ${ink};
`;

export const nextText = css`
  display: grid;
  gap: 2px;
  min-width: 0;

  strong,
  span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  strong {
    font-size: 15px;
    font-weight: 600;
    letter-spacing: -0.02em;
  }
  span {
    font-size: 13px;
    color: ${sub};
  }
`;

export const nextBar = css`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 10px 14px;
  background: rgba(245, 244, 240, 0.7);
  font-size: 13px;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;

  span:last-of-type {
    color: ${sub};
    font-weight: 600;
  }
`;

export const rows = css`
  display: grid;
  gap: 6px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

// 이후 레슨: 카드보다 가벼운 줄 (날짜 칸 | 제목·시간 | 상태)
export const row = css`
  display: grid;
  grid-template-columns: 40px minmax(0, 1fr) auto;
  align-items: center;
  gap: 12px;
  padding: 8px 12px 8px 8px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.45);
  color: ${ink};
  text-decoration: none;
  transition: background 0.15s ease;

  &:hover {
    color: ${ink};
    background: rgba(255, 255, 255, 0.85);
  }
  ${focusRing}
`;

export const rowDate = css`
  display: grid;
  place-items: center;
  align-content: center;
  gap: 1px;
  width: 40px;
  height: 44px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.8);
  line-height: 1.1;

  strong {
    font-size: 16px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
  small {
    font-size: 11px;
    color: ${faint};
  }
`;

export const rowText = css`
  display: grid;
  gap: 2px;
  min-width: 0;

  strong,
  span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  strong {
    font-size: 14px;
    font-weight: 600;
  }
  span {
    font-size: 12px;
    color: ${sub};
    font-variant-numeric: tabular-nums;
  }
`;

export const badge = (tone: "solid" | "wait" | "muted") => css`
  flex-shrink: 0;
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  ${tone === "solid"
    ? css`
        background: ${ink};
        color: #FFFFFF;
      `
    : tone === "wait"
      ? css`
          background: rgba(23, 25, 28, 0.06);
          color: ${sub};
        `
      : css`
          background: rgba(255, 255, 255, 0.6);
          color: ${faint};
        `}
`;

export const moreNote = css`
  padding: 4px 2px 0;
  font-size: 13px;

  a {
    color: ${sub};
    font-weight: 600;
    text-decoration: underline;
    text-decoration-color: ${silver};
    text-underline-offset: 3px;
  }
  a:hover {
    color: ${ink};
  }
`;

// 안내 문구 왼쪽 + 버튼 오른쪽 한 줄 (좁으면 버튼이 아래로)
export const empty = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px 12px;
  padding: 18px 16px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.55);

  p {
    margin: 0;
    font-size: 14px;
    color: ${sub};
  }
`;

// 빈 일정 안의 보조 버튼: 양끝 둥근 알약 + 따뜻한 회색 면 (주요 버튼인 차콜보다 한 단계 아래)
export const emptyAction = css`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  white-space: nowrap;
  height: 36px;
  padding: 0 16px;
  border: 0;
  border-radius: 999px;
  background: ${mist};
  color: ${ink};
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: background 0.15s ease;

  &:hover {
    color: ${ink};
    background: #E2E0DA;
  }
  ${focusRing}
`;

const shimmer = keyframes`
  0% { opacity: 0.55; }
  50% { opacity: 1; }
  100% { opacity: 0.55; }
`;

export const skeletonWrap = css`
  display: grid;
  gap: 8px;
`;

export const skeleton = (h: number) => css`
  display: block;
  height: ${h}px;
  border-radius: 18px;
  background: rgba(255, 255, 255, 0.7);
  animation: ${shimmer} 1.4s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
