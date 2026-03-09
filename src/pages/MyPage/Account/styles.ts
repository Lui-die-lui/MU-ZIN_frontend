import styled from "@emotion/styled";
import { css } from "@emotion/react";

export const SubContainer = styled.div`
display: flex;
justify-content: space-between;
`

export const ContentItem = styled.div`
display: flex;
  align-items: center; /* 아이콘-글자 수직 정렬 */
  gap: 8px;            /* 아이콘-글자 간격 */

`

export const input = css`
  height: 34px;
  padding: 0 10px;
  border: 1px solid #e6e6e6;
  border-radius: 10px;
  background: #fff;
`;

export const reserveBtn = css`
  padding: 10px 12px;
  border-radius: 14px;
  border: none;
  background: #111;
  color: #fff;
  cursor: pointer;

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }
`;