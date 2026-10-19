import { css } from "@emotion/react";
import { brushed, c, font } from "../../../../constants/metalTheme";

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

// 차콜 헤더 위 링크: 실버 테두리, 올리면 라임 테두리
export const profileLink = css`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  height: 36px;
  padding: 0 14px;
  border: 1px solid rgba(174, 180, 184, 0.6);
  border-radius: 2px;
  background: rgba(255, 255, 255, 0.04);
  color: ${c.paper};
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
  transition: border-color 0.15s ease, color 0.15s ease;

  &:hover {
    border-color: ${c.lime};
    color: ${c.lime};
  }

  &:focus-visible {
    outline: 3px solid ${c.lime};
    outline-offset: 2px;
  }
`;

// AccountInfoRow 와 같은 값 (칸 160px · 내용 · 버튼, 여백 24/28, 배경 #fcfcfc, 구분선 #eee)
// 다른 점: 내용이 여러 줄이라 라벨·버튼을 위쪽에 맞추고, 좁은 화면에서는 세로로 쌓음
// AccountInfoRow 와 같은 칸 (이름 170px · 내용 · 버튼)
// 다른 점: 내용이 여러 줄이라 이름·버튼을 위쪽에 맞추고, 좁은 화면에서는 세로로 쌓음
export const row = css`
  display: grid;
  grid-template-columns: 170px minmax(0, 1fr) auto;
  align-items: start;
  gap: 20px;
  padding: 26px 28px;
  border-bottom: 1px solid ${c.hairline};
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
  color: ${c.ink};
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
  border: 1px solid ${invalid ? c.danger : c.steel};
  border-radius: 2px;
  background: ${c.white};
  box-shadow: inset 0 1px 2px rgba(17, 19, 21, 0.08);
  font: inherit;
  font-size: 15px;
  line-height: 1.65;
  color: ${c.ink};
  box-sizing: border-box;
  resize: vertical;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &::placeholder {
    color: ${c.steel};
  }

  &:focus {
    outline: none;
    border-color: ${invalid ? c.danger : c.ink};
    box-shadow: inset 0 1px 2px rgba(17, 19, 21, 0.08), 0 0 0 3px ${invalid ? "rgba(179, 38, 30, 0.2)" : c.lime};
  }
`;

// 안내 문구 + 글자 수 (글자 수는 장비 표시창처럼 고정폭 숫자)
export const metaLine = css`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
  font-size: 13px;
  line-height: 1.5;
  color: ${c.steelDeep};

  > span:last-of-type:not(:first-of-type) {
    flex-shrink: 0;
    font-family: ${font.mono};
    font-size: 12px;
    letter-spacing: 0.04em;
    font-variant-numeric: tabular-nums;
    color: ${c.ink};
  }
`;

// 전공 (승인 후 고정): 이름표처럼 새긴 브러시드 스틸 판
export const readonlyValue = css`
  align-self: flex-start;
  padding: 8px 14px;
  border: 1px solid ${c.steel};
  border-radius: 2px;
  background: ${brushed};
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.85), 0 1px 2px rgba(17, 19, 21, 0.12);
  font-size: 16px;
  font-weight: 900;
  letter-spacing: -0.01em;
  color: ${c.ink};
`;

export const inUseNote = css`
  margin: 0;
  font-size: 13px;
  line-height: 1.6;
  color: ${c.steelDeep};

  b {
    color: ${c.ink};
    font-weight: 800;
  }
`;

export const centerState = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 80px 16px;
  color: ${c.steelDeep};
  font-size: 14px;
`;
