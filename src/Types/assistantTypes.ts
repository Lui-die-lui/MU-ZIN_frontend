import type { LessonMode } from "./lessonTypes";

// AI 레슨 내비게이터 (백엔드 /ai/lesson-assistant)

export type AssistantQuota = {
  weeklyLimit: number;
  used: number;
  remaining: number;
  weekStart: string;
  resetsAt: string; // 다음 월요일 00:00 (KST)
  maxUserMessages: number;
  available: boolean;
  unavailableCode: "AI_BUDGET_EXHAUSTED" | "AI_UNAVAILABLE" | null;
  unavailableMessage: string | null;
};

// 추천 카드 - 값은 모두 서버가 DB 에서 채움 (가격·지역·예약 가능 시간·링크)
export type AssistantCard = {
  kind: "LESSON" | "ARTIST";
  id: number;
  reason: string | null;
  available: boolean;
  title: string | null;
  artistProfileId: number | null;
  artistName: string | null;
  profileImgUrl: string | null;
  majorName: string | null;
  instruments: string[];
  mainRegion: string | null;
  serviceRegions: string[];
  price: number | null;
  durationMin: number | null;
  mode: LessonMode | null;
  openSlotCount: number | null;
  nextSlots: { startDt: string; endDt: string }[];
  publicLessonCount: number | null;
  link: string | null;
};

export type AssistantMessage = {
  messageId: number;
  role: "USER" | "ASSISTANT";
  content: string;
  followUpQuestion: string | null;
  recommendations: AssistantCard[];
  pending: boolean;
  createDt: string;
};

export type AssistantConversation = {
  conversationId: number;
  title: string;
  status: "PROCESSING" | "ACTIVE" | "CLOSED";
  styleContext: { recommended: string[]; region: string | null; keywords: string[] } | null;
  userMessageCount: number;
  maxUserMessages: number;
  remainingQuestions: number;
  inFlight: boolean;
  createDt: string;
  updateDt: string;
  messages: AssistantMessage[];
};

export type AssistantConversationSummary = Pick<
  AssistantConversation,
  "conversationId" | "title" | "status" | "userMessageCount" | "maxUserMessages" | "createDt" | "updateDt"
>;

export const ASSISTANT_MESSAGE_MAX = 500;

// 서버 에러 코드 (data.code)
export const ASSISTANT_ERRORS = {
  WEEKLY_LIMIT: "AI_WEEKLY_LIMIT",
  MESSAGE_LIMIT: "AI_MESSAGE_LIMIT",
  BUDGET_EXHAUSTED: "AI_BUDGET_EXHAUSTED",
  UNAVAILABLE: "AI_UNAVAILABLE",
  AI_ERROR: "AI_ERROR",
  IN_PROGRESS: "AI_REQUEST_IN_PROGRESS",
} as const;
