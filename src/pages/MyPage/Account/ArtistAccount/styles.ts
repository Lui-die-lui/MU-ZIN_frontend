import { css } from "@emotion/react";
import { tone } from "../styles";

// 아티스트 프로필 - "내 정보" 화면(AccountPage)과 같은 디자인
// 공통(page/header/title/desc/card/labelWithIcon/input/reserveBtn/helperText/errorText/successText)은 ../styles 를 그대로 쓰고,
// 여기에는 입력칸이 긴 행(소개·지역·악기)에 필요한 것만 둠

export const headerRow = css`
  display: flex;
  flex-wrap: wrap; /* 좁은 화면: 제목이 "아티스트 프로 / 필"로 끊기지 않게 버튼을 아래로 */
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;

  > div {
    flex: 1 1 220px;
    min-width: 0;
  }
`;

// 공개 프로필 보기: 테두리만 있는 보조 버튼
export const profileLink = css`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  height: 36px;
  padding: 0 14px;
  border: 1px solid ${tone.border};
  border-radius: 12px;
  background: #fff;
  color: ${tone.text};
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: ${tone.text};
  }

  &:focus-visible {
    outline: 3px solid ${tone.ring};
    outline-offset: 2px;
  }
`;

// AccountInfoRow 와 같은 칸 (이름 170px · 내용 · 버튼)
// 다른 점: 내용이 여러 줄이라 이름·버튼을 위쪽에 맞추고, 좁은 화면에서는 세로로 쌓음
export const row = css`
  display: grid;
  grid-template-columns: 170px minmax(0, 1fr) auto;
  align-items: start;
  gap: 20px;
  padding: 26px 28px;
  border-bottom: 1px solid ${tone.divider};
  text-align: left;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 720px) {
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 14px;
    padding: 22px 18px;

    & > :nth-of-type(2) {
      grid-column: 1 / -1;
      grid-row: 2;
    }
  }
`;

export const rowLabel = css`
  padding-top: 8px; /* 첫 입력칸 글자 높이에 맞춤 */
`;

export const rowContent = css`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
  font-size: 15px;
  color: ${tone.text};
`;

export const rowAction = css`
  display: flex;
  align-items: center;
  padding-top: 2px;

  @media (max-width: 720px) {
    grid-column: 2;
    grid-row: 1;
  }
`;

export const textarea = (invalid: boolean) => css`
  width: 100%;
  min-height: 120px;
  padding: 12px 14px;
  border: 1px solid ${invalid ? tone.danger : tone.border};
  border-radius: 12px;
  background: #fff;
  font: inherit;
  font-size: 15px;
  line-height: 1.65;
  color: ${tone.text};
  box-sizing: border-box;
  resize: vertical;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &::placeholder {
    color: ${tone.faint};
  }

  &:focus {
    outline: none;
    border-color: ${invalid ? tone.danger : tone.text};
    box-shadow: 0 0 0 3px ${invalid ? "rgba(192, 54, 44, 0.15)" : tone.ring};
  }
`;

// 안내 문구 + 글자 수 (숫자 폭 고정)
export const metaLine = css`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  font-size: 13px;
  line-height: 1.5;
  color: ${tone.muted};

  > span:last-of-type:not(:first-of-type) {
    flex-shrink: 0;
    font-size: 12px;
    font-variant-numeric: tabular-nums;
    color: ${tone.muted};
  }
`;

// 전공 (승인 후 고정): 옅은 회색 칩
export const readonlyValue = css`
  align-self: flex-start;
  padding: 8px 14px;
  border-radius: 10px;
  background: ${tone.soft};
  font-size: 15px;
  font-weight: 700;
  color: ${tone.text};
`;

export const inUseNote = css`
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: ${tone.muted};

  b {
    color: ${tone.text};
    font-weight: 800;
  }
`;

export const centerState = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 80px 16px;
  color: ${tone.muted};
  font-size: 14px;
`;
