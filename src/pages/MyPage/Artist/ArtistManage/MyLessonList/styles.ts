// src/pages/myPage/lessons/styles.ts
import { css } from "@emotion/react";
import type { LessonStatus } from "../../../../../Types/lessonTypes";
// 리스트
export const list = css`
  display: grid;
  gap: 12px;
`;

export const skeleton = css`
  height: 96px;
  border-radius: 14px;
  background: #f3f3f3;
`;

export const empty = css`
  border: 1px dashed #ddd;
  border-radius: 14px;
  padding: 18px;
  background: #fafafa;
`;

export const emptyTitle = css`
  font-weight: 700;
  margin-bottom: 6px;
`;

// 카드 관련
export const card = css`
  text-align: left;
  border: 1px solid #eee;
  background: #fff;
  border-radius: 14px;
  padding: 14px;
  cursor: pointer;

  &:hover {
    border-color: #ddd;
  }
`;

export const cardTop = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const cardTitleRow = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
`;

export const cardTitle = css`
  font-size: 15px;
`;


export const cardMeta = css`
  font-size: 13px;
  opacity: 0.8;
  display: flex;
  gap: 6px;
`;

export const tagRow = css`
  margin-top: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const tagChip = css`
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 999px;
  background: #f4f4f4;
`;

export const tagMore = css`
  font-size: 12px;
  opacity: 0.7;
  padding: 4px 6px;
`;

// 오른쪽 섹션
export const rightActions = css`
  display: inline-flex;
  align-items: center;
  gap: 8px;
`;

// 토글 버튼
export const toggleBtn = (status: LessonStatus) => css` 
// lesson status에 따라 변하기 때문에 lesson.status 받아줘야함
  height: 28px;
  padding: 0 10px;
  border-radius: 999px;

  font-size: 12px;
  font-weight: 700;
  letter-spacing: -0.2px;

  border: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.9);
  color: rgba(0, 0, 0, 0.82);

  cursor: pointer;
  transition:
    transform 120ms ease,
    background-color 120ms ease,
    border-color 120ms ease,
    opacity 120ms ease;

  &:hover {
    transform: translateY(-1px);
    background: rgba(255, 255, 255, 1);
    border-color: rgba(0, 0, 0, 0.12);
  }

  &:active {
    transform: translateY(0px);
    opacity: 0.9;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    transform: none;
  }

  /* 상태에 따라 살짝 톤만 */
  ${status === "ACTIVE"
    ? css`
        /* "비활성화" 액션: 살짝 경고 톤 */
        background: rgba(255, 240, 240, 0.9);
        border-color: rgba(255, 80, 80, 0.22);
        color: rgba(200, 40, 40, 0.9);

        &:hover {
          background: rgba(255, 240, 240, 1);
          border-color: rgba(255, 80, 80, 0.28);
        }
      `
    : css`
        /* "활성화" 액션: 살짝 긍정 톤 */
        background: rgba(240, 250, 244, 0.9);
        border-color: rgba(30, 160, 90, 0.22);
        color: rgba(20, 120, 70, 0.92);

        &:hover {
          background: rgba(240, 250, 244, 1);
          border-color: rgba(30, 160, 90, 0.28);
        }
      `}
`;




export const rightControls = css`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;

  /* ✅ 우측 영역 폭 고정: 리스트 줄맞춤 */
  flex: 0 0 150px;
`;

export const badge = (active: boolean) => css`
  min-width: 62px; /* ✅ "비활성" 때문에 폭 고정 */
  padding: 6px 10px;
  border-radius: 999px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  font-size: 13px;
  font-weight: 800;
  letter-spacing: -0.2px;

  background: ${active ? "#E7F9EF" : "#FFEAEA"};
  color: ${active ? "#1F7A4A" : "#B42318"};
  border: 1px solid ${active ? "#A7E3C0" : "#FDA29B"};
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.06);
`;


// 스위치 + 배지 묶음(이 래퍼에 stopPropagation 걸면 깔끔)
export const statusControl = css`
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;