import { css } from "@emotion/react";
import { modalBtn } from "../CommonModal/modalButtons";

// 확인 창 버튼 - 모든 모달과 같은 공용 버튼
export const ghostBtn = modalBtn("secondary");
export const primaryBtn = modalBtn("primary");

export const message = css`
  margin: 0;
  color: #5f656a;
  word-break: keep-all;
`;
