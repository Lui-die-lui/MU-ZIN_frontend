import { css, keyframes } from "@emotion/react";

// 마이페이지 공통 밝은 톤: 흰 카드 + 옅은 회색 선, 차콜 글자
const ink = "#1b1d20";
const muted = "#697078";
const border = "#e2e5e9";
const soft = "#f4f5f6";

export const wrap = css`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  width: 100%;
  max-width: 920px;
  margin: 0 auto;
  padding: 0 24px;
  box-sizing: border-box;

  @media (max-width: 600px) {
    padding: 0;
    gap: 12px;
  }
`;

// 카드 전체가 링크
export const card = css`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 150px;
  padding: 18px 18px 16px;
  border: 1px solid ${border};
  border-radius: 18px;
  background: #fff;
  color: ${ink};
  text-align: left;
  text-decoration: none;
  transition: border-color 150ms ease, box-shadow 150ms ease, transform 150ms ease;

  &:hover {
    border-color: #aeb4bc;
    box-shadow: 0 6px 18px rgba(20, 25, 30, 0.06);
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 3px solid rgba(17, 24, 39, 0.16);
    outline-offset: 2px;
  }
`;

export const titleRow = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

export const title = css`
  font-size: 18px;
  font-weight: 600;
`;

export const pill = css`
  padding: 4px 10px;
  border-radius: 999px;
  background: ${soft};
  font-size: 12px;
  font-weight: 600;
  color: ${muted};
`;

// 확인할 게 있으면 오른쪽 위 점
export const dot = css`
  position: absolute;
  top: -4px;
  right: -4px;
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: ${ink};
  box-shadow: 0 0 0 3px #fff;
`;

/* ===== 카드 안 미니 목록 ===== */

export const list = css`
  display: grid;
  gap: 8px;
  margin-top: 14px;
`;

export const row = css`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;

export const bullet = css`
  flex: 0 0 auto;
  width: 5px;
  height: 5px;
  border-radius: 999px;
  background: #aeb4bc;
`;

export const text = css`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;
  font-weight: 500;
`;

export const sub = css`
  flex-shrink: 0;
  margin-left: auto;
  font-size: 12px;
  color: ${muted};
  white-space: nowrap;
`;

export const empty = css`
  margin-top: 14px;
  font-size: 13px;
  color: ${muted};
`;

const shimmer = keyframes`
  from { opacity: 0.55; }
  to { opacity: 1; }
`;

export const skeleton = css`
  display: block;
  height: 14px;
  border-radius: 6px;
  background: ${soft};
  animation: ${shimmer} 0.9s ease-in-out infinite alternate;

  &:nth-of-type(2) {
    width: 70%;
  }
`;

export const footer = css`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 8px;
  margin-top: auto;
  padding-top: 14px;
`;

export const more = css`
  font-size: 12px;
  font-weight: 600;
  color: ${muted};
`;

export const count = css`
  font-size: 26px;
  font-weight: 700;
  line-height: 1;
  font-variant-numeric: tabular-nums;
`;
