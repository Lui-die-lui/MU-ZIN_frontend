import type { MonthDayGrouped } from "../Types/searchForTimeTypes";

// dt: "YYYY-MM-DDTHH:mm..." 라는 가정
export function groupByMonthDay<T>(
  items: T[],
  getDt: (item: T) => string,
): MonthDayGrouped<T> {
  const out: MonthDayGrouped<T> = {};

  for (const it of items) {
    const dt = getDt(it);
    const ymd = dt.slice(0, 10);
    const ym = ymd.slice(0, 7);
    const day = ymd.slice(8, 10);

    out[ym] ??= {};
    out[ym][day] ??= [];
    out[ym][day].push(it);
  }

  // 정렬: 월/일/시간
  const sorted: MonthDayGrouped<T> = {};
  Object.keys(out)
    .sort()
    .forEach((ym) => {
      sorted[ym] = {};
      Object.keys(out[ym])
        .sort()
        .forEach((day) => {
          sorted[ym][day] = out[ym][day]
            .slice()
            .sort((a, b) => getDt(a).localeCompare(getDt(b)));
        });
    });

  return sorted;
}

export function toTimeLabel(dt: string) {
  // "2026-02-10T10:00:00.000" / "2026-02-10T10:00" 다 커버
  const t = dt.includes("T") ? dt.split("T")[1] : dt.slice(11);
  return (t ?? "").slice(0, 5);
}