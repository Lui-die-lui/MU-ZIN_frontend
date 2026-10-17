import { create } from "zustand";

// 내 레슨 관리 목록의 정렬/필터/검색 상태 (수정 화면에 다녀와도 유지되도록 store 에 보관)
export type LessonSort = "LATEST" | "OLDEST" | "TITLE";
export type LessonStatusFilter = "ALL" | "ACTIVE" | "INACTIVE";

type MyLessonsUiState = {
  sort: LessonSort;
  statusFilter: LessonStatusFilter;
  keyword: string;
  setSort: (v: LessonSort) => void;
  setStatusFilter: (v: LessonStatusFilter) => void;
  setKeyword: (v: string) => void;
  reset: () => void;
};

const INITIAL = { sort: "LATEST", statusFilter: "ALL", keyword: "" } as const;

export const useMyLessonUiStore = create<MyLessonsUiState>((set) => ({
  ...INITIAL,
  setSort: (sort) => set({ sort }),
  setStatusFilter: (statusFilter) => set({ statusFilter }),
  setKeyword: (keyword) => set({ keyword }),
  reset: () => set({ ...INITIAL }),
}));
