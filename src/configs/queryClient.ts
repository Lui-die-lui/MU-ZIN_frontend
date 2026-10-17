import { MutationCache, QueryClient } from "@tanstack/react-query";
import { ApiError, getErrorMessage } from "../utils/errorUtils";
import { toast } from "../stores/useToastStore";

// useMutation({ meta: { skipGlobalError: true } }) 이면 전역 토스트를 띄우지 않음
// (화면 안에 에러를 직접 보여주는 곳에서 사용)
declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: { skipGlobalError?: boolean };
  }
}

// 세션 만료는 인터셉터가 따로 안내하므로 토스트 중복 방지
const SESSION_CODES = new Set(["UNAUTHORIZED", "TOKEN_EXPIRED", "TOKEN_INVALID", "ACCOUNT_SUSPENDED"]);

export const queryClient = new QueryClient({
  // 변경 요청(저장/예약/취소 등) 실패는 기본적으로 백엔드 메시지를 토스트로 표시
  mutationCache: new MutationCache({
    onError: (error, _vars, _ctx, mutation) => {
      if (mutation.meta?.skipGlobalError) return;
      if (error instanceof ApiError && SESSION_CODES.has(error.code)) return;
      toast.error(getErrorMessage(error, "요청을 처리하지 못했습니다."));
    },
  }),
  defaultOptions: {
    queries: {
      retry: (failureCount, error: unknown) => {
        if (error instanceof ApiError) {
          // 4xx는 다시 시도해도 결과가 같으므로 재시도하지 않음 (네트워크/5xx만 1회 재시도)
          if (error.httpStatus >= 400 && error.httpStatus < 500) return false;
        }
        return failureCount < 1; // retry: 1
      },
      refetchOnWindowFocus: false, // 불필요한 재요청 방지
      refetchOnReconnect: true,
      staleTime: 1000 * 60 * 3, // 3분 안에는 같은 쿼리면 재요청보다 캐시를 우선
      gcTime: 1000 * 60 * 10, // 사용 안하는 쿼리는 10분 지나면 캐시에서 정리
    },
  },
});
