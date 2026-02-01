import { css } from "@emotion/react";

export const wrap = css`
  width: 100%;
  margin-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
`;

export const item = css`
  background: #e7e7e7;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
`;

export const header = (disabled: boolean) => css`
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  padding: 0 18px;
  background: transparent;
  border: none;
  cursor: ${disabled ? "not-allowed" : "pointer"};

  color: rgba(0, 0, 0, ${disabled ? 0.45 : 0.92});
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

export const title = css`
  font-size: 13px;
  font-weight: 600;
  line-height: 1;
`;

export const icon = (open: boolean) => css`
  flex: 0 0 auto;
  font-size: 18px;
  opacity: 0.85;
  transform: rotate(${open ? "180deg" : "0deg"});
  transition: transform 180ms ease;
`;

/**
 * height 애니메이션: grid 0fr -> 1fr 트릭
 */
export const panel = (open: boolean) => css`
  display: grid;
  grid-template-rows: ${open ? "1fr" : "0fr"};
  transition: grid-template-rows 220ms ease;
  overflow: hidden;
  background: #f7f7f7;
`;

export const panelInner = (open: boolean) => css`
  overflow: hidden;
  padding: ${open ? "14px 18px 18px" : "0 18px"};
  color: rgba(0, 0, 0, 0.86);
`;

