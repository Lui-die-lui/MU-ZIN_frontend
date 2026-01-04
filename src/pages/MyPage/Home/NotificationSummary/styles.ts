/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

export type CardKey = "message" | "reservation" | "lesson";

const gradients: Record<CardKey, string> = {
  message: "linear-gradient(135deg, #E8C8F0 0%, #F0D8F0 45%, #F8D8D0 100%)",
  reservation: "linear-gradient(135deg, #F8D8D0 0%, #F8C8C8 55%, #F0C8E8 100%)",
  lesson: "linear-gradient(135deg, #F0C8E8 0%, #F8D0D0 55%, #F0D0F0 100%)",
};

// export const wrap = css`
//   display: grid;
//   gap: 18px;
//   grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
//   justify-content: center;
// `;

export const wrap = css`
  display: grid;
  gap: 18px;

  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));

  width: 100%;
  max-width: 920px; /* 원하는 폭으로 조절 */
  margin: 0 auto; /* ★ 가운데 정렬 핵심 */
  padding: 0 24px; /* 모바일 여백 */
  box-sizing: border-box;
`;

export const card = (kind: CardKey) => css`
  position: relative;
  border-radius: 18px;
  padding: 18px 18px 16px;
  min-height: 130px;

  background: ${gradients[kind]};
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.55);

  color: #111;
  overflow: visible;

  transition: transform 120ms ease, box-shadow 120ms ease;
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 14px 30px rgba(0, 0, 0, 0.1);
  }
`;

export const titleRow = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

export const title = css`
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.2px;
`;

export const pill = css`
  border: 0;
  background: rgba(255, 255, 255, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.7);
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
  cursor: pointer;

  transition: transform 120ms ease, background-color 120ms ease;
  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 0.75);
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
    transform: none;
  }
`;

export const count = css`
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.3px;
  font-variant-numeric: tabular-nums;
  opacity: 0.95;
`;

export const dot = css`
  position: absolute;
  top: -6px;
  right: -6px;
  width: 14px;
  height: 14px;
  border-radius: 999px;
  background: #ff2d2d;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.9);
`;

/* ===== 카드 내부 미니 리스트 ===== */

export const list = css`
  margin-top: 10px;
  display: grid;
  gap: 6px;
`;

export const row = css`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;

export const bullet = css`
  width: 6px;
  height: 6px;
  border-radius: 999px;
  background: rgba(17, 24, 39, 0.6);
  flex: 0 0 auto;
`;

export const text = css`
  font-size: 13px;
  font-weight: 800;
  opacity: 0.86;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const sub = css`
  font-size: 12px;
  font-weight: 800;
  opacity: 0.65;
  white-space: nowrap;
`;

export const empty = css`
  margin-top: 10px;
  font-size: 13px;
  font-weight: 800;
  opacity: 0.75;
`;
