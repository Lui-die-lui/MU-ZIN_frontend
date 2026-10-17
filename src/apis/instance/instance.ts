import axios from "axios";
import { ApiError, toApiError } from "../../utils/errorUtils";

// 기본 설정
export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 로그인 만료/정지 시 실행할 처리 (순환 import를 피하려고 App에서 등록)
type SessionEndHandler = (error: ApiError) => void;
let onSessionEnd: SessionEndHandler | null = null;
export const setSessionEndHandler = (handler: SessionEndHandler | null) => {
  onSessionEnd = handler;
};

// 토큰이 더 이상 쓸 수 없다는 뜻의 에러 코드
const SESSION_END_CODES = new Set([
  "UNAUTHORIZED",
  "TOKEN_EXPIRED",
  "TOKEN_INVALID",
  "ACCOUNT_SUSPENDED",
]);

// 요청 인터셉터 설정 - 모든 요청마다 헤더에 jwt를 자동으로 붙여줌
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token && token !== "null" && token !== "undefined") {
      config.headers = config.headers ?? {};
      config.headers.Authorization = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 응답 인터셉터 - 실패는 전부 ApiError로 통일
instance.interceptors.response.use(
  (response) => {
    // 예전 방식(HTTP 200 + status "failed")이 남아 있어도 실패로 처리
    const body = response.data as { status?: string; message?: string } | undefined;
    if (body && typeof body === "object" && body.status === "failed") {
      return Promise.reject(
        new ApiError({
          message: body.message || "요청을 처리하지 못했습니다.",
          httpStatus: response.status,
          code: "FAILED",
        }),
      );
    }
    return response;
  },
  (error) => {
    const apiError = toApiError(error);

    // 토큰을 보낸 요청이 401/정지로 막혔으면 세션 종료 처리
    // (로그인 시도 자체의 401 = 비밀번호 틀림은 토큰이 없으므로 해당 없음)
    const sentToken = !!error?.config?.headers?.Authorization;
    if (sentToken && SESSION_END_CODES.has(apiError.code) && onSessionEnd) {
      onSessionEnd(apiError);
    }

    return Promise.reject(apiError);
  },
);
