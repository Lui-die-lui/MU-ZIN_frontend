import { css } from "@emotion/react";

export const infoRow = css`
  display: grid;
  grid-template-columns: 180px 1fr auto;
  align-items: center;
  /* gap: 20px; */
  padding: 24px 28px;
  border-bottom: 1px solid #ececec;
  background-color: #fcfcfc;
`;

export const infoLabel = css`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  font-weight: 600;
  color: #111;
`;

export const infoContent = css`
  font-size: 12px;
  color: #666;
  line-height: 1.5;
  text-align: start;
`;

export const infoText = css`
  margin: 0;
`;

export const infoAction = css`
  display: flex;
  align-items: center;
`;

export const avatarButton = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
`;

export const avatarHint = css`
  font-size: 13px;
  color: #666;
`;

export const errorText = css`
  margin: 6px 0 0;
  font-size: 13px;
  color: #d93025;
`;
