import { css } from "@emotion/react";

// 아티스트 프로필 - "내 정보" 화면(AccountPage)과 같은 디자인
// 공통(page/header/title/desc/card/labelWithIcon/input/reserveBtn/helperText/errorText/successText)은 ../styles 를 그대로 쓰고,
// 여기에는 입력칸이 긴 행(소개·지역·악기)에 필요한 것만 둠

export const headerRow = css`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
`;

export const profileLink = css`
  flex-shrink: 0;
  padding: 8px 12px;
  border: 1px solid #e6e6e6;
  border-radius: 14px;
  background: #fff;
  color: #111;
  font-size: 13px;
  text-decoration: none;

  &:hover {
    border-color: #111;
  }
`;

// AccountInfoRow 와 같은 값 (칸 160px · 내용 · 버튼, 여백 24/28, 배경 #fcfcfc, 구분선 #eee)
// 다른 점: 내용이 여러 줄이라 라벨·버튼을 위쪽에 맞추고, 좁은 화면에서는 세로로 쌓음
export const row = css`
  display: grid;
  grid-template-columns: 160px minmax(0, 1fr) auto;
  align-items: start;
  gap: 16px;
  padding: 24px 28px;
  border-bottom: 1px solid #eeeeee;
  background-color: #fcfcfc;
  text-align: left;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 720px) {
    grid-template-columns: minmax(0, 1fr) auto;
    padding: 20px;

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
  color: #333;
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
  min-height: 110px;
  padding: 10px;
  border: 1px solid ${invalid ? "#d93025" : "#e6e6e6"};
  border-radius: 10px;
  background: #fff;
  font: inherit;
  font-size: 14px;
  line-height: 1.6;
  color: #111;
  box-sizing: border-box;
  resize: vertical;

  &::placeholder {
    color: #aaa;
  }

  &:focus {
    outline: none;
    border-color: ${invalid ? "#d93025" : "#111"};
  }
`;

export const metaLine = css`
  display: flex;
  justify-content: space-between;
  gap: 8px;
  font-size: 13px;
  color: #777;
`;

export const readonlyValue = css`
  padding-top: 8px;
  font-size: 15px;
  color: #111;
`;

export const inUseNote = css`
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: #777;

  b {
    color: #111;
    font-weight: 600;
  }
`;

export const centerState = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 80px 16px;
  color: #666;
  font-size: 14px;
`;
