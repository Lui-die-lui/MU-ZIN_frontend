import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  approveArtistReq,
  dismissAbuseFlagReq,
  getAbuseFlagsReq,
  getAdminDashboardReq,
  getAdminReportsReq,
  getAdminUsersReq,
  getModerationCountsReq,
  resolveAdminReportReq,
  getArtistApplicationReq,
  getArtistApplicationsReq,
  rejectArtistReq,
  suspendUserReq,
  unsuspendUserReq,
} from "../../apis/admin/adminApi";
import type { DashboardDays, ReviewStatus } from "../../Types/adminTypes";
import { usePrincipalState } from "../../stores/usePrincipalState";
import { ADMIN_ROLE } from "../../Types/adminTypes";

export const adminKeys = {
  all: ["admin"] as const,
  applications: () => [...adminKeys.all, "applications"] as const,
  applicationList: (status: ReviewStatus, page: number) => [...adminKeys.applications(), "list", status, page] as const,
  application: (artistProfileId: number) => [...adminKeys.applications(), "detail", artistProfileId] as const,
  users: (q: string, suspended: boolean, page: number) => [...adminKeys.all, "users", q, suspended, page] as const,
  dashboard: (days: DashboardDays) => [...adminKeys.all, "dashboard", days] as const,
  moderationCounts: () => [...adminKeys.all, "moderation", "counts"] as const,
  flags: (open: boolean, page: number) => [...adminKeys.all, "moderation", "flags", open, page] as const,
  reports: (open: boolean, page: number) => [...adminKeys.all, "moderation", "reports", open, page] as const,
};

export const useIsAdmin = () => usePrincipalState((st) => !!st.principal?.roles?.includes(ADMIN_ROLE));

// ---------- 조회 ----------

export const useArtistApplications = (status: ReviewStatus, page: number, enabled = true) =>
  useQuery({
    queryKey: adminKeys.applicationList(status, page),
    queryFn: () => getArtistApplicationsReq({ status, page }),
    placeholderData: keepPreviousData,
    enabled,
  });

// 사이드 메뉴 뱃지용 - 대기 건수만 (첫 페이지의 totalElements)
export const usePendingApplicationCount = (enabled: boolean) =>
  useQuery({
    queryKey: adminKeys.applicationList("PENDING", 0),
    queryFn: () => getArtistApplicationsReq({ status: "PENDING", page: 0 }),
    select: (p) => p.totalElements,
    enabled,
    staleTime: 1000 * 30,
  });

export const useArtistApplication = (artistProfileId: number | null) =>
  useQuery({
    queryKey: adminKeys.application(artistProfileId ?? 0),
    queryFn: () => getArtistApplicationReq(artistProfileId!),
    enabled: !!artistProfileId,
  });

export const useAdminUsers = (q: string, suspended: boolean, page: number) =>
  useQuery({
    queryKey: adminKeys.users(q, suspended, page),
    queryFn: () => getAdminUsersReq({ q, suspended, page }),
    placeholderData: keepPreviousData,
  });

export const useAdminDashboard = (days: DashboardDays) =>
  useQuery({
    queryKey: adminKeys.dashboard(days),
    queryFn: () => getAdminDashboardReq(days),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60,
  });

// 사이드 메뉴 뱃지용 - 처리 안 된 감지 + 신고
export const useModerationCounts = (enabled: boolean) =>
  useQuery({
    queryKey: adminKeys.moderationCounts(),
    queryFn: getModerationCountsReq,
    enabled,
    staleTime: 1000 * 30,
  });

export const useAbuseFlags = (open: boolean, page: number) =>
  useQuery({
    queryKey: adminKeys.flags(open, page),
    queryFn: () => getAbuseFlagsReq({ open, page }),
    placeholderData: keepPreviousData,
  });

export const useAdminReports = (open: boolean, page: number) =>
  useQuery({
    queryKey: adminKeys.reports(open, page),
    queryFn: () => getAdminReportsReq({ open, page }),
    placeholderData: keepPreviousData,
  });

// ---------- 변경 ----------
// 심사하면 모든 탭 목록·건수가 바뀌고, 정지하면 회원 목록이 바뀜 -> 관리자 쿼리 전체를 다시 불러옴

const useInvalidateAdmin = () => {
  const qc = useQueryClient();
  return () => qc.invalidateQueries({ queryKey: adminKeys.all });
};

export const useApproveArtist = () => {
  const invalidate = useInvalidateAdmin();
  return useMutation({ mutationFn: approveArtistReq, onSuccess: invalidate });
};

export const useRejectArtist = () => {
  const invalidate = useInvalidateAdmin();
  return useMutation({ mutationFn: rejectArtistReq, onSuccess: invalidate });
};

export const useSuspendUser = () => {
  const invalidate = useInvalidateAdmin();
  return useMutation({ mutationFn: suspendUserReq, onSuccess: invalidate });
};

export const useUnsuspendUser = () => {
  const invalidate = useInvalidateAdmin();
  return useMutation({ mutationFn: unsuspendUserReq, onSuccess: invalidate });
};

export const useDismissAbuseFlag = () => {
  const invalidate = useInvalidateAdmin();
  return useMutation({ mutationFn: dismissAbuseFlagReq, onSuccess: invalidate });
};

export const useResolveAdminReport = () => {
  const invalidate = useInvalidateAdmin();
  return useMutation({ mutationFn: resolveAdminReportReq, onSuccess: invalidate });
};
