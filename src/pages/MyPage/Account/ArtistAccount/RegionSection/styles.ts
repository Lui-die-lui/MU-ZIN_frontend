import { css } from "@emotion/react";

// 스튜디오 주소 / 서비스 가능 지역 (아티스트 프로필 · 아티스트 신청 공용)

export const section = css`
  width: 100%;
  text-align: left;

  & + & {
    margin-top: 24px;
    padding-top: 24px;
    border-top: 1px solid #f3f4f6;
  }
`;

export const sectionHeader = css`
  margin-bottom: 14px;
`;

export const title = css`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 4px;
  font-size: 15px;
  font-weight: 800;
  color: #111827;
`;

export const countBadge = css`
  font-size: 12px;
  font-weight: 700;
  color: #6b7280;
`;

export const desc = css`
  margin: 0;
  font-size: 13px;
  line-height: 1.5;
  color: #6b7280;
`;

export const buttonRow = css`
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
`;

const smallBtn = css`
  height: 34px;
  padding: 0 12px;
  border-radius: 10px;
  font: inherit;
  font-size: 13px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const outlineButton = css`
  ${smallBtn};
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #111827;

  &:hover:not(:disabled) {
    border-color: #111827;
  }
`;

export const ghostButton = css`
  ${smallBtn};
  border: 1px solid transparent;
  background: transparent;
  color: #b91c1c;

  &:hover:not(:disabled) {
    background: #fef2f2;
  }
`;

// 주소가 있을 때
export const addressCard = css`
  display: grid;
  gap: 10px;
  padding: 14px;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  background: #fafafa;
`;

export const addressMain = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  @media (max-width: 520px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

export const addressText = css`
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  word-break: keep-all;
`;

export const detailRow = css`
  position: relative;
`;

export const detailAddressInput = (invalid: boolean) => css`
  width: 100%;
  height: 44px;
  padding: 0 64px 0 12px;
  border: 1px solid ${invalid ? "#ef4444" : "#e5e7eb"};
  border-radius: 10px;
  background: #fff;
  color: #111827;
  font: inherit;
  font-size: 14px;
  box-sizing: border-box;

  &::placeholder {
    color: #9ca3af;
  }

  &:focus {
    outline: none;
    border-color: ${invalid ? "#ef4444" : "#111827"};
  }

  &:disabled {
    background: #f3f4f6;
    color: #9ca3af;
  }
`;

export const counter = css`
  position: absolute;
  top: 50%;
  right: 12px;
  transform: translateY(-50%);
  font-size: 12px;
  color: #9ca3af;
  pointer-events: none;
`;

// 주소가 없을 때 - 눌러서 바로 검색
export const emptyAddress = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16px;
  border: 1px dashed #d1d5db;
  border-radius: 14px;
  background: #fafafa;
  color: #6b7280;
  font: inherit;
  font-size: 14px;
  cursor: pointer;

  b {
    color: #111827;
    font-weight: 700;
  }

  &:hover:not(:disabled) {
    border-color: #111827;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
`;

// 서비스 지역 입력줄
// 들어가는 자리 너비에 맞춰 줄바꿈 (넓으면 한 줄, 좁은 행 안에서는 두 줄)
export const regionInputRow = css`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 8px;
  align-items: start;
  width: 100%;
`;

export const fieldItem = css`
  min-width: 0;
  width: 100%;
`;

export const addButton = css`
  justify-self: start;
  height: 46px; /* 옆 입력칸과 같은 높이 */
  padding: 0 18px;
  border: 1px solid #111827;
  border-radius: 12px;
  background: #111827;
  color: #fff;
  font: inherit;
  font-size: 14px;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;

  &:disabled {
    border-color: #e5e7eb;
    background: #f3f4f6;
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

export const chipArea = css`
  margin-top: 12px;
`;

export const noticeText = css`
  margin: 12px 0 0;
  font-size: 13px;
  color: #4b5563;
`;

export const hintText = css`
  margin: 12px 0 0;
  font-size: 13px;
  color: #6b7280;
`;

export const errorText = css`
  margin: 0;
  font-size: 13px;
  color: #dc2626;
`;

export const emptyText = css`
  margin: 12px 0 0;
  font-size: 13px;
  color: #9ca3af;
`;
