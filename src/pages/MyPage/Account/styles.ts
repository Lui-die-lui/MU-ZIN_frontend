import styled from "@emotion/styled";
import { css } from "@emotion/react";

// 인증 및 개인정보 (내 정보 / 아티스트 프로필) 공통
// 다른 마이페이지 화면(내 예약 · 리뷰 관리)과 같은 밝은 톤: 흰 카드 + 옅은 회색 선, 차콜 글자, 포인트 컬러 없음
export const tone = {
  text: "#1b1d20",
  muted: "#697078",
  faint: "#9aa0a6",
  border: "#e2e5e9",
  divider: "#f0f1f2",
  soft: "#f4f5f6", // 아이콘 타일 · 읽기 전용 칸
  danger: "#c0362c",
  success: "#2f6b4f",
  ring: "rgba(27, 29, 32, 0.12)",
};

export const page = css`
  display: grid;
  gap: 16px;
  color: ${tone.text};
  text-align: left;
`;

export const header = css`
  display: grid;
  gap: 8px;
  margin-bottom: 4px;
  text-align: left;
`;

export const title = css`
  margin: 0;
  font-size: 25px;
  font-weight: 700;
  color: ${tone.text};
`;

export const desc = css`
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: ${tone.muted};
`;

// 행들을 담는 흰 카드
export const card = css`
  background: #fff;
  border: 1px solid ${tone.border};
  border-radius: 18px;
  /* overflow: hidden 을 두면 카드 안 드롭다운 목록(스타일·악기 선택)이 카드 밖에서 잘림 */
`;

// 회원 탈퇴 - 위 설정 카드와 간격을 더 두고 따로
export const dangerCard = css`
  margin-top: 24px;
`;

export const SubContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const ContentItem = styled.div`
  display: flex;
  align-items: center; /* 아이콘-글자 수직 정렬 */
  gap: 8px; /* 아이콘-글자 간격 */
`;

export const input = css`
  height: 42px;
  min-width: 0;
  padding: 0 14px;
  border: 1px solid ${tone.border};
  border-radius: 12px;
  background: #fff;
  font: inherit;
  font-size: 15px;
  color: ${tone.text};
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:focus {
    outline: none;
    border-color: ${tone.text};
    box-shadow: 0 0 0 3px ${tone.ring};
  }

  &:disabled {
    border-color: transparent;
    background: ${tone.soft};
    color: ${tone.muted};
  }
`;

// 저장 = 주 동작: 차콜 버튼. 바뀐 게 없으면(비활성) 옅은 회색
export const reserveBtn = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 38px;
  padding: 0 16px;
  border: 1px solid ${tone.text};
  border-radius: 12px;
  background: ${tone.text};
  color: #fff;
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;

  @media (hover: hover) {
    &:hover:enabled {
      background: #33373b;
      border-color: #33373b;
    }
  }
  &:active:enabled {
    background: #33373b;
    border-color: #33373b;
  }

  &:focus-visible {
    outline: 3px solid ${tone.ring};
    outline-offset: 2px;
  }

  &:disabled {
    border-color: ${tone.border};
    background: ${tone.soft};
    color: ${tone.faint};
    cursor: not-allowed;
  }
`;

// 보조 동작: 테두리만 있는 버튼
export const actionBtn = css`
  height: 38px;
  padding: 0 16px;
  border: 1px solid ${tone.border};
  border-radius: 12px;
  background: #fff;
  color: ${tone.text};
  font: inherit;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: border-color 0.15s ease;

  @media (hover: hover) {
    &:hover:enabled {
      border-color: ${tone.text};
    }
  }
  &:active:enabled {
    border-color: ${tone.text};
  }

  &:focus-visible {
    outline: 3px solid ${tone.ring};
    outline-offset: 2px;
  }

  &:disabled {
    color: ${tone.faint};
    cursor: not-allowed;
  }
`;

// 완료 상태 (이메일 인증 완료): 버튼이 아니라 상태 표시처럼
export const statusDone = css`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 12px;
  border-radius: 999px;
  background: ${tone.soft};
  color: ${tone.success};
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;

  &::before {
    content: "✓";
    font-weight: 600;
  }
`;

export const textarea = css`
  resize: none;
  min-height: 120px;
  max-height: 300px;
  min-width: 300px;
  max-width: 630px;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid ${tone.border};
  border-radius: 12px;
  background: #fff;
`;

export const userReserveBtn = css`
  width: 100%;
  height: 100%;
  border: none;
  background: ${tone.text};
  color: #fff;
  font-size: 15px;
  cursor: pointer;

  &:disabled {
    background: ${tone.soft};
    color: ${tone.faint};
    cursor: not-allowed;
  }
`;

// 행 이름: 굵은 글자 + 아이콘은 옅은 회색 타일 안에
export const labelWithIcon = css`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 600;
  color: ${tone.text};
  line-height: 1.2;

  svg {
    flex-shrink: 0;
    box-sizing: content-box;
    width: 15px;
    height: 15px;
    padding: 8px;
    border-radius: 10px;
    background: ${tone.soft};
    color: ${tone.text};
  }
`;

export const helperText = css`
  margin: 6px 0 0;
  font-size: 13px;
  line-height: 1.5;
  color: ${tone.muted};
`;

export const errorText = css`
  margin: 6px 0 0;
  font-size: 13px;
  line-height: 1.5;
  color: ${tone.danger};
`;

export const successText = css`
  margin: 6px 0 0;
  font-size: 13px;
  font-weight: 500;
  line-height: 1.5;
  color: ${tone.success};
`;

// Artist css
export const section = css`
  display: grid;
  grid-template-columns: 170px 1fr;
  gap: 28px;
  padding: 28px 30px;
  border-bottom: 1px solid ${tone.divider};

  &:last-of-type {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 18px;
    padding: 24px 20px;
  }
`;

export const sectionLabel = css`
  display: flex;
  flex-direction: column;
  gap: 8px;

  h2,
  h3 {
    margin: 0;
    font-size: 17px;
    font-weight: 600;
    color: ${tone.text};
  }

  p {
    margin: 0;
    font-size: 13px;
    line-height: 1.5;
    color: ${tone.muted};
  }
`;

export const sectionContent = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const fieldGroup = css`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 14px;
    font-weight: 600;
    color: ${tone.text};
  }
`;

export const actionRow = css`
  display: flex;
  justify-content: flex-end;
  margin-top: 4px;
`;

// Profile Section 
export const innerDivider = css`
  width: 100%;
  height: 1px;
  background: ${tone.divider};
  margin: 8px 0;
`;

export const subSection = css`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const subSectionHeader = css`
  display: flex;
  flex-direction: column;
  gap: 6px;

  h3 {
    margin: 0;
    font-size: 17px;
    font-weight: 600;
    color: ${tone.text};
  }

  p {
    margin: 0;
    font-size: 13px;
    color: ${tone.muted};
    line-height: 1.5;
  }
`;