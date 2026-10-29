import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";
import { faint, ink, paper, silver, sub } from "../../../constants/uiTone";

// 마이페이지 · 관리자 사이드 메뉴 - 메인과 같은 결
// 데스크톱: 테두리 없는 오프화이트 둥근 판이 상단 메뉴 아래에 붙어 따라옴, 선택된 메뉴는 차콜 알약
// 900px 이하: 상단 메뉴 바로 아래 붙는 가로 칩 한 줄 (예전: 메뉴 9줄이 본문 위에 쌓여 내용이 화면 중간부터 시작)

const MOBILE = "@media (max-width: 900px)";
const focusRing = `
  &:focus-visible {
    outline: 3px solid rgba(23, 25, 28, 0.35);
    outline-offset: 2px;
  }
`;

export const Aside = styled.aside`
  box-sizing: border-box;
  flex-shrink: 0;
  align-self: flex-start;
  width: 248px;
  padding: 20px 12px 14px;
  border-radius: 24px;
  background: ${paper};

  /* 상단 메뉴(64px) 아래 16px 띄워 붙어 따라옴. 메뉴가 길면 판 안에서 스크롤 */
  position: sticky;
  top: 80px;
  max-height: calc(100dvh - 96px);
  overflow: auto;

  ${MOBILE} {
    display: flex;
    align-items: center;
    align-self: stretch; /* 데스크톱의 flex-start 가 남으면 줄이 내용 길이만큼 늘어나 옆으로 넘겨지지 않음 */
    gap: 6px;
    width: auto;
    min-width: 0;
    max-height: none;
    margin: 0 -16px; /* 판 여백 없이 화면 끝까지 넘겨 보기 */
    padding: 8px 16px;
    border-radius: 0;
    background: rgba(255, 255, 255, 0.92);
    backdrop-filter: saturate(1.4) blur(12px);
    -webkit-backdrop-filter: saturate(1.4) blur(12px);
    overflow-x: auto;
    overflow-y: hidden;
    scrollbar-width: none;
    z-index: 90; /* 상단 메뉴(100) 아래 */
    top: 64px;

    &::-webkit-scrollbar {
      display: none;
    }
  }
  @media (max-width: 600px) {
    top: 56px;
  }
`;

export const Title = styled.h2`
  margin: 0 10px 14px;
  text-align: left;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: ${faint};
  cursor: pointer;

  ${MOBILE} {
    display: none;
  }
`;

export const Nav = styled.ul`
  display: grid;
  gap: 2px;
  margin: 0;
  padding: 0;
  list-style: none;

  ${MOBILE} {
    display: flex;
    flex-shrink: 0;
    gap: 6px;
  }
`;

export const Item = styled.li`
  ${MOBILE} {
    display: flex;
    flex-shrink: 0;
    gap: 6px;
  }
`;

const itemBase = `
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  box-sizing: border-box;
  min-height: 42px;
  padding: 0 14px;
  border-radius: 14px;
  text-decoration: none;
  color: ${sub};
  font-size: 14px;
  font-weight: 600;
  transition: background 0.15s ease, color 0.15s ease;

  @media (hover: hover) {
    &:hover {
      color: ${ink};
      background: rgba(255, 255, 255, 0.85);
    }
  }
  &:active {
    color: ${ink};
    background: rgba(255, 255, 255, 0.85);
  }

  &.active {
    color: #ffffff;
    background: ${ink};
  }
  ${focusRing}

  ${MOBILE} {
    min-height: 38px;
    padding: 0 14px;
    border-radius: 999px;
    background: #f2f1ed;
    font-size: 13px;
    white-space: nowrap;

    @media (hover: hover) {
      &:hover {
        background: #e8e7e2;
      }
    }
    &:active {
      background: #e8e7e2;
    }
    &.active {
      background: ${ink};
    }
  }
`;

export const LinkItem = styled(NavLink)`
  ${itemBase}
`;

// 알림 뱃지 - 상단 메뉴 알림 종과 같은 빨강
export const Badge = styled.span`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  border-radius: 999px;
  box-sizing: border-box;
  background: #e5484d;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
  line-height: 1;
`;

// 하위 메뉴가 있는 항목 (레슨/예약 관리) - 모바일은 하위 메뉴를 바로 칩으로 보여줘서 숨김
export const ParentButton = styled.button`
  ${itemBase}
  width: 100%;
  border: 0;
  background: transparent;
  font-family: inherit;
  cursor: pointer;

  & > span:first-of-type {
    flex: 1;
    text-align: left;
  }

  ${MOBILE} {
    display: none;
  }
`;

// 아래 꺾쇠 (열리면 위로)
export const Chevron = styled.span`
  display: grid;
  place-items: center;
  color: ${faint};
  transform: rotate(90deg);
  transition: transform 0.15s ease;

  &[data-open="true"] {
    transform: rotate(-90deg);
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

// 하위 메뉴: 왼쪽 얇은 실버 선으로 묶음 (닫혀 있으면 데스크톱에서만 숨김)
export const ChildNav = styled.ul`
  display: grid;
  gap: 2px;
  margin: 2px 0 6px 18px;
  padding: 0 0 0 10px;
  border-left: 1px solid ${silver};
  list-style: none;

  &[data-open="false"] {
    display: none;
  }

  ${MOBILE} {
    &,
    &[data-open="false"] {
      display: flex;
      gap: 6px;
      margin: 0;
      padding: 0;
      border: 0;
    }
  }
`;

export const ChildLinkItem = styled(NavLink)`
  ${itemBase}
  min-height: 38px;
  font-size: 13px;
`;

// 관리자 페이지 <-> 사용자 화면 전환 (메뉴 아래 따로, 테두리 없는 흰 알약)
export const SwitchButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 42px;
  margin-top: 14px;
  padding: 0 14px;
  border: 0;
  border-radius: 14px;
  background: #ffffff;
  color: ${ink};
  font-family: inherit;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;

  @media (hover: hover) {
    &:hover {
      background: #fbfaf8;
      box-shadow: 0 10px 22px -18px rgba(23, 25, 28, 0.5);
    }
  }
  &:active {
    background: #fbfaf8;
    box-shadow: 0 10px 22px -18px rgba(23, 25, 28, 0.5);
  }
  ${focusRing}

  /* 모바일: 선택된 칩(차콜)과 헷갈리지 않게 구분선 뒤 배경 없는 글자 버튼 */
  ${MOBILE} {
    position: relative;
    flex-shrink: 0;
    width: auto;
    min-height: 38px;
    margin: 0 0 0 6px;
    padding: 0 6px 0 14px;
    border-radius: 0;
    background: transparent;
    color: ${ink};
    text-decoration: underline;
    text-decoration-color: ${silver};
    text-underline-offset: 4px;
    white-space: nowrap;

    &::before {
      content: "";
      position: absolute;
      left: 0;
      top: 50%;
      width: 1px;
      height: 20px;
      margin-top: -10px;
      background: #e1e0db;
    }
    @media (hover: hover) {
      &:hover {
        background: transparent;
        box-shadow: none;
        text-decoration-color: ${ink};
      }
    }
    &:active {
      background: transparent;
      box-shadow: none;
      text-decoration-color: ${ink};
    }
  }
`;
