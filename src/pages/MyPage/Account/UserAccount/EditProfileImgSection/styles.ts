import { css } from "@emotion/react";
import { brushed, c } from "../../../../../constants/metalTheme";

// 프로필 사진 행 - 다른 행(AccountInfoRow)과 같은 칸 배치
export const infoRow = css`
  display: grid;
  grid-template-columns: 170px minmax(0, 1fr) auto;
  grid-template-areas: "label content action";
  align-items: center;
  gap: 20px;
  padding: 24px 28px;
  border-bottom: 1px solid ${c.hairline};
  text-align: left;

  /* 좁은 화면: [제목 ... 사진] 아래 안내 문구 */
  @media (max-width: 600px) {
    grid-template-columns: minmax(0, 1fr) auto;
    grid-template-areas:
      "label action"
      "content content";
    gap: 12px;
    padding: 22px 18px 20px;
  }
`;

// 제목: 다른 행의 labelWithIcon 과 같은 모양 (아이콘은 스틸 타일)
export const infoLabel = css`
  grid-area: label;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: ${c.ink};

  svg {
    flex-shrink: 0;
    box-sizing: content-box;
    width: 15px;
    height: 15px;
    padding: 6px;
    border: 1px solid ${c.steel};
    border-radius: 2px;
    background: ${brushed};
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
  }
`;

export const infoContent = css`
  grid-area: content;
  min-width: 0;
  font-size: 13px;
  color: ${c.steelDeep};
  line-height: 1.5;
  text-align: start;
`;

export const infoText = css`
  margin: 0;
`;

export const infoAction = css`
  grid-area: action;
  display: flex;
  align-items: center;
`;

// 사진: 크롬 링 + 누를 수 있다는 걸 알리는 라임 포커스
export const avatarButton = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 3px;
  border: none;
  border-radius: 50%;
  background: conic-gradient(from 210deg, #F4F5F6, ${c.steel}, #6E7579, #E3E6E8, ${c.steel}, #F4F5F6);
  box-shadow: 0 6px 18px -8px rgba(17, 19, 21, 0.5);
  cursor: pointer;
  transition: transform 0.15s ease;

  > * {
    box-shadow: 0 0 0 2px ${c.paper};
    border-radius: 50%;
  }

  &:hover:enabled {
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 3px solid ${c.lime};
    outline-offset: 3px;
  }

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
`;

export const avatarHint = css`
  font-size: 13px;
  color: #666;
`;

export const errorText = css`
  margin: 6px 0 0;
  font-size: 13px;
  color: ${c.danger};
`;
