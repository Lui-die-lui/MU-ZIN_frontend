import { css } from "@emotion/react";

export const input = css`
  height: 38px;
  padding: 0 10px;
  border: 1px solid #e6e6e6;
  border-radius: 10px;
  background: #fff;
`;

export const wrap = css`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 460px) {
    width: 100%;
    flex-wrap: wrap;

    input { flex: 1 1 130px; min-width: 0; }
  }
`;
