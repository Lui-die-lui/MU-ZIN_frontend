import { css } from "@emotion/react";
import { faint, focusRing, ink, paper, sub } from "../../../constants/uiTone";

// 마이페이지·관리자처럼 바깥 여백이 없는 레이아웃에서 감싸는 틀 (공개 화면 레이아웃과 같은 16px)
export const outside = css`
  padding: 0 16px 8px;
`;

// 메인 톤: 오프화이트 판(테두리 없음). 바깥 여백은 레슨·아티스트 찾기 판과 같은 선
export const footer = css`
  display: grid;
  gap: 10px;
  margin: 56px 8px 8px;
  padding: 22px 32px;
  border-radius: 24px;
  background: ${paper};
  text-align: left;

  @media (max-width: 600px) {
    margin: 40px 0 0;
    padding: 20px 20px calc(20px + env(safe-area-inset-bottom));
    border-radius: 20px;
  }
`;

export const top = css`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px 24px;
`;

export const logo = css`
  flex-shrink: 0;
  font-size: 17px;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: ${ink};
  text-decoration: none;
  border-radius: 6px;
  ${focusRing};
`;

export const links = css`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px 18px;
  font-size: 13px;
`;

export const link = css`
  color: ${sub};
  text-decoration: none;
  border-radius: 4px;

  strong {
    color: ${ink};
    font-weight: 800;
  }
  &:hover {
    color: ${ink};
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  ${focusRing};
`;

export const plain = css`
  color: ${sub};
`;

export const bottom = css`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 4px 16px;
`;

export const notice = css`
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: ${faint};
  word-break: keep-all;
`;

export const copy = css`
  margin: 0;
  font-size: 12px;
  color: ${faint};
`;
