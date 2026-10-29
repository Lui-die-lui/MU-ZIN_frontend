import { css } from "@emotion/react";
import { faint, focusRing, ink, paper, sub } from "../../../constants/uiTone";

// 레슨 찾기 - 공용 틀(상단 판·검색창·칩·결과 머리)은 components/search/searchStyles
// 여기는 레슨 카드: 테두리 없는 오프화이트 판, 악기는 글자 뱃지 (그림은 악기마다 맞출 수 없어서 안 씀)

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

// 넓으면 3칸, 중간 2칸, 모바일 1칸
export const list = css`
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
  height: 210px;

  @media (max-width: 640px) {
    height: 170px;
  }
`;

export const card = css`
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
  padding: 20px 20px 18px;
  border: 0;
  border-radius: 18px;
  background: ${paper};
  color: ${ink};
  font-family: inherit;
  text-align: left;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    background: #efede8;
    transform: translateY(-2px);
    box-shadow: 0 16px 30px -24px rgba(23, 25, 28, 0.55);
  }
  &:hover > span:last-of-type > span:last-of-type {
    background: #000000;
  }
  ${focusRing}

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    &:hover {
      transform: none;
    }
  }

  @media (max-width: 640px) {
    padding: 16px 16px 14px;
    gap: 8px;
  }
`;

export const cardHead = css`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
`;

// 악기 이름: 흰 알약 (카드 판 위에서 떠 보이게)
export const instBadge = css`
  flex-shrink: 0;
  max-width: 60%;
  overflow: hidden;
  padding: 5px 10px;
  border-radius: 8px;
  background: #ffffff;
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const cardSub = css`
  overflow: hidden;
  font-size: 12px;
  color: ${sub};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const cardTitle = css`
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  font-size: 17px;
  font-weight: 600;
  line-height: 1.4;
  letter-spacing: -0.02em;
  word-break: keep-all;
  overflow-wrap: anywhere;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

export const cardDescription = css`
  display: -webkit-box;
  margin: 0;
  overflow: hidden;
  font-size: 13px;
  line-height: 1.6;
  color: ${sub};
  word-break: keep-all;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

// 가격 · 지역 | 화살표 - 카드 맨 아래에 붙음
export const cardFoot = css`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-top: auto;
  padding-top: 6px;
`;

export const cardMeta = css`
  display: grid;
  gap: 2px;
  min-width: 0;

  strong {
    font-size: 16px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
  span {
    overflow: hidden;
    font-size: 12px;
    color: ${faint};
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

export const cardArrow = css`
  display: grid;
  flex-shrink: 0;
  place-items: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: ${ink};
  color: #ffffff;
  transition: background 0.15s ease;

  svg {
    display: block;
  }
`;
