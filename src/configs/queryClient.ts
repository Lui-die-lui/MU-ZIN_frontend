import { QueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

const isAxiosError = (error: unknown): error is AxiosError =>
  axios.isAxiosError(error); // 에러 자체가 axios 에러(http 요청 에러)인지 확인

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: unknown) => {
        if (isAxiosError(error)) {
          // 에러가 exios에러 일 때
          const status = error.response?.status;
          if (status === 401 || status === 403) return false; // 권한 없으면 재시도 막기
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
