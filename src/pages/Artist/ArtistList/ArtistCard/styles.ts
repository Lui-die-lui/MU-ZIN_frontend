import { css } from "@emotion/react";
import { faint, focusRing, ink, paper, sub } from "../../../../constants/uiTone";

// 아티스트 카드 - 레슨 카드와 같은 결: 테두리 없는 오프화이트 판, 흰 알약 악기
// 팔로우 버튼은 카드(버튼) 안에 넣을 수 없어(버튼 안 버튼) 오른쪽 위에 겹쳐 둠

export const cardWrap = css`
  position: relative;
  min-width: 0; /* 목록(grid) 칸이 카드 내용 폭만큼 늘어나지 않게 */
`;

export const follow = css`
  position: absolute;
  top: 18px;
  right: 18px;

  @media (max-width: 600px) {
    top: 14px;
    right: 14px;
  }
`;

export const card = css`
  display: flex;
  align-items: flex-start;
  gap: 14px;
  width: 100%;
  height: 100%; /* 칸 높이만큼 (옆 카드와 같은 높이) */
  padding: 18px;
  border: 0;
  border-radius: 18px;
  background: ${paper};
  color: ${ink};
  font-family: inherit;
  text-align: left;
  box-sizing: border-box;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;

  &:hover {
    background: #efede8;
    transform: translateY(-2px);
    box-shadow: 0 16px 30px -24px rgba(23, 25, 28, 0.55);
  }
  ${focusRing}

  /* 프로필 사진이 없을 때 첫 글자 원: 흰 바탕 */
  > div:first-of-type {
    background: #ffffff;
    color: ${sub};
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
    &:hover {
      transform: none;
    }
  }

  @media (max-width: 600px) {
    gap: 12px;
    padding: 14px;
  }
`;

export const content = css`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
`;

// 이름 줄: 오른쪽 위 팔로우 버튼 자리만큼 비워 둠
export const topRow = css`
  display: grid;
  gap: 2px;
  min-width: 0;
  min-height: 36px;
  padding-right: 92px;
  align-content: center;
`;

// 긴 아이디(공백 없음)도 한 줄 + 말줄임 (예전: 글자 단위로 끊겨 두 줄)
export const username = css`
  margin: 0;
  overflow: hidden;
  font-size: 17px;
  font-weight: 600;
  letter-spacing: -0.02em;
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const sub2 = css`
  overflow: hidden;
  font-size: 13px;
  color: ${sub};
  white-space: nowrap;
  text-overflow: ellipsis;
`;

export const chips = css`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

export const chip = css`
  padding: 4px 9px;
  border-radius: 8px;
  background: #ffffff;
  color: ${ink};
  font-size: 12px;
  font-weight: 600;
  white-space: nowrap;
`;

// 지역: 줄마다 한 줄 + 말줄임
export const regions = css`
  display: grid;
  gap: 2px;
  min-width: 0;
  color: ${faint};
  font-size: 12px;

  span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;
