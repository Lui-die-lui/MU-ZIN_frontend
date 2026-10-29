import { css } from "@emotion/react";
import { tone } from "../../styles";

// 프로필 사진 행 - 다른 행(AccountInfoRow)과 같은 칸 배치
export const infoRow = css`
  display: grid;
  grid-template-columns: 170px minmax(0, 1fr) auto;
  grid-template-areas: "label content action";
  align-items: center;
  gap: 20px;
  padding: 24px 28px;
  border-bottom: 1px solid ${tone.divider};
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

// 제목: 다른 행의 labelWithIcon 과 같은 모양 (아이콘은 옅은 회색 타일)
export const infoLabel = css`
  grid-area: label;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 600;
  color: ${tone.text};

  svg {
    flex-shrink: 0;
    box-sizing: content-box;
    width: 15px;
    height: 15px;
    padding: 8px;
    border-radius: 10px;
    background: ${tone.soft};
    color: ${tone.text};
  }
`;

export const infoContent = css`
  grid-area: content;
  min-width: 0;
  font-size: 13px;
  color: ${tone.muted};
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

// 사진: 옅은 테두리 + 그림자, 올리면 살짝 떠오름
export const avatarButton = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 3px;
  border: 1px solid ${tone.border};
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 6px 18px rgba(20, 25, 30, 0.08);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;

  > * {
    border-radius: 50%;
  }

  &:hover:enabled {
    transform: translateY(-1px);
    box-shadow: 0 10px 24px rgba(20, 25, 30, 0.12);
  }

  &:focus-visible {
    outline: 3px solid ${tone.ring};
    outline-offset: 3px;
  }

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
`;

export const avatarHint = css`
  font-size: 13px;
  color: ${tone.muted};
`;

export const errorText = css`
  margin: 6px 0 0;
  font-size: 13px;
  color: ${tone.danger};
`;
