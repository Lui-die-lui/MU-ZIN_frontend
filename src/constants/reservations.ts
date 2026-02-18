import type { Option, SortOrder } from "../Types/commonTypes";
import type {
  DateBasis,
  DateRange,
  SearchDraft,
} from "../Types/reservationType";

// Artist
export const ARTIST_TAB_ITEMS = [
  { key: "requested", label: "요청" },
  { key: "confirmed", label: "확정" },
  { key: "canceled", label: "취소/거절" },
  { key: "today", label: "오늘" },
  { key: "all", label: "전체" },
] as const;

// default user
export const MY_TAB_ITEMS = [
  { key: "requested", label: "요청" },
  { key: "confirmed", label: "확정" },
  { key: "canceled", label: "취소/거절" },
  { key: "today", label: "오늘" },
  { key: "all", label: "전체" },
] as const;

export const DEFAULT_DATE_RANGE: DateRange = {
  from: undefined,
  to: undefined,
};

export const DATE_BASIS_OPTIONS: ReadonlyArray<Option<DateBasis>> = [
  { value: "REQUESTED_DT", label: "요청일" },
  { value: "LESSON_DT", label: "레슨일" },
] as const;

export const SORT_OPTIONS: ReadonlyArray<Option<SortOrder>> = [
  { value: "NEWEST", label: "최신순" },
  { value: "OLDIST", label: "오래된순" },
] as const;

// 페이지에서 바로 쓰는 기본 draft
export const DEFAULT_SEARCH_DRAFT: SearchDraft = {
  basis: "LESSON_DT", // 너가 원하는 기본값으로: 레슨일 기준
  range: DEFAULT_DATE_RANGE,
  sort: "NEWEST",
};
