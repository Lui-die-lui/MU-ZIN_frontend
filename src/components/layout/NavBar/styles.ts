import styled from "@emotion/styled";
import { css } from "@emotion/react";

// Nav
export const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  height: 56px;
  padding: 0 16px;
  background: #fff;
  border-bottom: 1px solid #eee;

  display: flex;
  align-items: center;
  justify-content: space-between;
`;

// 왼쪽 영역
export const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

// 로고
export const Logo = styled.div`
  font-weight: 800;
  cursor: pointer;
`;

// 메뉴(네비게이션) 영역
export const Nav = styled.nav`
  display: flex;
  gap: 10px;
`;

export const link = css`
  text-decoration: none;
  color: #333;
  padding: 8px 10px;
  border-radius: 10px;

  &:hover {
    background: #f4f4f4;
  }

  &.active {
    background: #111;
    color: #fff;
  }
`;

// 메뉴 활성화
export const linkActive = styled.div`
  background: #111;
  color: #fff;
`;

// 오른쪽 영역
export const Right = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

// 버튼
export const Btn = styled.button`
  border: 1px solid #ddd;
  background: #fff;
  padding: 8px 10px;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    border-color: #bbb;
    background: #fafafa;
  }
`;
