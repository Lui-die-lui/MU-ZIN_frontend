// URL 쿼리 만들기 (applied 상태를 URL에 싣기)
// 서버에 요청 보낼 때도 그대로 사용 가능
// 빈 값은 아예 파라미터에서 제외해서 URL이 깔끔해짐

import type {
  OpenSlotFilter,
  TimePart,
  Weekday,
} from "../Types/searchForTimeTypes";

// timeParts / daysOfWeek는 "MORNING,EVENING"처럼 콤마로 합침
export function buildSearchTimeQuery(v: OpenSlotFilter) {
  const p = new URLSearchParams();

  if (v.from) p.set("from", v.from);
  if (v.to) p.set("to", v.to);
  if (v.timeParts.length) p.set("timeParts", v.timeParts.join(","));
  if (v.daysOfWeek.length) p.set("daysOfWeek", v.daysOfWeek.join(","));

  return p.toString();
}

// LocalDateTime 문자열 -> Date 파싱 (KST 로컬 문자열 전제)
export function parseLocalDateTime(s: string): Date {
  // 공백이 오는 경우도 방어
  return new Date(s.replace(" ", "T"));
}

// Date -> 요일 변환 (월=1 ... 일=7 규칙)
// 현재 timeSlots 쪽에서도 1부터 시작
export function toWeekday(dt: Date): Weekday {
  const d = dt.getDay();
  return (d === 0 ? 7 : d) as Weekday;
}

// 시간대(TimePart) 매칭 로직
export function matchTimePart(hour: number, part: TimePart) {
  if (part === "MORNING") return hour >= 6 && hour <= 11;
  if (part === "AFTERNOON") return hour >= 12 && hour <= 17;
  if (part === "EVENING") return hour >= 18 && hour <= 23;
  return hour >= 0 && hour <= 5; // DAWN
}

// 슬롯 최소 타입(필터링에 필요한 최소 필드만 강제)
type SlotLike = { startDt: string };
// 슬롯 배열 필터링 (기간 + 요일 + 시간대)
export function filterSlotsByOpen<T extends SlotLike>(
  slots: T[],
  f: OpenSlotFilter,
) {
  const hasTimeParts = f.timeParts.length > 0;
  const hasDays = f.daysOfWeek.length > 0;

  // from, to 문자열을 비교 가능한 Date 객체로 파싱
  const from = f.from ? parseLocalDateTime(f.from) : null;
  const to = f.to ? parseLocalDateTime(f.to) : null;

  return slots.filter((s) => {
    const dt = parseLocalDateTime(s.startDt);

    // 기간 필터 - from/to가 있으면 걸고, 없으면 통과
    if (from && dt < from) return false; // from이 설정되어있고, 슬롯 시간이 from보다 과거면 해당 슬롯 버림
    if (to && dt > to) return false;

    // 요일 필터 - 선택된 요일이 있으면 포함 여부 검사
    if (hasDays) {
      const wd = toWeekday(dt);
      if (!f.daysOfWeek.includes(wd)) return false;
    }

    // 시간대 필터 - 선택된 시간대가 있으면 하나라도 매칭되는지 검사
    if (hasTimeParts) {
      const hour = dt.getHours();
      const ok = f.timeParts.some((p) => matchTimePart(hour, p));
      if (!ok) return false;
    }

    return true;
  });
}

// input type = date 값을 서버용 LocalDateTime 문자열로 변환
export function ymdToStartOfDay(ymd: string) {
  return `${ymd}T00:00:00`;
}

export function ymdToEndOfDay(ymd: string) {
  return `${ymd}T23:59:59`;
}

// YYYY-MM-DD 까지 자름
export function pickYmdFromLocalDateTime(ldt?: string) {
  if (!ldt) return "";
  // "YYYY-MM-DDTHH:mm:ss" 또는 "YYYY-MM-DD HH:mm:ss" 둘 다 방어
  return ldt.split("T")[0].split(" ")[0];
}

// 같은 값 중복 막음 + 배열에 있으면 제거 없으면 추가
export function toggleArr<T>(arr: T[], v: T) {
  return arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
}
