import { css } from "@emotion/react";

export const wrap = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: left;
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
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const optionCard = css`
  position: relative;
  display: grid;
  grid-template-columns: 18px 1fr;
  column-gap: 12px;
  row-gap: 4px;
  align-items: start;
  padding: 16px;
  border: 1px solid #e2e5e9;
  border-radius: 14px;
  background-color: #fff;
  cursor: pointer;
  transition: border-color 0.15s ease, background-color 0.15s ease;

  @media (hover: hover) {
    &:hover {
      border-color: #9ca3af;
    }
  }
  &:active {
    border-color: #9ca3af;
  }

  /* 키보드로 이동했을 때 */
  &:focus-within {
    outline: 3px solid rgba(17, 24, 39, 0.1);
  }
`;

export const optionCardSelected = css`
  border-color: #111827;
  background-color: #f9fafb;
`;

export const optionCardDisabled = css`
  cursor: not-allowed;
  opacity: 0.6;
`;

// 화면에선 숨기되 키보드·스크린리더로는 선택 가능
export const hiddenRadio = css`
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  margin: 0;
`;

// 라디오 동그라미
export const dot = (selected: boolean) => css`
  grid-row: 1 / span 2;
  width: 18px;
  height: 18px;
  margin-top: 1px;
  box-sizing: border-box;
  border-radius: 50%;
  border: ${selected ? "5px solid #111827" : "1.5px solid #9ca3af"};
  background: #fff;
`;

export const optionTitle = css`
  font-size: 14px;
  font-weight: 600;
  color: #111827;
`;

export const optionDescription = css`
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
`;
