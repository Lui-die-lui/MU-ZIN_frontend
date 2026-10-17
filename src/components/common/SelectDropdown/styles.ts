import { css } from "@emotion/react";
import {
  dropdownCaret,
  dropdownList,
  dropdownMenu,
  dropdownOption,
  dropdownTrigger,
} from "../dropdownStyles";

// 바깥 너비는 사용하는 쪽에서 css 로 지정 (기본은 내용 크기)
export const root = css`
  position: relative;
  display: inline-flex;
  min-width: 0;
`;

// 다른 드롭다운과 같은 상자
export const trigger = (isPlaceholder: boolean) => css`
  ${dropdownTrigger};
  width: 100%;
  min-width: 0;
  color: ${isPlaceholder ? "#989da3" : "#1b1d20"};
`;

export const label = css`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const caret = dropdownCaret;

// 펼쳐진 목록 (공통 디자인)
export const menu = css`
  ${dropdownMenu};
  ${dropdownList};
  margin: 0;
  list-style: none;
`;

export const option = (selected: boolean, active: boolean, disabled: boolean) => css`
  ${dropdownOption(selected, active, disabled)};
  justify-content: space-between;
  white-space: nowrap;
`;

export const check = css`
  font-size: 12px;
  color: #111827;
`;
