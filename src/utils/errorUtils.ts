import axios from "axios";

// 백엔드 실패 응답: HTTP 4xx/5xx + { status: "failed", message, data: { code, fieldErrors? } }
type FailedBody = {
  status?: string;
  message?: string;
  data?: { code?: string; fieldErrors?: Record<string, string>; retryAfterSeconds?: number } | null;
};

// 모든 API 실패를 이 형태로 통일 (axios 인터셉터에서 변환)
export class ApiError extends Error {
  readonly httpStatus: number; // 0 = 네트워크 오류(서버 응답 없음)
  readonly code: string;
  readonly fieldErrors?: Record<string, string>;
  readonly requestId?: string;
  readonly retryAfterSeconds?: number; // 429(횟수 제한)일 때 다시 시도 가능까지 남은 초

  constructor(params: {
    message: string;
    httpStatus: number;
    code: string;
    fieldErrors?: Record<string, string>;
    requestId?: string;
    retryAfterSeconds?: number;
  }) {
    super(params.message);
    this.name = "ApiError";
    this.httpStatus = params.httpStatus;
    this.code = params.code;
    this.fieldErrors = params.fieldErrors;
    this.requestId = params.requestId;
    this.retryAfterSeconds = params.retryAfterSeconds;
  }
}

export function toApiError(e: unknown): ApiError {
  if (e instanceof ApiError) return e;

  if (axios.isAxiosError(e)) {
    const requestId = e.response?.headers?.["x-request-id"] as string | undefined;

    // 서버 응답 자체가 없음 (서버 꺼짐, 네트워크 끊김, CORS)
    if (!e.response) {
      return new ApiError({
        message: "서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.",
        httpStatus: 0,
        code: "NETWORK_ERROR",
      });
    }

    const body = e.response.data as FailedBody | undefined;
    return new ApiError({
      message: body?.message || defaultMessage(e.response.status),
      httpStatus: e.response.status,
      code: body?.data?.code ?? `HTTP_${e.response.status}`,
      fieldErrors: body?.data?.fieldErrors,
      retryAfterSeconds: body?.data?.retryAfterSeconds,
      requestId,
    });
  }

  if (e instanceof Error) {
    return new ApiError({ message: e.message, httpStatus: 0, code: "CLIENT_ERROR" });
  }
  return new ApiError({ message: String(e), httpStatus: 0, code: "CLIENT_ERROR" });
}

function defaultMessage(httpStatus: number) {
  if (httpStatus === 401) return "로그인이 필요합니다.";
  if (httpStatus === 403) return "접근 권한이 없습니다.";
  if (httpStatus === 404) return "요청한 정보를 찾을 수 없습니다.";
  if (httpStatus >= 500) return "일시적인 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  return "요청을 처리하지 못했습니다.";
}

// 화면에 보여줄 메시지 (백엔드 메시지 우선)
export function getErrorMessage(e: unknown, fallback = "문제가 발생했습니다.") {
  if (e instanceof ApiError || axios.isAxiosError(e)) return toApiError(e).message || fallback;
  if (e instanceof Error) return e.message || fallback;
  if (typeof e === "string") return e;
  return fallback;
}
