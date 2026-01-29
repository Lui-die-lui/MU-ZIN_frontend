import { create } from "zustand";

export type LessonSort = "LATEST" | "OLDEST";

type MyLessonsUiState = {
  sort: LessonSort;
  keyword: string;
  setSort: (v: LessonSort) => void;
  setKeyword: (v: string) => void;
};

export const useMyLessonUiStore = create<MyLessonsUiState>((set) => ({
  sort: "LATEST",
  keyword: "",
  setSort: (sort) => set({ sort }),
  setKeyword: (keyword) => set({ keyword }),
}));
