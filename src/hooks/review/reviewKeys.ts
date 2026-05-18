export const reviewKeys = {
  all: ["reviews"] as const,
  keywords: () => [...reviewKeys.all, "keywords"] as const,
  me: () => [...reviewKeys.all, "me"] as const,
  lesson: (lessonId: number) =>
    [...reviewKeys.all, "lesson", lessonId] as const,
  artist: (artistProfileId: number) =>
    [...reviewKeys.all, "artist", artistProfileId] as const,
};
