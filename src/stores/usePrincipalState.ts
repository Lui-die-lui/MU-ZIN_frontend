import { create } from "zustand";
import type { PrincipalState } from "../Types/auth";
import { queryClient } from "../configs/queryClient";

export const usePrincipalState = create<PrincipalState>((set) => ({
  principal: null,
  isAuthenticated: false,
  setPrincipal: (p) => set({ principal: p, isAuthenticated: !!p }), // !!p = sAuthenticated = principal !== null
  login: (p) => set({ principal: p, isAuthenticated: true }),
  logout: () => {
    localStorage.removeItem("jwt");
    queryClient.clear;
    set({ principal: null, isAuthenticated: false });
    window.location.href = "/login";
  },
}));
