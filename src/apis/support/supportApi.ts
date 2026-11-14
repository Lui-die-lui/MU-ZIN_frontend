import type { ApiRespDto } from "../../Types/responseType";
import type { PageResp } from "../../Types/adminTypes";
import type { AdminSupportItem, SupportCategory, SupportInquiry } from "../../Types/supportTypes";
import { instance } from "../instance/instance";

// ---------- 사용자 ----------
export const createSupportReq = async (body: { category: SupportCategory; content: string }) =>
  (await instance.post<ApiRespDto<SupportInquiry>>("/support", body)).data.data;

export const getMySupportReq = async () => (await instance.get<ApiRespDto<SupportInquiry[]>>("/support/me")).data.data;

// ---------- 관리자 (ROLE_ADMIN) ----------
export const getAdminSupportReq = async ({ open, page }: { open: boolean; page: number }) =>
  (
    await instance.get<ApiRespDto<PageResp<AdminSupportItem>>>("/admin/support", {
      params: { open, page, size: 20 },
    })
  ).data.data;

export const getAdminSupportOpenCountReq = async () =>
  (await instance.get<ApiRespDto<{ openCount: number }>>("/admin/support/open-count")).data.data.openCount;

export const replySupportReq = async ({ supportId, content }: { supportId: number; content: string }) =>
  (await instance.post<ApiRespDto<AdminSupportItem>>(`/admin/support/${supportId}/reply`, { content })).data.data;
