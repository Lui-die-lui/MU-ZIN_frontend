// 내 음악 스타일 찾기 - 조정 가능한 설정값
// 규칙·가중치를 바꾸면 QUIZ_VERSION 을 올림 -> 예전 버전 답변은 버리고 다시 시작 (고른 지역만 이어 씀)
export const QUIZ_VERSION = "style-v2-2026-10";

// 악기 적합도 = 쓰인 항목의 (가중치 x 유사도) 합 / 쓰인 가중치 합 -> 항상 0~1
// - genre: "아직 모르겠어요"면 항목 자체를 뺌 (모든 후보에 똑같이)
// - create: Q4 에서 "배운 걸 바꿔 보기"를 골랐을 때만
// - activity: 노래 후속 질문에 답했을 때만
// 혼자/함께·빠른/차근차근은 악기 적합도에 넣지 않음 (해석·시작 목표·레슨 정렬에만)
export const FIT_WEIGHTS = {
  role: 0.55,
  timbre: 0.3,
  genre: 0.15,
  create: 0.1,
  activity: 0.25,
} as const;

// 정규화된 적합도 차이가 이 값 이내면 "비슷한 후보" (편집 기준, 검증된 신뢰도 기준이 아님)
export const CLOSE_GAP = 0.05;

// 화면에 보여줄 추천 최대 개수 (대표 1 + 함께 살펴볼 후보 최대 2)
export const MAX_SHOWN = 3;

// 동점 판단용 반올림 자리
export const FIT_DECIMALS = 4;

// 학습 방식 -> 레슨 스타일 태그 (lesson_styles_tag.style_name). 의미가 직접 맞는 것만
// "좋아하는 곡부터"·"함께"에 직접 맞는 태그는 아직 없어 정렬에 쓰지 않음
export const DEEP_LESSON_TAGS = ["기초부터 탄탄히", "커리큘럼 제공", "체계적인"];
