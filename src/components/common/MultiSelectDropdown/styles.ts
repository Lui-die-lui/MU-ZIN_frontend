import { css } from "@emotion/react";
import {
  dropdownCaret,
  dropdownHint,
  dropdownList,
  dropdownMenu,
  dropdownMenuButton,
  dropdownMenuSearch,
  dropdownMenuTop,
  dropdownOption,
  dropdownTrigger,
} from "../dropdownStyles";

export const dropdownRoot = css`
  position: relative;
`;

// 공통 드롭다운 상자 디자인 (dropdownStyles.ts)
export const trigger = css`
  ${dropdownTrigger};
  min-width: 220px;
`;

export const caret = dropdownCaret;

// 펼쳐진 목록 (공통 디자인)
export const menu = css`
  ${dropdownMenu};
  width: min(360px, 92vw);
`;

export const menuTop = dropdownMenuTop;

export const searchInput = dropdownMenuSearch;

export const clearBtn = dropdownMenuButton;

export const list = dropdownList;

// 체크된 항목은 굵게, 마우스를 올리면 회색 배경 (공통 디자인)
export const item = (checked: boolean) => dropdownOption(checked, false);

export const hint = dropdownHint;
