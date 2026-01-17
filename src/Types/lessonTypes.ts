import type { ApiRespDto } from "./responseType";

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

// 아티스트 프로필 요약
export interface ArtistSummaryResponse {
  artistProfileId: number;
  username: string;
  profileImgUrl: string | null; // 프로필 이미지 없을 수도 있으니까
}

// 리스트/검색 공용 - 정렬 표시용으로 있으면 good
export interface LessonSummary extends LessonBase {
  description: string | null;
}

export type LessonSearchResp = ApiRespDto<LessonSummary[]>;

// 레슨 단일 조회
// 상세 페이지
export interface LessonDetail extends LessonBase {
  description: string | null;
  requirementText: string | null;
  // styleTags: LessonStyleTagResponse[];
  createDt: string;
  updateDt: string;
  artist: ArtistSummaryResponse;
}

export type LessonDetailResp = ApiRespDto<LessonDetail>;

// 레슨 생성
export interface LessonCreateReq {
  title: string;
  mode: LessonMode;
  durationMin: number;
  price?: number | null;
  description?: string | null;
  requirementText?: string | null;
}

// 레슨 생성 응답 타입 자체를 분리하는게 타입 깨질 걱정 없다고 함 - 백이랑 맞춤
export interface LessonCreateResp {
  lessonId: number;
  title: string;
  mode: LessonMode;
  status: LessonStatus;
}

// 레슨 수정
export interface LessonUpdateReq {
  title?: string | null;
  mode?: LessonMode | null;
  durationMin?: number | null;
  price?: number | null;
  description?: string | null;
  requirementText?: string | null;
  status?: LessonStatus | null;
}

// 레슨 스타일 토글
export interface SetLessonStylesReq {
  styleTagIds: number[];
}

// 타임슬롯 생성 타입
export type TimeSlotCreateReq = {
  startDts: string[];
}

