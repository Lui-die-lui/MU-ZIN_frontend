/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import {
  dropdownCaret,
  dropdownField,
  dropdownHint,
  dropdownList,
  dropdownMenu,
  dropdownOption,
} from "../dropdownStyles";

export const root = css`
  position: relative;
  width: 100%;
  min-width: 0;
`;

// 공통 드롭다운 상자 디자인 (dropdownStyles.ts) - 아이콘 자리만큼 오른쪽 여백
export const input = css`
  ${dropdownField};
  width: 100%;
  padding: 0 34px 0 13px;
`;

// 아이콘은 select 와 같은 위치(오른쪽 14px, 세로 가운데)
export const inputCaret = (open: boolean) => css`
  ${dropdownCaret(open)};
  position: absolute;
  top: 20.5px; /* (입력칸 46px - 아이콘 5px) / 2 - 아래 안내 문구가 붙어도 위치 고정 */
  right: 14px;
  pointer-events: none;
`;

export const helperText = css`
  margin-top: 6px;
  font-size: 12px;
  color: #6b7280;
`;

export const errorText = css`
  margin-top: 6px;
  font-size: 12px;
  color: #dc2626;
`;

// 펼쳐진 목록 (공통 디자인)
export const dropdown = css`
  ${dropdownMenu};
  ${dropdownList};
  right: 0;
`;

export const stateText = dropdownHint;

// 항목 (active: 마우스/키보드로 가리킴) - 보조 문구가 있으면 아래 줄에 표시
export const optionButton = (active: boolean) => css`
  ${dropdownOption(false, active)};
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
`;

export const optionLabel = css`
  font-size: 14px;
  color: #1b1d20;
`;

export const optionSubLabel = css`
  font-size: 12px;
  color: #6b7280;
`;
