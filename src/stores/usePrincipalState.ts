import { create } from "zustand";
import type { Principal, PrincipalState } from "../Types/auth";
import { queryClient } from "../configs/queryClient";
import { getPrincipalReq, signinReq } from "../apis/auth/authApi";

type PrincipalStore = {
  principal: Principal | null;
  isAuthenticated: boolean;
  setPrincipal: (p: Principal | null) => void;

  updatePrincipal: (patch: Partial<Principal>) => void;

  signin: (email: string, password: string) => Promise<void>; // 이거 왜 이렇게 되는거임?
  bootstrap: () => Promise<void>; // 앱 시작시 principal 상태 관리

  logout: (redirectTo?: string) => void;
};

export const usePrincipalState = create<PrincipalStore>((set) => ({
  principal: null,
  isAuthenticated: false,

  setPrincipal: (p) => set({ principal: p, isAuthenticated: !!p }),

  // 업데이트 
  updatePrincipal: (patch) =>
    set((state) => {
      if (!state.principal) return state; // 로그인 전이면 변경 불가
      return {
        ...state,
        principal: { ...state.principal, ...patch },
        isAuthenticated: true,
      };
    }),

  signin: async (email, password) => {
    // 1. 로그인 요청 -> ApiRespDto<string|null>
    const signinRes = await signinReq({ email, password });
    const { status, message, data: accessToken } = signinRes.data;

    if (status !== "success" || !accessToken) {
      // 백엔드에서 떨어지는 메시지
      throw new Error(message);
    }

    // 2. 토큰 저장
    localStorage.setItem("accessToken", accessToken);

    // 3. Principal 조회 -> ApiRespDto<Principal>
    const PrincipalRes = await getPrincipalReq();
    const {
      status: pStatus,
      message: pMsg,
      data: principal,
    } = PrincipalRes.data;

    if (pStatus !== "success") {
      // 토큰은 저장됐지만 principal이 실패하면 ux가 이상해짐 - 로그인 상태인데 로그인이 안됐다던가
      localStorage.removeItem("accessToken");
      throw new Error(pMsg);
    }

    // 4. 전역 상태 세팅
    set({ principal, isAuthenticated: true });
  },

  bootstrap: async () => {
    // 앱 시작/새로고침 시 토큰 있으면 principal 복구
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const principalRes = await getPrincipalReq();
      const { status, data: principal } = principalRes.data;

      if (status !== "success") {
        localStorage.removeItem("accessToken");
        set({ principal: null, isAuthenticated: false });
        return;
      }

      // 성공시 principal 객체 / 인증 상태 true로 세팅해줌
      set({ principal, isAuthenticated: true });
    } catch {
      // 네트워크/401 등
      localStorage.removeItem("accessToken");
      set({ principal: null, isAuthenticated: false });
    }
  },

  logout: () => {
    localStorage.removeItem("accessToken");
    queryClient.clear();
    set({ principal: null, isAuthenticated: false });
  },
}));
