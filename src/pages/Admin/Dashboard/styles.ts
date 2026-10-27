import { css } from "@emotion/react";
import { faint, ink, line, mist, paper, silver, sub } from "../../../constants/uiTone";

export { srOnly } from "../styles";

// 관리자 대시보드 - 메인 톤(차콜 · 오프화이트), 차트는 차콜 한 가지 색
const gridColor = "#E8E7E2";

export const topRow = css`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
`;

export const segment = css`
  display: inline-flex;
  padding: 3px;
  border-radius: 12px;
  background: ${mist};
`;

export const segBtn = (on: boolean) => css`
  height: 32px;
  min-width: 52px;
  padding: 0 12px;
  border: 0;
  border-radius: 10px;
  background: ${on ? "#fff" : "transparent"};
  box-shadow: ${on ? "0 1px 3px rgba(23, 25, 28, 0.12)" : "none"};
  color: ${on ? ink : sub};
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  &:focus-visible {
    outline: 3px solid rgba(23, 25, 28, 0.35);
    outline-offset: 1px;
  }
`;

export const stack = css`
  display: grid;
  gap: 16px;
`;

export const todo = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 14px;
  padding: 12px 16px;
  border-radius: 14px;
  background: ${paper};
  font-size: 14px;

  strong {
    color: ${ink};
  }
  a {
    color: ${ink};
    font-weight: 700;
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;

export const tiles = css`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 760px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
`;

export const tile = css`
  display: grid;
  gap: 4px;
  align-content: start;
  padding: 16px;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(23, 25, 28, 0.06), 0 0 0 1px ${line};
  min-width: 0;
`;

export const tileLabel = css`
  font-size: 13px;
  font-weight: 600;
  color: ${sub};
`;

export const tileValue = css`
  font-size: 28px;
  font-weight: 800;
  line-height: 1.2;
  color: ${ink};
`;

export const delta = css`
  font-size: 12px;
  color: ${sub};
  overflow-wrap: anywhere;
`;

export const deltaSub = css`
  margin-left: 4px;
  color: ${faint};
`;

export const grid2 = css`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 760px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const grid3 = css`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;

  @media (max-width: 860px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const card = css`
  display: grid;
  gap: 10px;
  align-content: start;
  padding: 18px;
  border-radius: 18px;
  background: #fff;
  box-shadow: 0 1px 2px rgba(23, 25, 28, 0.06), 0 0 0 1px ${line};
  min-width: 0;
`;

export const cardTitle = css`
  margin: 0;
  font-size: 15px;
  font-weight: 800;
  color: ${ink};
`;

export const cardDesc = css`
  margin: -4px 0 2px;
  font-size: 12px;
  line-height: 1.5;
  color: ${faint};
`;

export const empty = css`
  margin: 0;
  padding: 18px 0;
  font-size: 13px;
  color: ${faint};
  text-align: center;
`;

// ---------- 세로 막대 차트 ----------

export const chartWrap = css`
  display: grid;
  gap: 6px;
`;

export const chartBox = css`
  position: relative;
  width: 100%;
  min-width: 0;
`;

export const chartSvg = css`
  display: block;
  overflow: visible;
  touch-action: pan-y;

  &:focus-visible {
    outline: 3px solid rgba(23, 25, 28, 0.35);
    outline-offset: 2px;
    border-radius: 8px;
  }
`;

export const gridLine = css`
  stroke: ${gridColor};
  stroke-width: 1;
  shape-rendering: crispEdges;
`;

export const axisText = css`
  font-size: 11px;
  fill: ${faint};
  font-variant-numeric: tabular-nums;
`;

export const peakText = css`
  font-size: 11px;
  font-weight: 700;
  fill: ${sub};
`;

export const bar = (active: boolean) => css`
  fill: ${ink};
  opacity: ${active ? 0.72 : 1};
  pointer-events: none;
`;

export const crosshair = css`
  stroke: ${silver};
  stroke-width: 1;
  pointer-events: none;
`;

export const tooltip = css`
  position: absolute;
  transform: translateX(-50%);
  display: grid;
  gap: 1px;
  padding: 7px 10px;
  border-radius: 10px;
  background: #fff;
  box-shadow: 0 4px 14px rgba(23, 25, 28, 0.14), 0 0 0 1px ${line};
  pointer-events: none;
  white-space: nowrap;
  text-align: center;

  strong {
    font-size: 14px;
    color: ${ink};
  }
  span {
    font-size: 11px;
    color: ${sub};
  }
`;

export const tableToggle = css`
  font-size: 12px;
  color: ${sub};

  summary {
    width: fit-content;
    cursor: pointer;
    padding: 2px 0;
  }
`;

export const dataTable = css`
  width: 100%;
  margin-top: 8px;
  border-collapse: collapse;
  font-size: 12px;
  font-variant-numeric: tabular-nums;

  th,
  td {
    padding: 5px 8px;
    border-bottom: 1px solid ${gridColor};
    text-align: left;
  }
  td:last-child,
  th:last-child {
    text-align: right;
  }
  tbody {
    display: block;
    max-height: 220px;
    overflow-y: auto;
  }
  thead,
  tbody tr {
    display: table;
    width: 100%;
    table-layout: fixed;
  }
`;

// ---------- 가로 막대 목록 ----------

export const barList = css`
  display: grid;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const barRow = css`
  display: grid;
  gap: 5px;
  min-width: 0;
`;

export const barHead = css`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-size: 13px;
`;

export const barName = css`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${ink};
`;

export const barValue = css`
  flex-shrink: 0;
  font-weight: 700;
  color: ${ink};
  font-variant-numeric: tabular-nums;
`;

export const barShare = css`
  margin-left: 6px;
  font-weight: 500;
  color: ${faint};
`;

export const barTrack = css`
  height: 8px;
  border-radius: 999px;
  background: ${mist};
  overflow: hidden;
`;

export const barFill = css`
  height: 100%;
  border-radius: 999px;
  background: ${ink};
`;

// ---------- 활동 ----------

export const activity = css`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 16px;
  margin: 0;

  div {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    padding: 8px 0;
    border-bottom: 1px solid ${gridColor};
  }
  dt {
    font-size: 13px;
    color: ${sub};
  }
  dd {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    color: ${ink};
    font-variant-numeric: tabular-nums;
  }
`;
