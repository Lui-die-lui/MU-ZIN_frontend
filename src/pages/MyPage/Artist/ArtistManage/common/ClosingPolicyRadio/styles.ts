import { css } from "@emotion/react";

export const wrap = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const label = css`
  font-size: 15px;
  font-weight: 600;
  color: #111827;
`;

export const helperText = css`
  font-size: 13px;
  color: #6b7280;
  line-height: 1.4;
`;

export const optionGroup = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-bottom: 10px;
`;

export const optionCard = css`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 16px;
  border: 1px solid #d7dfe7;
  border-radius: 14px;
  background-color: #ffffff;
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    background-color 0.2s ease;

  &:hover {
    border-color: #9fb3c8;
    background-color: #fafcff;
  }
`;

export const optionCardSelected = css`
  border-color: #4f7cff;
  box-shadow: 0 0 0 3px rgba(79, 124, 255, 0.12);
  background-color: #f8fbff;
`;

export const hiddenRadio = css`
  display: none;
`;

export const optionTitle = css`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
`;

export const optionDescription = css`
  font-size: 13px;
  color: #6b7280;
  line-height: 1.45;
`;
