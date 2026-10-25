import { css } from "@emotion/react";
import { tone } from "../styles";

// 넓은 화면: [제목 | 내용 | 버튼] 한 줄
// 좁은 화면: [제목 ... 버튼] 아래 내용 전체 폭 (예전엔 세 칸을 그대로 둬서 설명이 한 글자씩 세로로 쌓이고 입력칸이 카드 밖으로 잘림)
export const row = css`
  display: grid;
  grid-template-columns: 170px minmax(0, 1fr) auto;
  grid-template-areas: "label content action";
  align-items: center;
  gap: 20px;
  padding: 24px 28px;
  border-bottom: 1px solid ${tone.divider};
  text-align: left;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 600px) {
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-areas:
      "label action"
      "content content";
    gap: 12px;
    padding: 20px 18px;
  }
`;

export const label = css`
  grid-area: label;
`;

export const content = css`
  grid-area: content;
  display: flex;
  min-width: 0;
  font-size: 15px;
  color: ${tone.text};

  /* 넓은 화면에서도 입력칸이 내용 칸 폭을 넘지 않게 */
  input {
    width: min(100%, 320px);
    box-sizing: border-box;
  }

  @media (max-width: 600px) {
    flex-direction: column;

    input {
      width: 100%;
    }
  }
`;

export const action = css`
  grid-area: action;
  justify-self: end;
  display: flex;
  align-items: center;
  gap: 12px;
`;
