// 사용자 상태에 따라 사이드 네비게이션바가 바뀌기 때문에

import type { ArtistStatus } from "../../../Types/auth";

export type NavItem = {
  key: string;
  label: string;
  to: string;
  // 혹시 모를 뱃지 카운트 표시용
  badgeCount?: number;
};

// 네비게이션 메뉴 
export const buildMyPageNavItems = (artistStatus: ArtistStatus): NavItem[] => {
  const items: NavItem[] = [
    { key: "home", label: "홈", to: "/mypage" },
    {
      key: "reservations",
      label: "레슨/예약 관리",
      to: "/mypage/reservations",
    },
    { key: "account", label: "인증 및 개인정보", to: "/mypage/account" },
  ];

  // 마지막 탭 아티스트 = 레슨 관리, 아니면 신청
  if (artistStatus === "APPROVED") {
    items.push({ key: "artist", label: "레슨 생성 및 관리", to: "/mypage/artist" });
  } else {
    items.push({
      key: "artistApply",
      label: "아티스트 전환 신청",
      to: "/mypage/artist",
    });
  }
  return items;
};
