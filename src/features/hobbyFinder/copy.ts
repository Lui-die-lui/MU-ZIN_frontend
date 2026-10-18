// 내 음악 스타일 찾기 - 결과 문구 (어떤 조건에서 어떤 문장을 쓰는지 engine 이 고름)
// 원칙: "~를 골랐다고 했어요" 반복 X, 성격·재능 단정 X, 기간·개인 속도 단정 X
import type { Genre, Role, Timbre, TypeKey } from "./types";

// 유형 (혼자/함께 x 좋아하는 곡부터/차근차근). 두 문항이 같은 쪽일 때만 그쪽으로 판정
export const TYPE_COPY: Record<TypeKey, { name: string; oneLiner: string; sentence: string; keywords: string[] }> = {
  "solo|deep": {
    name: "한 곡을 끝까지 다듬는 타입",
    oneLiner: "한 곡을 정해 조금씩 다듬어 가는 과정에서 재미를 찾는 쪽이에요.",
    sentence: "누구와 일정을 맞추지 않아도 되는 연습 시간, 그리고 어렵던 구간이 조금씩 매끄러워지는 순간에 의미를 두는 편이에요.",
    keywords: ["혼자 연습", "차근차근"],
  },
  "solo|quick": {
    name: "좋아하는 곡부터 혼자 시작하는 타입",
    oneLiner: "좋아하는 곡을 골라 혼자 바로 소리 내 보는 데서 시작하고 싶은 쪽이에요.",
    sentence: "기초를 길게 쌓기 전에, 아는 노래의 한 구간이라도 직접 소리 내 보는 경험이 동기가 될 수 있어요.",
    keywords: ["혼자 연습", "좋아하는 곡부터"],
  },
  "solo|mixed": {
    name: "내 페이스로 혼자 즐기는 타입",
    oneLiner: "다른 사람과 일정을 맞추기보다 내 시간에 맞춰 음악을 즐기고 싶은 쪽이에요.",
    sentence: "좋아하는 곡부터 시작할지 기초부터 차근차근 쌓을지는 한쪽으로 정해지지 않았어요. 혼자 연습할 수 있다면 둘 다 열려 있어요.",
    keywords: ["혼자 연습"],
  },
  "together|quick": {
    name: "일단 함께 맞춰 보는 타입",
    oneLiner: "혼자 완벽해지기 전에, 다른 사람과 소리를 맞춰 보는 데서 재미를 찾는 쪽이에요.",
    sentence: "처음부터 혼자 오래 다듬기보다, 몇 가지를 익혀 다른 소리와 맞춰 보는 경험이 동기가 될 수 있어요.",
    keywords: ["함께 맞추기", "좋아하는 곡부터"],
  },
  "together|deep": {
    name: "여럿이 오래 맞춰 완성하는 타입",
    oneLiner: "각자 다듬어 온 소리를 한 곡으로 모아 가는 과정을 좋아하는 쪽이에요.",
    sentence: "빠르게 한 곡을 해내기보다, 시간을 들여 맞춘 곡이 마지막에 맞아떨어지는 순간에 의미를 두는 편이에요.",
    keywords: ["함께 맞추기", "차근차근"],
  },
  "together|mixed": {
    name: "함께 소리 내는 시간이 좋은 타입",
    oneLiner: "음악을 다른 사람과 함께하는 시간 자체를 좋아하는 쪽이에요.",
    sentence: "좋아하는 곡부터 맞춰 볼지 오래 다듬을지는 한쪽으로 정해지지 않았어요. 함께할 수 있다면 둘 다 열려 있어요.",
    keywords: ["함께 맞추기"],
  },
  "mixed|deep": {
    name: "차근차근 쌓아 가는 타입",
    oneLiner: "조금씩 나아지는 과정을 확인하며 배우고 싶은 쪽이에요.",
    sentence: "혼자 할지 함께 할지보다, 전보다 나아진 부분을 확인하는 데 의미를 두는 편이에요.",
    keywords: ["차근차근"],
  },
  "mixed|quick": {
    name: "좋아하는 곡부터 시작하는 타입",
    oneLiner: "기초를 오래 쌓기 전에 좋아하는 곡부터 소리 내 보고 싶은 쪽이에요.",
    sentence: "혼자 할지 함께 할지보다, 아는 곡을 직접 소리 내 보는 경험이 동기가 될 수 있어요.",
    keywords: ["좋아하는 곡부터"],
  },
  "mixed|mixed": {
    name: "여러 방식에 열려 있는 타입",
    oneLiner: "혼자 할지 함께 할지, 좋아하는 곡부터 할지 기초부터 할지 아직 한쪽으로 정해지지 않은 쪽이에요.",
    sentence: "답변이 여러 방향으로 나뉘어서 배우는 방식은 단정하지 않았어요. 아래 후보를 보며 끌리는 쪽을 골라 보세요.",
    keywords: [],
  },
};

// 혼자/함께 x 나를 위해/들려주기
export const OUTLET_SENTENCE = {
  "solo|in": "누구에게 보여주기보다 내 방에서 만족스러운 소리를 내는 것 자체가 목표에 가까워 보여요.",
  "solo|out": "혼자 연습하는 시간이 편하지만, 완성한 곡은 누군가에게 들려주고 싶은 마음도 보여요.",
  "together|in": "사람들 앞에 서는 것보다 연습실에서 함께 맞춰 가는 과정 자체가 목표에 가까워 보여요.",
  "together|out": "같이 준비한 곡을 사람들 앞에서 들려주는 장면까지 그리고 있어요.",
  "mixed|in": "다른 사람에게 들려주기보다 내가 즐기는 데 무게가 있어 보여요.",
  "mixed|out": "완성한 곡을 누군가에게 들려주고 싶은 마음이 보여요.",
} as const;

export const ROLE_NAME: Record<Role, string> = {
  melody: "멜로디",
  rhythm: "박자",
  voice: "노랫소리·가사",
  harmony: "반주·화음",
};

export const ROLE_EXPERIENCE: Record<Role, string> = {
  melody: "노래의 주선율을 직접 소리 내 보는 경험",
  rhythm: "곡의 박자를 직접 만들거나 받치는 경험",
  voice: "목소리로 곡을 전하는 경험",
  harmony: "멜로디 아래를 반주와 화음으로 채우는 경험",
};

export const ROLE_KEYWORD: Record<Role, string> = {
  melody: "멜로디",
  rhythm: "박자",
  voice: "노래",
  harmony: "반주·화음",
};

// "이런 답과 연결돼요"
export const ROLE_ANSWER: Record<Role, string> = {
  melody: "멜로디에 먼저 귀가 간다는 답",
  rhythm: "박자에 먼저 반응한다는 답",
  voice: "노랫소리와 가사에 끌린다는 답",
  harmony: "반주와 화음이 귀에 남는다는 답",
};

export const TIMBRE_NAME: Record<Timbre, string> = {
  low: "낮고 묵직하게 깔리는 소리",
  bright: "맑고 또렷하게 떠오르는 소리",
  power: "힘 있게 터지는 소리",
  warm: "부드럽고 따뜻하게 감싸는 소리",
};

export const TIMBRE_KEYWORD: Record<Timbre, string> = {
  low: "낮은 소리",
  bright: "맑은 소리",
  power: "힘 있는 소리",
  warm: "따뜻한 소리",
};

export const GENRE_NAME: Record<Genre, string> = {
  pop: "팝·발라드·K-POP",
  band: "록·밴드",
  jazz: "재즈·어쿠스틱",
  classic: "클래식·영화음악",
  korean: "국악·퓨전 국악",
};

export const VOICE_ANSWER: Record<"pop" | "classical", string> = {
  pop: "좋아하는 대중가요를 불러 보고 싶다는 답",
  classical: "가곡·아리아를 불러 보고 싶다는 답",
};

// 노랫소리에 끌리지만 악기를 해 보고 싶다고 한 경우 (목소리 역할 -> 노래하듯 이어지는 선율로 봄)
export const VOICE_AS_MELODY_ANSWER = "노랫소리에 끌리지만 악기로 해 보고 싶다는 답";
export const VOICE_AS_MELODY_SENTENCE =
  "노랫소리에 먼저 귀가 가지만 직접 해 보고 싶은 건 악기라면, 노래하듯 선율을 이어 가는 악기에서 그 느낌을 살려 볼 수 있어요.";

export const CREATE_ANSWER = "배운 걸 내 마음대로 바꿔 보고 싶다는 답";
export const CREATE_SENTENCE = "배운 걸 바꿔 보는 데 재미를 느낀다면, 화음을 함께 배워 두면 익힌 곡을 바꿔 보는 데 도움이 돼요.";
export const NO_LINK_ANSWER = "답변과 직접 겹치는 부분은 적지만, 가까운 방향의 후보예요";

// 시작해 본다면 (필요한 기초를 익힌 뒤 시도할 제안). {basics} {verb} 를 채움
export const START_TEMPLATE: Record<TypeKey, string> = {
  "solo|quick": "{basics} 좋아하는 곡에서 짧은 구간 하나를 골라 {verb} 보세요.",
  "mixed|quick": "{basics} 좋아하는 곡에서 짧은 구간 하나를 골라 {verb} 보세요.",
  "together|quick": "{basics} 반주 음원에 맞춰 짧은 곡 하나를 끝까지 {verb} 보세요.",
  "solo|deep": "{basics} 한 곡을 정해 구간을 나눠 조금씩 다듬어 보세요.",
  "mixed|deep": "{basics} 한 곡을 정해 구간을 나눠 조금씩 다듬어 보세요.",
  "together|deep": "{basics} 함께 연주하거나 노래할 곡에서 맡을 파트 하나를 정해 꾸준히 다듬어 보세요.",
  "together|mixed": "{basics} 다른 사람이나 반주 음원과 맞춰 볼 수 있는 쉬운 곡을 골라 보세요.",
  "solo|mixed": "{basics} 좋아하는 곡 한 곡을 정해 짧은 구간부터 {verb} 보세요.",
  "mixed|mixed": "{basics} 좋아하는 곡 한 곡을 정해 짧은 구간부터 {verb} 보세요.",
};
export const START_SHARE = "익숙해지면 녹음해서 누군가에게 들려줘 보세요.";

export const PRACTICE_STUDIO = "연습실이나 레슨실에서 연습한다면 소리 걱정은 덜 수 있어요.";

// 서비스에 분류가 없는 경우 (취향 분석과 별개 안내)
export const NOTICE_KOREAN_VOICE =
  "민요·판소리 같은 국악 노래는 아직 서비스의 레슨 분류에 없어요. 노래 레슨은 보컬이나 성악으로 찾아볼 수 있어요.";

// 받침 여부에 따라 조사 고르기 (예: josa("피아노", "은", "는") -> "피아노는")
export function josa(word: string, withFinal: string, withoutFinal: string) {
  const ch = word.charCodeAt(word.length - 1);
  if (ch < 0xac00 || ch > 0xd7a3) return word + withoutFinal;
  return word + ((ch - 0xac00) % 28 ? withFinal : withoutFinal);
}
