import type { ApiRespDto } from "../../Types/responseType";
import type {
  AbuseFlagItem,
  AdminArtistApplyDetail,
  AdminDashboard,
  AdminReportItem,
  DashboardDays,
  ModerationCounts,
  AdminArtistApplyListItem,
  AdminUserListItem,
  PageResp,
  ReviewStatus,
} from "../../Types/adminTypes";
import { instance } from "../instance/instance";

// 관리자 전용 (ROLE_ADMIN). 아니면 403

// ---------- 아티스트 신청 심사 ----------
export const getArtistApplicationsReq = async ({ status, page }: { status: ReviewStatus; page: number }) =>
  (
    await instance.get<ApiRespDto<PageResp<AdminArtistApplyListItem>>>("/admin/artist-applications", {
      params: { status, page, size: 20 },
    })
  ).data.data;

export const getArtistApplicationReq = async (artistProfileId: number) =>
  (await instance.get<ApiRespDto<AdminArtistApplyDetail>>(`/admin/artist-applications/${artistProfileId}`)).data.data;

export const approveArtistReq = async (artistProfileId: number) => {
  await instance.post(`/admin/artist-applications/${artistProfileId}/approve`);
};

export const rejectArtistReq = async ({
  artistProfileId,
  title,
  reason,
}: {
  artistProfileId: number;
  title: string;
  reason: string;
}) => {
  await instance.post(`/admin/artist-applications/${artistProfileId}/reject`, { title, reason });
};

// ---------- 회원 관리 ----------
export const getAdminUsersReq = async ({ q, suspended, page }: { q: string; suspended: boolean; page: number }) =>
  (
    await instance.get<ApiRespDto<PageResp<AdminUserListItem>>>("/admin/users", {
      params: { q: q || undefined, suspended, page, size: 20 },
    })
  ).data.data;

export const suspendUserReq = async ({ userId, reason }: { userId: number; reason: string }) => {
  await instance.post(`/admin/users/${userId}/suspend`, { reason });
};

export const unsuspendUserReq = async (userId: number) => {
  await instance.post(`/admin/users/${userId}/unsuspend`);
};

// ---------- 대시보드 ----------
export const getAdminDashboardReq = async (days: DashboardDays) =>
  (await instance.get<ApiRespDto<AdminDashboard>>("/admin/dashboard", { params: { days } })).data.data;

// ---------- 이상행동 · 신고 ----------
export const getModerationCountsReq = async () =>
  (await instance.get<ApiRespDto<ModerationCounts>>("/admin/moderation/counts")).data.data;

export const getAbuseFlagsReq = async ({ open, page }: { open: boolean; page: number }) =>
  (
    await instance.get<ApiRespDto<PageResp<AbuseFlagItem>>>("/admin/moderation/flags", {
      params: { open, page, size: 20 },
    })
  ).data.data;

export const dismissAbuseFlagReq = async (flagId: number) => {
  await instance.post(`/admin/moderation/flags/${flagId}/dismiss`);
};

export const getAdminReportsReq = async ({ open, page }: { open: boolean; page: number }) =>
  (
    await instance.get<ApiRespDto<PageResp<AdminReportItem>>>("/admin/moderation/reports", {
      params: { open, page, size: 20 },
    })
  ).data.data;

// actioned: true = 조치 완료 / false = 문제없음
export const resolveAdminReportReq = async ({
  reportId,
  actioned,
  memo,
}: {
  reportId: number;
  actioned: boolean;
  memo?: string;
}) => {
  await instance.post(`/admin/moderation/reports/${reportId}/${actioned ? "resolve" : "dismiss"}`, { memo: memo || null });
};
