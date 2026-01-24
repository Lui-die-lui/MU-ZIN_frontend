import { useMemo } from "react";
import SelectedChips from "../../../../../../../components/common/SelectedChips/SelectedChips";

type Props = {
  startDts: string[];
  onRemove: (dt: string) => void;
  onClear: () => void;
};

export default function TimeSlotSelectedList({
  startDts,
  onRemove,
  onClear,
}: Props) {
  const grouped = useMemo(() => groupByMonthDay(startDts), [startDts]);

  return (
    <section style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <h3 style={{ margin: 0 }}>선택된 타임슬롯</h3>

        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          <span style={{ opacity: 0.8 }}>
            선택: <b>{startDts.length}</b>개
          </span>
          <button type="button" onClick={onClear} disabled={startDts.length === 0}>
            전체 삭제
          </button>
        </div>
      </div>

      <div
        style={{
          padding: 12,
          border: "1px solid #333",
          borderRadius: 12,
        }}
      >
        {startDts.length === 0 ? (
          <p style={{ margin: 0, opacity: 0.7 }}>아직 추가된 타임슬롯이 없습니다.</p>
        ) : (
          <div style={{ display: "grid", gap: 12 }}>
            {Object.entries(grouped).map(([ym, days]) => (
              <div
                key={ym}
                style={{
                  padding: 12,
                  border: "1px solid #eee",
                  borderRadius: 16,
                }}
              >
                <div style={{ fontWeight: 700, marginBottom: 10 }}>
                  {ym.slice(0, 4)}년 {ym.slice(5, 7)}월
                </div>

                <div style={{ display: "grid", gap: 10 }}>
                  {Object.entries(days).map(([day, dts]) => (
                    <div
                      key={`${ym}-${day}`}
                      style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
                    >
                      <div style={{ width: 42, opacity: 0.75 }}>{Number(day)}일</div>

                      <SelectedChips
                        items={dts}
                        getKey={(dt) => dt}
                        getLabel={(dt) => dt.slice(11, 16)}
                        onRemove={(dt) => onRemove(dt)}
                        title="클릭 시 삭제"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function groupByMonthDay(startDts: string[]) {
  const out: Record<string, Record<string, string[]>> = {};

  for (const dt of startDts) {
    const ymd = dt.slice(0, 10);
    const ym = ymd.slice(0, 7);
    const day = ymd.slice(8, 10);

    out[ym] ??= {};
    out[ym][day] ??= [];
    out[ym][day].push(dt);
  }

  const sorted: Record<string, Record<string, string[]>> = {};
  Object.keys(out)
    .sort()
    .forEach((ym) => {
      sorted[ym] = {};
      Object.keys(out[ym])
        .sort()
        .forEach((day) => {
          sorted[ym][day] = out[ym][day].slice().sort();
        });
    });

  return sorted;
}