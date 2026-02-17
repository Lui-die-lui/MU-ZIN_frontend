import type { SortOrder } from "../Types/commonTypes";
import type {
  DateBasis,
  SearchApplied,
  SearchDraft,
} from "../Types/reservationType";

export const makeReservationSearchApplied = (
  draft: SearchDraft,
): SearchApplied => ({
  ...draft,
  stamp: Date.now(),
});

// 최신순 / 오래된순 정렬
// sort = 비교 함수 필요
type GetDate<T> = (item: T, basis: DateBasis) => string;

export function makeSortComparator<T>(
  basis: DateBasis,
  sort: SortOrder,
  getDate: GetDate<T>,
) {
  // 음수 = 최신순 , 양수 = 오래된순
  const dir = sort === "NEWEST" ? -1 : 1;

  return (a: T, b: T) => {
    const ta = new Date(getDate(a, basis)).getTime();
    const tb = new Date(getDate(b, basis)).getTime();
    return (ta - tb) * dir; // 음수면 앞, 양수면 뒤
  };
}
