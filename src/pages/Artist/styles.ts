import { css } from "@emotion/react";

// 아티스트 찾기 - 공용 틀(상단 판·검색창·칩·결과 머리)은 components/search/searchStyles

// 불러오는 동안 카드 자리 (목록과 같은 칸 나눔)
export const skeletonGrid = css`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 1080px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  @media (max-width: 640px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 10px;
  }
`;

export const cardSkeleton = css`
  display: block;
  height: 150px;
`;
