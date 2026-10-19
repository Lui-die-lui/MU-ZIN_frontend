import styled from "@emotion/styled";
import { NavLink } from "react-router-dom";

// 사이드 바
export const Aside = styled.aside`
  box-sizing: border-box; /* 모바일에서 width 100% + padding 으로 화면보다 24px 넓어지던 문제 */
  width: 240px;
  min-width: 240px;
  padding: 16px 12px;
  border-right: 1px solid #e5e7eb;
  background: #fff;

  /* 상단 메뉴(64px, 화면에 붙어 있음) 바로 아래에 붙음 */
  position: sticky;
  top: 64px;
  height: calc(100dvh - 64px);
  overflow: auto;

  @media (max-width: 900px) {
    width: 100%;
    min-width: 0;
    height: auto;
    position: static;
    border-right: none;
    border-bottom: 1px solid #e5e7eb;
  }
`;

export const Title = styled.h2`
  /* margin: 4px 8px 12px;
  font-size: 14px;
  font-weight: 700;
  color: #111827; */
  margin: 4px 8px 12px;
  display: flex;
  justify-content: flex-start;
  font-weight: 700;
  font-size: 18px;
  cursor: pointer;
`;

// 사이드 바 네비게이션 메뉴
export const Nav = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 4px;
`;

export const Item = styled.li``;

export const LinkItem = styled(NavLink)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  padding: 10px 12px;
  border-radius: 10px;

  text-decoration: none;
  color: #374151;
  font-size: 14px;
  font-weight: 600;

  &:hover {
    background: #f3f4f6;
  }

  &.active {
    background: #111827;
    color: #ffffff;
  }
`;

// 알림 뱃지
export const Badge = styled.span`
  min-width: 22px;
  height: 22px;
  padding: 0 8px;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  background: #ef4444;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
`;

export const ParentButton = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: space-between;

  padding: 10px 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 12px;

  color: #374151;
  font-size: 14px;
  font-weight: 600;

  &:hover {
    background: #f6f6f6;
  }
`;

export const Chevron = styled.span`
  font-size: 15px;
  opacity: 0.7;
  transform: rotate(0deg);
  transition: transform 0.15s ease;

  &[data-open="true"] {
    transform: rotate(180deg);
  }
`;

export const ChildNav = styled.ul`
  margin: 6px 0 0;
  padding: 0 0 0 10px;
  display: grid;
  gap: 6px;
  font-size: 12px;
  list-style: none;
`;

export const ChildLinkItem = styled(NavLink)`
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 10px 12px;
  border-radius: 10px;
  text-decoration: none;

  color: inherit;

  &:hover {
    background: #f6f6f6;
  }

  &.active {
    background: #111;
    color: #fff;
  }
`;

// 관리자 페이지 <-> 사용자 화면 전환 버튼 (메뉴 아래 따로)
export const SwitchButton = styled.button`
  width: 100%;
  margin-top: 16px;
  padding: 10px 12px;
  border: 1px solid #111827;
  border-radius: 10px;
  background: #fff;
  color: #111827;
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: #f3f4f6;
  }
`;
