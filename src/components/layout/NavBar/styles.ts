import styled from "@emotion/styled";
import { css } from "@emotion/react";

// Nav
export const Header = styled.header`
  /* position: sticky;
  top: 0;
  z-index: 50;
  height: 56px;
  padding: 0 16px;
  background: #fff;
  border-bottom: 1px solid #eee;

  display: flex;
  align-items: center;
  justify-content: space-between; */
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 18px;
  border-bottom: 1px solid #eee;
  background: #fff;
`;

// 왼쪽 영역
export const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

// 로고
export const Logo = styled.div`
  font-weight: 800;
  cursor: pointer;
`;

// 메뉴(네비게이션) 영역
export const Nav = styled.nav`
  display: flex;
  gap: 12px;
`;

export const link = css`
  /* text-decoration: none;
  color: #333;
  padding: 8px 10px;
  border-radius: 10px;

  &:hover {
    background: #f4f4f4;
  }

  &.active {
    background: #111;
    color: #fff;
  } */
  padding: 8px 10px;
  border-radius: 10px;
  text-decoration: none;
  color: #222;

  &.active {
    background: #111827;
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
  align-items: center;
  gap: 10px;
`;

// 버튼
export const Btn = styled.button`
  /* border: 1px solid #ddd; */
  border: none;
  background: #fff;
  padding: 8px 10px;
  border-radius: 10px;
  cursor: pointer;

  &:hover {
    border-color: #bbb;
    background: #fafafa;
  }
`;


export const IconBtn = styled.button`
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  /* border: 1px solid #eee; */
  border: none;
  background: #fff;
  display: grid;
  place-items: center;
  cursor: pointer;

  svg {
    font-size: 22px;
  }
`;


export const Badge = styled.div`
  position: absolute;
  top: 6px;
  right: 6px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  border-radius: 999px;
  background: #ef4444;
  color: white;
  font-size: 11px;
  line-height: 16px;
  text-align: center;
`;


export const ProfileBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  height: 0px;
  padding: 0 10px;
  border-radius: 12px;
  /* border: 1px solid #eee; */
  border: none;
  background: #fff;
  cursor: pointer;

  svg {
    font-size: 16px;
    opacity: 0.8;
  }
`;

export const AvatarCircle = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 999px;
  background: #111827;
  color: #fff;
  display: grid;
  place-items: center;
  font-size: 12px;
`;

export const MenuHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;

  button {
    border: 0;
    background: transparent;
    cursor: pointer;
    opacity: 0.8;
  }
`;

export const MenuEmpty = styled.span`
  padding: 14px;
  opacity: 0.7;
`;

export const NotiItem = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  b {
    display: block;
    font-size: 13px;
    margin-bottom: 2px;
  }
  div {
    font-size: 12px;
    opacity: 0.85;
  }
`;

export const Dot = styled.div`
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #ef4444;
`;

export const chevron = (open: boolean) => css`
  transform: rotate(${open ? 180 : 0}deg);
`;