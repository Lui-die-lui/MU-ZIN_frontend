import { css } from "@emotion/react";

// 가능한 일정: [라벨 | 내용] 줄 세 개 (날짜 / 요일 / 시간)
// 좁은 화면에서도 날짜 두 칸은 "~" 와 한 줄, 요일 7개·시간 4개도 한 줄 (줄바꿈 없음)
export const wrap = css`
  display: grid;
  gap: 12px;
  width: 100%;
  min-width: 0;
`;

export const row = css`
  display: grid;
  grid-template-columns: 36px minmax(0, 1fr);
  align-items: center;
  gap: 10px;
  min-width: 0;
`;

export const label = css`
  font-weight: 600;
  font-size: 13px;
  color: #5f656a;
  white-space: nowrap;
`;

// 넓으면 내용 길이만큼, 좁으면 칸을 똑같이 나눠 한 줄에
export const chips = (count: number) => css`
  min-width: 0;

  & > div {
    flex-wrap: nowrap;
  }

  @media (max-width: 600px) {
    & > div {
      display: grid;
      grid-template-columns: repeat(${count}, minmax(0, 1fr));
      gap: 6px;
    }
    & > div > button {
      min-width: 0;
      padding: 0;
    }
  }
`;
