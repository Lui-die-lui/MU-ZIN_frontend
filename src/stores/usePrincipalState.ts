import { create } from "zustand";
import type { Principal } from "../Types/auth";
import { queryClient } from "../configs/queryClient";
import { getPrincipalReq, signinReq } from "../apis/auth/authApi";
import { ApiError } from "../utils/errorUtils";

type PrincipalStore = {
  principal: Principal | null;
  isAuthenticated: boolean;
  hydrated: boolean; // 앱 시작 시 로그인 복구 시도가 끝났는지

  setPrincipal: (p: Principal | null) => void;

  updatePrincipal: (patch: Partial<Principal>) => void;

  signin: (email: string, password: string) => Promise<void>;
  bootstrap: () => Promise<void>; // 앱 시작시 principal 상태 관리

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

  logout: () => {
    localStorage.removeItem("accessToken");
    queryClient.clear();
    set({ principal: null, isAuthenticated: false, hydrated: true });
  },
}));
