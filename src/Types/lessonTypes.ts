import type { ApiRespDto } from "./responseType";

// 레슨 오프라인, 온라인
export type LessonMode = "ONLINE" | "OFFLINE" | "VISIT" | "REQUEST_ONLY";

// 레슨 활성 상태
export type LessonStatus = "ACTIVE" | "INACTIVE";

// 레슨 타임 슬롯 예약 가능/예약중/불가 상태
export type TimeSlotStatus = "OPEN" | "BOOKED" | "CLOSED";

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
  instrumentId: number;
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
  instrumentId?: number;
}

// 레슨 스타일 토글
export interface SetLessonStylesReq {
  styleTagIds: number[];
}

// 타임슬롯 생성 타입
export type TimeSlotCreateReq = {
  startDts: string[];
};

// 타임슬롯 응답
export type TimeSlotResp = {
  timeSlotId: number;
  startDt: string;
  endDt: string;
  status: TimeSlotStatus;
};

// 타임슬롯 요일 별 반복 생성
export type LessonRecurrenceUpsertReq = {
  enabled?: boolean; // 안보내주면 true로 처리 중
  timezone?: string; // default Asia/Seoul
  daysOfWeekMask?: number; // default 127
  startTime: string; // "HH:mm"
  endTime: string;
  intervalMin: number; // 수업 간격(= 수업 + 쉬는시간 포함)
  weeksAhead?: number; // default 6
};

export type LessonRecurrenceResp = {
  ruleId: number;
  lessonId: number;
  enabled: boolean;
  timezone: string;
  daysOfWeekMask: number;
  startTime: string;
  endTime: string;
  intervalMin: number;
  weeksAhead: number;
  materializedUntil: string | null;
};

// 레슨 생성 및 수정 입력 form types
export type LessonFormValues = {
  title: string;
  instrumentId: number;
  mode: LessonMode;
  durationMin: string;
  price: string;
  description: string;
  requirementText: string;
};

// edit(=update)시 원래 내 Detail값 set 해줄 수 있도록 (관리용)
// 공개에서 쓰는 것과 관리에서 쓰는 것을 같은 타입으로 강제하지 말것.
export interface MyLessonDetail {
  lessonId: number;
  title: string;
  price: number | null;
  durationMin: number;
  mode: LessonMode;
  status: LessonStatus;

  description: string | null;
  requirementText: string | null;

  createDt: string;
  updateDt: string;

  instrumentId: number;
}

export type MyLessonDetailResp = ApiRespDto<MyLessonDetail>;
