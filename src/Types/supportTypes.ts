// 운영자 문의 (사용자 -> 관리자)

export type SupportCategory = "ACCOUNT" | "RESERVATION" | "REPORT" | "BUG" | "ETC";
export type SupportStatus = "OPEN" | "ANSWERED";

export const SUPPORT_MAX = 2000;

export const SUPPORT_CATEGORY_LABEL: Record<SupportCategory, string> = {
  ACCOUNT: "계정 · 로그인",
  RESERVATION: "예약 · 레슨",
  REPORT: "신고 · 이용 제한",
  BUG: "오류 제보",
  ETC: "기타",
};

export type SupportInquiry = {
  supportId: number;
  category: SupportCategory;
  content: string;
  status: SupportStatus;
  replyContent: string | null;
  repliedDt: string | null;
  createDt: string;
};

export type AdminSupportItem = {
  supportId: number;
  userId: number;
  userName: string;
  userEmail: string | null; // 탈퇴한 회원은 null
  userSuspended: boolean;
  category: SupportCategory;
  content: string;
  status: SupportStatus;
  replyContent: string | null;
  repliedByName: string | null;
  repliedDt: string | null;
  createDt: string;
};
