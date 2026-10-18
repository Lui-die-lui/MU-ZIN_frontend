// 내 음악 스타일 찾기 - 질문 (취향 7 + 노래 후속 1(조건부) + 연습 공간 1)
// - 악기 이름을 선택지에 쓰지 않음, 무대·합주 경험을 전제하지 않음
// - 취향 문항은 답마다 같은 크기만큼만 움직임 (역할 2개 중 1개 / 축 합 2)
import type { Answers, QuizQuestion, Role } from "./types";

const roleOptions = (labels: Record<Role, string>) =>
  (["melody", "rhythm", "voice", "harmony"] as const).map((r) => ({ id: r, label: labels[r], effect: { role: r } }));

export const QUESTIONS: QuizQuestion[] = [
  {
    id: "hum",
    kind: "taste",
    title: "좋아하는 노래가 흘러나올 때, 나도 모르게 하게 되는 건?",
    hint: "여러 개가 맞아도 가장 자주 하는 하나만 골라 주세요.",
    options: roleOptions({
      melody: "멜로디를 따라 흥얼거려요",
      rhythm: "손가락이나 발로 박자를 타요",
      voice: "가사에 감정을 실어 따라 불러요",
      harmony: "뒤에 깔린 반주나 화음이 귀에 남아요",
    }),
  },
  {
    id: "watch",
    kind: "taste",
    title: "좋아하는 곡의 라이브 영상을 본다면, 가장 오래 눈이 가는 사람은?",
    options: roleOptions({
      melody: "곡의 멜로디를 이끄는 사람",
      rhythm: "뒤에서 박자를 단단히 잡는 사람",
      voice: "노래로 곡의 감정을 전하는 사람",
      harmony: "화음과 반주로 소리를 채우는 사람",
    }),
  },
  {
    id: "scene",
    kind: "taste",
    title: "조금 배워서 한 곡을 할 수 있게 됐어요. 가장 해 보고 싶은 건?",
    options: [
      { id: "solo_in", label: "내 방에서 그날 기분대로 마음껏 해 보기", effect: { social: -1, outlet: -1 } },
      { id: "solo_out", label: "혼자 완성한 곡을 녹음해서 친구에게 보내기", effect: { social: -1, outlet: 1 } },
      { id: "together_in", label: "마음 맞는 사람들과 연습실에서 맞춰 보기", effect: { social: 1, outlet: -1 } },
      { id: "together_out", label: "같이 준비한 곡을 작은 모임에서 들려주기", effect: { social: 1, outlet: 1 } },
    ],
  },
  {
    id: "firstMonth",
    kind: "taste",
    title: "새로 배우기 시작했을 때, 가장 신날 것 같은 순간은?",
    options: [
      { id: "quick", label: "아는 노래 한 소절을 처음 소리 내 본 순간", effect: { pace: -2 } },
      { id: "deep", label: "어색하던 소리가 조금씩 고르게 다듬어지는 걸 느낀 순간", effect: { pace: 2 } },
      { id: "create", label: "배운 걸 내 마음대로 바꿔서 해 본 순간", effect: { create: true } },
    ],
  },
  {
    id: "moment",
    kind: "taste",
    title: "음악을 하면서 가장 갖고 싶은 장면은?",
    options: [
      { id: "solo_deep", label: "혼자 붙잡던 어려운 구간을 어느 날 매끄럽게 넘긴 순간", effect: { social: -1, pace: 1 } },
      { id: "solo_quick", label: "처음 듣는 노래를 금방 따라 해 본 순간", effect: { social: -1, pace: -1 } },
      { id: "together_quick", label: "처음 만난 사람들과 맞춘 첫 곡이 그럭저럭 굴러간 순간", effect: { social: 1, pace: -1 } },
      { id: "together_deep", label: "여럿이 오래 맞춘 곡이 마지막에 딱 맞아떨어진 순간", effect: { social: 1, pace: 1 } },
    ],
  },
  {
    id: "sound",
    kind: "taste",
    title: "이어폰으로 듣는다면 가장 오래 듣고 싶은 소리는?",
    options: [
      { id: "low", label: "낮고 묵직하게 깔리는 소리", effect: { timbre: "low" } },
      { id: "bright", label: "맑고 또렷하게 떠오르는 소리", effect: { timbre: "bright" } },
      { id: "power", label: "힘 있게 터지는 소리", effect: { timbre: "power" } },
      { id: "warm", label: "부드럽고 따뜻하게 감싸는 소리", effect: { timbre: "warm" } },
    ],
  },
  {
    id: "music",
    kind: "taste",
    title: "음악을 직접 해 본다면, 어떤 음악에 가장 가까워요?",
    hint: "가능한 장르를 좁히는 질문이 아니에요. 시작할 곡과 활동을 고르는 데 참고해요.",
    options: [
      { id: "pop", label: "팝 · 발라드 · K-POP", effect: { genre: "pop" } },
      { id: "band", label: "록 · 밴드 음악", effect: { genre: "band" } },
      { id: "jazz", label: "재즈 · 어쿠스틱", effect: { genre: "jazz" } },
      { id: "classic", label: "클래식 · 영화음악", effect: { genre: "classic" } },
      { id: "korean", label: "국악 · 퓨전 국악", effect: { genre: "korean" } },
      { id: "unknown", label: "아직 모르겠어요", effect: {} },
    ],
  },
  {
    id: "voice",
    kind: "followup",
    title: "노래를 한다면 어떤 걸 해 보고 싶어요?",
    showIf: (a) => a.hum === "voice" || a.watch === "voice",
    options: [
      { id: "pop", label: "좋아하는 대중가요 부르기", effect: { voice: "pop" } },
      { id: "classical", label: "가곡 · 아리아 부르기", effect: { voice: "classical" } },
      { id: "both", label: "둘 다 알아보기", effect: { voice: "both" } },
      { id: "none", label: "노래보다는 악기에 더 관심 있어요", effect: { voice: "none" } },
    ],
  },
  {
    id: "space",
    kind: "reality",
    title: "집에서 연습한다면 어떤 환경에 가까워요?",
    options: [
      { id: "free", label: "소리를 내도 비교적 괜찮아요", effect: { practice: "free" } },
      { id: "day", label: "낮 시간엔 어느 정도 괜찮아요", effect: { practice: "day" } },
      { id: "quiet", label: "소리를 거의 낼 수 없어요", effect: { practice: "quiet" } },
      { id: "studio", label: "연습실이나 레슨실에서 할 생각이에요", effect: { practice: "studio" } },
    ],
  },
];

// 지금 답변 기준으로 보여줄 질문 (조건부 질문은 조건이 맞을 때만)
export const visibleQuestions = (answers: Answers) => QUESTIONS.filter((q) => !q.showIf || q.showIf(answers));
