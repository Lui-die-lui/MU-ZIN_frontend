export const regionKeys = {
  all: ["regions"] as const,

  sido: () => [...regionKeys.all, "sido"] as const,
  sidoList: (q?: string) => [...regionKeys.sido(), "list", q ?? ""] as const,

  children: () => [...regionKeys.all, "children"] as const,
  childrenList: (parentId: number | null, q?: string) =>
    [...regionKeys.children(), parentId ?? "none", q ?? ""] as const,
};
