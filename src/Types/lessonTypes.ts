import type { ApiRespDto } from "./responseType";

// 레슨 오프라인, 온라인
export type LessonMode = "ONLINE" | "OFFLINE" | "VISIT" | "REQUEST_ONLY";

// 레슨 활성 상태
export type LessonStatus = "ACTIVE" | "INACTIVE";

// 레슨 타임 슬롯 예약 가능/예약중/불가 상태
// PENDING = 예약 요청이 들어와 아티스트 응답을 기다리는 시간
export type TimeSlotStatus = "OPEN" | "PENDING" | "BOOKED" | "CLOSED";

// 드로어 내 컴포넌트(페이지) 전환
export type Mode = "pick" | "request" | "success";

// 레슨 타임 슬롯 만료 시 노출 유무
export type LessonClosingPolicy =
  | "KEEP_OPEN_FOR_REQUEST"
  | "AUTO_CLOSE_WHEN_NO_SLOTS";

export const LESSON_CLOSING_POLICY_LABEL: Record<LessonClosingPolicy, string> =
  {
    KEEP_OPEN_FOR_REQUEST: "타임슬롯이 없어도 요청 계속 받기",
    AUTO_CLOSE_WHEN_NO_SLOTS: "타임슬롯이 없으면 자동으로 레슨 닫기",
  };
// 기본값
export const DEFAULT_LESSON_CLOSING_POLICY: LessonClosingPolicy =
  "KEEP_OPEN_FOR_REQUEST";

// 스타일 태그 응답
export interface LessonStyleTagResponse {
  lessonStyleTagId: number;
  styleName: string;
}

// 스타일 태그 default 값 상수
export const EMPTY_STYLE_TAGS: LessonStyleTagResponse[] = [];

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

export interface LessonSearchItem extends LessonSummary {
  instId: number;
  instName: string;
  instCategory: string;
  mainRegionSummary: {
    region1DepthName: string | null;
    region2DepthName: string | null;
    region3DepthName: string | null;
    addressLabel: string | null;
  } | null;
}

export const LESSON_MODE_LABEL: Record<LessonMode, string> = {
  ONLINE: "온라인",
  OFFLINE: "대면",
  VISIT: "방문",
  REQUEST_ONLY: "일정 협의",
};

export type LessonSearchResp = ApiRespDto<LessonSearchItem[]>;

// 레슨 단일 조회
// 상세 페이지
export interface LessonDetail extends LessonBase {
  description: string | null;
  requirementText: string | null;
  // styleTags: LessonStyleTagResponse[];
  createDt: string;
  updateDt: string;
  artist: ArtistSummaryResponse;
  // "시간이 없으면 자동 비공개" 레슨인데 예약 가능한 시간이 없어 검색에서 빠진 상태
  autoClosed?: boolean;
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
  instId: number;
  closingPolicy: LessonClosingPolicy;
}

// 레슨 생성 응답 타입 자체를 분리하는게 타입 깨질 걱정 없다고 함 - 백이랑 맞춤
export interface LessonCreateResp {
  lessonId: number;
  title: string;
  mode: LessonMode;
  status: LessonStatus;
  closingPolicy: LessonClosingPolicy;
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
  instId?: number;
  closingPolicy?: LessonClosingPolicy | null;
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
  instId: number;
  mode: LessonMode;
  durationMin: string;
  price: string;
  description: string;
  requirementText: string;
  closingPolicy: LessonClosingPolicy;
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
  closingPolicy: LessonClosingPolicy;

  description: string | null;
  requirementText: string | null;

  createDt: string;
  updateDt: string;

  instId: number;
  instName: string;
  // 진행 중인 예약(요청 대기/확정/완료 대기) 수 - 0 보다 크면 핵심 정보 수정·레슨 삭제 불가
  activeReservationCount: number;
  deleted: boolean;
  // 수락/거절을 기다리는 예약 요청 수
  pendingRequestCount: number;
  // 앞으로 예약 가능한(OPEN) 시간 수
  upcomingOpenSlotCount: number;
}

export type MyLessonDetailResp = ApiRespDto<MyLessonDetail>;
