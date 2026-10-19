import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteAllAssistantConversationsReq,
  deleteAssistantConversationReq,
  getAssistantConversationReq,
  getAssistantConversationsReq,
  getAssistantQuotaReq,
  sendAssistantMessageReq,
  startAssistantConversationReq,
} from "../../apis/assistant/assistantApi";
import type { AssistantConversation } from "../../Types/assistantTypes";

export const assistantKeys = {
  all: ["assistant"] as const,
  quota: () => [...assistantKeys.all, "quota"] as const,
  list: () => [...assistantKeys.all, "list"] as const,
  detail: (id: number) => [...assistantKeys.all, "detail", id] as const,
};

// 이용량·예산은 서버가 바꾸므로 캐시를 오래 두지 않음
export const useAssistantQuota = (enabled: boolean) =>
  useQuery({ queryKey: assistantKeys.quota(), queryFn: getAssistantQuotaReq, enabled, staleTime: 0, refetchOnMount: "always" });

export const useAssistantConversations = (enabled: boolean) =>
  useQuery({ queryKey: assistantKeys.list(), queryFn: getAssistantConversationsReq, enabled, staleTime: 0 });

// 카드 값(가격·예약 가능 시간)은 열 때마다 서버 DB 값으로
export const useAssistantConversation = (id: number | null) =>
  useQuery({
    queryKey: assistantKeys.detail(id ?? 0),
    queryFn: () => getAssistantConversationReq(id!),
    enabled: !!id,
    staleTime: 0,
    refetchOnMount: "always",
  });

const useRefreshAfter = () => {
  const qc = useQueryClient();
  return (data?: AssistantConversation) => {
    if (data) qc.setQueryData(assistantKeys.detail(data.conversationId), data);
    qc.invalidateQueries({ queryKey: assistantKeys.quota() });
    qc.invalidateQueries({ queryKey: assistantKeys.list() });
  };
};

// 오류는 화면 안에 직접 보여주므로 전역 토스트 생략
export const useStartAssistant = () => {
  const refresh = useRefreshAfter();
  return useMutation({
    mutationFn: startAssistantConversationReq,
    meta: { skipGlobalError: true },
    onSuccess: (d) => refresh(d),
    onError: () => refresh(),
  });
};

export const useSendAssistantMessage = () => {
  const refresh = useRefreshAfter();
  return useMutation({
    mutationFn: sendAssistantMessageReq,
    meta: { skipGlobalError: true },
    onSuccess: (d) => refresh(d),
    onError: () => refresh(),
  });
};

export const useDeleteAssistantConversation = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAssistantConversationReq,
    onSuccess: (_d, id) => {
      qc.removeQueries({ queryKey: assistantKeys.detail(id) });
      qc.invalidateQueries({ queryKey: assistantKeys.list() });
    },
  });
};

export const useDeleteAllAssistantConversations = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAllAssistantConversationsReq,
    onSuccess: () => qc.invalidateQueries({ queryKey: assistantKeys.all }),
  });
};
