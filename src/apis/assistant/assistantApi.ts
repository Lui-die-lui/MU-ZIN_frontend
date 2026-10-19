import type { ApiRespDto } from "../../Types/responseType";
import type { AssistantConversation, AssistantConversationSummary, AssistantQuota } from "../../Types/assistantTypes";
import type { StyleAssistantContext } from "../../features/hobbyFinder/engine";
import { instance } from "../instance/instance";

// AI 레슨 내비게이터 (로그인 필요). 시작·질문 추가는 Idempotency-Key 필수 (재시도·중복 클릭이 한 번만 처리되게)
const BASE = "/ai/lesson-assistant";

export const getAssistantQuotaReq = async () => (await instance.get<ApiRespDto<AssistantQuota>>(`${BASE}/quota`)).data.data;

export const getAssistantConversationsReq = async () =>
  (await instance.get<ApiRespDto<AssistantConversationSummary[]>>(`${BASE}/conversations`)).data.data;

export const getAssistantConversationReq = async (conversationId: number) =>
  (await instance.get<ApiRespDto<AssistantConversation>>(`${BASE}/conversations/${conversationId}`)).data.data;

export const startAssistantConversationReq = async (p: {
  message: string;
  styleContext: StyleAssistantContext | null;
  idempotencyKey: string;
}) =>
  (
    await instance.post<ApiRespDto<AssistantConversation>>(
      `${BASE}/conversations`,
      { message: p.message, styleContext: p.styleContext },
      { headers: { "Idempotency-Key": p.idempotencyKey } },
    )
  ).data.data;

export const sendAssistantMessageReq = async (p: { conversationId: number; message: string; idempotencyKey: string }) =>
  (
    await instance.post<ApiRespDto<AssistantConversation>>(
      `${BASE}/conversations/${p.conversationId}/messages`,
      { message: p.message },
      { headers: { "Idempotency-Key": p.idempotencyKey } },
    )
  ).data.data;

export const deleteAssistantConversationReq = async (conversationId: number) => {
  await instance.delete(`${BASE}/conversations/${conversationId}`);
};

export const deleteAllAssistantConversationsReq = async () => {
  await instance.delete(`${BASE}/conversations`);
};
