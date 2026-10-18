// 내 음악 스타일 찾기 - 타입
// 데이터(질문·후보·문구·설정)와 계산(engine)과 화면을 분리

// 끌리는 소리 역할 (Q1·Q2)
export type Role = "melody" | "rhythm" | "voice" | "harmony";
// 좋아하는 소리 (Q6)
export type Timbre = "low" | "bright" | "power" | "warm";
// 직접 해 본다면 가까운 음악 (Q7) - 후보를 거르지 않고 우선순위·시작 설명에만 사용 (korean 은 국악기 후보를 엶)
export type Genre = "pop" | "band" | "jazz" | "classic" | "korean";
// 노래 후속 질문 (목소리를 고른 경우만)
export type VoiceActivity = "pop" | "classical" | "both" | "none"; // none = 노래보다 악기에 관심
// 연습 공간 (Q8, 추천 순위에 쓰지 않음)
export type PracticeSpace = "free" | "day" | "quiet" | "studio";

export type QuestionKind = "taste" | "followup" | "reality";

// 선택지 효과 (취향 문항은 답마다 같은 크기만큼만 움직임)
export type OptionEffect = {
  role?: Role;
  social?: number; // 혼자 -, 함께 +
  outlet?: number; // 나를 위해 -, 들려주기 +
  pace?: number; // 좋아하는 곡부터(빠른 재미) -, 차근차근(쌓는 성취) +
  create?: boolean; // 배운 걸 바꿔 보기
  timbre?: Timbre;
  genre?: Genre;
  voice?: VoiceActivity;
  practice?: PracticeSpace;
};

export type QuizOption = {
  id: string;
  label: string;
  effect: OptionEffect;
};

export type Answers = Record<string, string>; // questionId -> optionId

export type QuizQuestion = {
  id: string;
  kind: QuestionKind;
  title: string;
  hint?: string;
  options: QuizOption[];
  showIf?: (answers: Answers) => boolean; // 없으면 항상
};

// 추천 후보 (악기·보컬 이름 하나씩, 서비스 악기 이름과 연결)
export type CandidateGroup = "base" | "korean" | "seongak";

export type Candidate = {
  id: string;
  name: string; // 화면에 보이는 이름
  instrumentNames: string[]; // instruments.inst_name 과 정확히 같은 이름 (레슨 검색용)
  group: CandidateGroup; // base: 항상 / korean: 국악을 고르면 / seongak: 가곡·아리아에 관심을 보이면
  role: Partial<Record<Role, number>>; // 1 = 주로 맡는 역할, 0.3~0.5 = 함께 맡기도 하는 역할
  timbre: Partial<Record<Timbre, number>>; // 0~1, 0.7 이상이면 대표 음색
  genre: Partial<Record<Genre, number>>; // 0~1, 그 음악에서 흔히 쓰이는 정도 (후보를 거르지 않음)
  compose?: boolean; // 화음을 함께 다뤄 익힌 곡을 바꿔 보기 좋은 악기
  // 문구
  experience: string; // 이 악기·보컬로 하게 되는 경험 (정의가 아니라 하는 일)
  contrast: string; // 비슷한 후보와 비교할 때 "~쪽" 표현
  basics: string; // 시작 목표 앞에 붙는 "~를 익힌 뒤"
  verb: string; // 쳐 / 켜 / 불어 / 불러 / 연주해
  entry: string; // 처음 배울 때 참고 (일반적인 내용, 기간·개인 속도 단정 없음)
  genreNotes?: Partial<Record<Genre, string>>; // 고른 음악에 맞춘 한 줄
  practice: Partial<Record<PracticeSpace, string>>; // 연습 공간 답별 안내
};

// ---------- 계산 결과 ----------
export type StyleProfile = {
  roles: Role[]; // Q1·Q2 에서 고른 역할 (중복 포함, 길이 2)
  social: number; // -2 / 0 / +2
  outlet: number; // -1 / +1
  pace: number; // -3 ~ +3
  create: boolean;
  timbre: Timbre | null;
  genre: Genre | null; // null = 아직 모르겠어요
  voice: VoiceActivity | null;
  practice: PracticeSpace | null;
};

export type TypeKey =
  | "solo|deep" | "solo|quick" | "solo|mixed"
  | "together|deep" | "together|quick" | "together|mixed"
  | "mixed|deep" | "mixed|quick" | "mixed|mixed";

export type ScoredCandidate = {
  candidate: Candidate;
  order: number; // 후보 목록 순서 (동점 처리)
  fit: number; // 0~1 정규화 점수 - 내부 정렬용, 화면에 표시하지 않음
  roleLinked: boolean; // 고른 역할을 주로 맡는 후보인지
  activityLinked: boolean; // 노래 후속 질문에서 고른 활동과 맞는지
};

export type CandidateView = {
  candidate: Candidate;
  linkedAnswers: string[]; // "이런 답과 연결돼요"
  start: string; // 시작해 본다면
  notes: string[]; // 처음 배울 때 참고 + 연습 공간 안내
};

export type StyleResult = {
  version: string;
  typeKey: TypeKey;
  typeName: string;
  oneLiner: string;
  interpretation: string[];
  keywords: string[];
  // 추천: 대표 1개(또는 비슷한 두 후보) + 함께 살펴볼 후보 (전체 최대 3개)
  lead: CandidateView[]; // 길이 1 = 대표 추천, 길이 2 = 비슷한 두 후보 (동등)
  leadContrast: string | null; // 비슷한 두 후보의 경험 차이
  others: CandidateView[];
  notices: string[]; // 서비스에 분류가 없는 경우 등 (취향 분석과 별개 안내)
  lessonTagNames: string[]; // 레슨 정렬에 쓸 태그 (의미가 직접 맞는 것만)
  ranked: ScoredCandidate[]; // 전체 순서 (검증·향후 연동용)
};
