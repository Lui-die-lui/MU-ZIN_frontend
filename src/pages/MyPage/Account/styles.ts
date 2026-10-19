import styled from "@emotion/styled";
import { css } from "@emotion/react";
import { brushed, brushedDark, c, chromeDot } from "../../../constants/metalTheme";


// 인증 및 개인정보 (내 정보 / 아티스트 프로필) 공통
// 헤더 = 공연 포스터 같은 차콜 판, 본문 = 실버 테두리의 장비 패널, 입력칸 = 패널 안에 파인 흰 칸

export const page = css`
  max-width: 760px;
  margin: 0 auto;
  padding: 30px 24px 80px;
  color: ${c.ink};

  /* 마이페이지 본문에 이미 좌우 여백(16px)이 있어 좁은 화면에선 겹치지 않게 */
  @media (max-width: 600px) {
    padding: 20px 0 60px;
  }
`;

export const header = css`
  position: relative;
  margin-bottom: 20px;
  padding: 30px 32px 28px;
  border-radius: 4px;
  background: ${brushedDark};
  color: ${c.paper};
  text-align: left;
  overflow: hidden;

  /* 아래 크롬 테두리 + 왼쪽 라임 눈금 */
  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 3px;
    background: linear-gradient(90deg, ${c.lime} 0 56px, transparent 56px), ${brushed};
  }

  @media (max-width: 600px) {
    padding: 24px 20px 22px;
  }
`;

export const title = css`
  margin: 0 0 10px;
  font-size: 36px;
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -0.04em;
  color: ${c.paper};

  @media (max-width: 600px) {
    font-size: 28px;
  }
`;

export const desc = css`
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: ${c.steel};
`;

// 장비 패널: 오프화이트 판 + 얇은 실버 테두리 + 위 모서리 크롬 나사 2개
export const card = css`
  position: relative;
  background: ${c.paper};
  border: 1px solid ${c.steel};
  border-radius: 4px;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    0 1px 0 rgba(17, 19, 21, 0.04),
    0 12px 32px -20px rgba(17, 19, 21, 0.35);
  overflow: hidden;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 9px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${chromeDot};
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.25);
    pointer-events: none;
  }
  &::before {
    left: 9px;
  }
  &::after {
    right: 9px;
  }
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

// 패널 안에 파인 입력칸 (각진 모서리 + 안쪽 그림자), 포커스는 라임
export const input = css`
  height: 40px;
  min-width: 0;
  padding: 0 12px;
  border: 1px solid ${c.steel};
  border-radius: 2px;
  background: ${c.white};
  box-shadow: inset 0 1px 2px rgba(17, 19, 21, 0.08);
  font: inherit;
  font-size: 15px;
  color: ${c.ink};
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &:focus {
    outline: none;
    border-color: ${c.ink};
    box-shadow: inset 0 1px 2px rgba(17, 19, 21, 0.08), 0 0 0 3px ${c.lime};
  }

  &:disabled {
    background: transparent;
    border-style: dashed;
    color: ${c.steelDeep};
    box-shadow: none;
  }
`;

// 저장 = 주 동작: 차콜 판 버튼, 바뀐 내용이 있을 때만 라임 표시등
// 바뀐 게 없으면(비활성) 점선 실버 테두리로 "아직 누를 필요 없음"을 구분
export const reserveBtn = css`
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 38px;
  padding: 0 16px;
  border: 1px solid ${c.ink};
  border-radius: 2px;
  background: ${c.ink};
  color: ${c.paper};
  font: inherit;
  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.02em;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;

  &::before {
    content: "";
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${c.lime};
    box-shadow: 0 0 6px rgba(215, 255, 63, 0.7);
  }

  &:hover:enabled {
    background: #24282B;
  }

  &:focus-visible {
    outline: 3px solid ${c.lime};
    outline-offset: 2px;
  }

  &:disabled {
    border: 1px dashed ${c.steel};
    background: transparent;
    color: ${c.steelDeep};
    cursor: not-allowed;

    &::before {
      background: ${c.steel};
      box-shadow: none;
    }
  }
`;

// 보조 동작 (메일 전송·비밀번호 변경 창 열기): 테두리만 있는 버튼
export const actionBtn = css`
  height: 38px;
  padding: 0 16px;
  border: 1px solid ${c.ink};
  border-radius: 2px;
  background: transparent;
  color: ${c.ink};
  font: inherit;
  font-size: 13px;
  font-weight: 800;
  white-space: nowrap;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease;

  &:hover:enabled {
    background: ${c.ink};
    color: ${c.paper};
  }

  &:focus-visible {
    outline: 3px solid ${c.lime};
    outline-offset: 2px;
  }

  &:disabled {
    border-color: ${c.steel};
    color: ${c.steelDeep};
    cursor: not-allowed;
  }
`;

// 완료 상태 (이메일 인증 완료): 버튼이 아니라 상태 표시처럼 - 라임 표시등 + 스틸 판
export const statusDone = css`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 32px;
  padding: 0 12px;
  border: 1px solid ${c.steel};
  border-radius: 2px;
  background: ${brushed};
  color: ${c.ink};
  font: inherit;
  font-size: 12px;
  font-weight: 800;
  white-space: nowrap;
  cursor: default;

  &::before {
    content: "";
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: ${c.lime};
    box-shadow: 0 0 0 1px ${c.ink};
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
  border: 1px solid ${c.steel};
  border-radius: 2px;
  background: ${c.white};
`;

export const userReserveBtn = css`
  width: 100%;
  height: 100%;
  border: none;
  background: ${c.ink};
  color: ${c.paper};
  font-size: 15px;
  cursor: pointer;

  &:disabled {
    background: ${c.steel};
    color: ${c.white};
    cursor: not-allowed;
  }
`;

// 행 이름: 굵은 글자 + 아이콘은 작은 브러시드 스틸 타일 안에
export const labelWithIcon = css`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: ${c.ink};
  line-height: 1.2;

  svg {
    flex-shrink: 0;
    box-sizing: content-box;
    width: 15px;
    height: 15px;
    padding: 6px;
    border: 1px solid ${c.steel};
    border-radius: 2px;
    background: ${brushed};
    color: ${c.ink};
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
  }
`;

export const helperText = css`
  margin: 6px 0 0;
  font-size: 13px;
  line-height: 1.5;
  color: ${c.steelDeep};
`;

export const errorText = css`
  margin: 6px 0 0;
  font-size: 13px;
  line-height: 1.5;
  color: ${c.danger};
`;

// 성공 문구: 라임 네모 표시 + 차콜 글자 (라임 글자는 밝은 배경에서 읽기 어려워 표시에만)
export const successText = css`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 6px 0 0;
  font-size: 13px;
  font-weight: 700;
  color: ${c.ink};

  &::before {
    content: "";
    flex-shrink: 0;
    width: 8px;
    height: 8px;
    background: ${c.lime};
    box-shadow: 0 0 0 1px ${c.ink};
  }
`;

// Artist css
export const section = css`
  display: grid;
  grid-template-columns: 170px 1fr;
  gap: 28px;
  padding: 28px 30px;
  border-bottom: 1px solid #eef0f3;

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
    font-weight: 800;
    color: #111827;
  }

  p {
    margin: 0;
    font-size: 13px;
    line-height: 1.5;
    color: #6b7280;
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
    font-weight: 700;
    color: #111827;
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
  background: #eef0f3;
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
    font-weight: 800;
    color: #111827;
  }

  p {
    margin: 0;
    font-size: 13px;
    color: #6b7280;
    line-height: 1.5;
  }
`;