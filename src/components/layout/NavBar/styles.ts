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

  /* 좁은 화면: 로그인하면 채팅·알림·프로필이 함께 있어 가로로 넘치지 않게 간격만 줄임 */
  @media (max-width: 480px) {
    padding: 0 10px;
  }
`;

// 왼쪽 영역
export const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;

  @media (max-width: 480px) {
    gap: 8px;
  }
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

  @media (max-width: 480px) {
    gap: 2px;
  }
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

  @media (max-width: 480px) {
    padding: 8px 7px;
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

  @media (max-width: 480px) {
    gap: 2px;
  }
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
  color: #20242a;
  transition:
    background-color 160ms ease,
    color 160ms ease;

  &:hover,
  &[data-open="true"] {
    background: #f2f4f6;
  }

  &:focus-visible {
    outline: 2px solid #20242a;
    outline-offset: 2px;
  }

  svg {
    font-size: 22px;
  }
`;


export const Badge = styled.div`
  position: absolute;
  top: 5px;
  right: 5px;
  min-width: 14px;
  height: 14px;
  /* padding: 0 4px; */
  border-radius: 999px;
  background: #ef4444;
  color: white;
  font-size: 9px;
  line-height: 14px;
  text-align: center;
`;


export const ProfileBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  /* 예전엔 height: 0px 이라 메뉴가 버튼 가운데(=프로필 사진 위)에서 열렸음 -> 사진 크기에 맞춤 */
  height: 36px;
  padding: 0 6px;
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
  gap: 16px;
  padding: 18px 18px 15px;
  border-bottom: 1px solid #eceef1;

  > div {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 3px;
  }

  strong {
    color: #1d2127;
    font-size: 17px;
    line-height: 1.35;
    letter-spacing: -0.02em;
  }

  span {
    color: #777e88;
    font-size: 12px;
    line-height: 1.4;
  }

  button {
    flex: 0 0 auto;
    min-height: 34px;
    padding: 0 10px;
    border: 1px solid #dfe2e6;
    border-radius: 8px;
    background: transparent;
    color: #4f5660;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;

    &:hover:not(:disabled) {
      border-color: #b9bec5;
      background: #f7f8f9;
    }

    &:disabled {
      color: #aeb3ba;
      cursor: default;
    }
  }
`;

export const MenuEmpty = styled.div`
  min-height: 230px;
  padding: 36px 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #8a9098;

  > svg {
    margin-bottom: 14px;
    color: #a8adb4;
    font-size: 30px;
  }

  strong {
    color: #333840;
    font-size: 14px;
    line-height: 1.45;
  }

  span {
    margin-top: 5px;
    font-size: 12px;
    line-height: 1.5;
  }

  button {
    min-height: 36px;
    margin-top: 16px;
    padding: 0 14px;
    border: 1px solid #d7dbe0;
    border-radius: 8px;
    background: #fff;
    color: #333840;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
  }
`;

export const NotiItem = styled.div`
  min-width: 0;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  text-align: left;

  p {
    margin: 0;
    color: #6a717b;
    font-size: 12px;
    line-height: 1.55;
    overflow-wrap: anywhere;
  }
`;

export const NotificationList = styled.div`
  max-height: 390px;
  overflow-y: auto;
  overscroll-behavior: contain;
`;

export const NotificationButton = styled.button`
  width: 100%;
  min-height: 88px;
  padding: 15px 18px;
  display: flex;
  align-items: flex-start;
  gap: 11px;
  border: 0;
  border-bottom: 1px solid #f0f1f3;
  background: #fff;
  color: inherit;
  font: inherit;
  cursor: pointer;
  transition: background-color 140ms ease;

  &[data-unread="true"] {
    background: #f7f8fa;
  }

  &:hover {
    background: #f1f3f5;
  }

  &:focus-visible {
    position: relative;
    z-index: 1;
    outline: 2px solid #303640;
    outline-offset: -2px;
  }
`;

export const NotificationStatus = styled.span`
  width: 7px;
  height: 7px;
  flex: 0 0 auto;
  margin-top: 6px;
  border-radius: 999px;
  background: transparent;

  [data-unread="true"] & {
    background: #303640;
  }
`;

export const NotificationMeta = styled.div`
  min-width: 0;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;

  strong {
    min-width: 0;
    color: #292e35;
    font-size: 13px;
    line-height: 1.45;
    font-weight: 650;
    overflow-wrap: anywhere;
  }

  time {
    flex: 0 0 auto;
    color: #989ea6;
    font-size: 11px;
    line-height: 1.4;
    white-space: nowrap;
  }
`;

export const NotificationFooter = styled.div`
  padding: 11px 16px;
  border-top: 1px solid #eceef1;
  background: #fafafa;
  color: #858b93;
  font-size: 11px;
  line-height: 1.4;
  text-align: center;
`;

export const NotificationLoading = styled.div`
  padding: 2px 18px;

  > div {
    min-height: 86px;
    padding: 18px 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    border-bottom: 1px solid #f0f1f3;
  }

  span {
    display: block;
    height: 11px;
    border-radius: 4px;
    background: #eef0f2;
    animation: notification-pulse 1.2s ease-in-out infinite alternate;

    &:first-of-type {
      width: 42%;
    }

    &:last-of-type {
      width: 78%;
    }
  }

  @keyframes notification-pulse {
    to {
      background: #e2e5e8;
    }
  }
`;

// ---------- 프로필 메뉴 ----------
// MUI Menu 종이(paper) - 다른 드롭다운 목록(dropdownStyles.dropdownMenu)과 같은 테두리/모서리/그림자/항목 모양
export const profileMenuPaperSx = {
  mt: "4px", // 버튼 아래 여백 4px + 4px = 프로필 사진 아래 8px (사진을 가리지 않게)
  minWidth: 240,
  maxWidth: 280,
  borderRadius: "12px",
  border: "1px solid #e2e5e9",
  boxShadow: "0 12px 32px rgba(17,24,39,.12)",
  "& .MuiList-root": { padding: "6px" },
  "& .MuiMenuItem-root": {
    minHeight: 40,
    padding: "0 10px",
    borderRadius: "8px",
    fontSize: 14,
    fontFamily: "inherit",
    color: "#1b1d20",
  },
  "& .MuiMenuItem-root:hover, & .MuiMenuItem-root.Mui-focusVisible": { backgroundColor: "#f3f4f6" },
};

export const profileMenuHeader = css`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 10px 6px;
  list-style: none;
`;

export const profileMenuWho = css`
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  text-align: left;
`;

export const profileMenuNameRow = css`
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;

  strong {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 15px;
    color: #1b1d20;
  }
`;

export const profileMenuBadge = css`
  flex-shrink: 0;
  padding: 1px 6px;
  border-radius: 6px;
  background: #111827;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
`;

export const profileMenuEmail = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  color: #6b7280;
`;
