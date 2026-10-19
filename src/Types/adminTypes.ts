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
