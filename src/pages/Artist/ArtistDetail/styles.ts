import { css } from "@emotion/react";
import { faint, focusRing, ink, line, mist, paper, silver, sub } from "../../../constants/uiTone";

// 공개 아티스트 프로필 (/artists/:id) - 메인 · 찾기 화면과 같은 결
// [오프화이트 상단 판] → [소개·레슨·리뷰 탭(따라옴)] → [본문 | 예약 카드(따라옴)]
// 1080px 이하: 예약 카드가 화면 아래 고정 바로 바뀜 (어디를 읽든 레슨 보기·문의로 바로)

const NARROW = "@media (max-width: 1080px)";
const MOBILE = "@media (max-width: 600px)";
// 섹션으로 넘어갈 때 상단 메뉴(64) + 탭 줄(56) 아래에 제목이 오게
const SCROLL_OFFSET = 132;

export const wrap = css`
  display: grid;
  gap: 20px;
  padding: 4px 8px 96px;
  color: ${ink};
  text-align: left;
  box-sizing: border-box;

  ${NARROW} {
    padding-bottom: 120px; /* 아래 고정 바 자리 */
  }
  ${MOBILE} {
    gap: 14px;
    padding: 0 0 112px;
  }
`;

export const backLink = css`
  justify-self: start;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 2px;
  border: 0;
  background: none;
  color: ${sub};
  font: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;

  @media (hover: hover) {
    &:hover {
      color: ${ink};
    }
  }
  &:active {
    color: ${ink};
  }
  ${focusRing}
`;

// ---------- 상단 판 ----------

export const hero = css`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  grid-template-areas:
    "avatar info actions"
    "facts facts facts";
  column-gap: 28px;
  padding: 36px 40px 32px;
  border-radius: 24px;
  background: ${paper};

  ${MOBILE} {
    grid-template-columns: auto minmax(0, 1fr);
    grid-template-areas:
      "avatar info"
      "actions actions"
      "facts facts";
    column-gap: 16px;
    padding: 24px 20px 20px;
    border-radius: 20px;
  }
`;

export const avatarArea = css`
  grid-area: avatar;

  /* 사진 없을 때 글자 원: 흰 바탕 */
  & > div {
    background: #ffffff;
    color: ${sub};
  }
`;

export const info = css`
  grid-area: info;
  display: grid;
  align-content: center;
  gap: 8px;
  min-width: 0;
`;

export const nameRow = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 10px;
  min-width: 0;
`;

export const name = css`
  margin: 0;
  font-size: clamp(24px, 2.6vw, 34px);
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.035em;
  overflow-wrap: anywhere;
`;

export const majorBadge = css`
  padding: 5px 10px;
  border-radius: 8px;
  background: #ffffff;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
`;

export const location = css`
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
  color: ${sub};
  font-size: 14px;

  svg {
    flex-shrink: 0;
    color: ${faint};
  }
  span {
    overflow-wrap: anywhere;
  }
`;

// 레슨 N · 팔로워 N | 별점
export const numbers = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 16px;
  margin-top: 2px;
`;

export const stats = css`
  display: flex;
  gap: 16px;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 14px;
  color: ${sub};

  strong {
    margin-left: 4px;
    color: ${ink};
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
`;

export const ratingLine = css`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 5px 10px 5px 8px;
  border: 0;
  border-radius: 999px;
  background: #ffffff;
  font: inherit;
  font-size: 13px;
  color: ${ink};
  cursor: pointer;

  span {
    color: ${sub};
  }
  @media (hover: hover) {
    &:hover {
      box-shadow: 0 8px 18px -14px rgba(23, 25, 28, 0.5);
    }
  }
  &:active {
    box-shadow: 0 8px 18px -14px rgba(23, 25, 28, 0.5);
  }
  ${focusRing}
`;

export const actions = css`
  grid-area: actions;
  display: flex;
  align-items: flex-start;
  gap: 8px;

  ${MOBILE} {
    margin-top: 16px;

    & > * {
      flex: 1;
    }
  }
`;

// 악기 · 레슨 스타일 · 방문 가능 지역 - 흰 알약
export const facts = css`
  grid-area: facts;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, auto));
  justify-content: start;
  gap: 16px 40px;
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px solid ${line};

  ${NARROW} {
    grid-template-columns: minmax(0, 1fr);
    gap: 14px;
  }
  ${MOBILE} {
    margin-top: 20px;
    padding-top: 18px;
  }
`;

export const fact = css`
  display: grid;
  gap: 8px;
  min-width: 0;

  ${NARROW} {
    grid-template-columns: 96px minmax(0, 1fr);
    align-items: start;
    gap: 10px;
  }
  ${MOBILE} {
    grid-template-columns: minmax(0, 1fr);
    gap: 6px;
  }
`;

export const factLabel = css`
  font-size: 12px;
  font-weight: 600;
  color: ${faint};

  ${NARROW} {
    padding-top: 7px;
  }
  ${MOBILE} {
    padding-top: 0;
  }
`;

export const chips = css`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const chip = css`
  display: inline-flex;
  align-items: center;
  height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  background: #ffffff;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
`;

export const emptyInline = css`
  color: ${faint};
  font-size: 13px;
`;

// ---------- 섹션 탭 (따라옴) ----------

export const tabs = css`
  position: sticky;
  top: 64px;
  z-index: 20;
  display: flex;
  gap: 6px;
  margin: 0 -8px;
  padding: 10px 8px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: saturate(1.4) blur(12px);
  -webkit-backdrop-filter: saturate(1.4) blur(12px);
  overflow-x: auto;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }
  ${MOBILE} {
    top: 56px;
    margin: 0 -16px;
    padding: 8px 16px;
  }
`;

export const tab = (active: boolean) => css`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  gap: 6px;
  height: 38px;
  padding: 0 16px;
  border: 0;
  border-radius: 999px;
  background: ${active ? ink : "#f2f1ed"};
  color: ${active ? "#ffffff" : sub};
  font-family: inherit;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;

  span {
    font-size: 12px;
    font-weight: 600;
    opacity: 0.7;
    font-variant-numeric: tabular-nums;
  }
  @media (hover: hover) {
    &:hover {
      background: ${active ? "#000000" : "#e8e7e2"};
      color: ${active ? "#ffffff" : ink};
    }
  }
  &:active {
    background: ${active ? "#000000" : "#e8e7e2"};
    color: ${active ? "#ffffff" : ink};
  }
  ${focusRing}
`;

// ---------- 본문 | 예약 카드 ----------

export const body = css`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 340px;
  align-items: start;
  gap: 40px;

  ${NARROW} {
    grid-template-columns: minmax(0, 1fr);
    gap: 0;
  }
`;

export const main = css`
  display: grid;
  gap: 48px;
  min-width: 0;
  padding: 12px 8px 0;

  ${MOBILE} {
    gap: 40px;
    padding: 8px 4px 0;
  }
`;

export const section = css`
  display: grid;
  gap: 16px;
  min-width: 0;
  scroll-margin-top: ${SCROLL_OFFSET}px;

  ${MOBILE} {
    scroll-margin-top: 120px;
  }
`;

export const sectionHead = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

export const sectionTitle = css`
  display: flex;
  align-items: baseline;
  gap: 8px;
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.03em;

  span {
    color: ${faint};
    font-size: 15px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
  ${MOBILE} {
    font-size: 19px;
  }
`;

export const bodyText = css`
  margin: 0;
  max-width: 46em;
  font-size: 15px;
  line-height: 1.8;
  color: #2f3337;
  white-space: pre-wrap; /* 줄바꿈 그대로 */
  word-break: keep-all;
  overflow-wrap: anywhere;
`;

export const mutedText = css`
  margin: 0;
  color: ${faint};
  font-size: 14px;
`;

// 소개 아래 경력: 얇은 실버 선으로 묶음
export const career = css`
  display: grid;
  gap: 6px;
  max-width: 46em;
  margin-top: 8px;
  padding-left: 16px;
  border-left: 2px solid ${silver};

  h3 {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    color: ${faint};
  }
`;

// ---------- 예약 카드 (데스크톱: 오른쪽에 따라옴 / 좁으면: 아래 고정 바) ----------

export const bookCard = css`
  position: sticky;
  top: 136px;
  display: grid;
  gap: 16px;
  padding: 24px;
  border-radius: 24px;
  background: ${paper};

  ${NARROW} {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: auto;
    z-index: 50;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 12px;
    padding: 12px 20px calc(12px + env(safe-area-inset-bottom));
    border-radius: 20px 20px 0 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: saturate(1.4) blur(14px);
    -webkit-backdrop-filter: saturate(1.4) blur(14px);
    box-shadow: 0 -12px 30px -22px rgba(23, 25, 28, 0.45);
  }
  ${MOBILE} {
    padding: 10px 16px calc(10px + env(safe-area-inset-bottom));
  }
`;

export const bookInfo = css`
  display: grid;
  gap: 4px;
  min-width: 0;
`;

export const bookEyebrow = css`
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.12em;
  color: ${faint};

  ${NARROW} {
    display: none;
  }
`;

export const bookPrice = css`
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;

  small {
    margin-left: 4px;
    font-size: 14px;
    font-weight: 600;
    color: ${sub};
  }
  ${NARROW} {
    font-size: 19px;
  }
`;

export const bookSub = css`
  margin: 0;
  overflow: hidden;
  font-size: 13px;
  color: ${sub};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const bookActions = css`
  display: grid;
  gap: 8px;

  ${NARROW} {
    display: flex;
  }
`;

export const btn = (variant: "primary" | "ghost") => css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  height: 48px;
  padding: 0 20px;
  border: 0;
  border-radius: 14px;
  background: ${variant === "primary" ? ink : "#ffffff"};
  color: ${variant === "primary" ? "#ffffff" : ink};
  font: inherit;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.15s ease;

  @media (hover: hover) {
    &:hover {
      color: ${variant === "primary" ? "#ffffff" : ink};
      background: ${variant === "primary" ? "#000000" : "#fbfaf8"};
    }
  }
  &:active {
    color: ${variant === "primary" ? "#ffffff" : ink};
    background: ${variant === "primary" ? "#000000" : "#fbfaf8"};
  }
  ${focusRing}

  ${NARROW} {
    height: 44px;
    padding: 0 16px;
    font-size: 14px;
    background: ${variant === "primary" ? ink : mist};

    @media (hover: hover) {
      &:hover {
        background: ${variant === "primary" ? "#000000" : "#e2e1dc"};
      }
    }
    &:active {
      background: ${variant === "primary" ? "#000000" : "#e2e1dc"};
    }
  }
`;

// 상단 판의 작은 버튼 (본인: 프로필 수정 등)
export const smallBtn = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  padding: 0 16px;
  border-radius: 12px;
  background: #ffffff;
  color: ${ink};
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  white-space: nowrap;

  @media (hover: hover) {
    &:hover {
      color: ${ink};
      box-shadow: 0 8px 18px -14px rgba(23, 25, 28, 0.5);
    }
  }
  &:active {
    color: ${ink};
    box-shadow: 0 8px 18px -14px rgba(23, 25, 28, 0.5);
  }
  ${focusRing}
`;

// ---------- 레슨 카드 (레슨 찾기와 같은 카드) ----------

export const lessonGrid = css`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
  }
`;

export const lessonCard = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  padding: 20px 20px 18px;
  border: 0;
  border-radius: 18px;
  background: ${paper};
  color: ${ink};
  font: inherit;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;

  @media (hover: hover) {
    &:hover {
      background: #efede8;
      transform: translateY(-2px);
      box-shadow: 0 16px 30px -24px rgba(23, 25, 28, 0.55);
    }
  }
  &:active {
    background: #efede8;
    transform: translateY(-2px);
    box-shadow: 0 16px 30px -24px rgba(23, 25, 28, 0.55);
  }
  ${focusRing}

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    @media (hover: hover) {
      &:hover {
        transform: none;
      }
    }
    &:active {
      transform: none;
    }
  }
`;

export const lessonTop = css`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;

export const instBadge = css`
  flex-shrink: 0;
  padding: 5px 10px;
  border-radius: 8px;
  background: #ffffff;
  font-size: 12px;
  font-weight: 600;
`;

export const lessonSub = css`
  overflow: hidden;
  font-size: 12px;
  color: ${sub};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const lessonTitle = css`
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: -0.02em;
  word-break: keep-all;
  overflow-wrap: anywhere;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

export const lessonFoot = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
  padding-top: 4px;

  strong {
    font-size: 16px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
`;

export const arrow = css`
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: ${ink};
  color: #ffffff;

  svg {
    display: block;
  }
`;

export const lessonHint = css`
  margin: 0;
  color: ${faint};
  font-size: 13px;
`;

export const textBtn = css`
  padding: 4px 2px;
  border: 0;
  background: none;
  color: ${ink};
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  text-decoration: underline;
  text-decoration-color: ${silver};
  text-underline-offset: 3px;
  cursor: pointer;
  ${focusRing}
`;

// ---------- 상태 화면 ----------

export const state = css`
  display: grid;
  justify-items: center;
  gap: 10px;
  padding: 72px 16px;
  border-radius: 24px;
  background: ${paper};
  color: ${sub};
  font-size: 14px;
  text-align: center;

  strong {
    color: ${ink};
    font-size: 17px;
  }
`;

export const skeleton = (h: number) => css`
  height: ${h}px;
  border-radius: 24px;
  background: ${paper};
  animation: artistPulse 1.4s ease-in-out infinite;

  @keyframes artistPulse {
    50% {
      opacity: 0.55;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;
