/** @jsxImportSource @emotion/react */
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import * as s from "./styles";

export type ColumnPoint = { key: string; label: string; value: number };

type Props = {
  title: string; // 화면 읽기 프로그램용 (보이는 제목은 바깥에서)
  unit: string; // "명" 등
  data: ColumnPoint[];
  height?: number;
};

const PAD = { top: 22, right: 8, bottom: 26, left: 34 };

// 0 부터 깔끔한 눈금 최대값 (1, 2, 5 × 10^n)
const niceMax = (v: number) => {
  if (v <= 4) return 4;
  const pow = 10 ** Math.floor(Math.log10(v));
  const step = [1, 2, 2.5, 5, 10].find((m) => m * pow >= v / 4)! * pow;
  return Math.ceil(v / step) * step;
};

const compact = (n: number) => (n >= 1000 ? `${Math.round(n / 100) / 10}K` : String(n));

// 날짜별 세로 막대 (한 가지 값). 막대마다 마우스·키보드(←→)로 값 확인, 표로 보기 제공
function ColumnChart({ title, unit, data, height = 180 }: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(600);
  const [active, setActive] = useState<number | null>(null);
  const tableId = useId();

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setWidth(Math.max(240, Math.floor(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const n = data.length;
  const max = niceMax(Math.max(0, ...data.map((d) => d.value)));
  const innerW = width - PAD.left - PAD.right;
  const innerH = height - PAD.top - PAD.bottom;
  const band = n ? innerW / n : innerW;
  const barW = Math.max(2, Math.min(24, band - 2)); // 이웃 막대와 2px 이상 띄움
  const y = (v: number) => PAD.top + innerH - (v / max) * innerH;
  const ticks = [0, max / 2, max];

  // 가장 큰 값 하나만 막대 위에 숫자 표시 (나머지는 마우스·표로)
  const peak = data.reduce((best, d, i) => (d.value > (data[best]?.value ?? -1) ? i : best), 0);
  // x축 날짜: 처음 · 가운데 · 끝
  const xLabels = n ? [...new Set([0, Math.floor((n - 1) / 2), n - 1])] : [];

  const onKey = (e: KeyboardEvent) => {
    if (!n) return;
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const cur = active ?? (e.key === "ArrowRight" ? -1 : n);
      setActive(Math.min(n - 1, Math.max(0, cur + (e.key === "ArrowRight" ? 1 : -1))));
    } else if (e.key === "Escape") {
      setActive(null);
    }
  };

  const tip = active != null ? data[active] : null;
  const tipX = active != null ? PAD.left + band * active + band / 2 : 0;

  return (
    <div css={s.chartWrap}>
      <div ref={wrapRef} css={s.chartBox}>
        <svg
          width={width}
          height={height}
          role="img"
          aria-label={`${title}. 막대를 선택하고 좌우 화살표로 날짜별 값을 확인할 수 있어요.`}
          aria-describedby={tableId}
          tabIndex={0}
          css={s.chartSvg}
          onKeyDown={onKey}
          onBlur={() => setActive(null)}
          onPointerLeave={() => setActive(null)}
        >
          {ticks.map((t) => (
            <g key={t}>
              <line x1={PAD.left} x2={width - PAD.right} y1={y(t)} y2={y(t)} css={s.gridLine} />
              <text x={PAD.left - 6} y={y(t)} css={s.axisText} textAnchor="end" dominantBaseline="middle">
                {compact(t)}
              </text>
            </g>
          ))}

          {data.map((d, i) => {
            const x = PAD.left + band * i + (band - barW) / 2;
            const top = y(d.value);
            const h = PAD.top + innerH - top;
            const r = Math.min(4, barW / 2, h);
            return (
              <g key={d.key}>
                {d.value > 0 && (
                  <path
                    css={s.bar(active === i)}
                    // 위쪽만 둥글게, 바닥은 각지게
                    d={`M${x},${top + h} V${top + r} Q${x},${top} ${x + r},${top} H${x + barW - r} Q${x + barW},${top} ${x + barW},${top + r} V${top + h} Z`}
                  />
                )}
                {/* 막대보다 넓은 투명 영역이 마우스 대상 */}
                <rect
                  x={PAD.left + band * i}
                  y={PAD.top}
                  width={band}
                  height={innerH}
                  fill="transparent"
                  onPointerMove={() => setActive(i)}
                />
              </g>
            );
          })}

          {n > 0 && data[peak].value > 0 && active == null && (
            <text x={PAD.left + band * peak + band / 2} y={y(data[peak].value) - 6} css={s.peakText} textAnchor="middle">
              {data[peak].value.toLocaleString("ko-KR")}
            </text>
          )}

          {active != null && (
            <line x1={tipX} x2={tipX} y1={PAD.top} y2={PAD.top + innerH} css={s.crosshair} />
          )}

          {xLabels.map((i) => (
            <text
              key={i}
              x={PAD.left + band * i + band / 2}
              y={height - 8}
              css={s.axisText}
              textAnchor={i === 0 && n > 1 ? "start" : i === n - 1 && n > 1 ? "end" : "middle"}
            >
              {data[i].label}
            </text>
          ))}
        </svg>

        {tip && (
          <div
            css={s.tooltip}
            role="status"
            style={{ left: Math.min(Math.max(tipX, 60), width - 60), top: Math.max(0, y(tip.value) - 52) }}
          >
            <strong>
              {tip.value.toLocaleString("ko-KR")}
              {unit}
            </strong>
            <span>{tip.label}</span>
          </div>
        )}
      </div>

      <details css={s.tableToggle}>
        <summary>표로 보기</summary>
        <table id={tableId} css={s.dataTable}>
          <caption css={s.srOnly}>{title}</caption>
          <thead>
            <tr>
              <th scope="col">날짜</th>
              <th scope="col">{unit === "명" ? "인원" : "값"}</th>
            </tr>
          </thead>
          <tbody>
            {[...data].reverse().map((d) => (
              <tr key={d.key}>
                <td>{d.label}</td>
                <td>{d.value.toLocaleString("ko-KR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}

export default ColumnChart;
