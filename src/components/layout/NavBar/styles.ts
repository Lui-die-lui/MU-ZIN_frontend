import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { Link } from "react-router-dom";

// 상단 메뉴 - 메인과 같은 톤: 흰 바탕(구분선 없음), 차콜 글자, 실버는 로고 쌍점 하나만
// 화면 위에 붙어 있고(sticky), 스크롤을 내렸을 때만 아주 옅은 선·그림자로 본문과 구분
const ink = "#17191C";
const sub = "#5F656A";
const soft = "#F2F1ED"; // 선택·hover 면
const line = "#ECEAE5";
const silver = "#AEB4B8";

const focusRing = `
  &:focus-visible {
    outline: 2px solid ${ink};
    outline-offset: 2px;
  }
`;

export const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 100; /* 페이지 안 드롭다운(50) 위, 모달·서랍(9999)·MUI 메뉴(1300) 아래 */
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 24px;
  box-sizing: border-box;

  /* 배경은 화면 전체 폭 (내용은 #root 폭 안에 그대로) - 반투명 흰색 + 흐림
     상단 메뉴는 항상 화면 맨 위에 있으므로 배경은 화면 기준(fixed)으로 깔면
     스크롤바를 뺀 폭에 정확히 맞고 문서 폭(가로 스크롤)에도 영향이 없음 */
  &::before {
    content: "";
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: -1;
    height: 64px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: saturate(1.4) blur(12px);
    -webkit-backdrop-filter: saturate(1.4) blur(12px);
    transition: box-shadow 0.2s ease;
    pointer-events: none;
  }

  &[data-scrolled="true"]::before {
    box-shadow: 0 1px 0 ${line}, 0 10px 24px -20px rgba(23, 25, 28, 0.35);
  }

  @media (max-width: 600px) {
    height: 56px;
    padding: 0 12px 0 16px;

    &::before {
      height: 56px;
    }
  }
  /* 아주 좁은 화면: 로그인하면 채팅·일정·알림·프로필이 함께 있어 간격을 더 줄임 */
  @media (max-width: 360px) {
    padding: 0 8px 0 12px;
  }
`;

// 왼쪽 영역
export const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 28px;
  min-width: 0;

  @media (max-width: 600px) {
    gap: 8px;
  }
  @media (max-width: 360px) {
    gap: 4px;
  }
`;

// 로고: 굵은 워드마크, 쌍점만 스틸 실버 (작은 금속 포인트)
export const Logo = styled(Link)`
  /* inline-flex 로 하면 MU · : · ZIN 이 따로 배치돼 텍스트가 끊김 -> 글자 흐름 그대로 */
  display: inline-block;
  font-size: 19px;
  font-weight: 900;
  letter-spacing: -0.03em;
  line-height: 1;
  color: ${ink};
  text-decoration: none;
  white-space: nowrap;
  border-radius: 6px;

  span {
    margin: 0 1px;
    color: ${silver};
  }

  &:hover {
    color: ${ink};
  }
  ${focusRing}

  @media (max-width: 600px) {
    font-size: 17px;
  }
`;

// 메뉴(네비게이션) 영역
export const Nav = styled.nav`
  display: flex;
  gap: 4px;

  @media (max-width: 360px) {
    gap: 0;
  }
`;

// 메뉴 링크: 선택된 곳은 옅은 면 + 진한 글자 (검은 알약 대신)
export const link = css`
  display: inline-flex;
  align-items: center;
  height: 36px;
  padding: 0 12px;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
  color: ${sub};
  text-decoration: none;
  white-space: nowrap;
  transition: background-color 0.15s ease, color 0.15s ease;

  &:hover {
    color: ${ink};
    background: ${soft};
  }

  &.active {
    color: ${ink};
    font-weight: 600;
    background: ${soft};
  }
  ${focusRing}

  @media (max-width: 600px) {
    height: 34px;
    padding: 0 8px;
    font-size: 14px;
  }
  @media (max-width: 360px) {
    padding: 0 7px;
  }
`;

// 오른쪽 영역
export const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;

  @media (max-width: 600px) {
    gap: 0;
  }
`;

// 로그인 (비로그인일 때 오른쪽): 차콜 버튼
export const Btn = styled.button`
  height: 38px;
  padding: 0 18px;
  border: none;
  border-radius: 12px;
  background: ${ink};
  color: #FFFFFF;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover {
    background: #000000;
  }
  ${focusRing}

  @media (max-width: 600px) {
    height: 34px;
    padding: 0 14px;
    font-size: 13px;
  }
`;

// 아이콘 버튼 (채팅·일정·알림): 둥근 칸, hover·열림 때만 옅은 면
export const IconBtn = styled.button`
  position: relative;
  width: 40px;
  height: 40px;
  padding: 0;
  border: none;
  border-radius: 50%;
  background: transparent;
  display: grid;
  place-items: center;
  cursor: pointer;
  color: #4a4f55; /* 로고·프로필보다 한 톤 옅게, 누를 때는 진하게 */
  transition: background-color 0.15s ease, color 0.15s ease;

  &:hover,
  &[data-open="true"] {
    background: ${soft};
    color: ${ink};
  }
  ${focusRing}

  /* 채팅·알림 아이콘 (NavIcons, 선 굵기 1.5) */
  svg {
    font-size: 22px;
  }

  @media (max-width: 600px) {
    width: 34px;
    height: 34px;

    svg {
      font-size: 21px;
    }
  }
`;

// 안 읽은 수: 흰 테두리로 아이콘과 분리
export const Badge = styled.div`
  position: absolute;
  top: 4px;
  right: 3px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  box-sizing: border-box;
  border-radius: 999px;
  background: #E5484D;
  box-shadow: 0 0 0 2px #FFFFFF;
  color: #FFFFFF;
  font-size: 10px;
  font-weight: 600;
  line-height: 16px;
  text-align: center;
  font-variant-numeric: tabular-nums;

  @media (max-width: 600px) {
    top: 2px;
    right: 1px;
  }
`;

// 프로필: 사진(실버 링) + 펼침 표시
export const ProfileBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 40px;
  margin-left: 4px;
  padding: 0 8px 0 4px;
  border: none;
  border-radius: 999px;
  background: transparent;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover,
  &[aria-expanded="true"] {
    background: ${soft};
  }
  ${focusRing}

  .MuiAvatar-root {
    box-shadow: 0 0 0 1.5px #FFFFFF, 0 0 0 2.5px ${silver};
  }

  svg {
    font-size: 16px;
    opacity: 0.8;
  }

  @media (max-width: 600px) {
    height: 36px;
    margin-left: 2px;
    padding: 0 6px 0 3px;
  }
`;

export const AvatarCircle = styled.div`
  width: 26px;
  height: 26px;
  border-radius: 999px;
  background: ${ink};
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
    font-weight: 500;
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
    font-weight: 500;
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
    font-weight: 600;
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
  mt: "2px", // 버튼 아래 여백 6px(40px 버튼 - 28px 사진) + 2px = 프로필 사진 아래 8px (사진을 가리지 않게)
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
  background: #17191C;
  color: #fff;
  font-size: 11px;
  font-weight: 600;
`;

export const profileMenuEmail = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  color: #6b7280;
`;
