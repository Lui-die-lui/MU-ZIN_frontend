import { css } from "@emotion/react";
import { faint, focusRing, ink, paper } from "../../../constants/uiTone";

// 메인 톤: 오프화이트 판(테두리 없음) 한 줄. 바깥 여백은 레슨·아티스트 찾기 판과 같은 선
export const footer = css`
  display: flex;
  align-items: center;
  gap: 24px;
  margin: 56px 8px 8px;
  padding: 22px 32px;
  border-radius: 24px;
  background: ${paper};
  text-align: left;

  @media (max-width: 600px) {
    flex-wrap: wrap;
    gap: 8px 16px;
    margin: 40px 0 0;
    padding: 20px 20px calc(20px + env(safe-area-inset-bottom));
    border-radius: 20px;
  }
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

export const notice = css`
  flex: 1;
  min-width: 0;
  margin: 0;
  font-size: 12px;
  line-height: 1.6;
  color: ${faint};
  word-break: keep-all;

  @media (max-width: 600px) {
    flex-basis: 100%;
    order: 3;
  }
`;

export const copy = css`
  flex-shrink: 0;
  margin: 0 0 0 auto;
  font-size: 12px;
  color: ${faint};
`;
