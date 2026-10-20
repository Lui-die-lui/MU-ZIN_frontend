import { css } from "@emotion/react";

// 아티스트 찾기 검색 - 공용 틀은 components/search/searchStyles

export const form = css`
  display: grid;
  gap: 14px;
  min-width: 0;

  @media (max-width: 600px) {
    gap: 12px;
  }
`;

export const chipGroup = css`
  display: flex;
  flex-shrink: 0;
  gap: 8px;
`;
