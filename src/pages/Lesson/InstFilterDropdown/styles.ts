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
} from "../../../components/common/dropdownStyles";

export const wrap = css`
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
`;

// 악기군 드롭다운 바깥 너비 (디자인은 components/common/SelectDropdown 공통)
export const select = css`
  min-width: 160px;
`;

export const dropdownRoot = css`
  position: relative;
`;

export const trigger = css`
  ${dropdownTrigger};
  min-width: 220px;
`;

export const caret = dropdownCaret;

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
