import { css } from "@emotion/react";

/*
 * 모든 드롭다운 공통 디자인
 *  - 단일 선택: components/common/SelectDropdown (네이티브 <select> 는 열림 상태를 알 수 없어 아이콘을 못 돌리므로 사용하지 않음)
 *  - 다중 선택: MultiSelectDropdown, InstFilterDropdown 의 악기 선택
 *  - 입력형: InputDropdown (지역)
 */

// 공통 아이콘
// 마이페이지 사이드바의 "▾"(15px, #374151, 투명도 0.7)와 같은 모양/크기/색으로 맞춘 작은 채워진 삼각형
// (브라우저에서 글자를 측정해 같은 크기의 SVG로 만듦: 약 5.2 x 4.5px)
const CARET_SVG =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='6' height='5' viewBox='0 0 6 5'%3E%3Cpath d='M0.4 0.25H5.6L3 4.75Z' fill='%23374151' fill-opacity='0.7'/%3E%3C/svg%3E\")";

const CARET_WIDTH = 6;
const CARET_HEIGHT = 5;

// ---------- 드롭다운 입력칸 공통 디자인 ----------
// 버튼형 / 입력형 드롭다운이 모두 같은 상자로 보이도록 (검색어 입력칸과 동일한 값)
// 폼 요소는 기본적으로 페이지 폰트를 물려받지 않아서(Arial 13.3px) font: inherit 를 꼭 지정
export const dropdownField = css`
  box-sizing: border-box;
  height: 46px;
  border: 1px solid #cfd4da;
  border-radius: 10px;
  background-color: #fff;
  color: #1b1d20;
  font: inherit;
  font-size: 14px;
  font-weight: 400;
  text-align: left;

  &::placeholder {
    color: #989da3;
  }

  &:focus,
  &:focus-visible {
    outline: 3px solid rgba(17, 24, 39, 0.1);
    border-color: #111827;
  }

  &:disabled {
    background-color: #f3f4f6;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

// 버튼형 드롭다운 (단일 선택, 스타일 선택, 악기 선택) - 아이콘이 마지막 요소라 오른쪽 여백 14px = 입력형과 같은 위치
export const dropdownTrigger = css`
  ${dropdownField};
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0 14px 0 13px;
  cursor: pointer;
`;

// ---------- 펼쳐진 목록 공통 디자인 ----------
// 단일 선택(SelectDropdown) / 다중 선택(스타일·악기) / 입력형(지역) 목록이 모두 같은 모양

// 목록 상자
export const dropdownMenu = css`
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  min-width: 100%;
  box-sizing: border-box;
  z-index: 50;
  overflow: hidden;
  background: #fff;
  border: 1px solid #e2e5e9;
  border-radius: 12px;
  box-shadow: 0 12px 32px rgba(17, 24, 39, 0.12);
  font-size: 14px;
  text-align: left;
`;

// 목록 영역 (스크롤)
export const dropdownList = css`
  max-height: 280px;
  overflow-y: auto;
  padding: 6px;
`;

// 목록 상단 (검색칸 + 전체 해제)
export const dropdownMenuTop = css`
  display: flex;
  gap: 8px;
  padding: 8px;
  border-bottom: 1px solid #eef0f2;
`;

// 목록 안 검색칸
export const dropdownMenuSearch = css`
  flex: 1;
  min-width: 0;
  height: 36px;
  box-sizing: border-box;
  padding: 0 10px;
  border: 1px solid #cfd4da;
  border-radius: 8px;
  background: #fff;
  color: #1b1d20;
  font: inherit;
  font-size: 14px;

  &::placeholder {
    color: #989da3;
  }

  &:focus {
    outline: none;
    border-color: #111827;
  }
`;

// 목록 안 보조 버튼 (전체 해제)
export const dropdownMenuButton = css`
  height: 36px;
  padding: 0 10px;
  border: 1px solid #cfd4da;
  border-radius: 8px;
  background: #fff;
  color: #374151;
  font: inherit;
  font-size: 13px;
  white-space: nowrap;
  cursor: pointer;

  &:hover {
    background: #f3f4f6;
  }
`;

// 항목 (selected: 선택됨, active: 마우스/키보드로 가리킴)
export const dropdownOption = (selected: boolean, active: boolean, disabled = false) => css`
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  border: 0;
  border-radius: 8px;
  background: ${active && !disabled ? "#f3f4f6" : "transparent"};
  color: ${disabled ? "#9ca3af" : "#1b1d20"};
  font: inherit;
  font-size: 14px;
  font-weight: ${selected ? 600 : 400};
  text-align: left;
  cursor: ${disabled ? "default" : "pointer"};

  ${!disabled && "&:hover { background: #f3f4f6; }"}

  /* 다중 선택 체크박스 */
  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    margin: 0;
    accent-color: #111827;
    cursor: pointer;
  }
`;

// 불러오는 중 / 결과 없음
export const dropdownHint = css`
  padding: 12px 10px;
  color: #6b7280;
  font-size: 13px;
`;

// 커스텀 드롭다운 아이콘 (열리면 사이드바처럼 위로 뒤집힘)
export const dropdownCaret = (open: boolean) => css`
  display: inline-block;
  width: ${CARET_WIDTH}px;
  height: ${CARET_HEIGHT}px;
  flex: 0 0 ${CARET_WIDTH}px;
  background-image: ${CARET_SVG};
  background-repeat: no-repeat;
  background-position: center;
  background-size: ${CARET_WIDTH}px ${CARET_HEIGHT}px;
  transform: rotate(${open ? "180deg" : "0deg"});
  transition: transform 0.15s ease;
`;
