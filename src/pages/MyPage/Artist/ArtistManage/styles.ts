import { css } from "@emotion/react";

// 내 레슨 관리 (레슨 수정 화면과 같은 톤: 왼쪽 정렬 제목, 흰 카드, 검정 버튼)

export const page = css`
  max-width: 820px;
  margin: 0 auto;
  padding: 28px 24px 40px;
  text-align: left;

  @media (max-width: 600px) {
    padding: 20px 16px 32px;
  }
`;

export const headerRow = css`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 20px;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: stretch;
  }
`;

export const title = css`
  margin: 0;
  font-size: 25px;
  font-weight: 700;
  color: #111827;
`;

export const sub = css`
  margin: 6px 0 0;
  font-size: 13px;
  color: #6b7280;
`;

export const primaryBtn = css`
  flex-shrink: 0;
  height: 44px;
  padding: 0 18px;
  border-radius: 12px;
  border: 1px solid #111827;
  background: #111827;
  color: #fff;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;

  @media (hover: hover) {
    &:hover {
      background: #1f2937;
    }
  }
  &:active {
    background: #1f2937;
  }
`;

export const toolbar = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;

  /* 모바일: 탭은 한 줄 전체, 검색과 정렬은 아래 한 줄에 나란히 */
  @media (max-width: 600px) {
    display: grid;
    grid-template-columns: minmax(0, 1fr) 112px;
  }
`;

// 전체 / 공개 중 / 비공개 탭
export const segment = css`
  display: inline-flex;
  padding: 4px;
  border-radius: 12px;
  background: #f3f4f6;

  @media (max-width: 600px) {
    grid-column: 1 / -1;

    & > button {
      flex: 1;
    }
  }
`;

export const segmentBtn = (active: boolean) => css`
  height: 36px;
  padding: 0 14px;
  border: 0;
  border-radius: 9px;
  background: ${active ? "#fff" : "transparent"};
  box-shadow: ${active ? "0 1px 2px rgba(17, 24, 39, 0.12)" : "none"};
  color: ${active ? "#111827" : "#6b7280"};
  font: inherit;
  font-size: 13px;
  font-weight: ${active ? 700 : 600};
  cursor: pointer;
  white-space: nowrap;

  span {
    margin-left: 4px;
    color: ${active ? "#111827" : "#9ca3af"};
  }
`;

export const searchWrap = css`
  position: relative;
  flex: 1;
  min-width: 180px;

  @media (max-width: 600px) {
    min-width: 0;
  }
`;

export const searchInput = css`
  width: 100%;
  height: 44px;
  padding: 0 36px 0 14px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  background: #fff;
  font: inherit;
  font-size: 14px;
  color: #111827;
  box-sizing: border-box;
  outline: none;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    border-color: #111827;
  }
`;

export const searchClear = css`
  position: absolute;
  top: 50%;
  right: 8px;
  transform: translateY(-50%);
  width: 26px;
  height: 26px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  color: #9ca3af;
  font-size: 16px;
  cursor: pointer;

  @media (hover: hover) {
    &:hover {
      background: #f3f4f6;
      color: #374151;
    }
  }
  &:active {
    background: #f3f4f6;
    color: #374151;
  }
`;

export const sortSelect = css`
  width: 140px;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

// 처리해야 할 예약 요청 안내
export const banner = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
  padding: 14px 16px;
  border: 1px solid #e2e5e9;
  border-radius: 14px;
  background: #f7f8f9;
  color: #1b1d20;
  font-size: 14px;

  b {
    font-weight: 600;
  }
`;

export const bannerLink = css`
  flex-shrink: 0;
  padding: 0;
  border: 0;
  background: none;
  color: #1b1d20;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  text-decoration: underline;
  cursor: pointer;
`;

export const resultText = css`
  margin: 0 0 10px;
  font-size: 13px;
  color: #6b7280;
`;
