// 레슨 오프라인, 온라인
export type LessonMode = "ONLINE" | "OFFLINE" | "VISIT" | "REQUEST_ONLY";

// 레슨 활성 상태
export type LessonStatus = "ACTIVE" | "INACTIVE";



// 스타일 태그 응답
export interface LessonStyleTagResponse {
  lessonStyleTagId: number;
  styleName: string;
}

// 공통 베이스 (요약 / 상세 둘 다 가지고있음)
export interface LessonBase {
  lessonId: number;
  title: string;
  price: number | null;
  durationMin: number;
  mode: LessonMode;
  status: LessonStatus;
}

// 리스트/검색 공용 - 정렬 표시용으로 있으면 good
export interface LessonSummary extends LessonBase {
  updateDt: string;
}

// 상세 페이지
export interface LessonDetail extends LessonBase {
  description: string | null;
  requirementText: string | null;
  styleTags: LessonStyleTagResponse[];
  createDt: string;
  updateDt: string; 
}

// 레슨 생성
export interface LessonCreateReq {
  title: string;
  mode: LessonMode;
  durationMin: number;
  price?: number | null;
  description?: string | null;
  requirementText?: string | null;
}

// 레슨 수정
export interface LessonUpdateReq {
  title?: string | null;
  mode?: LessonMode | null;
  durationMin?: number | null;
  price?: number | null;
  description?: string | null;
  requirementText?: string | null;
}

// 레슨 스타일 토글
export interface SetLessonStylesReq {
  styleTagIds: number[]; 
}
