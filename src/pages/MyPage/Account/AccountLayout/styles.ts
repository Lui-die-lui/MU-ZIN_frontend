import { css } from "@emotion/react";

export const page = css`
  width: 100%;
`;

export const container = css`
  max-width: 980px; /* ✅ 예약관리 페이지랑 비슷한 “작업영역 폭” */
  margin: 0 auto; /* ✅ 가운데로 컨테이너 자체를 */
`;

export const header = css`
  width: 100%;
  display: flex;
  justify-content: flex-start; /* ✅ 탭을 “컨텐츠 시작점”에 붙이기 */
  margin-bottom: 18px;
`;

export const content = css`
  width: 100%;
`;
