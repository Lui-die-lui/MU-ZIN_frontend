// 내 음악 스타일 찾기 - 브라우저 저장 (새로고침해도 유지)
// 비민감 정보만: 질문 버전, 답변(선택지 id), 고른 지역 이름, 지금 보는 후보, 비슷한 두 후보 선택, 원하는 수업 방식
// 계정별로 다른 키 -> 같은 브라우저에서 다른 계정 결과와 섞이지 않음 (비로그인은 guest)
import { QUIZ_VERSION } from "./config";
import type { Answers } from "./types";

export type StoredRegion = {
  region1DepthName: string;
  region2DepthName: string | null;
  region3DepthName: string | null;
};

export type LessonModeChoice = "any" | "inperson" | "online";

export type HobbyFinderSaved = {
  version: string;
  answers: Answers;
  region: StoredRegion | null;
  // 레슨을 볼 대상: 추천 후보 id ("piano") 또는 둘러보기에서 고른 악기 ("inst:19")
  viewId: string | null;
  // 비슷한 두 후보 선택 (한 번만 물음). pair = "piano|cello", choice = 고른 후보 id 또는 "both"
  pairChoice: { pair: string; choice: string } | null;
  lessonMode: LessonModeChoice;
  // 예전 버전 답변을 버리고 새로 시작했는지 (질문 화면에 한 번 안내)
  resetFromOldVersion?: boolean;
};

const keyOf = (userId: number | null) => `muzin.hobbyFinder:${userId ?? "guest"}`;

export const emptySaved = (): HobbyFinderSaved => ({
  version: QUIZ_VERSION,
  answers: {},
  region: null,
  viewId: null,
  pairChoice: null,
  lessonMode: "any",
});

const validRegion = (r: unknown): StoredRegion | null =>
  r && typeof r === "object" && typeof (r as StoredRegion).region1DepthName === "string" && (r as StoredRegion).region1DepthName
    ? {
        region1DepthName: (r as StoredRegion).region1DepthName,
        region2DepthName: (r as StoredRegion).region2DepthName ?? null,
        region3DepthName: (r as StoredRegion).region3DepthName ?? null,
      }
    : null;

export function loadSaved(userId: number | null): HobbyFinderSaved {
  try {
    const raw = localStorage.getItem(keyOf(userId));
    if (!raw) return emptySaved();
    const parsed = JSON.parse(raw) as Partial<HobbyFinderSaved>;
    // 질문이 바뀐 예전 버전: 답변은 옮길 수 없어 버리고, 고른 지역만 이어 씀
    if (parsed.version !== QUIZ_VERSION) {
      const hadAnswers = !!parsed.answers && Object.keys(parsed.answers).length > 0;
      return { ...emptySaved(), region: validRegion(parsed.region), resetFromOldVersion: hadAnswers };
    }
    return {
      version: QUIZ_VERSION,
      answers: parsed.answers && typeof parsed.answers === "object" ? (parsed.answers as Answers) : {},
      region: validRegion(parsed.region),
      viewId: typeof parsed.viewId === "string" ? parsed.viewId : null,
      pairChoice:
        parsed.pairChoice && typeof parsed.pairChoice.pair === "string" && typeof parsed.pairChoice.choice === "string" ? parsed.pairChoice : null,
      lessonMode: parsed.lessonMode === "inperson" || parsed.lessonMode === "online" ? parsed.lessonMode : "any",
    };
  } catch {
    return emptySaved();
  }
}

export function saveSaved(userId: number | null, data: HobbyFinderSaved) {
  try {
    const { resetFromOldVersion: _ignored, ...rest } = data; // 안내 표시는 저장하지 않음
    void _ignored;
    localStorage.setItem(keyOf(userId), JSON.stringify(rest));
  } catch {
    // 저장 공간을 못 쓰는 환경(시크릿 모드 등)이면 저장 없이 계속
  }
}

export function clearSaved(userId: number | null) {
  try {
    localStorage.removeItem(keyOf(userId));
  } catch {
    // 무시
  }
}
