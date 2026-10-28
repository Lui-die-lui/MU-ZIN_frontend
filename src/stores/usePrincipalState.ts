import { create } from "zustand";
import type { Principal } from "../Types/auth";
import { queryClient } from "../configs/queryClient";
import { getPrincipalReq, signinReq } from "../apis/auth/authApi";
import { ApiError } from "../utils/errorUtils";
import { detachPushOnLogout } from "../push/pushClient";

type PrincipalStore = {
  principal: Principal | null;
  isAuthenticated: boolean;
  hydrated: boolean; // 앱 시작 시 로그인 복구 시도가 끝났는지

  setPrincipal: (p: Principal | null) => void;

  updatePrincipal: (patch: Partial<Principal>) => void;

  signin: (email: string, password: string) => Promise<void>;
  bootstrap: () => Promise<void>; // 앱 시작시 principal 상태 관리
  refreshPrincipal: () => Promise<void>; // 서버에서 바뀐 값(아티스트 승인/반려 등)을 다시 받아옴

  logout: () => void;
};

// 진행 중인 bootstrap 공유 (여러 곳에서 동시에 불러도 요청은 1번)
let bootstrapPromise: Promise<void> | null = null;

export const usePrincipalState = create<PrincipalStore>((set) => ({
  principal: null,
  isAuthenticated: false,
  hydrated: false,

  setPrincipal: (p) => set({ principal: p, isAuthenticated: !!p }),

  // 업데이트
  updatePrincipal: (patch) =>
    set((state) => {
      if (!state.principal) return state; // 로그인 전이면 변경 불가
      return {
        ...state,
        principal: { ...state.principal, ...patch },
        isAuthenticated: true,
        hydrated: true,
      };
    }),

  // 실패 시 ApiError(백엔드 메시지)를 그대로 던짐
  signin: async (email, password) => {
    // 1. 로그인 요청 -> ApiRespDto<string>
    const signinRes = await signinReq({ email, password });
    const accessToken = signinRes.data.data;

    // 2. 토큰 저장
    localStorage.setItem("accessToken", accessToken);

    // 3. Principal 조회 -> 실패하면 토큰도 지워서 "로그인됐는데 정보 없음" 상태를 막음
    try {
      const principalRes = await getPrincipalReq();
      set({ principal: principalRes.data.data, isAuthenticated: true, hydrated: true });
    } catch (e) {
      localStorage.removeItem("accessToken");
      throw e;
    }
  },

  bootstrap: () => {
    if (bootstrapPromise) return bootstrapPromise;

    bootstrapPromise = (async () => {
      // 앱 시작/새로고침 시 토큰 있으면 principal 복구
      const token = localStorage.getItem("accessToken");
      if (!token) {
        set({ principal: null, isAuthenticated: false, hydrated: true });
        return;
      }

      try {
        const principalRes = await getPrincipalReq();
        set({ principal: principalRes.data.data, isAuthenticated: true, hydrated: true });
      } catch (e) {
        // 토큰이 무효(401/정지)일 때만 지움. 서버가 잠깐 꺼진 경우엔 토큰을 남겨서 새로고침하면 복구되게
        if (e instanceof ApiError && (e.httpStatus === 401 || e.httpStatus === 403)) {
          localStorage.removeItem("accessToken");
        }
        set({ principal: null, isAuthenticated: false, hydrated: true });
      }
    })().finally(() => {
      bootstrapPromise = null;
    });

    return bootstrapPromise;
  },

  // principal 은 react-query 가 아니라서 invalidateQueries(["principal"]) 로는 갱신되지 않음 -> 이걸 호출
  // 실패하면 기존 값 유지 (세션 만료는 인터셉터가 처리)
  refreshPrincipal: async () => {
    if (!localStorage.getItem("accessToken")) return;
    try {
      const principalRes = await getPrincipalReq();
      set({ principal: principalRes.data.data, isAuthenticated: true, hydrated: true });
    } catch {
      // 유지
    }
  },

  logout: () => {
    // 이 기기의 알림 구독을 먼저 떼어 냄 (토큰이 있어야 서버에서도 지울 수 있음) - 기다리지 않음
    void detachPushOnLogout(localStorage.getItem("accessToken"));
    localStorage.removeItem("accessToken");
    queryClient.clear();
    set({ principal: null, isAuthenticated: false, hydrated: true });
  },
}));
