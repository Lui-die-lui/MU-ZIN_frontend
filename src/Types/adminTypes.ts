import type { ArtistStatus } from "./auth";
import type { InstrumentResponse } from "./instrumentTypes";

// 스프링 Page 응답 중 화면에서 쓰는 값만
export type PageResp<T> = {
  content: T[];
  number: number; // 현재 페이지 (0부터)
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};

// 아티스트 신청 심사 탭 (NONE = 아직 제출 안 한 프로필이라 심사 대상 아님)
export type ReviewStatus = Exclude<ArtistStatus, "NONE">;

export type AdminArtistApplyListItem = {
  artistProfileId: number;
  userId: number;
  email: string;
  username: string;
  artistStatus: ArtistStatus;
  submittedDt: string | null;
  reviewedDt: string | null;
  rejectReasonTitle: string | null;
};

export type AdminArtistApplyDetail = AdminArtistApplyListItem & {
  bio: string | null;
  career: string | null;
  majorName: string | null;
  rejectedReason: string | null;
  instruments: InstrumentResponse[];
};

export type AdminUserListItem = {
  userId: number;
  email: string;
  username: string;
  profileImgUrl: string | null;
  artistStatus: ArtistStatus;
  emailVerified: boolean;
  admin: boolean;
  sample: boolean;
  createDt: string | null;
  suspendedDt: string | null; // null 이면 정상
  suspendedReason: string | null;
};

// 백엔드 검증과 같은 길이
export const REJECT_TITLE_MAX = 100;
export const REJECT_REASON_MAX = 2000;
export const SUSPEND_REASON_MAX = 255;

export const ADMIN_ROLE = "ROLE_ADMIN";

// ---------- 대시보드 ----------
export type DashboardDays = 7 | 30 | 90;
export type NameCount = { name: string; count: number };
export type DashboardDailyPoint = { date: string; visitors: number; newVisitors: number; signups: number };

export type AdminDashboard = {
  days: number;
  from: string;
  to: string;
  kpis: {
    totalUsers: number;
    newUsers: number;
    newUsersPrev: number;
    visitors: number;
    visitorsPrev: number;
    newVisitors: number;
    approvedArtists: number;
    pendingArtists: number;
    suspendedUsers: number;
    openFlags: number;
    openReports: number;
    loginFailures: number;
  };
  daily: DashboardDailyPoint[];
  sources: NameCount[];
  referrers: NameCount[];
  landings: NameCount[];
  signupMethods: NameCount[];
  activity: {
    reservationRequests: number;
    reservationsCompleted: number;
    reservationsCanceled: number;
    chatMessages: number;
    inquiries: number;
    reviews: number;
  };
};

// ---------- 이상행동 · 신고 ----------
export type ModerationStatus = "OPEN" | "DISMISSED" | "ACTIONED";
export type AbuseRule =
  | "CHAT_FLOOD"
  | "INQUIRY_SPAM"
  | "RESERVATION_SPAM"
  | "RESERVATION_CANCEL"
  | "LOGIN_FAILURE"
  | "REVIEW_BURST"
  | "REVIEW_LOW_RATING"
  | "REPORTED";

export type AbuseFlagItem = {
  abuseFlagId: number;
  userId: number;
  email: string;
  username: string;
  profileImgUrl: string | null;
  suspended: boolean;
  rule: AbuseRule;
  detail: string;
  metric: number;
  status: ModerationStatus;
  detectedDt: string;
  lastDetectedDt: string;
  resolvedByName: string | null;
  resolvedDt: string | null;
};

export type ReportTargetType = "ARTIST" | "CHAT_ROOM" | "REVIEW" | "INQUIRY";
export type ReportReason = "SPAM" | "ABUSE" | "FRAUD" | "INAPPROPRIATE" | "ETC";

export type AdminReportItem = {
  reportId: number;
  reporterUserId: number;
  reporterName: string;
  reporterEmail: string;
  targetUserId: number;
  targetName: string;
  targetEmail: string;
  targetProfileImgUrl: string | null;
  targetSuspended: boolean;
  targetOpenReports: number;
  targetType: ReportTargetType;
  targetRefId: number;
  reason: ReportReason;
  detail: string | null;
  contentSnapshot: string | null;
  status: ModerationStatus;
  adminMemo: string | null;
  resolvedByName: string | null;
  createDt: string;
  resolvedDt: string | null;
};

export type ModerationCounts = { openFlags: number; openReports: number };

export const REPORT_REASON_LABEL: Record<ReportReason, string> = {
  SPAM: "스팸·홍보",
  ABUSE: "욕설·괴롭힘",
  FRAUD: "사기·금전 요구",
  INAPPROPRIATE: "부적절한 내용",
  ETC: "기타",
};

export const REPORT_DETAIL_MAX = 1000;
export const ADMIN_MEMO_MAX = 255;
