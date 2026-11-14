import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSupportReq,
  getAdminSupportOpenCountReq,
  getAdminSupportReq,
  getMySupportReq,
  replySupportReq,
} from "../../apis/support/supportApi";

export const supportKeys = {
  all: ["support"] as const,
  mine: () => [...supportKeys.all, "mine"] as const,
  admin: (open: boolean, page: number) => [...supportKeys.all, "admin", open, page] as const,
  adminOpenCount: () => [...supportKeys.all, "admin", "openCount"] as const,
};

// ---------- 사용자 ----------
export const useMySupport = () => useQuery({ queryKey: supportKeys.mine(), queryFn: getMySupportReq });

export const useCreateSupport = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createSupportReq,
    onSuccess: () => qc.invalidateQueries({ queryKey: supportKeys.mine() }),
  });
};

// ---------- 관리자 ----------
export const useAdminSupport = (open: boolean, page: number) =>
  useQuery({
    queryKey: supportKeys.admin(open, page),
    queryFn: () => getAdminSupportReq({ open, page }),
    placeholderData: keepPreviousData,
  });

// 사이드 메뉴 뱃지
export const useAdminSupportOpenCount = (enabled: boolean) =>
  useQuery({
    queryKey: supportKeys.adminOpenCount(),
    queryFn: getAdminSupportOpenCountReq,
    enabled,
    staleTime: 1000 * 30,
  });

export const useReplySupport = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: replySupportReq,
    onSuccess: () => qc.invalidateQueries({ queryKey: [...supportKeys.all, "admin"] }),
  });
};
