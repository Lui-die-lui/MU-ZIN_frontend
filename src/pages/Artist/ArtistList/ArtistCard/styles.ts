import { css } from "@emotion/react";

export const cardWrap = css`
  position: relative;
  min-width: 0; /* 목록(grid) 칸이 카드 내용 폭만큼 늘어나지 않게 */
`;

// 오른쪽 가운데 팔로우(하트) 버튼 자리
export const follow = css`
  position: absolute;
  top: 50%;
  right: 18px;
  transform: translateY(-50%);

  @media (max-width: 560px) {
    top: 16px;
    right: 14px;
    transform: none;
  }
`;

export const card = css`
  width: 100%;
  height: 100%; /* 칸 높이만큼 (옆 카드와 같은 높이) */
  box-sizing: border-box; /* 하트 자리 여백까지 폭 안에 (없으면 모바일에서 화면보다 넓어짐) */
  padding-right: 120px !important;

  /* 모바일은 하트가 오른쪽 위로 가서 이름 줄만 비워둠 */
  @media (max-width: 560px) {
    padding-right: 16px !important;
  }
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 20px;
  border: 1px solid #e2e5e9;
  border-radius: 14px;
  background: #fff;
  color: #1b1d20;
  text-align: left;
  transition: border-color 150ms ease, transform 150ms ease, box-shadow 150ms ease;

  &:hover {
    border-color: #aeb4bc;
    box-shadow: 0 10px 24px rgba(20, 25, 30, 0.07);
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 3px solid rgba(17, 24, 39, 0.16);
    outline-offset: 2px;
  }

  > div:first-of-type {
    background: #eef0f2;
    color: #535a62;
  }

  @media (max-width: 560px) {
    align-items: flex-start;
    padding: 16px;
  }
`;

export const content = css`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const topRow = css`
  @media (max-width: 560px) {
    padding-right: 96px;
  }

  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

export const username = css`
  min-width: 0;
  overflow-wrap: anywhere; /* 띄어쓰기 없는 긴 이름도 카드 안에서 줄바꿈 */
  margin: 0;
  font-size: 18px;
  font-weight: 700;
`;

export const followers = css`
  font-size: 13px;
  color: #8e8e8e;
`;

export const major = css`
  font-size: 14px;
  color: #697078;
`;

export const chips = css`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const chip = css`
  padding: 5px 8px;
  border-radius: 6px;
  background: #f0f1f2;
  color: #4c5157;
  font-size: 13px;
`;

export const regions = css`
  display: flex;
  flex-direction: column;
  gap: 3px;
  color: #767c83;
  font-size: 12px;
`;

